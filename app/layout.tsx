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
  title: 'Mystic Palantir — 东西方命理解读',
  description: '融合八字、紫微、星座、塔罗、人类图的AI命理解读，精准洞察你的运势与人生方向',
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
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  themeColor: '#060412',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geist.variable} h-full`}>
      <body className="min-h-full star-bg">
        <ThemeProvider>
          <LangProvider>
            <LangToggle />
            <div className="pb-16">{children}</div>
            <BottomNav />
          </LangProvider>
        </ThemeProvider>
        <SwRegister />
      </body>
    </html>
  )
}
