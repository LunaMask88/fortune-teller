import type { FullReading } from '@/types'

const PROFILE_KEY      = 'mystic_profile'
const LAST_READING_KEY = 'mystic_last_reading'
const QUICK_PERIOD_KEY = 'mystic_quick_period'

export interface UserProfile {
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number | null
  gender: 'male' | 'female'
  lang?: 'zh' | 'en'
}

export function saveProfile(p: UserProfile): void {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)) } catch { /* ignore */ }
}

export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch { return null }
}

export function saveLastReading(r: FullReading): void {
  try { localStorage.setItem(LAST_READING_KEY, JSON.stringify(r)) } catch { /* ignore */ }
}

export function loadLastReading(): FullReading | null {
  try {
    const raw = localStorage.getItem(LAST_READING_KEY)
    return raw ? (JSON.parse(raw) as FullReading) : null
  } catch { return null }
}

/** 快捷入口：写入期望的 period，然后跳转到 /reading 自动提交 */
export function setQuickPeriod(period: string): void {
  try { localStorage.setItem(QUICK_PERIOD_KEY, period) } catch { /* ignore */ }
}

export function getAndClearQuickPeriod(): string | null {
  try {
    const v = localStorage.getItem(QUICK_PERIOD_KEY)
    if (v) localStorage.removeItem(QUICK_PERIOD_KEY)
    return v
  } catch { return null }
}
