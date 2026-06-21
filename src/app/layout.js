import { Inter, Outfit } from 'next/font/google';
import Script from 'next/script';
import './globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], display: 'swap', variable: '--font-outfit' });

export const metadata = {
  title: 'Carbon Guardian AI — AI-Powered Carbon Footprint Platform',
  description: 'Understand, track, and reduce your carbon footprint with AI-powered digital twin modeling, personalized coaching, and gamified eco-challenges. Built for a sustainable future.',
  keywords: 'carbon footprint, sustainability, AI, climate tech, carbon tracking, eco-friendly',
  authors: [{ name: 'Carbon Guardian AI Team' }],
}

export const viewport = {
  themeColor: '#070a13',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
      </head>
      <body>
        <Script id="dummy-analytics" strategy="lazyOnload">
          {`
            console.log("Lazy loaded analytics script executed");
          `}
        </Script>
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <div className="ambient-background" aria-hidden="true">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        {children}
      </body>
    </html>
  )
}
