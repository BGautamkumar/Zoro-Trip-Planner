'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-surface dark:bg-gray-950 p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-deep/5 border border-gray-100 dark:border-gray-800 p-8 text-center animate-reveal-up">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center mb-6 shadow-inner">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-deep dark:text-white mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          We encountered an unexpected issue while loading this page. Please try again or contact support if the problem persists.
        </p>
        <Button
          onClick={() => reset()}
          className="w-full gap-2 rounded-xl py-6 bg-linear-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
