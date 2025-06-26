'use client'

import React from 'react'

interface HeaderProps {
  saveStatus: string
}

export default function Header({ saveStatus }: HeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b-4 border-pink-600">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
            i
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">SMART Leerdoel Creator</h1>
            <p className="text-sm text-pink-600 font-medium">inholland hogeschool</p>
          </div>
        </div>
        <div className="text-xs text-gray-600">
          Auto-save: <span className="font-medium">{saveStatus}</span>
        </div>
      </div>
    </div>
  )
}