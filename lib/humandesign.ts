import type { HumanDesignResult } from '@/types'

// 人类图：由 Ra Uru Hu 于 1987 年创立，融合易经64卦、西洋星座、脉轮、卡巴拉
// 完整计算需要精确星历表。此处提供基于生日的简化版四种类型推算

// 四大类型（Aura Type）
const HD_TYPES = [
  {
    type: 'Manifestor' as const,
    typeCN: '显化者',
    percent: '9%',
    aura: '封闭且排斥',
    strategy: '在行动前告知他人',
    notSelf: '愤怒',
    desc: '天生的先行者，有能力独自启动事物。你来到这里是为了在世界留下印记。',
  },
  {
    type: 'Generator' as const,
    typeCN: '生产者',
    percent: '37%',
    aura: '开放且包容',
    strategy: '等待回应',
    notSelf: '沮丧',
    desc: '生命力旺盛的工作者。当你用骶骨（直觉）回应时，能量无穷无尽。',
  },
  {
    type: 'Manifesting Generator' as const,
    typeCN: '显化生产者',
    percent: '33%',
    aura: '开放且包容',
    strategy: '等待回应后告知',
    notSelf: '沮丧/愤怒',
    desc: '多才多艺的快手。你可以同时进行多件事，跳过步骤是你的天赋而非错误。',
  },
  {
    type: 'Projector' as const,
    typeCN: '投射者',
    percent: '20%',
    aura: '专注且穿透',
    strategy: '等待邀请',
    notSelf: '苦涩',
    desc: '天生的向导。你来此引领他人，需要等待认可和邀请，才能让天赋被看见。',
  },
  {
    type: 'Reflector' as const,
    typeCN: '反射者',
    percent: '1%',
    aura: '抵抗且取样',
    strategy: '等待月亮周期（28天）',
    notSelf: '失望',
    desc: '社区的镜子。你反映出周围人和环境的状态，极为稀有，拥有独特的宇宙视角。',
  },
]

// Profile（人生角色）1-6 × 2 = 12种组合，简化为6基础数字
const PROFILES: Record<number, { profile: string; desc: string }> = {
  1: { profile: '1/3 研究者/烈士', desc: '需要强大的知识基础，通过试错学习，天生的调查者' },
  2: { profile: '2/4 隐士/机会主义者', desc: '需要独处时间，等待被召唤，人脉自然带来机会' },
  3: { profile: '3/5 烈士/异端', desc: '通过经历和失败学习，被他人视为实用解决者' },
  4: { profile: '4/6 机会主义者/榜样', desc: '人脉极为重要，经历三个人生阶段，最终成为榜样' },
  5: { profile: '5/1 异端/研究者', desc: '被他人投射期望，需要强大基础，天生的实用主义者' },
  6: { profile: '6/2 榜样/隐士', desc: '三段人生，前30年试错，后成为部落榜样' },
}

// 九大能量中心（Defined/Undefined）
const CENTERS = ['头脑', '思维', '喉咙', '意志', '自我', '骶骨', '情绪', '直觉', '根部']

function determineCenters(seed: number): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  CENTERS.forEach((center, i) => {
    result[center] = ((seed >> i) & 1) === 1
  })
  return result
}

export function calculateHumanDesign(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number | null
): HumanDesignResult {
  // 简化版：用生日数字的特征推算类型
  const dayOfYear = birthMonth * 30 + birthDay
  const hourFactor = birthHour ?? 12

  // 类型分布概率：Generator(37) + MG(33) + Projector(20) + Manifestor(9) + Reflector(1)
  const seed = (birthYear % 100) + birthMonth + birthDay + hourFactor
  const typeIndex =
    seed % 100 < 37 ? 1 :   // Generator
    seed % 100 < 70 ? 2 :   // Manifesting Generator
    seed % 100 < 90 ? 3 :   // Projector
    seed % 100 < 99 ? 0 :   // Manifestor
    4                        // Reflector

  const hdType = HD_TYPES[typeIndex]
  const profileNum = (dayOfYear % 6) + 1
  const profile = PROFILES[profileNum]

  const centerSeed = seed * 17 + dayOfYear
  const centers = determineCenters(centerSeed)
  const definedCount = Object.values(centers).filter(Boolean).length
  const authority =
    centers['骶骨']  ? '骶骨权威（内在感应）' :
    centers['情绪']  ? '情绪权威（等待情绪清明）' :
    centers['直觉']  ? '直觉权威（当下反应）' :
    centers['意志']  ? '意志权威（内心承诺）' :
    centers['自我']  ? '自我权威（内心说话）' : '外在权威（环境/月亮）'

  return {
    type: hdType.type,
    typeCN: hdType.typeCN,
    aura: hdType.aura,
    strategy: hdType.strategy,
    notSelf: hdType.notSelf,
    typeDesc: hdType.desc,
    profile: profile.profile,
    profileDesc: profile.desc,
    authority,
    centers,
    definedCenters: definedCount,
    percent: hdType.percent,
  }
}
