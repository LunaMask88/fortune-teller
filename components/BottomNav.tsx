'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/contexts/LangContext'

export default function BottomNav() {
  const pathname = usePathname()
  const { lang } = useLang()

  const tabs = [
    { href: '/',        icon: '🏠', label: lang === 'en' ? 'Home'   : '首页' },
    { href: '/reading', icon: '🔮', label: lang === 'en' ? 'Reading': '解读' },
    { href: '/match',   icon: '💕', label: lang === 'en' ? 'Match'  : '配对' },
    { href: '/result',  icon: '📊', label: lang === 'en' ? 'Report' : '报告' },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: 'rgba(6,4,18,0.92)',
        WebkitBackdropFilter: 'blur(16px)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map(tab => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all"
            style={{ color: active ? 'var(--gold)' : 'var(--text-muted)', touchAction: 'manipulation' }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>{tab.label}</span>
            {active && (
              <span style={{
                position: 'absolute', bottom: 0,
                width: 24, height: 2, borderRadius: 1,
                background: 'var(--gold)',
              }} />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
