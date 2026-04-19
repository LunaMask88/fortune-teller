/**
 * 基于 Mulberry32 的轻量级种子伪随机数生成器
 * 同样的种子永远产生同样的序列，保证同天同人占卜结果一致
 */
export function createRng(seed: number) {
  let s = seed >>> 0
  return function rand(): number {
    s += 0x6d2b79f5
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 0xffffffff
  }
}

/**
 * 根据出生信息 + 运势周期 + 当天日期，生成一个整数种子
 * - 同一天、同一人、同一周期：种子相同 → 牌面相同
 * - 跨天自动刷新（today 参数）
 */
export function buildSeed(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  period: string,
  today = new Date(),
): number {
  const dateKey = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const raw = `${birthYear}${birthMonth}${birthDay}|${period}|${dateKey}`
  // djb2 hash
  let hash = 5381
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) ^ raw.charCodeAt(i)
  }
  return hash >>> 0
}
