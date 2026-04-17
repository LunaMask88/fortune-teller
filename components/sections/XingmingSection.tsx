'use client'

import type { XingmingResult, GridRating } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { xingming: XingmingResult }

const JI_COLOR: Record<GridRating['ji'], { bg: string; text: string; border: string }> = {
  '大吉': { bg: 'rgba(212,175,55,0.15)', text: 'var(--gold)', border: 'rgba(212,175,55,0.4)' },
  '吉':   { bg: 'rgba(74,222,128,0.1)',  text: '#4ade80',     border: 'rgba(74,222,128,0.3)' },
  '平':   { bg: 'rgba(156,163,175,0.1)', text: '#9ca3af',     border: 'rgba(156,163,175,0.3)' },
  '凶':   { bg: 'rgba(251,146,60,0.1)',  text: '#fb923c',     border: 'rgba(251,146,60,0.3)' },
  '大凶': { bg: 'rgba(248,113,113,0.1)', text: '#f87171',     border: 'rgba(248,113,113,0.3)' },
}

const GRID_KEYS = ['tianGe', 'renGe', 'diGe', 'zongGe', 'waiGe'] as const

export default function XingmingSection({ xingming }: Props) {
  const { tr } = useLang()
  const GRIDS = GRID_KEYS.map((key, i) => ({
    key,
    label: tr.ui.xingming.grids[i].name,
    note: tr.ui.xingming.grids[i].note,
  }))
  if (xingming.strokes.length < 2) return null

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>
        {tr.sections.xingming}
      </h2>

      {/* 笔画展示 */}
      <div className="mystic-card p-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          {Array.from(xingming.name).map((char, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--gold)' }}>{char}</div>
              <div className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--text-muted)' }}>
                {xingming.strokes[i]}{tr.ui.xingming.strokeSuffix}
              </div>
            </div>
          ))}
        </div>

        {/* 三才 */}
        <div className="text-center mb-4">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{tr.ui.xingming.sancai}</span>
          <span className="text-sm font-bold ml-1" style={{ color: 'var(--purple-light)' }}>{xingming.sancai}</span>
        </div>

        {/* 五格 */}
        <div className="grid grid-cols-5 gap-2">
          {GRIDS.map(({ key, label, note }) => {
            const num = xingming[key]
            const rating = xingming.ratings[key]
            const colors = JI_COLOR[rating.ji]
            return (
              <div
                key={key}
                className="rounded-xl p-2 text-center"
                style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
              >
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
                <div className="text-xl font-bold mb-1" style={{ color: colors.text }}>{num}</div>
                <div className="text-xs font-medium mb-1" style={{ color: colors.text }}>{rating.ji}</div>
                <div className="text-xs leading-tight" style={{ color: 'var(--text-muted)', fontSize: 10 }}>{note}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 人格详解（最重要的格） */}
      <div className="gold-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-sm" style={{ color: 'var(--gold)' }}>{tr.ui.xingming.rengeDetail}</span>
          <span className="tag text-xs" style={{
            background: JI_COLOR[xingming.ratings.renGe.ji].bg,
            color: JI_COLOR[xingming.ratings.renGe.ji].text,
            border: `1px solid ${JI_COLOR[xingming.ratings.renGe.ji].border}`,
          }}>{xingming.ratings.renGe.ji}</span>
        </div>
        <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>
          {xingming.ratings.renGe.desc}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {xingming.summary}
        </p>
      </div>
    </section>
  )
}
