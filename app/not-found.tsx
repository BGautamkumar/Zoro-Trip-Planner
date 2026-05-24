import Link from 'next/link';
import { Compass, Home, PlaneTakeoff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Big 404 */}
        <div className="relative">
          <h1 className="text-[120px] sm:text-[160px] font-black text-transparent bg-clip-text bg-gradient-to-r from-deep to-ocean leading-none select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 rounded-full bg-ocean/10 flex items-center justify-center animate-bounce">
              <Compass className="w-8 h-8 text-ocean" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <h2 className="text-2xl font-bold text-deep dark:text-white mb-2">
            Lost in transit
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
            This destination doesn&apos;t exist on our map. Let&apos;s get you back on route.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 px-6 bg-gradient-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white shadow-lg">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/create-new-trip">
            <Button variant="outline" className="gap-2 px-6">
              <PlaneTakeoff className="w-4 h-4" />
              Plan a Trip
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
