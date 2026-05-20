import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="absolute inset-0 bg-linear-to-br from-deep/5 to-ocean/5 dark:from-deep-dark dark:to-gray-900" />
      <div className="relative flex flex-col items-center">
        {/* Animated Orbs */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-ocean/20 rounded-full animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-2 border-4 border-t-ocean border-r-ocean border-b-transparent border-l-transparent rounded-full animate-[spin_2s_linear_infinite]" />
          <div className="absolute inset-4 border-4 border-gold/30 rounded-full animate-[spin_4s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-deep to-ocean animate-pulse-glow" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-deep dark:text-white mb-2 animate-pulse">
          Loading
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Preparing your premium experience
        </p>
      </div>
    </div>
  )
}
