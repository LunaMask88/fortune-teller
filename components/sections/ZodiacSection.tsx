'use client'

import type { SunSign } from '@/types'
import { useLang } from '@/contexts/LangContext'
import { SIGN_WESTERN_ELEMENT, SIGN_RULER } from '@/lib/astrology'

interface Props {
  sunSign: SunSign
  chineseZodiac: string
  lifePathNumber: number
  numerologyDesc: string
  destinyNumber: number
  ziwei: { palaceName: string; mainStar: string; description: string }
}

const SIGN_EMOJI: Record<string, string> = {
  '白羊座': '♈', '金牛座': '♉', '双子座': '♊', '巨蟹座': '♋',
  '狮子座': '♌', '处女座': '♍', '天秤座': '♎', '天蝎座': '♏',
  '射手座': '♐', '摩羯座': '♑', '水瓶座': '♒', '双鱼座': '♓',
}
const ZODIAC_EMOJI: Record<string, string> = {
  '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰', '龙': '🐲', '蛇': '🐍',
  '马': '🐴', '羊': '🐑', '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷',
}

export default function ZodiacSection({ sunSign, chineseZodiac, lifePathNumber, numerologyDesc, destinyNumber, ziwei }: Props) {
  const { tr } = useLang()
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.sections.zodiac}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 西洋星座 */}
        <div className="mystic-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{SIGN_EMOJI[sunSign]}</span>
            <div>
              <div className="font-bold" style={{ color: 'var(--gold)' }}>{sunSign}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tr.ui.zodiac.western}</div>
            </div>
          </div>
          <div className="space-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <div>{tr.ui.zodiac.ruler}<span style={{ color: 'var(--purple-light)' }}>{SIGN_RULER[sunSign]}</span></div>
            <div>{tr.ui.zodiac.element}<span style={{ color: 'var(--gold)' }}>{SIGN_WESTERN_ELEMENT[sunSign]}</span></div>
          </div>
        </div>

        {/* 中国生肖 */}
        <div className="mystic-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{ZODIAC_EMOJI[chineseZodiac] ?? '🐾'}</span>
            <div>
              <div className="font-bold" style={{ color: 'var(--gold)' }}>{chineseZodiac}{tr.ui.zodiac.yearSuffix}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tr.ui.zodiac.chinese}</div>
            </div>
          </div>
        </div>

        {/* 数字命理 */}
        <div className="mystic-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ background: 'rgba(124,58,237,0.2)', border: '2px solid rgba(124,58,237,0.4)', color: 'var(--purple-light)' }}>
              {lifePathNumber}
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: 'var(--gold)' }}>{tr.ui.zodiac.lifePathNum}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tr.ui.zodiac.destinyNum}{destinyNumber}</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{numerologyDesc}</p>
        </div>

        {/* 紫微斗数 */}
        <div className="mystic-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🏛️</span>
            <div>
              <div className="font-bold" style={{ color: 'var(--gold)' }}>{ziwei.mainStar}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{tr.ui.zodiac.destinyPalace}{ziwei.palaceName}</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{ziwei.description}</p>
        </div>
      </div>
    </section>
  )
}
