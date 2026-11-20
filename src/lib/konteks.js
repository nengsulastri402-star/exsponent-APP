// Soal yang sedang dikerjakan siswa, dibagikan ke obrolan AI supaya Kak AI
// tahu apa yang ditanyakan. Disimpan di memori saja; kosong saat pretest/posttest.
let sekarang = null
export const setKonteks = (v) => {
  sekarang = v
}
export const getKonteks = () => sekarang
