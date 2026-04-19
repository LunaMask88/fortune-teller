import type { RuneCard, RuneResult } from '@/types'

// 24 个古符文（Elder Futhark）
const ELDER_FUTHARK: RuneCard[] = [
  { symbol: 'ᚠ', name: 'Fehu',   nameCN: '财富',   upright: '财富流入、物质成功、繁荣', reversed: '财富流失、贪婪、缺乏满足感' },
  { symbol: 'ᚢ', name: 'Uruz',   nameCN: '野牛',   upright: '力量、生命力、意志力', reversed: '暴力、软弱、错失机会' },
  { symbol: 'ᚦ', name: 'Thurisaz', nameCN: '刺', upright: '保护、打破障碍、门槛', reversed: '危险、冲动、被动' },
  { symbol: 'ᚨ', name: 'Ansuz',  nameCN: '神谕',   upright: '沟通、智慧、神圣信息', reversed: '欺骗、误解、沟通障碍' },
  { symbol: 'ᚱ', name: 'Raidho', nameCN: '旅途',   upright: '旅行、正确方向、进展', reversed: '延迟、阻碍、失控' },
  { symbol: 'ᚲ', name: 'Kenaz',  nameCN: '火炬',   upright: '知识、启示、创造力', reversed: '失去方向、疾病、黑暗' },
  { symbol: 'ᚷ', name: 'Gebo',   nameCN: '馈赠',   upright: '礼物、伙伴关系、慷慨', reversed: '依赖、孤立、自私' },
  { symbol: 'ᚹ', name: 'Wunjo',  nameCN: '喜悦',   upright: '快乐、和谐、成就感', reversed: '悲伤、疏离、错位' },
  { symbol: 'ᚺ', name: 'Hagalaz', nameCN: '冰雹',  upright: '破坏性变化、自然力量、考验', reversed: '延迟灾难' },
  { symbol: 'ᚾ', name: 'Nauthiz', nameCN: '需求',  upright: '约束、意志力、生存本能', reversed: '限制、痛苦、执着' },
  { symbol: 'ᛁ', name: 'Isa',    nameCN: '冰',     upright: '静止、等待、内省期', reversed: '解冻、前进' },
  { symbol: 'ᛃ', name: 'Jera',   nameCN: '丰收',   upright: '循环、回报、收获时节', reversed: '无结果、冲突' },
  { symbol: 'ᛇ', name: 'Eihwaz', nameCN: '紫杉',   upright: '坚韧、可靠、生死转化', reversed: '混乱、薄弱' },
  { symbol: 'ᛈ', name: 'Perthro', nameCN: '命运杯', upright: '命运、神秘、未知可能性', reversed: '成瘾、停滞、不满' },
  { symbol: 'ᛉ', name: 'Algiz',  nameCN: '麋鹿',   upright: '保护、庇护、直觉防御', reversed: '脆弱、隐藏危险' },
  { symbol: 'ᛊ', name: 'Sowilo', nameCN: '太阳',   upright: '成功、生命力、光明目标', reversed: '虚假希望、错误指引' },
  { symbol: 'ᛏ', name: 'Tiwaz',  nameCN: '战神',   upright: '正义、荣耀、自我牺牲', reversed: '过度竞争、失败、怯懦' },
  { symbol: 'ᛒ', name: 'Berkano', nameCN: '白桦',  upright: '成长、新生、滋养', reversed: '迟滞、焦虑、家庭问题' },
  { symbol: 'ᛖ', name: 'Ehwaz',  nameCN: '马',     upright: '运动、合作、进步', reversed: '不忠、动荡、受阻' },
  { symbol: 'ᛗ', name: 'Mannaz', nameCN: '人类',   upright: '自我、社会、人性', reversed: '敌意、孤立、自我欺骗' },
  { symbol: 'ᛚ', name: 'Laguz',  nameCN: '湖泊',   upright: '流动、直觉、情感力量', reversed: '恐惧、失调、浅薄' },
  { symbol: 'ᛜ', name: 'Ingwaz', nameCN: '生育',   upright: '完成、内在成长、潜力释放', reversed: '停滞' },
  { symbol: 'ᛞ', name: 'Dagaz',  nameCN: '黎明',   upright: '突破、清晰、转化', reversed: '延迟的突破' },
  { symbol: 'ᛟ', name: 'Othala', nameCN: '传承',   upright: '遗产、家园、价值观', reversed: '失去、保守、排外' },
]

export function drawRunes(count: 3 | 1 = 3, rng: () => number = Math.random): RuneResult {
  const shuffled = [...ELDER_FUTHARK].sort(() => rng() - 0.5)
  const drawn = shuffled.slice(0, count).map(rune => {
    const reversed = rng() > 0.6
    return {
      rune,
      reversed,
      meaning: reversed ? rune.reversed : rune.upright,
    }
  })

  const positions = count === 3
    ? ['过去·根源', '现在·挑战', '未来·潜力']
    : ['当下指引']

  return {
    draws: drawn.map((d, i) => ({ ...d, position: positions[i] })),
    spread: count === 3 ? '三符文展开' : '单符文指引',
  }
}

export { ELDER_FUTHARK }
