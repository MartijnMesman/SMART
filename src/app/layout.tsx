import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SMART Leerdoel Creator - Inholland Hogeschool',
  description: 'Een veilige tool voor het creëren van SMART leerdoelen met geavanceerde privacy en security features',
  keywords: ['SMART doelen', 'onderwijs', 'leerdoelen', 'Inholland', 'privacy', 'veilig'],
  authors: [{ name: 'Inholland Hogeschool' }],
  robots: 'noindex, nofollow', // Prevent indexing for privacy
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <meta name="theme-color" content="#9333ea" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        <noscript>
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            textAlign: 'center',
            padding: '20px'
          }}>
            <div>
              <h1>JavaScript Vereist</h1>
              <p>Deze applicatie vereist JavaScript om te functioneren. Schakel JavaScript in en vernieuw de pagina.</p>
            </div>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  )
}