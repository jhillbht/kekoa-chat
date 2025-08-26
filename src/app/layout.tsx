import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'Kekoa Chat - Mobile AI Assistant',
    template: '%s | Kekoa Chat'
  },
  description: 'Mobile-first triple-mode AI assistant: Curriculum Designer, General Chat, and TikTok Shop Strategist. Optimized for touch devices.',
  keywords: ['AI assistant', 'mobile app', 'curriculum design', 'education', 'e-commerce', 'TikTok Shop', 'chat assistant', 'PWA'],
  authors: [{ name: 'Kekoa Chat Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kekoa Chat',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable + " h-full"} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kekoa Chat" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className + " h-full overflow-hidden bg-white dark:bg-gray-900 antialiased"}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  )
}
