'use client'

import type { VedicResult } from '@/types'
import { useLang } from '@/contexts/LangContext'

interface Props { vedic: VedicResult; sunSign: string }

export default function VedicSection({ vedic, sunSign }: Props) {
  const { tr } = useLang()
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold" style={{ color: 'var(--gold)' }}>
        {tr.sections.vedic}
        <span className="text-xs font-normal ml-2" style={{ color: 'var(--text-muted)' }}>
          {tr.ui.vedic.subtitle}
        </span>
      </h2>

      {/* 西洋 vs 吠陀 对比 */}
      <div className="gold-card p-3 flex items-center gap-3">
        <span className="text-lg">⚠️</span>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {tr.ui.vedic.intro(sunSign)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 月亮星座 + 星宿 */}
        <div className="mystic-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌙</span>
            <div>
              <div className="font-bold" style={{ color: 'var(--gold)' }}>
                {tr.ui.vedic.moonSign}{vedic.moonRashi.nameCN}
                {vedic.moonDegree && <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{vedic.moonDegree}</span>}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {vedic.moonRashi.name}{tr.ui.vedic.ruler}{vedic.moonRashi.ruler}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="tag text-xs" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
              {vedic.moonRashi.element}{tr.ui.vedic.elementSuffix}
            </span>
            <span className="tag text-xs" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--purple-light)', border: '1px solid rgba(124,58,237,0.3)' }}>
              {vedic.moonRashi.quality}{tr.ui.vedic.qualitySuffix}
            </span>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
            <div className="font-medium text-sm mb-1" style={{ color: 'var(--gold)' }}>
              {tr.ui.vedic.nakshatra}{vedic.nakshatra.nameCN}
            </div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              {vedic.nakshatra.name}{tr.ui.vedic.ruler}{vedic.nakshatra.ruler}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {tr.ui.vedic.deity}{vedic.nakshatra.deity}
            </div>
            <div className="mt-1">
              <span className="tag text-xs" style={{ background: 'rgba(201,123,132,0.1)', color: 'var(--rose)', border: '1px solid rgba(201,123,132,0.25)' }}>
                ✦ {vedic.nakshatra.quality}
              </span>
            </div>
          </div>
        </div>

        {/* 大运 + Rahu/Ketu */}
        <div className="mystic-card p-4 space-y-3">
          <div>
            <div className="font-medium text-sm mb-2" style={{ color: 'var(--gold)' }}>
              {tr.ui.vedic.dashaTitle}
            </div>
            <div className="gold-card p-3">
              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                {vedic.currentDasha.nameCN}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {vedic.currentDasha.planet}{tr.ui.vedic.dashaYears(vedic.currentDasha.years)}
              </div>
            </div>
          </div>

          <div>
            <div className="font-medium text-sm mb-2" style={{ color: 'var(--gold)' }}>
              {tr.ui.vedic.karmaTitle}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="tag text-xs" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
                  {tr.ui.vedic.rahu}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{vedic.rahuSign}{tr.ui.vedic.rahuDesc}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="tag text-xs" style={{ background: 'rgba(201,123,132,0.1)', color: 'var(--rose)', border: '1px solid rgba(201,123,132,0.3)' }}>
                  {tr.ui.vedic.ketu}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{vedic.ketuSign}{tr.ui.vedic.ketuDesc}</span>
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
            {vedic.summary}
          </p>
        </div>
      </div>
    </section>
  )
}
