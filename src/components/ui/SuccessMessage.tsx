'use client'

import React, { forwardRef, memo } from 'react'

const SuccessMessage = memo(forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div 
      ref={ref}
      className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 hidden"
    >
      ✅ Succesvol opgeslagen!
    </div>
  )
}))

SuccessMessage.displayName = 'SuccessMessage'

export default SuccessMessage