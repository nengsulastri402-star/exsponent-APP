-- Kode siswa uji coba. Hanya kode, tanpa nama atau data pribadi.
-- Jalankan setelah 0001_skema.sql. Catat siapa memegang kode mana di catatan
-- terpisah milik peneliti, jangan di repositori.
insert into siswa (kode, kelas) values
  ('P01', 'VIII'),
  ('P02', 'VIII')
on conflict (kode) do nothing;
