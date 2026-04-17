'use client'

import type { HumanDesignResult } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { hd: HumanDesignResult }

const TYPE_COLOR: Record<string, string> = {
  'Manifestor': '#f97316',
  'Generator': '#22c55e',
  'Manifesting Generator': '#84cc16',
  'Projector': '#a78bfa',
  'Reflector': '#38bdf8',
}

const CENTER_EMOJI: Record<string, string> = {
  '头脑': '🧠', '思维': '💭', '喉咙': '🗣️', '意志': '💪',
  '自我': '❤️', '骶骨': '⚡', '情绪': '🌊', '直觉': '🌙', '根部': '🌱',
}

export default function HumanDesignSection({ hd }: Props) {
  const { tr } = useLang()
  const typeColor = TYPE_COLOR[hd.type] ?? '#d4af37'
  const centers = Object.entries(hd.centers)

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>
        {tr.sections.humanDesign}
        <span className="text-xs font-normal ml-2" style={{ color: 'var(--text-muted)' }}>
          {tr.ui.hd.subtitle}
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 类型卡片 */}
        <div className="mystic-card p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: `${typeColor}15`, border: `2px solid ${typeColor}40` }}>
              {hd.type === 'Manifestor' ? '⚡' :
               hd.type === 'Generator' ? '🔋' :
               hd.type === 'Manifesting Generator' ? '🚀' :
               hd.type === 'Projector' ? '🔭' : '🪞'}
            </div>
            <div>
              <div className="font-bold text-lg" style={{ color: typeColor }}>{hd.typeCN}</div>
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{hd.type} · {tr.ui.hd.population}{hd.percent}</div>
              <span className="tag text-xs" style={{ background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}30` }}>
                {tr.ui.hd.aura}{hd.aura}
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed mt-3 mb-3" style={{ color: 'var(--text-muted)' }}>
            {hd.typeDesc}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium w-14 flex-shrink-0" style={{ color: 'var(--gold)' }}>{tr.ui.hd.strategy}</span>
              <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{hd.strategy}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium w-14 flex-shrink-0" style={{ color: 'var(--gold)' }}>{tr.ui.hd.notSelf}</span>
              <span className="text-xs" style={{ color: 'var(--rose)' }}>{hd.notSelf}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium w-14 flex-shrink-0" style={{ color: 'var(--gold)' }}>{tr.ui.hd.authority}</span>
              <span className="text-xs" style={{ color: 'var(--purple-light)' }}>{hd.authority}</span>
            </div>
          </div>
        </div>

        {/* 角色 + 能量中心 */}
        <div className="mystic-card p-5 space-y-4">
          {/* Profile */}
          <div>
            <div className="text-sm font-medium mb-1" style={{ color: 'var(--gold)' }}>{tr.ui.hd.profile}</div>
            <div className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>{hd.profile}</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{hd.profileDesc}</p>
          </div>

          {/* 能量中心 */}
          <div>
            <div className="text-sm font-medium mb-2" style={{ color: 'var(--gold)' }}>
              {tr.ui.hd.centers}
              <span className="text-xs font-normal ml-2" style={{ color: 'var(--text-muted)' }}>
                {hd.definedCenters}{tr.ui.hd.definedSuffix}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {centers.map(([center, defined]) => (
                <div
                  key={center}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                  style={{
                    background: defined ? `${typeColor}12` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${defined ? `${typeColor}30` : 'rgba(255,255,255,0.08)'}`,
                    color: defined ? typeColor : 'var(--text-muted)',
                  }}
                >
                  <span>{CENTER_EMOJI[center]}</span>
                  <span>{center}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
