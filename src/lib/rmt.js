// Pemetaan model Rigorous Mathematical Thinking (RMT) ke aplikasi.
// Fase fungsi kognitif Feuerstein: Input -> Elaborasi -> Output.

export const FASE = {
  input: {
    nama: 'Membaca soal',
    cadangan: 'Baca soalnya sekali lagi pelan-pelan. Apa yang diketahui, dan apa yang ditanyakan?',
  },
  elaborasi: {
    nama: 'Mengolah',
    cadangan: 'Jabarkan pangkatnya menjadi perkalian berulang. Apa yang kamu lihat dari faktor-faktornya?',
  },
  output: {
    nama: 'Menuliskan',
    cadangan: 'Jawabanmu sudah dekat. Tulis dalam bentuk yang diminta soal: satu bilangan berpangkat.',
  },
}

// Status 'format' berarti isi mungkin benar tetapi cara menuliskannya belum tepat.
export function faseDari(status, miskonsepsi) {
  if (status === 'format') return 'output'
  return miskonsepsi?.fase ?? 'elaborasi'
}
