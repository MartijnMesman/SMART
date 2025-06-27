'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the main component to prevent SSR issues
const SmartCreatorApp = dynamic(() => import('@/components/SmartCreatorApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">SMART Leerdoel Creator wordt geladen...</p>
      </div>
    </div>
  )
})

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Applicatie wordt voorbereid...</p>
        </div>
      </div>
    }>
      <SmartCreatorApp />
    </Suspense>
  )
}