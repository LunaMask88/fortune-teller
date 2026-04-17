export type Lang = 'zh' | 'en'

const zh = {
  lang: 'zh' as Lang,
  toggle: 'EN',

  nav: { back: '← 返回首页' },

  home: {
    tagline: '中西合璧命理师',
    desc1: '融合千年东方智慧与西方神秘学，输入你的出生信息，',
    desc2: 'AI 为你解读专属运势，推荐能量共振的幸运物件',
    cta: '✨ 开启命理解读',
    hint: '输入基本信息 · AI 深度分析 · 约 30 秒出结果',
    systemsTitle: '六大命理体系，全方位解读',
    footer: '命理仅供参考，人生掌握在自己手中 · MysticOracle © 2025',
    systems: [
      { icon: '☯️', title: '八字五行', desc: '天干地支，四柱命盘，五行平衡分析' },
      { icon: '⭐', title: '西洋星座', desc: '太阳星座·守护星·元素属性解读' },
      { icon: '🔮', title: '塔罗牌阵', desc: '过去·现在·未来 三张牌展开' },
      { icon: '🏛️', title: '紫微斗数', desc: '命宫主星·宫位能量·人生格局' },
      { icon: '🔢', title: '数字命理', desc: '生命数字·命运数字·灵魂密码' },
      { icon: '🎁', title: '幸运物件', desc: 'AI 推荐专属水晶、饰品、植物' },
    ],
  },

  form: {
    title: '输入你的星宿信息',
    subtitle: '信息越完整，解读越精准',
    name: '姓名', nameRequired: '*',
    namePlaceholder: '请输入你的姓名',
    nameHint: '用于数字命理计算',
    gender: '性别',
    female: '♀ 女', male: '♂ 男',
    birthDate: '出生日期', birthDateRequired: '*',
    year: '年', month: '月', day: '日',
    birthHour: '出生时辰',
    timeUnknown: '出生时间不知道（将以午时推算）',
    timeHint: '已知出生时辰可大幅提升八字和紫微斗数的精准度',
    period: '运势周期',
    periods: {
      today: { label: '今日运势', icon: '☀️' },
      month: { label: '本月运势', icon: '🌙' },
      year:  { label: '今年运势', icon: '🌟' },
    },
    context: '当前状况', contextOptional: '（选填）',
    contextPlaceholder: '描述你目前的状况、困惑或关注点，例如：最近在考虑换工作，感情方面有些迷茫……',
    questions: '你想问的问题', questionsOptional: '（选填，最多 5 个）',
    suggestedQ: ['今年适合换工作吗？', '感情运势如何？', '财运有什么要注意？', '健康方面有哪些提醒？'],
    addQuestion: '+ 添加自定义问题',
    questionPlaceholder: (n: number) => `问题 ${n}`,
    submit: '🔮 开始解读命运',
    submitting: '星象正在排盘，请稍候…',
    errorName: '请输入姓名',
    errorFailed: '运势生成失败',
    errorRetry: '请求失败，请稍后重试',
  },

  result: {
    periodLabels: { today: '今日', month: '本月', year: '今年' } as Record<string, string>,
    subtitle: (name: string, period: string) => `${name} 的${period}命理解读`,
    info12: '综合12大命理体系',
    tabs: {
      overview: { label: '总览',   icon: '✨' },
      eastern:  { label: '东方',   icon: '☯️' },
      western:  { label: '西方',   icon: '⭐' },
      lucky:    { label: '幸运物', icon: '🎁' },
    },
    loading: '正在加载命理结果…',
    exportPdf: '📄 导出 PDF', exporting: '⟳ 生成中…',
    reread: '🔄 重新解读', backHome: '← 返回首页',
    subtitleSuffix: (period: string) => `的${period}命理解读`,
    disclaimer: '命理仅供参考，人生掌握在自己手中 · 生成于',
    pdfGeneratedAt: '生成于',
    pdfTitle: (name: string) => `🔮 ${name} 的命理报告`,
    pdfMeta: (year: number, month: number, day: number, hour: number | null, gender: string, period: string) =>
      `${year}年${month}月${day}日${hour !== null ? ` ${hour}时` : ''} · ${gender === 'female' ? '女' : '男'} · ${period}运势`,
  },

  sections: {
    overall:          '✨ 综合运势',
    questionsAnswered:'🔍 针对你的问题',
    xingming:         '📝 姓名学 · 三才五格',
    bazi:             '🀄 八字 · 五行',
    zodiac:           '☯️ 星座 · 生肖 · 数字命理',
    liuyao:           '☰ 六爻 · 梅花易数',
    vedic:            '🪐 吠陀占星',
    tarot:            '🃏 塔罗牌',
    runes:            '᚛ 符文占卜',
    humanDesign:      '⚙️ 人类图',
  },

  lucky: {
    title: '🎁 专属幸运物件',
    subtitle: 'AI 根据你的命理特征推荐，与你五行能量最共振的物件',
    clickHint: (p: string) => `点击图片在 ${p} 中探索购买`,
    searchOn: (p: string) => `在 ${p} 搜索`,
    empty: '暂无幸运物件推荐',
    categories: {
      crystal: '水晶', jewelry: '饰品', color: '颜色',
      number:  '数字', plant:   '植物', symbol: '符号', other: '物件',
    },
  },
}

const en: typeof zh = {
  lang: 'en',
  toggle: '中文',

  nav: { back: '← Home' },

  home: {
    tagline: 'Eastern & Western Divination',
    desc1: 'Blending millennia of Eastern wisdom with Western mysticism. Enter your birth info,',
    desc2: 'and AI will decode your destiny & recommend resonant lucky items.',
    cta: '✨ Start My Reading',
    hint: 'Enter info · AI deep analysis · Results in ~30s',
    systemsTitle: 'Six Divination Systems, Full Spectrum',
    footer: 'For reference only. Your life is in your hands · MysticOracle © 2025',
    systems: [
      { icon: '☯️', title: 'BaZi · Five Elements',    desc: 'Four Pillars, heavenly stems & earthly branches' },
      { icon: '⭐', title: 'Western Astrology',        desc: 'Sun sign, ruling planet, elemental traits' },
      { icon: '🔮', title: 'Tarot Reading',            desc: 'Past · Present · Future three-card spread' },
      { icon: '🏛️', title: 'Zi Wei Dou Shu',          desc: 'Destiny palace, main star, life pattern' },
      { icon: '🔢', title: 'Numerology',               desc: 'Life path, destiny number, soul code' },
      { icon: '🎁', title: 'Lucky Items',              desc: 'AI-curated crystals, jewelry & plants' },
    ],
  },

  form: {
    title: 'Enter Your Birth Information',
    subtitle: 'More detail means more accurate readings',
    name: 'Name', nameRequired: '*',
    namePlaceholder: 'Enter your name',
    nameHint: 'Used for numerology calculation',
    gender: 'Gender',
    female: '♀ Female', male: '♂ Male',
    birthDate: 'Birth Date', birthDateRequired: '*',
    year: 'Year', month: 'Month', day: 'Day',
    birthHour: 'Birth Hour',
    timeUnknown: 'Birth time unknown (will use noon)',
    timeHint: 'Known birth hour greatly improves BaZi & Zi Wei accuracy',
    period: 'Fortune Period',
    periods: {
      today: { label: 'Today',      icon: '☀️' },
      month: { label: 'This Month', icon: '🌙' },
      year:  { label: 'This Year',  icon: '🌟' },
    },
    context: 'Current Situation', contextOptional: '(Optional)',
    contextPlaceholder: 'Describe your current situation, concerns, or focus areas…',
    questions: 'Questions to Ask', questionsOptional: '(Optional, up to 5)',
    suggestedQ: ['Good year to change jobs?', 'How is my love life?', 'Financial advice?', 'Any health reminders?'],
    addQuestion: '+ Add custom question',
    questionPlaceholder: (n: number) => `Question ${n}`,
    submit: '🔮 Start Reading',
    submitting: 'Reading the stars, please wait…',
    errorName: 'Please enter your name',
    errorFailed: 'Reading generation failed',
    errorRetry: 'Request failed, please try again',
  },

  result: {
    periodLabels: { today: 'Daily', month: 'Monthly', year: 'Annual' },
    subtitle: (name: string, period: string) => `${name}'s ${period} Reading`,
    info12: 'Integrating 12 divination systems',
    tabs: {
      overview: { label: 'Overview',    icon: '✨' },
      eastern:  { label: 'Eastern',     icon: '☯️' },
      western:  { label: 'Western',     icon: '⭐' },
      lucky:    { label: 'Lucky Items', icon: '🎁' },
    },
    loading: 'Loading your reading…',
    exportPdf: '📄 Export PDF', exporting: '⟳ Generating…',
    reread: '🔄 New Reading', backHome: '← Home',
    subtitleSuffix: (period: string) => `'s ${period} Reading`,
    disclaimer: 'For reference only. Your life is in your hands · Generated at',
    pdfGeneratedAt: 'Generated at',
    pdfTitle: (name: string) => `🔮 ${name}'s Destiny Report`,
    pdfMeta: (year: number, month: number, day: number, hour: number | null, gender: string, period: string) =>
      `${year}/${month}/${day}${hour !== null ? ` ${hour}:00` : ''} · ${gender === 'female' ? 'Female' : 'Male'} · ${period} Reading`,
  },

  sections: {
    overall:          '✨ Overall Fortune',
    questionsAnswered:'🔍 Your Questions Answered',
    xingming:         '📝 Chinese Name Analysis',
    bazi:             '🀄 BaZi · Five Elements',
    zodiac:           '☯️ Zodiac · Astrology · Numerology',
    liuyao:           '☰ I Ching · Six Lines',
    vedic:            '🪐 Vedic Astrology',
    tarot:            '🃏 Tarot Reading',
    runes:            '᚛ Rune Reading',
    humanDesign:      '⚙️ Human Design',
  },

  lucky: {
    title: '🎁 Your Lucky Items',
    subtitle: 'AI-curated items that resonate with your elemental energy',
    clickHint: (p: string) => `Click images to explore on ${p}`,
    searchOn: (p: string) => `Search on ${p}`,
    empty: 'No lucky items recommended yet',
    categories: {
      crystal: 'Crystal', jewelry: 'Jewelry', color: 'Color',
      number:  'Number',  plant:   'Plant',   symbol: 'Symbol', other: 'Item',
    },
  },
}

export const translations: Record<Lang, typeof zh> = { zh, en }
export type Translations = typeof zh
