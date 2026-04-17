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
          印度恒星黄道体系，与西洋星座相差约23°
        </span>
      </h2>

      {/* 西洋 vs 吠陀 对比 */}
      <div className="gold-card p-3 flex items-center gap-3">
        <span className="text-lg">⚠️</span>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          你的西洋太阳星座是 <span style={{ color: 'var(--gold)' }}>{sunSign}</span>，
          但吠陀占星重视<span style={{ color: 'var(--purple-light)' }}>月亮宫位（Rashi）</span>，
          且使用恒星黄道，结果通常相差一个星座。两套体系都有其传承，各有侧重。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 月亮星座 + 星宿 */}
        <div className="mystic-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌙</span>
            <div>
              <div className="font-bold" style={{ color: 'var(--gold)' }}>
                月亮宫位：{vedic.moonRashi.nameCN}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {vedic.moonRashi.name} · 守护星 {vedic.moonRashi.ruler}
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="tag text-xs" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
              {vedic.moonRashi.element} 属性
            </span>
            <span className="tag text-xs" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--purple-light)', border: '1px solid rgba(124,58,237,0.3)' }}>
              {vedic.moonRashi.quality} 宫位
            </span>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
            <div className="font-medium text-sm mb-1" style={{ color: 'var(--gold)' }}>
              星宿（Nakshatra）：{vedic.nakshatra.nameCN}
            </div>
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              {vedic.nakshatra.name} · 守护星 {vedic.nakshatra.ruler}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              主神：{vedic.nakshatra.deity}
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
              当前大运（Dasha）
            </div>
            <div className="gold-card p-3">
              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                {vedic.currentDasha.nameCN}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {vedic.currentDasha.planet} · 此大运持续 {vedic.currentDasha.years} 年
              </div>
            </div>
          </div>

          <div>
            <div className="font-medium text-sm mb-2" style={{ color: 'var(--gold)' }}>
              业力轴（Rahu-Ketu）
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="tag text-xs" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px solid rgba(212,175,55,0.3)' }}>
                  Rahu 北交 ↗
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{vedic.rahuSign}（今生渴望）</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="tag text-xs" style={{ background: 'rgba(201,123,132,0.1)', color: 'var(--rose)', border: '1px solid rgba(201,123,132,0.3)' }}>
                  Ketu 南交 ↙
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{vedic.ketuSign}（前世遗留）</span>
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
