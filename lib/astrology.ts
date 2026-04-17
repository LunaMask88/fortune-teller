import type { SunSign } from '@/types'

interface SignRange { sign: SunSign; startMonth: number; startDay: number }

const SIGN_RANGES: SignRange[] = [
  { sign: '摩羯座', startMonth: 12, startDay: 22 },
  { sign: '水瓶座', startMonth: 1,  startDay: 20 },
  { sign: '双鱼座', startMonth: 2,  startDay: 19 },
  { sign: '白羊座', startMonth: 3,  startDay: 21 },
  { sign: '金牛座', startMonth: 4,  startDay: 20 },
  { sign: '双子座', startMonth: 5,  startDay: 21 },
  { sign: '巨蟹座', startMonth: 6,  startDay: 21 },
  { sign: '狮子座', startMonth: 7,  startDay: 23 },
  { sign: '处女座', startMonth: 8,  startDay: 23 },
  { sign: '天秤座', startMonth: 9,  startDay: 23 },
  { sign: '天蝎座', startMonth: 10, startDay: 23 },
  { sign: '射手座', startMonth: 11, startDay: 22 },
]

export function getSunSign(month: number, day: number): SunSign {
  for (let i = 0; i < SIGN_RANGES.length; i++) {
    const current = SIGN_RANGES[i]
    const next = SIGN_RANGES[(i + 1) % SIGN_RANGES.length]
    if (month === current.startMonth && day >= current.startDay) return current.sign
    if (month === next.startMonth && day < next.startDay) return current.sign
  }
  return '摩羯座'
}

// 星座对应元素属性（西方四元素）
export const SIGN_WESTERN_ELEMENT: Record<SunSign, string> = {
  '白羊座': '火', '狮子座': '火', '射手座': '火',
  '金牛座': '土', '处女座': '土', '摩羯座': '土',
  '双子座': '风', '天秤座': '风', '水瓶座': '风',
  '巨蟹座': '水', '天蝎座': '水', '双鱼座': '水',
}

// 星座守护星
export const SIGN_RULER: Record<SunSign, string> = {
  '白羊座': '火星', '金牛座': '金星', '双子座': '水星',
  '巨蟹座': '月亮', '狮子座': '太阳', '处女座': '水星',
  '天秤座': '金星', '天蝎座': '冥王星', '射手座': '木星',
  '摩羯座': '土星', '水瓶座': '天王星', '双鱼座': '海王星',
}
