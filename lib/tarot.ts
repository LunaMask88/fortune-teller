import type { TarotCard, DrawnCard } from '@/types'

// 22 张大阿卡纳（Major Arcana）
const MAJOR_ARCANA: TarotCard[] = [
  { id: 0,  name: 'The Fool',        nameCN: '愚者',    arcana: 'major', emoji: '🃏', uprightMeaning: '新的开始、天真无邪、冒险精神', reversedMeaning: '鲁莽、缺乏计划、逃避责任' },
  { id: 1,  name: 'The Magician',    nameCN: '魔法师',  arcana: 'major', emoji: '🪄', uprightMeaning: '意志力、技能、资源充足', reversedMeaning: '操纵、技能未发挥、欺骗' },
  { id: 2,  name: 'The High Priestess', nameCN: '女祭司', arcana: 'major', emoji: '🌙', uprightMeaning: '直觉、内在智慧、神秘知识', reversedMeaning: '隐藏的议程、忽视直觉' },
  { id: 3,  name: 'The Empress',     nameCN: '女皇',    arcana: 'major', emoji: '👑', uprightMeaning: '丰盛、创造力、母性之爱', reversedMeaning: '依赖、创造受阻、匮乏' },
  { id: 4,  name: 'The Emperor',     nameCN: '皇帝',    arcana: 'major', emoji: '⚔️', uprightMeaning: '权威、结构、稳定、领导力', reversedMeaning: '独裁、控制欲强、缺乏纪律' },
  { id: 5,  name: 'The Hierophant', nameCN: '教皇',    arcana: 'major', emoji: '⛪', uprightMeaning: '传统、信仰、机构指引', reversedMeaning: '叛逆、突破传统、个人信仰' },
  { id: 6,  name: 'The Lovers',     nameCN: '恋人',    arcana: 'major', emoji: '💑', uprightMeaning: '爱情、和谐、重要选择', reversedMeaning: '不和谐、失衡、错误选择' },
  { id: 7,  name: 'The Chariot',    nameCN: '战车',    arcana: 'major', emoji: '🏆', uprightMeaning: '胜利、控制、意志力、前进', reversedMeaning: '失控、阻碍、侵略性' },
  { id: 8,  name: 'Strength',       nameCN: '力量',    arcana: 'major', emoji: '🦁', uprightMeaning: '内在力量、勇气、耐心', reversedMeaning: '软弱、自我怀疑、缺乏自信' },
  { id: 9,  name: 'The Hermit',     nameCN: '隐者',    arcana: 'major', emoji: '🔦', uprightMeaning: '内省、独处、寻求指引', reversedMeaning: '孤立、拒绝帮助、迷失' },
  { id: 10, name: 'Wheel of Fortune', nameCN: '命运之轮', arcana: 'major', emoji: '☸️', uprightMeaning: '命运转变、机遇、幸运周期', reversedMeaning: '厄运、抗拒改变、坏运气' },
  { id: 11, name: 'Justice',        nameCN: '正义',    arcana: 'major', emoji: '⚖️', uprightMeaning: '公平、真相、因果法则', reversedMeaning: '不公正、不诚实、逃避责任' },
  { id: 12, name: 'The Hanged Man', nameCN: '倒吊人',  arcana: 'major', emoji: '🙃', uprightMeaning: '暂停、放手、新视角、牺牲', reversedMeaning: '拖延、固执、无谓的牺牲' },
  { id: 13, name: 'Death',          nameCN: '死神',    arcana: 'major', emoji: '🌑', uprightMeaning: '转变、结束、新的开始', reversedMeaning: '抗拒改变、停滞不前、腐朽' },
  { id: 14, name: 'Temperance',     nameCN: '节制',    arcana: 'major', emoji: '🌊', uprightMeaning: '平衡、耐心、调和、中庸', reversedMeaning: '失衡、过度、缺乏节制' },
  { id: 15, name: 'The Devil',      nameCN: '恶魔',    arcana: 'major', emoji: '🔗', uprightMeaning: '束缚、执念、物质主义、阴暗面', reversedMeaning: '解脱束缚、自由、力量恢复' },
  { id: 16, name: 'The Tower',      nameCN: '高塔',    arcana: 'major', emoji: '⚡', uprightMeaning: '突变、混乱、启示、打破旧有', reversedMeaning: '避免灾难、抗拒改变的恐惧' },
  { id: 17, name: 'The Star',       nameCN: '星星',    arcana: 'major', emoji: '⭐', uprightMeaning: '希望、灵感、宁静、信念', reversedMeaning: '绝望、缺乏信心、不切实际' },
  { id: 18, name: 'The Moon',       nameCN: '月亮',    arcana: 'major', emoji: '🌕', uprightMeaning: '幻觉、直觉、潜意识、迷惑', reversedMeaning: '恐惧消散、真相揭示、混乱结束' },
  { id: 19, name: 'The Sun',        nameCN: '太阳',    arcana: 'major', emoji: '☀️', uprightMeaning: '成功、快乐、活力、积极', reversedMeaning: '短暂的悲观、延迟的成功' },
  { id: 20, name: 'Judgement',      nameCN: '审判',    arcana: 'major', emoji: '📯', uprightMeaning: '觉醒、内在召唤、转化', reversedMeaning: '自我怀疑、忽视内心呼唤' },
  { id: 21, name: 'The World',      nameCN: '世界',    arcana: 'major', emoji: '🌍', uprightMeaning: '完成、整合、成就、圆满', reversedMeaning: '未完成、延迟、缺乏收尾' },
]

// 56 张小阿卡纳（各 14 张 × 4 花色，简化版只含部分）
const SUITS = [
  { name: 'wands',   nameCN: '权杖', element: '火' },
  { name: 'cups',    nameCN: '圣杯', element: '水' },
  { name: 'swords',  nameCN: '宝剑', element: '风' },
  { name: 'pentacles', nameCN: '星币', element: '土' },
]

const MINOR_RANK = ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King']
const MINOR_RANK_CN = ['王牌','二','三','四','五','六','七','八','九','十','侍从','骑士','王后','国王']

const MINOR_ARCANA: TarotCard[] = []
let minorId = 100
for (const suit of SUITS) {
  for (let r = 0; r < 14; r++) {
    MINOR_ARCANA.push({
      id: minorId++,
      name: `${MINOR_RANK[r]} of ${suit.name.charAt(0).toUpperCase() + suit.name.slice(1)}`,
      nameCN: `${suit.nameCN}${MINOR_RANK_CN[r]}`,
      arcana: 'minor',
      suit: suit.nameCN,
      emoji: suit.element === '火' ? '🔥' : suit.element === '水' ? '💧' : suit.element === '风' ? '🌬️' : '🌿',
      uprightMeaning: `${suit.nameCN}的能量流动，${r < 5 ? '开端与建设' : r < 10 ? '行动与挑战' : '圆熟与完成'}`,
      reversedMeaning: `${suit.nameCN}能量受阻，需要重新审视`,
    })
  }
}

export const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA]

export function drawThreeCards(): DrawnCard[] {
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5)
  const positions: DrawnCard['position'][] = ['past', 'present', 'future']
  return shuffled.slice(0, 3).map((card, i) => {
    const orientation: DrawnCard['orientation'] = Math.random() > 0.3 ? 'upright' : 'reversed'
    return {
      card,
      orientation,
      position: positions[i],
      meaning: orientation === 'upright' ? card.uprightMeaning : card.reversedMeaning,
    }
  })
}
