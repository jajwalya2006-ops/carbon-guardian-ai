import './globals.css'

export const metadata = {
  title: 'Carbon Guardian AI — AI-Powered Carbon Footprint Platform',
  description: 'Understand, track, and reduce your carbon footprint with AI-powered digital twin modeling, personalized coaching, and gamified eco-challenges. Built for a sustainable future.',
  keywords: 'carbon footprint, sustainability, AI, climate tech, carbon tracking, eco-friendly',
  authors: [{ name: 'Carbon Guardian AI Team' }],
  themeColor: '#070a13',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
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
