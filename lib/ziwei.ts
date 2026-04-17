import type { ZiweiResult } from '@/types'

// 紫微斗数简化版：根据出生月份和时辰推算命宫主星
// 完整紫微斗数需要复杂的天文计算，此处提供教学性简化版
// 真实解读交由 DeepSeek 完成

const HOUR_TO_GONG: Record<number, string> = {
  23: '子宫', 0: '子宫', 1: '丑宫', 2: '丑宫',
  3: '寅宫', 4: '寅宫', 5: '卯宫', 6: '卯宫',
  7: '辰宫', 8: '辰宫', 9: '巳宫', 10: '巳宫',
  11: '午宫', 12: '午宫', 13: '未宫', 14: '未宫',
  15: '申宫', 16: '申宫', 17: '酉宫', 18: '酉宫',
  19: '戌宫', 20: '戌宫', 21: '亥宫', 22: '亥宫',
}

// 命宫主星（简化规则：月份+时支组合，取模映射）
const MAIN_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同',
  '廉贞', '天府', '太阴', '贪狼', '巨门',
  '天相', '天梁', '七杀', '破军',
]

const STAR_TRAITS: Record<string, string> = {
  '紫微': '帝王之星，气质高贵、领导力强、注重排场与尊严',
  '天机': '智慧之星，思维敏捷、善于谋略、变化多端',
  '太阳': '光明之星，慷慨大方、喜助他人、光明磊落',
  '武曲': '财星，刚毅果断、重义气、财务能力强',
  '天同': '福星，性情温和、享受生活、具有包容心',
  '廉贞': '囚星化桃花，多才多艺、感情丰富、事业多变',
  '天府': '库星，稳重踏实、保守谨慎、重视安全感',
  '太阴': '月亮之星，内敛细腻、感情丰富、重视家庭',
  '贪狼': '欲望之星，多才多艺、交际广泛、物质欲望强',
  '巨门': '暗星，口才好、善于分析、多疑善辩',
  '天相': '印星，正直诚实、重视规则、服务他人',
  '天梁': '荫星，正义感强、保护他人、有长者风范',
  '七杀': '将星，执行力强、不服输、容易走极端',
  '破军': '开创之星，改革精神、不拘一格、开疆拓土',
}

export function calculateZiwei(
  month: number,
  hour: number | null,
  gender: 'male' | 'female'
): ZiweiResult {
  const effectiveHour = hour ?? 12
  const palaceName = HOUR_TO_GONG[effectiveHour] ?? '午宫'

  // 简化公式：基于月份、时辰、性别的哈希映射
  const gongIndex = ['子宫','丑宫','寅宫','卯宫','辰宫','巳宫','午宫','未宫','申宫','酉宫','戌宫','亥宫'].indexOf(palaceName)
  const starIndex = (month + gongIndex + (gender === 'male' ? 0 : 7)) % MAIN_STARS.length
  const mainStar = MAIN_STARS[starIndex]

  return {
    palaceName,
    mainStar,
    description: STAR_TRAITS[mainStar] ?? '星曜能量蕴含深厚，待进一步解读',
  }
}
