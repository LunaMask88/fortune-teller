'use client'

import type { RuneResult } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { runes: RuneResult }

const POSITION_COLOR = [
  { bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.35)', text: 'var(--purple-light)' },
  { bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.35)', text: 'var(--gold)' },
  { bg: 'rgba(201,123,132,0.12)', border: 'rgba(201,123,132,0.35)', text: 'var(--rose)' },
]

export default function RunesSection({ runes }: Props) {
  const { tr } = useLang()
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.sections.runes}</h2>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {tr.ui.runes.subtitle}
      </p>

      <div className="grid grid-cols-3 gap-3">
        {runes.draws.map((draw, i) => {
          const colors = POSITION_COLOR[i % 3]
          return (
            <div
              key={i}
              className="rounded-2xl p-4 flex flex-col items-center text-center"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
              {/* 位置 */}
              <span className="tag mb-3 text-xs" style={{ background: `${colors.border}30`, color: colors.text, border: `1px solid ${colors.border}` }}>
                {draw.position}
              </span>

              {/* 符文大字 */}
              <div
                className="text-5xl font-bold mb-2"
                style={{
                  color: colors.text,
                  transform: draw.reversed ? 'rotate(180deg)' : 'none',
                  fontFamily: 'serif',
                  textShadow: `0 0 20px ${colors.text}60`,
                }}
              >
                {draw.rune.symbol}
              </div>

              {/* 名称 */}
              <div className="font-bold text-sm mb-1" style={{ color: colors.text }}>{draw.rune.nameCN}</div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{draw.rune.name}</div>

              {/* 正逆位 */}
              <span className="text-xs px-2 py-0.5 rounded-full mb-2" style={{
                background: draw.reversed ? 'rgba(201,123,132,0.1)' : 'rgba(74,222,128,0.1)',
                color: draw.reversed ? 'var(--rose)' : '#4ade80',
              }}>
                {draw.reversed ? tr.ui.reversed : tr.ui.upright}
              </span>

              {/* 含义 */}
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {draw.meaning}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
