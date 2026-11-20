// Bilangan rasional (pecahan) dengan BigInt, supaya hasil pangkat besar tetap tepat.
// Bentuk: { n: pembilang, d: penyebut } dengan d > 0 dan pecahan sudah disederhanakan.

const gcd = (a, b) => {
  a = a < 0n ? -a : a
  b = b < 0n ? -b : b
  while (b) [a, b] = [b, a % b]
  return a
}

export function rasional(n, d = 1n) {
  n = BigInt(n)
  d = BigInt(d)
  if (d === 0n) throw new Error('bagi_nol')
  if (d < 0n) {
    n = -n
    d = -d
  }
  const g = gcd(n, d) || 1n
  return { n: n / g, d: d / g }
}

export const tambah = (a, b) => rasional(a.n * b.d + b.n * a.d, a.d * b.d)
export const kurang = (a, b) => rasional(a.n * b.d - b.n * a.d, a.d * b.d)
export const kali = (a, b) => rasional(a.n * b.n, a.d * b.d)
export const bagi = (a, b) => {
  if (b.n === 0n) throw new Error('bagi_nol')
  return rasional(a.n * b.d, a.d * b.n)
}
export const sama = (a, b) => a.n === b.n && a.d === b.d

// a pangkat e, dengan e bilangan bulat (boleh negatif atau nol).
export function pangkat(a, e) {
  if (e.d !== 1n) throw new Error('pangkat_tak_bulat')
  let k = e.n
  if (k > 200n || k < -200n) throw new Error('terlalu_besar')
  if (k === 0n) {
    if (a.n === 0n) throw new Error('nol_pangkat_nol')
    return rasional(1n)
  }
  const negatif = k < 0n
  if (negatif) k = -k
  const hasil = rasional(a.n ** k, a.d ** k)
  return negatif ? bagi(rasional(1n), hasil) : hasil
}

// "5", "-3", "1/8"
export function teks(a) {
  return a.d === 1n ? a.n.toString() : `${a.n}/${a.d}`
}
