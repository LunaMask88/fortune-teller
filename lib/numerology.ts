import type { NumerologyResult } from '@/types'

// 将多位数字不断相加直到个位（主数 11/22/33 保留）
function reduceToSingle(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  const sum = String(n).split('').reduce((a, d) => a + parseInt(d), 0)
  return reduceToSingle(sum)
}

// 生命数字：出生年月日各位相加
export function calcLifePathNumber(year: number, month: number, day: number): number {
  const raw = [...String(year), ...String(month), ...String(day)].reduce((a, d) => a + parseInt(d), 0)
  return reduceToSingle(raw)
}

// 命运数字：仅用出生日期（不含年份），更侧重"与生俱来的特质"
export function calcDestinyNumber(month: number, day: number): number {
  const raw = [...String(month), ...String(day)].reduce((a, d) => a + parseInt(d), 0)
  return reduceToSingle(raw)
}

const LIFE_PATH_DESC: Record<number, string> = {
  1:  '领袖之数，独立、自主、开拓进取，天生具备领导才能',
  2:  '和谐之数，善于合作、感情细腻、具有外交天赋',
  3:  '创意之数，表达力强、乐观开朗、具有艺术天赋',
  4:  '稳定之数，踏实可靠、注重秩序、建设者气质',
  5:  '自由之数，变化多端、冒险精神、渴望自由与体验',
  6:  '责任之数，关爱他人、家庭和谐、天生的照顾者',
  7:  '智慧之数，深度思考、神秘主义倾向、灵性探索者',
  8:  '权力之数，野心勃勃、商业头脑、财富与成就',
  9:  '博爱之数，理想主义、慈悲为怀、大爱精神',
  11: '灵性导师数，直觉极强、具有启发他人的天赋',
  22: '大师建造数，将远大理想转化为现实的能力',
  33: '宇宙导师数，无私奉献、慈悲智慧达到最高境界',
}

export function calcNumerology(year: number, month: number, day: number): NumerologyResult {
  const lifePathNumber = calcLifePathNumber(year, month, day)
  const destinyNumber = calcDestinyNumber(month, day)
  return {
    lifePathNumber,
    destinyNumber,
    description: LIFE_PATH_DESC[lifePathNumber] ?? '神秘之数，蕴含独特的宇宙能量',
  }
}
