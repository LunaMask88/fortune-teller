import type { LiuyaoResult, Hexagram } from '@/types'

// 六十四卦：[上卦, 下卦] → 卦名
const GUAS: Record<string, { name: string; namePY: string; summary: string }> = {
  '111111': { name: '乾', namePY: 'Qián', summary: '刚健，天行健，君子以自强不息' },
  '000000': { name: '坤', namePY: 'Kūn', summary: '柔顺，地势坤，君子以厚德载物' },
  '100010': { name: '屯', namePY: 'Zhūn', summary: '初生艰难，万事开头苦，坚持可成' },
  '010001': { name: '蒙', namePY: 'Méng', summary: '蒙昧启蒙，需要指引，循序渐进' },
  '111010': { name: '需', namePY: 'Xū', summary: '等待时机，不可急进，需耐心' },
  '010111': { name: '讼', namePY: 'Sòng', summary: '争讼争议，宜和解，避免冲突' },
  '010000': { name: '师', namePY: 'Shī', summary: '统帅军事，需有领导，团队协作' },
  '000010': { name: '比', namePY: 'Bǐ', summary: '亲比团结，和谐共处，人际顺畅' },
  '111011': { name: '小畜', namePY: 'Xiǎo Chù', summary: '小有积蓄，耐心积累，时机未至' },
  '110111': { name: '履', namePY: 'Lǚ', summary: '谨慎行事，礼仪规范，步步为营' },
  '111000': { name: '泰', namePY: 'Tài', summary: '大吉大利，天地交泰，万事亨通' },
  '000111': { name: '否', namePY: 'Pǐ', summary: '闭塞不通，天地不交，暂时退守' },
  '101111': { name: '同人', namePY: 'Tóng Rén', summary: '同心协力，广结善缘，合作共赢' },
  '111101': { name: '大有', namePY: 'Dà Yǒu', summary: '大吉大有，财旺运盛，光明正大' },
  '000100': { name: '谦', namePY: 'Qiān', summary: '谦逊低调，厚积薄发，谦受益' },
  '001000': { name: '豫', namePY: 'Yù', summary: '喜悦豫顺，顺势而为，积极乐观' },
  '100110': { name: '随', namePY: 'Suí', summary: '随机应变，顺应时势，灵活处世' },
  '011001': { name: '蛊', namePY: 'Gǔ', summary: '革旧布新，整顿改革，拨乱反正' },
  '110000': { name: '临', namePY: 'Lín', summary: '君临天下，积极进取，时来运转' },
  '000011': { name: '观', namePY: 'Guān', summary: '观察审视，冷静旁观，洞察全局' },
  '100101': { name: '噬嗑', namePY: 'Shì Kè', summary: '啃咬障碍，突破阻力，直面困难' },
  '101001': { name: '贲', namePY: 'Bì', summary: '文饰美化，注重形式，内外兼修' },
  '000001': { name: '剥', namePY: 'Bō', summary: '剥落衰退，收敛退守，等待转机' },
  '100000': { name: '复', namePY: 'Fù', summary: '一阳来复，否极泰来，新的开始' },
  '100111': { name: '无妄', namePY: 'Wú Wàng', summary: '真实无妄，诚实守正，顺天而行' },
  '111001': { name: '大畜', namePY: 'Dà Chù', summary: '大量积蓄，厚积薄发，蓄势待发' },
  '100001': { name: '颐', namePY: 'Yí', summary: '颐养自身，注重健康，修身养性' },
  '011110': { name: '大过', namePY: 'Dà Guò', summary: '大有过失，独立难支，需要帮助' },
  '010010': { name: '坎', namePY: 'Kǎn', summary: '险陷重重，险中求胜，坚守正道' },
  '101101': { name: '离', namePY: 'Lí', summary: '光明附丽，光彩照人，才华横溢' },
  '001110': { name: '咸', namePY: 'Xián', summary: '感应交流，男女相感，心灵相通' },
  '011100': { name: '恒', namePY: 'Héng', summary: '持久恒常，坚持不懈，长久稳定' },
  '111001_d': { name: '遁', namePY: 'Dùn', summary: '退隐回避，顺势而退，以退为进' },
  '111100': { name: '大壮', namePY: 'Dà Zhuàng', summary: '大力壮盛，充满活力，勇往直前' },
  '000101': { name: '晋', namePY: 'Jìn', summary: '晋升进步，光明前途，步步高升' },
  '101000': { name: '明夷', namePY: 'Míng Yí', summary: '光明受伤，暂时蛰伏，韬光养晦' },
  '101011': { name: '家人', namePY: 'Jiā Rén', summary: '家庭和谐，各安其位，齐家治国' },
  '110101': { name: '睽', namePY: 'Kuí', summary: '乖离不合，分歧对立，求同存异' },
  '010100': { name: '蹇', namePY: 'Jiǎn', summary: '步履艰难，困境重重，寻求助力' },
  '001010': { name: '解', namePY: 'Xiè', summary: '解除困难，柳暗花明，释然轻松' },
  '110001': { name: '损', namePY: 'Sǔn', summary: '损下益上，有所牺牲，舍得之道' },
  '100011': { name: '益', namePY: 'Yì', summary: '增益进步，利人利己，助人为乐' },
  '011111': { name: '夬', namePY: 'Guài', summary: '决断果断，勇于决策，当断则断' },
  '111110': { name: '姤', namePY: 'Gòu', summary: '偶遇相遇，机缘巧合，把握时机' },
  '000110': { name: '萃', namePY: 'Cuì', summary: '聚集汇萃，人脉广聚，众志成城' },
  '011000': { name: '升', namePY: 'Shēng', summary: '向上升进，步步高升，循序渐进' },
  '010110': { name: '困', namePY: 'Kùn', summary: '困厄穷迫，身处困境，守正待时' },
  '011010': { name: '井', namePY: 'Jǐng', summary: '水井清泉，取之不尽，滋养他人' },
  '101110': { name: '革', namePY: 'Gé', summary: '变革更新，除旧布新，大胆改革' },
  '011101': { name: '鼎', namePY: 'Dǐng', summary: '鼎新革故，稳重权威，建功立业' },
  '100100': { name: '震', namePY: 'Zhèn', summary: '震动惊雷，警醒猛省，积极振作' },
  '001001': { name: '艮', namePY: 'Gèn', summary: '静止守止，适时而止，知止得止' },
  '001011': { name: '渐', namePY: 'Jiàn', summary: '渐进有序，循序渐进，稳步前进' },
  '110100': { name: '归妹', namePY: 'Guī Mèi', summary: '婚姻归宿，顺势而行，情感归宿' },
  '101100': { name: '丰', namePY: 'Fēng', summary: '丰盛富足，盛大辉煌，鼎盛时期' },
  '001101': { name: '旅', namePY: 'Lǚ', summary: '旅途漂泊，客旅在外，谨慎处世' },
  '011011': { name: '巽', namePY: 'Xùn', summary: '顺从谦逊，柔顺入风，随机应变' },
  '110110': { name: '兑', namePY: 'Duì', summary: '喜悦愉快，口才交际，和悦相处' },
  '010111_h': { name: '涣', namePY: 'Huàn', summary: '涣散离散，需要凝聚，精神感召' },
  '111010_j': { name: '节', namePY: 'Jié', summary: '节制有度，适度而行，节用惜福' },
  '110011': { name: '中孚', namePY: 'Zhōng Fú', summary: '诚信中孚，内心诚实，以诚感人' },
  '001110_x': { name: '小过', namePY: 'Xiǎo Guò', summary: '小有过失，谨小慎微，稍加注意' },
  '101010': { name: '既济', namePY: 'Jì Jì', summary: '大功告成，已经完成，守成为要' },
  '010101': { name: '未济', namePY: 'Wèi Jì', summary: '尚未完成，继续努力，终将成功' },
}

// 六爻：上中下三爻×2层 = 六条线
// 铜钱法：每爻投3枚，正面=3，背面=2，3枚合计
function throwCoin(rng: () => number): number {
  return [1, 2, 3].reduce(acc => acc + (rng() > 0.5 ? 3 : 2), 0)
}

function coinToLine(val: number): { yao: 0 | 1; changing: boolean } {
  // 6=老阴(变), 7=少阳, 8=少阴, 9=老阳(变)
  return { yao: val % 2 === 1 ? 1 : 0, changing: val === 6 || val === 9 }
}

export function drawLiuyao(rng: () => number = Math.random): LiuyaoResult {
  const throws = Array.from({ length: 6 }, () => throwCoin(rng))
  const lines = throws.map(coinToLine)

  // 构建本卦（下→上，索引0=初爻）
  const benKey = lines.map(l => l.yao).join('')
  // 构建变卦（变爻取反）
  const bianKey = lines.map(l => l.changing ? (l.yao === 1 ? 0 : 1) : l.yao).join('')

  const benGua: Hexagram = GUAS[benKey] ?? { name: '未知', namePY: '?', summary: '卦象待查' }
  const bianGua: Hexagram | null = bianKey !== benKey ? (GUAS[bianKey] ?? null) : null

  const changingLines = lines.map((l, i) => l.changing ? i + 1 : null).filter(Boolean) as number[]

  return {
    lines: lines.map(l => ({ yao: l.yao, changing: l.changing })),
    benGua,
    bianGua,
    changingLines,
    interpretation: changingLines.length === 0
      ? `得${benGua.name}卦，${benGua.summary}。六爻皆静，以卦辞为主，局面相对稳定。`
      : `本卦${benGua.name}，变为${bianGua?.name ?? '未知'}。${benGua.summary}，变爻显示事态正在转化中。`,
  }
}
