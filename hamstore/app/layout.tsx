import type { Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import { SiteNav } from '@/components/SiteNav'
import { SmoothScroll } from '@/components/SmoothScroll'
import { SiteFooter } from '@/components/SiteFooter'
import { WalletProvider } from '@/components/WalletProvider'

const notoThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-thai',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HamStore — HamsterHub',
  description: 'ร้านค้าของ HamsterHub — ไอเทมแต่งแฮมสเตอร์ และคลัง Unity asset ของคุณ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={notoThai.variable}>
      <body className="font-sans">
        <WalletProvider>
          <SmoothScroll />
          <SiteNav />
          {children}
          <SiteFooter />
        </WalletProvider>
      </body>
    </html>
  )
}
