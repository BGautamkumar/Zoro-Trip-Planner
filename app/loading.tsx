import React from 'react'

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
      {/* Slim top progress bar — non-blocking, content shows behind it */}
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-deep via-ocean to-ocean-light animate-shimmer"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  )
}
