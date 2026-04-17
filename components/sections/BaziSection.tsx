'use client'

import type { BaziResult } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { bazi: BaziResult }

const ELEMENT_COLOR: Record<string, string> = {
  木: '#22c55e', 火: '#ef4444', 土: '#f59e0b', 金: '#d4af37', 水: '#3b82f6',
}
const ELEMENT_EMOJI: Record<string, string> = {
  木: '🌿', 火: '🔥', 土: '🏔️', 金: '⚡', 水: '💧',
}

export default function BaziSection({ bazi }: Props) {
  const { tr } = useLang()
  const pillars = [
    { label: tr.ui.bazi.pillars[0].name, pillar: bazi.yearPillar, note: tr.ui.bazi.pillars[0].note },
    { label: tr.ui.bazi.pillars[1].name, pillar: bazi.monthPillar, note: tr.ui.bazi.pillars[1].note },
    { label: tr.ui.bazi.pillars[2].name, pillar: bazi.dayPillar, note: tr.ui.bazi.pillars[2].note },
    { label: tr.ui.bazi.pillars[3].name, pillar: bazi.hourPillar, note: tr.ui.bazi.pillars[3].note },
  ]

  const elements = Object.entries(bazi.elements) as [string, number][]
  const total = elements.reduce((s, [, v]) => s + v, 0) || 1

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.sections.bazi}</h2>

      {/* 四柱宫格 */}
      <div className="mystic-card p-4">
        <div className="grid grid-cols-4 gap-2">
          {pillars.map(({ label, pillar, note }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</span>
              <div
                className="w-full rounded-xl py-3 flex flex-col items-center gap-1"
                style={{
                  background: 'rgba(212,175,55,0.06)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  minHeight: 80,
                }}
              >
                {pillar ? (
                  <>
                    <span className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>{pillar.stem}</span>
                    <span className="text-xl" style={{ color: 'var(--purple-light)' }}>{pillar.branch}</span>
                  </>
                ) : (
                  <span className="text-xl" style={{ color: 'var(--text-muted)' }}>—</span>
                )}
              </div>
              <span className="text-xs mt-1 text-center leading-tight" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{note}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{tr.ui.bazi.zodiac}</span>
          <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>{bazi.chineseZodiac}</span>
        </div>
      </div>

      {/* 五行能量条 */}
      <div className="mystic-card p-4 space-y-3">
        <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{tr.ui.bazi.elements}</div>
        {elements.map(([elem, val]) => (
          <div key={elem} className="flex items-center gap-3">
            <span className="text-base w-6">{ELEMENT_EMOJI[elem]}</span>
            <span className="text-sm font-medium w-4" style={{ color: ELEMENT_COLOR[elem] }}>{elem}</span>
            <div className="flex-1 fortune-bar">
              <div
                className="fortune-bar-fill"
                style={{ width: `${(val / total) * 100}%`, background: ELEMENT_COLOR[elem] }}
              />
            </div>
            <span className="text-xs w-6 text-right" style={{ color: 'var(--text-muted)' }}>{val}</span>
            {bazi.weakElements.includes(elem as never) && (
              <span className="tag text-xs" style={{ background: 'rgba(201,123,132,0.1)', color: 'var(--rose)', border: '1px solid rgba(201,123,132,0.3)' }}>{tr.ui.bazi.weak}</span>
            )}
            {bazi.dominantElement === elem && (
              <span className="tag text-xs" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>{tr.ui.bazi.dominant}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
