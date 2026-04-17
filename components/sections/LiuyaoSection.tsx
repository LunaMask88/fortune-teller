'use client'

import type { LiuyaoResult } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { liuyao: LiuyaoResult; meihua: import('@/types').MeihuaResult }

function YaoLine({ yao, changing, index, changingLabel }: { yao: 0 | 1; changing: boolean; index: number; changingLabel: string }) {
  const isYang = yao === 1
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-4 text-right" style={{ color: 'var(--text-muted)' }}>{index}</span>
      <div className="flex items-center gap-1">
        {isYang ? (
          <div className="h-2 rounded-full" style={{ width: 80, background: changing ? 'var(--gold)' : 'var(--purple-light)' }} />
        ) : (
          <div className="flex gap-1">
            <div className="h-2 rounded-full" style={{ width: 36, background: changing ? 'var(--gold)' : 'var(--text-muted)' }} />
            <div className="w-2" />
            <div className="h-2 rounded-full" style={{ width: 36, background: changing ? 'var(--gold)' : 'var(--text-muted)' }} />
          </div>
        )}
      </div>
      {changing && <span className="text-xs" style={{ color: 'var(--gold)' }}>{changingLabel}</span>}
    </div>
  )
}

export default function LiuyaoSection({ liuyao, meihua }: Props) {
  const { tr } = useLang()
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>{tr.sections.liuyao}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 六爻卦象 */}
        <div className="mystic-card p-4">
          <div className="text-sm font-medium mb-3" style={{ color: 'var(--gold)' }}>{tr.ui.liuyao.title}</div>
          <div className="flex gap-6 items-end mb-4">
            {/* 本卦 */}
            <div className="flex-1">
              <div className="text-xs mb-2 text-center" style={{ color: 'var(--text-muted)' }}>{tr.ui.liuyao.benGua}</div>
              <div className="space-y-2 mb-2">
                {[...liuyao.lines].reverse().map((line, i) => (
                  <YaoLine key={i} yao={line.yao} changing={line.changing} index={6 - i} changingLabel={tr.ui.liuyao.changing} />
                ))}
              </div>
              <div className="text-center font-bold" style={{ color: 'var(--gold)' }}>{liuyao.benGua.name}{tr.ui.liuyao.guaSuffix}</div>
              <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>{liuyao.benGua.namePY}</div>
            </div>

            {/* 变卦（如果有） */}
            {liuyao.bianGua && (
              <>
                <div className="text-xl" style={{ color: 'var(--text-muted)' }}>→</div>
                <div className="flex-1">
                  <div className="text-xs mb-2 text-center" style={{ color: 'var(--text-muted)' }}>{tr.ui.liuyao.bianGua}</div>
                  <div className="space-y-2 mb-2">
                    {[...liuyao.lines].reverse().map((line, i) => {
                      const newYao = line.changing ? (line.yao === 1 ? 0 : 1) as 0 | 1 : line.yao
                      return <YaoLine key={i} yao={newYao} changing={false} index={6 - i} changingLabel={tr.ui.liuyao.changing} />
                    })}
                  </div>
                  <div className="text-center font-bold" style={{ color: 'var(--rose)' }}>{liuyao.bianGua.name}{tr.ui.liuyao.guaSuffix}</div>
                  <div className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>{liuyao.bianGua.namePY}</div>
                </div>
              </>
            )}
          </div>
          <p className="text-xs leading-relaxed p-2 rounded-lg" style={{ background: 'rgba(212,175,55,0.05)', color: 'var(--text-muted)' }}>
            {liuyao.interpretation}
          </p>
        </div>

        {/* 梅花易数 */}
        <div className="mystic-card p-4">
          <div className="text-sm font-medium mb-3" style={{ color: 'var(--gold)' }}>{tr.ui.liuyao.meihuaTitle}</div>

          <div className="flex items-center justify-center gap-4 mb-4">
            {/* 上卦 */}
            <div className="text-center">
              <div className="text-4xl mb-1">{meihua.upperGua.symbol}</div>
              <div className="font-bold text-sm" style={{ color: 'var(--gold)' }}>{meihua.upperGua.name}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{meihua.upperGua.attr}</div>
            </div>
            <div className="text-2xl" style={{ color: 'var(--text-muted)' }}>+</div>
            {/* 下卦 */}
            <div className="text-center">
              <div className="text-4xl mb-1">{meihua.lowerGua.symbol}</div>
              <div className="font-bold text-sm" style={{ color: 'var(--purple-light)' }}>{meihua.lowerGua.name}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{meihua.lowerGua.attr}</div>
            </div>
          </div>

          <div className="text-center mb-3">
            <span className="font-bold" style={{ color: 'var(--gold)' }}>{meihua.hexagramName}{tr.ui.liuyao.guaSuffix}</span>
            <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>{tr.ui.liuyao.changingLine(meihua.changingYao)}</span>
          </div>

          {/* 体用关系 */}
          <div className="flex gap-2 justify-center mb-3">
            <span className="tag text-xs" style={{ background: 'rgba(124,58,237,0.15)', color: 'var(--purple-light)', border: '1px solid rgba(124,58,237,0.3)' }}>
              {tr.ui.liuyao.tiGua}{meihua.tiGua.name}（{meihua.tiGua.element}）
            </span>
            <span className="tag text-xs" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
              {tr.ui.liuyao.yongGua}{meihua.yongGua.name}（{meihua.yongGua.element}）
            </span>
          </div>

          <p className="text-xs leading-relaxed p-2 rounded-lg" style={{ background: 'rgba(212,175,55,0.05)', color: 'var(--text-muted)' }}>
            {meihua.summary}
          </p>
        </div>
      </div>
    </section>
  )
}
