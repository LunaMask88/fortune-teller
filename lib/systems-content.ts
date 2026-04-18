export interface SystemSection {
  heading: string
  body: string
}

export interface KeyTerm {
  term: string
  explanation: string
}

export interface SystemContent {
  slug: string
  icon: string
  title: string
  subtitle: string
  intro: string
  howItWorks: SystemSection[]
  howToRead: SystemSection[]
  keyTerms: KeyTerm[]
}

const content: Record<string, { zh: SystemContent; en: SystemContent }> = {
  bazi: {
    zh: {
      slug: 'bazi', icon: '☯️',
      title: '八字五行',
      subtitle: '天干地支，四柱命盘',
      intro: '八字，又称"四柱"，是中国最古老、最完整的命理体系之一。以出生年、月、日、时各对应一个天干地支组合，共八个字，构成一张"命盘"，映射一个人先天的能量格局。',
      howItWorks: [
        {
          heading: '天干与地支',
          body: '天干共十个：甲乙丙丁戊己庚辛壬癸，各对应五行属性。地支共十二个：子丑寅卯辰巳午未申酉戌亥，不仅对应十二生肖，也各有五行与阴阳属性。天干地支两两配对，形成年柱、月柱、日柱、时柱，合计八字。',
        },
        {
          heading: '五行平衡',
          body: '金木水火土五种元素在命盘中各有数量，多则"旺"，少则"弱"。命理认为，五行趋向均衡的人生命能量更稳定；某行偏弱时，可通过环境、颜色、物件进行补充与平衡。',
        },
        {
          heading: '日主——你是谁',
          body: '日柱的天干称为"日主"，代表命主本人的核心气质。分析八字时，一切都以日主为中心展开，看其强弱、看其与其他柱的生克制化关系，从而推演性格与运势走向。',
        },
      ],
      howToRead: [
        {
          heading: '看五行强弱',
          body: '数出命盘中木火土金水各出现几次，最多者为"旺"，最少者为"弱"。弱的五行往往代表你生命中相对欠缺的能量领域——如水弱可能代表智慧、沟通有待加强，木弱代表生命力与创造力需滋养。',
        },
        {
          heading: '看趋势',
          body: '大运和流年会带入新的天干地支，与原局产生生（互补）或克（碰撞）的关系。"运助日主"时往往是顺遂期，"运克日主"或"运泄日主"时需更谨慎行事。',
        },
        {
          heading: '结合本应用',
          body: '本应用会自动计算你的四柱与五行分布，标注偏旺与偏弱元素，并在幸运物件推荐中优先补足弱行——如木弱推荐绿色植物与绿色系服装，水弱推荐蓝色与黑色系。',
        },
      ],
      keyTerms: [
        { term: '日主', explanation: '日柱天干，代表命主本人，是分析八字的核心基准。' },
        { term: '四柱', explanation: '年柱、月柱、日柱、时柱，各由一天干+一地支组成，共八字。' },
        { term: '五行', explanation: '木、火、土、金、水，宇宙五种基本能量形式。' },
        { term: '生克', explanation: '五行之间相生（促进）与相克（制约）的关系，构成命盘动态。' },
        { term: '旺衰', explanation: '五行在命盘中的强弱程度，影响对应生活领域的能量高低。' },
        { term: '大运', explanation: '每隔约十年更换一次的运势周期，影响人生大方向。' },
      ],
    },
    en: {
      slug: 'bazi', icon: '☯️',
      title: 'BaZi & Five Elements',
      subtitle: 'Four Pillars of Destiny',
      intro: 'BaZi (八字), meaning "Eight Characters," is one of China\'s oldest and most complete destiny systems. Your exact birth date and time are converted into four Pillars — year, month, day, hour — each consisting of a Heavenly Stem and Earthly Branch, totaling eight characters that map your innate energy blueprint.',
      howItWorks: [
        {
          heading: 'Heavenly Stems & Earthly Branches',
          body: 'The ten Heavenly Stems (甲乙丙丁戊己庚辛壬癸) each carry a Five Element property. The twelve Earthly Branches (子丑寅…亥) correspond to the Chinese zodiac animals and also carry elemental and yin/yang attributes. Paired together they form the Year, Month, Day, and Hour Pillars.',
        },
        {
          heading: 'Five Element Balance',
          body: 'Wood, Fire, Earth, Metal, and Water each appear a certain number of times across the chart. Abundant elements are "strong"; scarce ones are "weak." A balanced chart suggests stable life energy. Weak elements can be supplemented through colors, environments, crystals, and lifestyle choices.',
        },
        {
          heading: 'Day Master — Who You Are',
          body: 'The Heavenly Stem of the Day Pillar is called the "Day Master" and represents you, the chart owner. Everything else in the chart is interpreted relative to the Day Master\'s strength and its interactions with surrounding elements.',
        },
      ],
      howToRead: [
        {
          heading: 'Check Element Counts',
          body: 'Count how many times each element appears in the chart. The most frequent is "dominant," the least frequent is "weak." Weak elements often indicate life areas that need nurturing — weak Water may suggest wisdom and communication need development; weak Wood may point to creativity and vitality.',
        },
        {
          heading: 'Watch the Cycles',
          body: 'Major Luck Cycles (大运) and Annual Pillars (流年) introduce new stems and branches that interact with your natal chart. When the cycle supports your Day Master, life tends to flow; when it clashes or drains, more caution is needed.',
        },
        {
          heading: 'In This App',
          body: 'The app automatically calculates your Four Pillars and Five Element distribution, highlights dominant and weak elements, and recommends lucky items that supplement your weakest element — e.g., green plants and clothing for weak Wood, blue tones and crystals for weak Water.',
        },
      ],
      keyTerms: [
        { term: 'Day Master', explanation: 'The Heavenly Stem of the Day Pillar — represents you, the chart owner.' },
        { term: 'Four Pillars', explanation: 'Year, Month, Day, and Hour Pillars, each a Stem-Branch pair, totaling eight characters.' },
        { term: 'Five Elements', explanation: 'Wood, Fire, Earth, Metal, Water — the five fundamental energy forces of the universe.' },
        { term: 'Generation/Control', explanation: 'The two core relationships between elements: generating (supporting) and controlling (restraining).' },
        { term: 'Strength', explanation: 'How abundant or scarce each element is in the chart, affecting its life domain.' },
        { term: 'Luck Cycle', explanation: 'A roughly ten-year period of fortune influence that overlays the natal chart.' },
      ],
    },
  },

  astrology: {
    zh: {
      slug: 'astrology', icon: '⭐',
      title: '西洋星座',
      subtitle: '太阳星座·守护星·元素属性',
      intro: '西洋占星源自古希腊与巴比伦，以天体在黄道十二宫的位置解读个人命运与性格。太阳星座是最广为人知的切入点，代表你的核心自我与生命意志。',
      howItWorks: [
        {
          heading: '黄道十二宫',
          body: '地球围绕太阳运行时，太阳从地球视角依次经过十二个星座区域，每段约30天。出生时太阳所在的星座即为你的"太阳星座"，蕴含你最基本的生命能量与自我认同。',
        },
        {
          heading: '四元素与三模式',
          body: '十二星座按四元素分组——火象（牡羊、狮子、射手）主激情行动；土象（金牛、处女、摩羯）重实际稳定；风象（双子、天秤、水瓶）善思维交流；水象（巨蟹、天蝎、双鱼）富情感直觉。再按开创、固定、变动三种模式细分性格风格。',
        },
        {
          heading: '守护行星',
          body: '每个星座有对应的守护星，象征其核心能量来源。如白羊守护星为火星（行动力），金牛守护星为金星（美感与享受），双子守护星为水星（思维与沟通）。守护星的状态影响星座能量的释放方式。',
        },
      ],
      howToRead: [
        {
          heading: '了解你的元素',
          body: '首先判断自己属于火土风水哪种元素。火象星座适合大胆行动；土象星座专注长期规划；风象星座享受思想交流；水象星座依赖情感直觉。这决定你能量运作的底层逻辑。',
        },
        {
          heading: '结合运势周期',
          body: '本应用呈现的是太阳星座的当期运势倾向。当行星与你的星座形成有利相位时，对应领域能量上升；形成紧张相位时需注意潜在阻力。',
        },
        {
          heading: '与其他体系对照',
          body: '西洋星座与八字常有共鸣之处。如八字火旺的人往往也是火象星座，性格激情外向；五行水旺者多为水象星座，情感丰富细腻。东西方体系的共鸣点能加强解读的可信度。',
        },
      ],
      keyTerms: [
        { term: '太阳星座', explanation: '出生时太阳所在的黄道星座，代表核心自我与生命意志。' },
        { term: '守护星', explanation: '与每个星座对应的行星，象征该星座的核心能量来源。' },
        { term: '四元素', explanation: '火、土、风、水，十二星座的基本能量分类。' },
        { term: '三模式', explanation: '开创（行动启动）、固定（稳定持续）、变动（适应变化）三种性格风格。' },
        { term: '相位', explanation: '行星之间的角度关系，决定能量是和谐流动还是产生张力。' },
      ],
    },
    en: {
      slug: 'astrology', icon: '⭐',
      title: 'Western Astrology',
      subtitle: 'Sun Sign · Ruling Planet · Elements',
      intro: 'Western Astrology traces its roots to ancient Greece and Babylon, interpreting character and destiny through planetary positions in the twelve zodiac signs. Your Sun Sign is the most widely known entry point, representing your core self and life force.',
      howItWorks: [
        {
          heading: 'The Twelve Zodiac Signs',
          body: 'As Earth orbits the Sun, the Sun appears to move through twelve constellation zones, spending about 30 days in each. The sign the Sun occupied at your birth is your Sun Sign — it carries your fundamental life energy and sense of self.',
        },
        {
          heading: 'Four Elements & Three Modalities',
          body: 'Signs are grouped by four elements: Fire (Aries, Leo, Sagittarius) — passion and action; Earth (Taurus, Virgo, Capricorn) — practicality and stability; Air (Gemini, Libra, Aquarius) — intellect and communication; Water (Cancer, Scorpio, Pisces) — emotion and intuition. Three modalities (Cardinal, Fixed, Mutable) further define personality style.',
        },
        {
          heading: 'Ruling Planets',
          body: 'Each sign has a ruling planet that symbolizes its core energy source. Aries is ruled by Mars (drive), Taurus by Venus (beauty and pleasure), Gemini by Mercury (thought and communication). The ruling planet\'s condition influences how the sign\'s energy expresses itself.',
        },
      ],
      howToRead: [
        {
          heading: 'Know Your Element',
          body: 'First identify your element: Fire signs thrive on bold action; Earth signs focus on long-term planning; Air signs excel at intellectual exchange; Water signs rely on emotional intuition. This reveals the underlying logic of how your energy operates.',
        },
        {
          heading: 'Reading Fortune Cycles',
          body: 'The app presents current fortune tendencies for your Sun Sign. When planets form favorable angles to your sign, corresponding life areas gain energy; tense angles signal areas needing caution.',
        },
        {
          heading: 'Cross-System Resonance',
          body: 'Western astrology and BaZi often echo each other. People with strong Fire in BaZi are frequently Fire sign personalities — passionate and outgoing. Water-dominant BaZi charts often align with Water sign sensitivity. These resonances strengthen the reading\'s reliability.',
        },
      ],
      keyTerms: [
        { term: 'Sun Sign', explanation: 'The zodiac sign the Sun occupied at birth — represents core self and life will.' },
        { term: 'Ruling Planet', explanation: 'The planet associated with each sign, symbolizing its primary energy source.' },
        { term: 'Four Elements', explanation: 'Fire, Earth, Air, Water — the fundamental energy categories of the twelve signs.' },
        { term: 'Modalities', explanation: 'Cardinal (initiating), Fixed (sustaining), Mutable (adapting) — three personality operating styles.' },
        { term: 'Aspect', explanation: 'The angular relationship between planets, determining harmonious or tense energy flow.' },
      ],
    },
  },

  tarot: {
    zh: {
      slug: 'tarot', icon: '🔮',
      title: '塔罗牌阵',
      subtitle: '过去·现在·未来',
      intro: '塔罗起源于15世纪欧洲，由78张牌组成，通过随机抽取触发潜意识共鸣，帮助人们探索当下处境、内在冲突与可能的走向。塔罗不是预言，而是一面镜子，映照你此刻内心最深的知晓。',
      howItWorks: [
        {
          heading: '大阿卡纳（22张）',
          body: '从愚者（0）到世界（21），代表人生重大原型与转化主题。每张牌都有深远的象征意义——恋人牌关于选择与关系，命运之轮关于时机与变化，审判牌关于觉醒与新的开始。大阿卡纳出现意味着当前议题具有重大生命意义。',
        },
        {
          heading: '小阿卡纳（56张）',
          body: '分权杖、圣杯、宝剑、星币四个花色，各14张（A到10加宫廷牌）。权杖对应火元素（行动与激情），圣杯对应水元素（情感与关系），宝剑对应风元素（思维与冲突），星币对应土元素（物质与现实）。',
        },
        {
          heading: '正位与逆位',
          body: '牌面朝上为正位，能量正向流动；倒置为逆位，表示能量受阻、内化或需要反思。逆位不等于坏事，有时代表内在转化的开始。',
        },
      ],
      howToRead: [
        {
          heading: '三牌阵：过去·现在·未来',
          body: '本应用采用最经典的三牌展开。左牌（过去）代表塑造当前处境的根源能量；中牌（现在）反映你此刻正在经历的核心主题；右牌（未来）展示若沿此方向前行，能量走向何方——注意，未来牌是"趋势"而非定局。',
        },
        {
          heading: '感受共鸣，不要死背牌义',
          body: '塔罗最有效的使用方式是观察牌面图像时内心升起的第一个感受。每张牌的标准含义是框架，你对图像的直觉反应才是个人化的信息。',
        },
        {
          heading: '结合其他体系',
          body: '当塔罗与八字、星座呈现相似主题时——如塔罗出现"宝剑"系（思维冲突）而命盘显示五行水弱（沟通不畅）——这种共鸣使信息更可信。本应用会综合所有体系进行AI解读。',
        },
      ],
      keyTerms: [
        { term: '大阿卡纳', explanation: '22张代表生命重大原型的牌，从愚者到世界，标志重要人生主题。' },
        { term: '小阿卡纳', explanation: '56张日常能量牌，分权杖、圣杯、宝剑、星币四花色。' },
        { term: '正位', explanation: '牌面向上，能量正向、外向表达。' },
        { term: '逆位', explanation: '牌面倒置，能量内化、受阻或处于转化过程中。' },
        { term: '花色', explanation: '四种牌组对应四元素：权杖（火）、圣杯（水）、宝剑（风）、星币（土）。' },
        { term: '牌阵', explanation: '牌的排列方式，每个位置代表特定含义，如时间线、生活领域等。' },
      ],
    },
    en: {
      slug: 'tarot', icon: '🔮',
      title: 'Tarot',
      subtitle: 'Past · Present · Future',
      intro: 'Tarot originated in 15th-century Europe and consists of 78 cards. Through random draws that activate subconscious resonance, Tarot helps explore current situations, inner conflicts, and possible paths forward. Tarot is not prophecy — it is a mirror reflecting what you already know at the deepest level.',
      howItWorks: [
        {
          heading: 'Major Arcana (22 Cards)',
          body: 'From The Fool (0) to The World (21), these cards represent life\'s major archetypes and transformative themes. Each carries profound symbolic meaning — The Lovers speaks to choice and relationship, The Wheel of Fortune to timing and change, Judgement to awakening. A Major Arcana appearance signals that the current situation carries significant life importance.',
        },
        {
          heading: 'Minor Arcana (56 Cards)',
          body: 'Divided into four suits of 14 cards each (Ace through 10, plus Court cards). Wands correspond to Fire (action and passion), Cups to Water (emotion and relationships), Swords to Air (thought and conflict), Pentacles to Earth (material reality and resources).',
        },
        {
          heading: 'Upright & Reversed',
          body: 'An upright card indicates energy flowing forward naturally. A reversed card suggests the energy is blocked, internalized, or in transformation. Reversed cards are not inherently negative — they often signal the beginning of inner change.',
        },
      ],
      howToRead: [
        {
          heading: 'Three-Card Spread: Past · Present · Future',
          body: 'The app uses the classic three-card layout. The left card (Past) represents the root energy shaping your current situation. The center card (Present) reflects the core theme you\'re experiencing now. The right card (Future) shows where energy trends if you continue on this path — note that future cards indicate tendencies, not fixed outcomes.',
        },
        {
          heading: 'Feel the Resonance, Don\'t Memorize',
          body: 'The most powerful way to use Tarot is to notice your first feeling when viewing the card image. Standard card meanings provide a framework; your intuitive reaction to the imagery carries your personalized message.',
        },
        {
          heading: 'Cross-System Integration',
          body: 'When Tarot and BaZi or Astrology present similar themes — such as Sword cards (mental conflict) appearing alongside weak Water in BaZi (communication difficulties) — the resonance strengthens the reading\'s credibility. The app integrates all systems in its AI analysis.',
        },
      ],
      keyTerms: [
        { term: 'Major Arcana', explanation: '22 cards representing life\'s major archetypes, from The Fool to The World.' },
        { term: 'Minor Arcana', explanation: '56 everyday energy cards in four suits: Wands, Cups, Swords, Pentacles.' },
        { term: 'Upright', explanation: 'Card facing up — energy expressed positively and outwardly.' },
        { term: 'Reversed', explanation: 'Card inverted — energy internalized, blocked, or in transformation.' },
        { term: 'Suits', explanation: 'Four card groups corresponding to four elements: Wands (Fire), Cups (Water), Swords (Air), Pentacles (Earth).' },
        { term: 'Spread', explanation: 'The layout arrangement where each position carries a specific meaning.' },
      ],
    },
  },

  ziwei: {
    zh: {
      slug: 'ziwei', icon: '🏛️',
      title: '紫微斗数',
      subtitle: '命宫主星·宫位能量',
      intro: '紫微斗数是中国命理学中最复杂、最精密的体系之一，相传由唐代陈抟老祖所创。以出生年月日时为基础，在十二宫位上排布一百多颗星曜，形成一张"宇宙地图"，精准描绘命主的性格、才能与人生格局。',
      howItWorks: [
        {
          heading: '十二宫位',
          body: '命宫（命主核心）、兄弟宫、夫妻宫、子女宫、财帛宫、疾厄宫、迁移宫、奴仆宫、官禄宫、田宅宫、福德宫、父母宫——每个宫位管辖人生的一个具体领域，主星与辅星落入其中，决定该领域的能量特质。',
        },
        {
          heading: '主星系统',
          body: '十四颗主星（紫微、天机、太阳、武曲、天同、廉贞、天府、太阴、贪狼、巨门、天相、天梁、七杀、破军）各有鲜明个性。紫微星代表领导与尊贵，贪狼星代表欲望与才艺，七杀星代表开拓与魄力。',
        },
        {
          heading: '四化——动态能量',
          body: '化禄（增益流通）、化权（权威掌控）、化科（声誉智慧）、化忌（阻碍暗耗）是斗数最核心的动态变量，随流年不断变化，决定各宫的吉凶起伏。',
        },
      ],
      howToRead: [
        {
          heading: '先看命宫',
          body: '命宫是整张盘最核心的宫位，落入哪颗主星，就具有那颗星的基本特质。如命宫坐紫微，天生有领导气质与贵人缘；坐天同，性情温和、福气深厚。',
        },
        {
          heading: '再看财帛宫与官禄宫',
          body: '财帛宫反映财富流向与理财方式；官禄宫显示事业格局与职场能量。这两宫与命宫形成三合格局时，往往预示事业财运的整体走向。',
        },
        {
          heading: '本应用的呈现',
          body: '本应用提取命宫所在宫位、主星名称及其核心描述，作为AI解读的重要参数。深度使用者可以学习完整命盘，但即便只看命宫主星，也能获得颇具参考价值的性格与运势洞见。',
        },
      ],
      keyTerms: [
        { term: '命宫', explanation: '十二宫之首，代表命主本人的核心性格、能力与人生主题。' },
        { term: '主星', explanation: '十四颗核心星曜，各有鲜明能量特质，决定所落宫位的基本属性。' },
        { term: '四化', explanation: '化禄/权/科/忌，为星曜附加动态属性，影响吉凶起伏。' },
        { term: '三合', explanation: '命宫、财帛宫、官禄宫形成的核心三角，决定整体格局高低。' },
        { term: '流年', explanation: '每一年的运势变化，通过流年星曜与本命盘互动呈现。' },
      ],
    },
    en: {
      slug: 'ziwei', icon: '🏛️',
      title: 'Zi Wei Dou Shu',
      subtitle: 'Purple Star Astrology',
      intro: 'Zi Wei Dou Shu (紫微斗数) is one of China\'s most complex and precise destiny systems. Using your birth date and time, over 100 stars are arranged across twelve life palaces, creating a cosmic map that precisely describes your personality, talents, and life architecture.',
      howItWorks: [
        {
          heading: 'Twelve Life Palaces',
          body: 'The Life Palace (self), Siblings, Marriage, Children, Wealth, Health, Travel, Servants, Career, Property, Fortune & Virtue, and Parents palaces each govern a specific life domain. Stars falling into each palace determine that area\'s energy characteristics.',
        },
        {
          heading: 'The Fourteen Major Stars',
          body: 'Purple Star (Zi Wei), Heavenly Machine, Sun, Martial Destruction, Heavenly Kindness, Pure Integrity, Heavenly Treasury, Moon, Greedy Wolf, Giant Gate, Heavenly Minister, Heavenly Roof Beam, Seven Kills, and Broken Army — each carries a distinct personality and energy signature.',
        },
        {
          heading: 'The Four Transformations',
          body: 'Hua Lu (增益·abundance), Hua Quan (权威·authority), Hua Ke (声誉·reputation), and Hua Ji (阻碍·obstruction) are dynamic variables that shift with each year, determining fortune rises and falls across the twelve palaces.',
        },
      ],
      howToRead: [
        {
          heading: 'Start with the Life Palace',
          body: 'The Life Palace is the chart\'s most important position. Whichever major star sits there defines your core character. Zi Wei in the Life Palace suggests natural leadership and powerful benefactors; Heavenly Kindness suggests gentle nature and deep fortune.',
        },
        {
          heading: 'Then Check Wealth & Career Palaces',
          body: 'The Wealth Palace reveals your money flow and financial style; the Career Palace shows your professional capacity and workplace energy. When these two form a favorable triangle with the Life Palace, overall career and wealth prospects are strong.',
        },
        {
          heading: 'In This App',
          body: 'The app extracts your Life Palace position, major star name, and its core description as key parameters for AI analysis. Even focusing only on the Life Palace major star yields valuable personality and fortune insights.',
        },
      ],
      keyTerms: [
        { term: 'Life Palace', explanation: 'The most important of the twelve palaces, representing the chart owner\'s core character and life theme.' },
        { term: 'Major Stars', explanation: 'The fourteen core stars, each with distinct energy signatures, determining the quality of each palace.' },
        { term: 'Four Transformations', explanation: 'Lu/Quan/Ke/Ji — dynamic properties that modify stars, influencing fortune rises and falls.' },
        { term: 'The Triangle', explanation: 'The Life, Wealth, and Career palaces form the core triangle determining overall life architecture.' },
        { term: 'Annual Flow', explanation: 'Each year\'s fortune changes, revealed through yearly stars interacting with the natal chart.' },
      ],
    },
  },

  numerology: {
    zh: {
      slug: 'numerology', icon: '🔢',
      title: '数字命理',
      subtitle: '生命数字·命运数字',
      intro: '数字命理学（Numerology）认为宇宙由数字构成，每个数字都振动着特定的能量频率。通过将出生日期或名字化简为1-9（或11、22、33等主数），可以揭示一个人的天赋特质、人生使命与灵魂渴望。',
      howItWorks: [
        {
          heading: '生命数字的计算',
          body: '将出生年月日的所有数字相加，逐步化简至个位数。例如1990年6月15日：1+9+9+0+6+1+5=31，3+1=4，生命数字为4。若相加得到11、22或33则不再化简，这三个为"主数字"，能量强烈。',
        },
        {
          heading: '九个基础数字',
          body: '1象征领导与开创；2代表合作与敏感；3带来创意与表达；4注重稳定与建设；5渴望自由与变化；6关怀与责任；7深度与智慧；8权力与财富；9博爱与完成。每个数字都有阴暗面：如4的执着可能变为固执，8的野心可能变为控制欲。',
        },
        {
          heading: '命运数字与其他数字',
          body: '除生命数字外，还有命运数字（由名字字母的数值之和算出，反映你向外展现的能量）、灵魂数字（只取名字中的元音，代表内在渴望）等维度，共同构成更完整的数字命理画像。',
        },
      ],
      howToRead: [
        {
          heading: '生命数字是核心使命',
          body: '生命数字不只是性格，它更代表你这一生要学习和实现的主题。4号人的使命是建立稳定的基础结构；7号人的使命是深入探索真理与智慧；9号人的使命是超越自我、服务更大的善。',
        },
        {
          heading: '识别挑战与天赋',
          body: '每个数字既有天赋面，也有挑战面。了解自己数字的挑战面，可以帮助你识别并超越反复出现的生命模式，将受阻的能量转化为成长的动力。',
        },
        {
          heading: '与命理结合',
          body: '数字命理常与八字产生有趣共鸣：生命数字8（权力、财富）的人往往命中金旺；生命数字7（深度、智慧）者常有水旺或紫微天机星等特征。本应用将数字命理作为解读的补充维度。',
        },
      ],
      keyTerms: [
        { term: '生命数字', explanation: '由出生日期所有数字相加化简而得，代表人生核心主题与使命。' },
        { term: '命运数字', explanation: '由全名字母数值计算，反映向外世界展现的能量与才能。' },
        { term: '主数字', explanation: '11、22、33，不化简为个位，能量强烈，肩负特殊使命。' },
        { term: '数字振动', explanation: '每个数字被认为具有独特的宇宙能量频率，影响持有者的能量状态。' },
      ],
    },
    en: {
      slug: 'numerology', icon: '🔢',
      title: 'Numerology',
      subtitle: 'Life Path · Destiny Number',
      intro: 'Numerology holds that the universe is built on numerical vibrations, and every number carries a specific energy frequency. By reducing your birth date or name to a single digit (1-9) or master number (11, 22, 33), you can reveal your innate talents, life mission, and soul\'s deepest desires.',
      howItWorks: [
        {
          heading: 'Calculating Your Life Path Number',
          body: 'Add all digits of your birth date together and reduce to a single digit. Example: June 15, 1990 → 1+9+9+0+6+1+5=31 → 3+1=4, Life Path 4. If the total is 11, 22, or 33, do not reduce further — these are Master Numbers with intensified energy.',
        },
        {
          heading: 'The Nine Core Numbers',
          body: '1: Leadership and initiation. 2: Cooperation and sensitivity. 3: Creativity and expression. 4: Stability and building. 5: Freedom and change. 6: Nurturing and responsibility. 7: Depth and wisdom. 8: Power and abundance. 9: Compassion and completion. Each number also has a shadow side — 4\'s focus can become rigidity; 8\'s ambition can become control.',
        },
        {
          heading: 'Destiny & Soul Numbers',
          body: 'Beyond the Life Path, the Destiny Number (derived from the numerical value of all letters in your full name, representing outward energy) and the Soul Urge Number (vowels only, representing inner desires) create a more complete numerological portrait.',
        },
      ],
      howToRead: [
        {
          heading: 'Life Path as Core Mission',
          body: 'The Life Path Number represents not just personality but the central theme you\'re here to learn and embody. Life Path 4 people are here to build solid foundations; Path 7 to explore truth and wisdom; Path 9 to transcend ego and serve the greater good.',
        },
        {
          heading: 'Recognize Gifts & Challenges',
          body: 'Every number has both gift and shadow aspects. Understanding your number\'s challenges helps you identify recurring life patterns and transform blocked energy into growth momentum.',
        },
        {
          heading: 'Cross-System Resonance',
          body: 'Numerology often resonates with BaZi: Life Path 8 (power and wealth) often correlates with strong Metal in the chart; Life Path 7 (depth and wisdom) frequently appears with strong Water or specific Zi Wei stars. The app integrates numerology as a supplementary interpretive layer.',
        },
      ],
      keyTerms: [
        { term: 'Life Path Number', explanation: 'Derived from all birth date digits — represents your core life theme and mission.' },
        { term: 'Destiny Number', explanation: 'Calculated from the full name — reflects energy and talents shown to the outer world.' },
        { term: 'Master Numbers', explanation: '11, 22, 33 — not reduced to single digits; carry intensified energy and special purpose.' },
        { term: 'Numerical Vibration', explanation: 'The unique cosmic energy frequency each number is believed to carry.' },
      ],
    },
  },

  lucky: {
    zh: {
      slug: 'lucky', icon: '🎁',
      title: '幸运物件',
      subtitle: 'AI 能量共振推荐',
      intro: '幸运物件并非迷信，而是通过具体的物质媒介，持续提醒你与特定能量建立连接。水晶、颜色、植物、数字——每一类都有其对应的振动频率。本应用结合你的命理档案，智能推荐最能与你能量共振的物件。',
      howItWorks: [
        {
          heading: '五行对应',
          body: '五行是推荐的核心依据。缺木者推荐绿色系物件、植物、木质材料；缺火者推荐红橙色、蜡烛、辛辣香薰；缺土者推荐土黄色、陶瓷、埃及法老石等土系水晶；缺金者推荐白色、金属饰品、金色系；缺水者推荐蓝黑色、水晶球、流动感饰品。',
        },
        {
          heading: '吠陀星宿与人类图',
          body: '吠陀占星的星宿与达沙大运（当前行星周期）会影响推荐侧重。如当前火星大运者，推荐红色与行动力水晶；人类图"生产者"类型者，适合根部能量水晶（红色碧玺、石榴石）以支持骶轮能量。',
        },
        {
          heading: 'AI 综合生成',
          body: '本应用不使用固定数据库，而是由AI实时综合你的八字五行、星座、吠陀星宿、人类图等多个维度，生成7-8件专属推荐，覆盖水晶、饰品、植物/香薰、颜色服装、符号等多类别。',
        },
      ],
      howToRead: [
        {
          heading: '看"提升哪方运势"标签',
          body: '每件物件都标有它主要增益的运势维度（事业运/财运/感情运/健康运/整体运）。先关注你当前最需要提升的领域，优先考虑对应物件。',
        },
        {
          heading: '使用方式',
          body: '水晶可随身携带或放在工作、睡眠空间；颜色类建议穿着或布置在常用空间；香薰植物可晨起或冥想时使用；数字可以设为密码、提醒、或在重要场合有意识地使用。',
        },
        {
          heading: '购买渠道',
          body: '每件物件下方提供Pinterest（灵感图）、Etsy（手工精品）、Amazon（快速购买）三个平台直达链接。遇到平台搜索拦截时，可复制搜索词手动粘贴搜索。',
        },
      ],
      keyTerms: [
        { term: '五行补缺', explanation: '根据命盘中缺失的五行，推荐对应颜色、材质与物件来平衡能量。' },
        { term: '振动频率', explanation: '物质世界中每种颜色、材质、气味都被认为具有特定的能量频率，可与人体场产生共振。' },
        { term: '根部能量', explanation: '人类图中对应骶轮的生命力能量，红色系水晶可支持其稳定运作。' },
        { term: '星宿推荐', explanation: '吠陀占星27个星宿各有对应守护星与物件，影响幸运物件的方向选择。' },
      ],
    },
    en: {
      slug: 'lucky', icon: '🎁',
      title: 'Lucky Items',
      subtitle: 'AI Energy Resonance Recommendations',
      intro: 'Lucky items are not superstition — they are physical anchors that continuously remind you to connect with specific energies. Crystals, colors, plants, numbers — each category carries a corresponding vibrational frequency. The app combines your full divination profile to intelligently recommend items that resonate most with your energy field.',
      howItWorks: [
        {
          heading: 'Five Elements Alignment',
          body: 'Five Elements are the core recommendation basis. Weak Wood → green items, plants, wooden materials. Weak Fire → red and orange, candles, warming aromatherapy. Weak Earth → yellow-brown tones, ceramics, earth-element crystals. Weak Metal → white and gold, metal jewelry. Weak Water → blue and black tones, crystal spheres, flowing jewelry.',
        },
        {
          heading: 'Vedic Nakshatra & Human Design',
          body: 'Your current Vedic planetary period (Dasha) influences recommendation emphasis. Current Mars Dasha? Red crystals and action-oriented items are highlighted. Human Design Generator types benefit from root-energy crystals (red tourmaline, garnet) to support sacral energy.',
        },
        {
          heading: 'AI Synthesis',
          body: 'The app doesn\'t use a fixed database — AI synthesizes your BaZi elements, sun sign, Vedic nakshatra, Human Design type, and more in real time, generating 7-8 personalized recommendations across crystals, jewelry, plants/aromatherapy, colored clothing, and symbols.',
        },
      ],
      howToRead: [
        {
          heading: 'Check the Fortune Boost Tag',
          body: 'Each item is tagged with the fortune dimension it primarily enhances (Career/Wealth/Love/Health/Luck). Focus first on the domain you most need to strengthen, and prioritize the corresponding items.',
        },
        {
          heading: 'How to Use Them',
          body: 'Crystals can be carried or placed in work and sleep spaces. Color items are best worn or used in your daily environment. Aromatherapy plants work well during morning routines or meditation. Lucky numbers can be set as passwords, reminders, or consciously used on important occasions.',
        },
        {
          heading: 'Where to Buy',
          body: 'Each item provides direct links to Pinterest (inspiration), Etsy (handmade quality), and Amazon (quick delivery). If a platform link is blocked, copy the search term and paste it directly into the platform\'s search bar.',
        },
      ],
      keyTerms: [
        { term: 'Element Supplementation', explanation: 'Recommending items matching weak Five Elements in your chart to restore energy balance.' },
        { term: 'Vibrational Frequency', explanation: 'Each color, material, and scent is believed to carry a specific energy frequency that resonates with the human energy field.' },
        { term: 'Root Energy', explanation: 'Sacral-chakra life force in Human Design; red crystals support its stable operation.' },
        { term: 'Nakshatra Alignment', explanation: 'Each of the 27 Vedic star mansions has corresponding ruling planets and associated items that influence recommendation direction.' },
      ],
    },
  },
}

export function getSystemContent(slug: string, lang: 'zh' | 'en'): SystemContent | null {
  return content[slug]?.[lang] ?? null
}

export function getAllSlugs(): string[] {
  return Object.keys(content)
}
