-- Skema Aplikasi Eksponen (ARCHITECTURE.md §3–4)
-- Jalankan di Supabase: SQL Editor → paste → Run.
-- Siswa hanya dikenal lewat `kode` (mis. P01). Tidak ada nama, email, foto, kontak.
--
-- Prasyarat di dashboard Supabase:
--   Authentication → Providers → aktifkan "Allow anonymous sign-ins".

-- ---------------------------------------------------------------- Tabel

create table siswa (
  id uuid primary key default gen_random_uuid(),
  kode text unique not null check (kode ~ '^P[0-9]{2,3}$'),
  kelas text,
  auth_uid uuid unique,                -- sesi anonim Supabase yang sedang memakai kode ini
  dibuat timestamptz default now()
);

create table sesi (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid not null references siswa(id) on delete cascade,
  nomor_sesi int not null,
  mulai timestamptz default now(),
  selesai timestamptz
);

create table jawaban (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid not null references siswa(id) on delete cascade,
  sesi_id uuid references sesi(id) on delete set null,
  modul int check (modul between 0 and 3),            -- 0 = diagnostik
  butir text not null,
  jawaban text,
  benar boolean,
  miskonsepsi text,                                   -- kode miskonsepsi (M1–M8)
  tingkat_petunjuk int not null default 0 check (tingkat_petunjuk between 0 and 3),
  waktu_ms int,
  dibuat timestamptz default now()
);

create table tes (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid not null references siswa(id) on delete cascade,
  jenis text not null check (jenis in ('pretest', 'posttest', 'diagnostik')),
  skor numeric,
  skor_maks numeric,
  dibuat timestamptz default now()
);

create table skala_kognitif (
  id uuid primary key default gen_random_uuid(),
  siswa_id uuid not null references siswa(id) on delete cascade,
  butir text not null,                                -- mis. IL1, EL2, GL3
  nilai int check (nilai between 0 and 10),
  dibuat timestamptz default now()
);

create table progres_modul (
  siswa_id uuid not null references siswa(id) on delete cascade,
  modul int not null check (modul between 1 and 3),
  terbuka boolean not null default false,
  selesai boolean not null default false,
  primary key (siswa_id, modul)
);

create index on sesi (siswa_id);
create index on jawaban (siswa_id, modul);
create index on jawaban (sesi_id);
create index on tes (siswa_id);
create index on skala_kognitif (siswa_id);

-- ---------------------------------------------------------------- Fungsi bantu

-- Id siswa milik sesi anonim yang sedang masuk (dipakai kebijakan RLS).
create or replace function public.siswa_saya()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.siswa where auth_uid = auth.uid() limit 1
$$;

-- Masuk dengan kode: kaitkan sesi anonim ke baris siswa, buat sesi belajar baru,
-- dan siapkan progres modul (modul 1 terbuka). Kode bertindak sebagai kata sandi
-- sederhana; cukup untuk uji coba dua siswa, bukan untuk penggunaan luas.
create or replace function public.masuk_dengan_kode(p_kode text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_siswa uuid;
  v_kode text;
  v_nomor int;
  v_sesi uuid;
begin
  if auth.uid() is null then
    raise exception 'perlu_masuk';
  end if;

  select id, kode into v_siswa, v_kode
  from siswa
  where kode = upper(trim(p_kode));

  if v_siswa is null then
    raise exception 'kode_tidak_dikenal';
  end if;

  -- Satu sesi anonim hanya boleh memegang satu kode.
  update siswa set auth_uid = null where auth_uid = auth.uid() and id <> v_siswa;
  update siswa set auth_uid = auth.uid() where id = v_siswa;

  select coalesce(max(nomor_sesi), 0) + 1 into v_nomor
  from sesi where siswa_id = v_siswa;

  insert into sesi (siswa_id, nomor_sesi)
  values (v_siswa, v_nomor)
  returning id into v_sesi;

  insert into progres_modul (siswa_id, modul, terbuka)
  values (v_siswa, 1, true), (v_siswa, 2, false), (v_siswa, 3, false)
  on conflict (siswa_id, modul) do nothing;

  return jsonb_build_object(
    'siswa_id', v_siswa,
    'kode', v_kode,
    'sesi_id', v_sesi,
    'nomor_sesi', v_nomor
  );
end;
$$;

revoke all on function public.masuk_dengan_kode(text) from public, anon;
grant execute on function public.masuk_dengan_kode(text) to authenticated;
revoke all on function public.siswa_saya() from public, anon;
grant execute on function public.siswa_saya() to authenticated;

-- ---------------------------------------------------------------- RLS

alter table siswa enable row level security;
alter table sesi enable row level security;
alter table jawaban enable row level security;
alter table tes enable row level security;
alter table skala_kognitif enable row level security;
alter table progres_modul enable row level security;

-- siswa: hanya boleh melihat barisnya sendiri; tidak ada insert/update langsung
-- (penautan kode hanya lewat masuk_dengan_kode).
create policy siswa_baca on siswa
  for select to authenticated
  using (auth_uid = auth.uid());

-- sesi: baca, tambah, dan ubah (mengisi `selesai`) milik sendiri.
create policy sesi_baca on sesi
  for select to authenticated using (siswa_id = public.siswa_saya());
create policy sesi_tambah on sesi
  for insert to authenticated with check (siswa_id = public.siswa_saya());
create policy sesi_ubah on sesi
  for update to authenticated
  using (siswa_id = public.siswa_saya())
  with check (siswa_id = public.siswa_saya());

-- jawaban, tes, skala_kognitif: baca dan tambah milik sendiri (tidak boleh diubah/dihapus).
create policy jawaban_baca on jawaban
  for select to authenticated using (siswa_id = public.siswa_saya());
create policy jawaban_tambah on jawaban
  for insert to authenticated with check (siswa_id = public.siswa_saya());

create policy tes_baca on tes
  for select to authenticated using (siswa_id = public.siswa_saya());
create policy tes_tambah on tes
  for insert to authenticated with check (siswa_id = public.siswa_saya());

create policy skala_baca on skala_kognitif
  for select to authenticated using (siswa_id = public.siswa_saya());
create policy skala_tambah on skala_kognitif
  for insert to authenticated with check (siswa_id = public.siswa_saya());

-- progres_modul: baca, tambah, ubah milik sendiri (membuka modul berikutnya).
create policy progres_baca on progres_modul
  for select to authenticated using (siswa_id = public.siswa_saya());
create policy progres_tambah on progres_modul
  for insert to authenticated with check (siswa_id = public.siswa_saya());
create policy progres_ubah on progres_modul
  for update to authenticated
  using (siswa_id = public.siswa_saya())
  with check (siswa_id = public.siswa_saya());
