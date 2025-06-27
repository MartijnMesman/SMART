import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SMART Leerdoel Creator - Inholland Hogeschool',
  description: 'Een tool voor het creëren van SMART leerdoelen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}