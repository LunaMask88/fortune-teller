'use client'

import type { DrawnCard } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { cards: DrawnCard[] }

const POSITION_LABEL = { past: '过去', present: '现在', future: '未来' }
const POSITION_COLOR = {
  past:    { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.35)', text: 'var(--purple-light)' },
  present: { bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.35)', text: 'var(--gold)' },
  future:  { bg: 'rgba(201,123,132,0.12)', border: 'rgba(201,123,132,0.35)', text: 'var(--rose)' },
}

export default function TarotSection({ cards }: Props) {
  const { tr } = useLang()
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.sections.tarot}</h2>
      <div className="grid grid-cols-3 gap-3">
        {cards.map(drawn => {
          const colors = POSITION_COLOR[drawn.position]
          const isReversed = drawn.orientation === 'reversed'
          return (
            <div
              key={drawn.position}
              className="rounded-2xl p-4 flex flex-col items-center text-center"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
              {/* 位置标签 */}
              <span className="tag mb-3 text-xs" style={{ background: `${colors.border}30`, color: colors.text, border: `1px solid ${colors.border}` }}>
                {POSITION_LABEL[drawn.position]}
              </span>

              {/* 牌面 emoji */}
              <div
                className="text-4xl mb-2"
                style={{ transform: isReversed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
              >
                {drawn.card.emoji}
              </div>

              {/* 牌名 */}
              <div className="font-bold text-sm mb-1" style={{ color: colors.text }}>
                {drawn.card.nameCN}
              </div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                {drawn.card.name}
              </div>

              {/* 方位 */}
              <span className="text-xs px-2 py-0.5 rounded-full mb-2" style={{
                background: isReversed ? 'rgba(201,123,132,0.1)' : 'rgba(74,222,128,0.1)',
                color: isReversed ? 'var(--rose)' : '#4ade80',
              }}>
                {isReversed ? '逆位' : '正位'}
              </span>

              {/* 含义 */}
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {drawn.meaning}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
