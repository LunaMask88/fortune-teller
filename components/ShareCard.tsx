import type { FullReading } from '@/types'

interface Props {
  reading: FullReading
  lang: 'zh' | 'en'
  periodLabel: string
}

const CAT_COLORS: Record<string, string> = {
  career: '#d4af37', wealth: '#22c55e', love: '#f43f5e',
  health: '#3b82f6', luck: '#a78bfa',
}

const CAT_LABELS_ZH: Record<string, string> = {
  career: '事业', wealth: '财运', love: '感情', health: '健康', luck: '整体',
}
const CAT_LABELS_EN: Record<string, string> = {
  career: 'Career', wealth: 'Wealth', love: 'Love', health: 'Health', luck: 'Luck',
}

/** 分享图卡片 — 纯 inline 样式，供 html2canvas 渲染 */
export default function ShareCard({ reading, lang, periodLabel }: Props) {
  const { input, fortune } = reading
  const isZH = lang === 'zh'
  const cats = Object.entries(fortune.categories) as [string, { score: number; label: string }][]

  return (
    <div style={{
      width: 375, padding: '28px 24px 24px',
      background: 'linear-gradient(160deg, #0d0b1e 0%, #1a1040 40%, #0d0b1e 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#fff',
      borderRadius: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景光晕 */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 180, height: 180,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -40, left: -40, width: 140, height: 140,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* 顶部：logo + 标题 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>
            MysticOracle
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#d4af37' }}>
            {isZH ? `${input.name} 的${periodLabel}命理` : `${input.name}'s ${periodLabel} Reading`}
          </div>
        </div>
        <div style={{ fontSize: 36 }}>🔮</div>
      </div>

      {/* 总分 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        background: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.25)',
        borderRadius: 14, padding: '14px 18px', marginBottom: 18,
      }}>
        <div style={{ textAlign: 'center', minWidth: 60 }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: '#d4af37', lineHeight: 1 }}>
            {fortune.overallScore}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
            {isZH ? '综合评分' : 'Overall'}
          </div>
        </div>
        <div style={{ flex: 1, fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
          {fortune.summary[0]?.body?.slice(0, 60)}…
        </div>
      </div>

      {/* 五维进度条 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {cats.map(([key, cat]) => {
          const color = CAT_COLORS[key] ?? '#a78bfa'
          const label = isZH ? (CAT_LABELS_ZH[key] ?? cat.label) : (CAT_LABELS_EN[key] ?? cat.label)
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, fontSize: 11, color: 'rgba(255,255,255,0.5)', textAlign: 'right', flexShrink: 0 }}>
                {label}
              </div>
              <div style={{
                flex: 1, height: 6, borderRadius: 3,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${cat.score}%`, height: '100%', borderRadius: 3,
                  background: `linear-gradient(90deg, ${color}99, ${color})`,
                }} />
              </div>
              <div style={{ width: 24, fontSize: 11, color, fontWeight: 600, textAlign: 'right', flexShrink: 0 }}>
                {cat.score}
              </div>
            </div>
          )
        })}
      </div>

      {/* 前3个幸运物 */}
      {fortune.luckyItems.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {fortune.luckyItems.slice(0, 3).map((item, i) => (
            <span key={i} style={{
              padding: '3px 8px', borderRadius: 20, fontSize: 11,
              background: 'rgba(167,139,250,0.15)',
              border: '1px solid rgba(167,139,250,0.3)',
              color: '#c4b5fd',
            }}>
              {isZH ? item.name : (item.nameEN ?? item.name)}
            </span>
          ))}
        </div>
      )}

      {/* 底部水印 */}
      <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
        mysticoracle · {isZH ? '命理仅供参考' : 'For reference only'}
      </div>
    </div>
  )
}
