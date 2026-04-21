import type { Metadata } from 'next'
import {
  Geist_Mono,
  Stint_Ultra_Expanded,
  Pontano_Sans,
  Fugaz_One,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CustomCursor } from '@/components/landing/custom-cursor'
import './globals.css'

const pontano = Pontano_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const stint = Stint_Ultra_Expanded({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

const fugaz = Fugaz_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-accent',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kerning — intelligent, ATS-ready resumes',
  description:
    'Kerning turns your career notes into a clean, validated, ATS-ready resume. Structured input, intelligent review, professional output.',
  generator: 'kerning',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${pontano.variable} ${geistMono.variable} ${stint.variable} ${fugaz.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <div aria-hidden="true" className="bg-base" />
        <div aria-hidden="true" className="bg-grid" />
        <div aria-hidden="true" className="bg-aperture" />
        <CustomCursor />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
