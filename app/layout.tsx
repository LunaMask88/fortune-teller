import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/contexts/LangContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import LangToggle from '@/components/LangToggle'
import BottomNav from '@/components/BottomNav'
import SwRegister from '@/components/SwRegister'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MysticPalantir — AI 命理解读 · 八字塔罗星座',
  description: '免费AI命理解读，融合八字、紫微斗数、星座、塔罗、人类图、数字命理，精准洞察运势与人生方向。支持中英文，覆盖全球用户。',
  keywords: ['命理', '八字', '塔罗', '星座', '运势', '紫微斗数', '人类图', 'AI算命', '免费算命', '2025运势'],
  metadataBase: new URL('https://mysticpalantir.com'),
  alternates: { canonical: 'https://mysticpalantir.com' },
  openGraph: {
    title: 'MysticPalantir — AI 命理解读',
    description: '免费AI命理解读，融合八字、紫微斗数、星座、塔罗、人类图，精准洞察你的运势与人生方向',
    url: 'https://mysticpalantir.com',
    siteName: 'MysticPalantir',
    locale: 'zh_CN',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'MysticPalantir 命理解读' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MysticPalantir — AI 命理解读',
    description: '免费AI命理解读，融合八字、塔罗、星座、人类图，精准洞察你的运势',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MysticPalantir',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  other: { 'mobile-web-app-capable': 'yes' },
}

export const viewport: Viewport = {
  themeColor: '#060412',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,       // 允许放大，WeChat/iOS 无障碍需要
  viewportFit: 'cover',  // 支持 iPhone 刘海/圆角安全区
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geist.variable} h-full`}>
      <body className="min-h-full star-bg">
        <ThemeProvider>
          <LangProvider>
            <LangToggle />
            <div style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom))' }}>{children}</div>
            <BottomNav />
          </LangProvider>
        </ThemeProvider>
        <SwRegister />
      </body>
    </html>
  )
}
