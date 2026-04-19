'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { FullReading } from '@/types'
import { useLang } from '@/contexts/LangContext'
import OverallSection from './sections/OverallSection'
import BaziSection from './sections/BaziSection'
import ZodiacSection from './sections/ZodiacSection'
import TarotSection from './sections/TarotSection'
import LiuyaoSection from './sections/LiuyaoSection'
import RunesSection from './sections/RunesSection'
import HumanDesignSection from './sections/HumanDesignSection'
import VedicSection from './sections/VedicSection'
import XingmingSection from './sections/XingmingSection'
import LuckyItemsSection from './LuckyItemsSection'
import ShareCard from './ShareCard'
import { saveLastReading, loadProfile } from '@/lib/user-profile'

type TabId = 'overview' | 'eastern' | 'western' | 'lucky'

export default function FortuneResult() {
  const router = useRouter()
  const { tr, lang } = useLang()
  const [reading, setReading] = useState<FullReading | null>(null)
  const [userCountry, setUserCountry] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [exporting, setExporting] = useState(false)
  const [exportingHtml, setExportingHtml] = useState(false)
  const [hideName, setHideName] = useState(false)
  const [hideBirth, setHideBirth] = useState(false)
  const [shareToast, setShareToast] = useState('')
  const [sharingImg, setSharingImg] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'overview', label: tr.result.tabs.overview.label, icon: tr.result.tabs.overview.icon },
    { id: 'eastern',  label: tr.result.tabs.eastern.label,  icon: tr.result.tabs.eastern.icon },
    { id: 'western',  label: tr.result.tabs.western.label,  icon: tr.result.tabs.western.icon },
    { id: 'lucky',    label: tr.result.tabs.lucky.label,    icon: tr.result.tabs.lucky.icon },
  ]

  useEffect(() => {
    const raw = sessionStorage.getItem('fortune_reading')
    if (!raw) { router.replace('/reading'); return }
    try {
      const parsed = JSON.parse(raw)
      // 兼容旧格式：summary 曾是字符串
      if (typeof parsed.fortune?.summary === 'string') {
        parsed.fortune.summary = [{ title: '综合解读', body: parsed.fortune.summary }]
      }
      setReading(parsed)
      saveLastReading(parsed)
      const profile = loadProfile()
      if (profile?.country && profile.country !== 'undisclosed') setUserCountry(profile.country)
    } catch { router.replace('/reading') }
  }, [router])

  async function handleExport() {
    if (!exportRef.current || !reading) return
    setExporting(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])
      const el = exportRef.current
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: '#060412',
        useCORS: true,
        logging: false,
        windowWidth: 780,
      })
      const imgData = canvas.toDataURL('image/jpeg', 0.92)
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const ratio = pageW / canvas.width
      const totalH = canvas.height * ratio
      let y = 0
      while (y < totalH) {
        if (y > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, -y, pageW, totalH)
        y += pageH
      }
      const date = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')
      pdf.save(`${reading.input.name}_命理报告_${date}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  async function buildReportHTML(displayName: string): Promise<{ html: string; filename: string }> {
    if (!exportRef.current || !reading) throw new Error('not ready')
    const { input } = reading
    const date = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN').replace(/\//g, '-')
    const title = lang === 'en' ? `${displayName}'s Destiny Report` : `${displayName} 命理报告`
    const filename = `${displayName}_${lang === 'en' ? 'destiny_report' : '命理报告'}_${date}.html`

    // 生成二维码 data URL
    const { toDataURL } = await import('qrcode')
    const siteUrl = 'https://fortune-teller-ten-theta.vercel.app'
    const qrDataUrl = await toDataURL(siteUrl, { width: 100, margin: 1, color: { dark: '#d4af37', light: '#060412' } })

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg-deep:#060412;--bg-card:#0f0a1e;--bg-card2:#150e28;--gold:#d4af37;--gold-light:#f0d060;--rose:#c97b84;--purple:#7c3aed;--purple-light:#a78bfa;--text-primary:#f0e8ff;--text-muted:#9080b0;--border:rgba(212,175,55,0.2)}
body{background:var(--bg-deep);color:var(--text-primary);font-family:'PingFang SC','Microsoft YaHei',sans-serif;padding:32px 20px;line-height:1.6}
.mystic-card{background:linear-gradient(135deg,var(--bg-card) 0%,var(--bg-card2) 100%);border:1px solid var(--border);border-radius:16px;position:relative;overflow:hidden}
.mystic-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(212,175,55,0.03) 0%,transparent 60%);pointer-events:none}
.gold-card{background:linear-gradient(135deg,rgba(212,175,55,0.05) 0%,rgba(124,58,237,0.05) 100%);border:1px solid rgba(212,175,55,0.3);border-radius:12px}
.text-gold-gradient{background:linear-gradient(135deg,var(--gold) 0%,var(--gold-light) 50%,var(--rose) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.score-ring{filter:drop-shadow(0 0 8px rgba(212,175,55,0.4))}.fortune-bar{height:6px;border-radius:3px;background:rgba(255,255,255,0.08);overflow:hidden}.fortune-bar-fill{height:100%;border-radius:3px}
.tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:100px;font-size:.75rem;font-weight:500}
.space-y-4>*+*{margin-top:1rem}.space-y-3>*+*{margin-top:.75rem}.space-y-2>*+*{margin-top:.5rem}.space-y-8>*+*{margin-top:2rem}
.flex{display:flex}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.flex-col{flex-direction:column}
.gap-2{gap:.5rem}.gap-3{gap:.75rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.flex-1{flex:1}.flex-shrink-0{flex-shrink:0}.flex-wrap{flex-wrap:wrap}
.grid{display:grid}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}@media(min-width:768px){.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
.p-4{padding:1rem}.p-6{padding:1.5rem}.p-8{padding:2rem}.px-4{padding-left:1rem;padding-right:1rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.pb-4{padding-bottom:1rem}
.mb-1{margin-bottom:.25rem}.mb-2{margin-bottom:.5rem}.mb-3{margin-bottom:.75rem}.mb-4{margin-bottom:1rem}
.text-xs{font-size:.75rem}.text-sm{font-size:.875rem}.text-lg{font-size:1.125rem}.text-3xl{font-size:1.875rem}
.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}
.leading-relaxed{line-height:1.625}.text-center{text-align:center}.text-right{text-align:right}
.w-16{width:4rem}.w-8{width:2rem}.w-full{width:100%}.relative{position:relative}.absolute{position:absolute}.inset-0{inset:0}
.overflow-hidden{overflow:hidden}.whitespace-pre-wrap{white-space:pre-wrap}
</style>
</head>
<body>
<div style="max-width:760px;margin:0 auto">
${exportRef.current.innerHTML}
<div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(212,175,55,0.2);display:flex;align-items:center;gap:20px">
  <img src="${qrDataUrl}" alt="QR" style="width:80px;height:80px;border-radius:8px" />
  <div>
    <div style="font-size:13px;color:#d4af37;font-weight:600;margin-bottom:4px">🔮 MysticOracle</div>
    <div style="font-size:12px;color:#9080b0">${lang === 'en' ? 'Scan to get your own reading' : '扫码获取你的专属命理解读'}</div>
    <div style="font-size:11px;color:#6060a0;margin-top:2px">${siteUrl}</div>
  </div>
</div>
</div>
</body>
</html>`

    return { html, filename }
  }

  async function handleExportHTML() {
    if (!exportRef.current || !reading) return
    setExportingHtml(true)
    try {
      const displayName = hideName ? (lang === 'en' ? 'Anonymous' : '某命主') : reading.input.name
      const { html, filename } = await buildReportHTML(displayName)

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = filename; a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportingHtml(false)
    }
  }

  async function handleShare() {
    if (!shareCardRef.current || !reading) return
    setSharingImg(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2, useCORS: true, backgroundColor: null,
        logging: false,
      })
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const displayName = hideName ? (lang === 'en' ? 'Anonymous' : '某命主') : reading.input.name
        const filename = `mystic-${displayName}-${Date.now()}.png`
        const file = new File([blob], filename, { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: lang === 'en' ? 'My Destiny Reading' : '我的命理解读' })
        } else {
          // 降级：下载 PNG
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url; a.download = filename; a.click()
          URL.revokeObjectURL(url)
          setShareToast(lang === 'en' ? '✓ Image saved' : '✓ 图片已保存')
          setTimeout(() => setShareToast(''), 2500)
        }
      }, 'image/png')
    } finally {
      setSharingImg(false)
    }
  }

  async function handleShareOld() {
    if (!exportRef.current || !reading) return
    const displayName = hideName ? (lang === 'en' ? 'Anonymous' : '某命主') : reading.input.name
    const title = lang === 'en' ? `${displayName}'s Destiny Report` : `${displayName} 命理报告`
    const { html, filename } = await buildReportHTML(displayName)
    const file = new File([html], filename, { type: 'text/html' })

    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title })
      } else if (navigator.share) {
        await navigator.share({ title, text: lang === 'en'
          ? `Check out this destiny reading from MysticOracle!`
          : `来自 MysticOracle 的命理解读报告` })
      } else {
        // 降级：下载文件
        const url = URL.createObjectURL(file)
        const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
        URL.revokeObjectURL(url)
        setShareToast(lang === 'en' ? 'Report downloaded!' : '报告已下载')
        setTimeout(() => setShareToast(''), 2500)
      }
    } catch {
      // 用户取消，不处理
    }
  }

  if (!reading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">🔮</div>
          <p style={{ color: 'var(--text-muted)' }}>{tr.result.loading}</p>
        </div>
      </div>
    )
  }

  const { bazi, sunSign, numerology, ziwei, tarotCards, liuyao, meihua, runes, humanDesign, vedic, xingming, fortune, input } = reading
  const periodLabel = tr.result.periodLabels[input.period]
  const displayName = hideName ? (lang === 'en' ? 'Anonymous' : '某命主') : input.name
  const displayBirth = hideBirth
    ? (lang === 'en' ? '????-??-??' : '****年**月**日')
    : (lang === 'en'
        ? `${input.birthYear}/${input.birthMonth}/${input.birthDay}${input.birthHour !== null ? ` ${input.birthHour}:00` : ''}`
        : `${input.birthYear}年${input.birthMonth}月${input.birthDay}日${input.birthHour !== null ? ` ${input.birthHour}时` : ''}`)

  function PrivacyChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
      <button onClick={onClick} className="text-xs px-2 py-0.5 rounded-full transition-all" style={{
        background: active ? 'rgba(201,123,132,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? 'rgba(201,123,132,0.4)' : 'rgba(255,255,255,0.12)'}`,
        color: active ? 'var(--rose)' : 'var(--text-muted)',
      }}>
        {active ? '🙈' : '👁'} {label}
      </button>
    )
  }

  return (
    <div className="min-h-screen relative z-10 pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* 头部 */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🔮</div>
          <h1 className="text-2xl font-bold mb-1">
            <span className="text-gold-gradient">{displayName}</span>
            <span className="text-lg font-normal ml-2" style={{ color: 'var(--text-muted)' }}>{tr.result.subtitleSuffix(periodLabel)}</span>
          </h1>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            {displayBirth} · {input.gender === 'female' ? (lang === 'en' ? 'Female' : '女') : (lang === 'en' ? 'Male' : '男')} · {tr.result.info12}
          </p>
          {/* 隐私开关 */}
          <div className="flex gap-2 justify-center">
            <PrivacyChip active={hideName}  onClick={() => setHideName(v => !v)}  label={lang === 'en' ? 'Hide name'       : '隐藏姓名'} />
            <PrivacyChip active={hideBirth} onClick={() => setHideBirth(v => !v)} label={lang === 'en' ? 'Hide birth info'  : '隐藏生辰'} />
          </div>
        </div>

        {/* 标签导航 */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? 'rgba(212,175,55,0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
                border: activeTab === tab.id ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              <OverallSection fortune={fortune} />
              <XingmingSection xingming={xingming} />
            </>
          )}

          {activeTab === 'eastern' && (
            <>
              <BaziSection bazi={bazi} />
              <ZodiacSection
                sunSign={sunSign}
                chineseZodiac={bazi.chineseZodiac}
                lifePathNumber={numerology.lifePathNumber}
                destinyNumber={numerology.destinyNumber}
                numerologyDesc={numerology.description}
                ziwei={ziwei}
              />
              <LiuyaoSection liuyao={liuyao} meihua={meihua} />
            </>
          )}

          {activeTab === 'western' && (
            <>
              <VedicSection vedic={vedic} sunSign={sunSign} />
              <TarotSection cards={tarotCards} />
              <RunesSection runes={runes} />
              <HumanDesignSection hd={humanDesign} />
            </>
          )}

          {activeTab === 'lucky' && (
            <LuckyItemsSection items={fortune.luckyItems} country={userCountry} />
          )}
        </div>

        {/* 操作按钮 */}
        {shareToast && (
          <div className="mt-6 py-2 text-center text-sm rounded-xl" style={{ background: 'rgba(124,58,237,0.12)', color: 'var(--purple-light)', border: '1px solid rgba(124,58,237,0.25)' }}>
            {shareToast}
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: exporting ? 'rgba(212,175,55,0.05)' : 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.35)',
              color: exporting ? 'var(--text-muted)' : 'var(--gold)',
              cursor: exporting ? 'not-allowed' : 'pointer',
            }}
          >
            {exporting ? tr.result.exporting : tr.result.exportPdf}
          </button>
          <button
            onClick={handleExportHTML}
            disabled={exportingHtml}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: exportingHtml ? 'rgba(124,58,237,0.05)' : 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.35)',
              color: exportingHtml ? 'var(--text-muted)' : 'var(--purple-light)',
              cursor: exportingHtml ? 'not-allowed' : 'pointer',
            }}
          >
            {exportingHtml ? tr.result.exporting : (lang === 'en' ? '🌐 HTML' : '🌐 导出')}
          </button>
          <button
            onClick={handleShare}
            disabled={sharingImg}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: sharingImg ? 'rgba(201,123,132,0.05)' : 'rgba(201,123,132,0.12)',
              border: '1px solid rgba(201,123,132,0.35)',
              color: sharingImg ? 'var(--text-muted)' : 'var(--rose)',
              cursor: sharingImg ? 'not-allowed' : 'pointer',
            }}
          >
            {sharingImg
              ? (lang === 'en' ? '⟳ Generating…' : '⟳ 生成中…')
              : (lang === 'en' ? '🖼 Share Image' : '🖼 分享图片')}
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/reading')}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold)' }}
          >
            {tr.result.reread}
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}
          >
            {tr.result.backHome}
          </button>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          {tr.result.disclaimer} {new Date(fortune.generatedAt).toLocaleString('zh-CN')}
        </p>
      </div>

      {/* ── 隐藏的完整报告渲染层（供 PDF 导出使用）────────────────── */}
      <div
        ref={exportRef}
        aria-hidden
        style={{
          position: 'absolute',
          left: -9999,
          top: 0,
          width: 760,
          background: '#060412',
          padding: '32px 28px',
          fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif",
          color: '#f0e8ff',
        }}
      >
        {/* 报告头部 */}
        <div style={{ textAlign: 'center', marginBottom: 28, borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#d4af37', marginBottom: 6 }}>
            {tr.result.pdfTitle(input.name)}
          </div>
          <div style={{ fontSize: 13, color: '#9080b0' }}>
            {tr.result.pdfMeta(input.birthYear, input.birthMonth, input.birthDay, input.birthHour, input.gender, periodLabel)}
          </div>
          <div style={{ fontSize: 12, color: '#9080b0', marginTop: 4 }}>
            {tr.result.pdfGeneratedAt} {new Date(fortune.generatedAt).toLocaleString(lang === 'en' ? 'en-US' : 'zh-CN')}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <OverallSection fortune={fortune} />
          <XingmingSection xingming={xingming} />
          <BaziSection bazi={bazi} />
          <ZodiacSection
            sunSign={sunSign}
            chineseZodiac={bazi.chineseZodiac}
            lifePathNumber={numerology.lifePathNumber}
            destinyNumber={numerology.destinyNumber}
            numerologyDesc={numerology.description}
            ziwei={ziwei}
          />
          <LiuyaoSection liuyao={liuyao} meihua={meihua} />
          <VedicSection vedic={vedic} sunSign={sunSign} />
          <TarotSection cards={tarotCards} />
          <RunesSection runes={runes} />
          <HumanDesignSection hd={humanDesign} />

          {/* 幸运物件纯文字版（避免重复触发图片 API） */}
          {fortune.luckyItems?.length > 0 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: '#d4af37', margin: 0 }}>{tr.lucky.title}</h2>
              {fortune.luckyItems.map((item, i) => (
                <div key={i} style={{ padding: '12px 16px', borderRadius: 12, background: 'rgba(15,10,30,0.9)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                    {item.nameEN && <span style={{ fontSize: 12, color: '#9080b0' }}>{item.nameEN}</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#9080b0', margin: 0, lineHeight: 1.6 }}>{item.reason}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* 隐藏的分享图卡片（供 html2canvas 渲染） */}
      <div
        ref={shareCardRef}
        style={{ position: 'absolute', left: -9999, top: 0, pointerEvents: 'none' }}
      >
        <ShareCard reading={reading} lang={lang} periodLabel={periodLabel} />
      </div>
    </div>
  )
}
