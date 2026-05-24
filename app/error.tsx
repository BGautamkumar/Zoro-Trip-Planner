'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-deep/5 border border-gray-100 dark:border-gray-800 p-8 text-center animate-reveal-up">
        {/* Animated icon */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 rounded-2xl bg-rose-100 dark:bg-rose-950/30 animate-pulse opacity-50" />
          <div className="relative w-20 h-20 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center shadow-inner">
            <AlertCircle className="h-10 w-10 text-rose-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-deep dark:text-white mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
          We hit an unexpected turbulence. Don&apos;t worry — your trip data is safe.
        </p>

        {process.env.NODE_ENV === 'development' && error?.message && (
          <div className="my-4 p-3 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 dark:border-rose-900/20 text-left">
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button
            onClick={() => reset()}
            className="flex-1 gap-2 rounded-xl py-5 bg-gradient-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex-1 gap-2 rounded-xl py-5"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        {error?.digest && (
          <p className="mt-4 text-[10px] text-gray-400">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
