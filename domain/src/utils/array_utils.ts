// Trying to avoid getting Ramda all over the code base

export const times = <T>(gen: (i: number)=>T, size: number) => Array.from(new Array(size), (_, i) => gen(i))

export const repeat = <T>(val: T, size: number) => times(_ => val, size)

export const update = <T>(index: number, val: T, array: T[]): T[] => array.map((e, i) => i === index? val : e)

export const zipWith = <T, U, V>(w: (t: T, u: U) => V, ts: T[], us: U[]) => ts.map((t, i) => w(t, us[i]))
