"use client"
import Itinerary from '@/app/create-new-trip/_components/Itinerary';
import { Trip } from '@/app/my-trips/page';
import { useTripDetail, useUserDetail } from '@/app/Provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react'
import { ArrowLeft, Calendar, Wallet, Users, Plane, Share2, AlertTriangle, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIAssistantPanel from '../_components/AIAssistantPanel';
import { validateRouteParams } from '@/lib/routing-utils';
import { validateAITripData, ValidatedTripInfo } from '@/lib/ai-data-validator';
import { calculateTripBudget } from '@/lib/trip-budget-calculator';
import { ShareModal } from '@/components/trip/ShareModal';
import { BudgetDashboard } from '@/components/trip/BudgetDashboard';

function ViewTrip() {
  const params = useParams<{ tripId: string }>();
  const routeValidation = validateRouteParams(params);
  const { userDetail } = useUserDetail();
  const convex = useConvex();
  const [tripData, setTripData] = useState<Trip>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const router = useRouter();
  
  // Validate trip data for the budget panel
  const validatedTripData = useMemo<ValidatedTripInfo | null>(() => {
    if (!tripData?.tripDetail) return null;
    return validateAITripData(tripData.tripDetail);
  }, [tripData]);

  // Calculate budget for dashboard
  const budget = useMemo(() => {
    if (!validatedTripData) return null;
    return calculateTripBudget(validatedTripData);
  }, [validatedTripData]);

  useEffect(() => {
    if (!routeValidation.isValid) {
      setError(routeValidation.error || 'Invalid trip ID');
      setLoading(false);
      return;
    }

    if (userDetail && routeValidation.isValid) {
      GetTrip();
    }
  }, [userDetail, routeValidation.isValid]);

  const GetTrip = async () => {
    if (!routeValidation.isValid || !routeValidation.tripId) {
      setError('Invalid trip ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await convex.query(api.tripDetail.GetTripById, {
        uid: userDetail?._id,
        tripId: routeValidation.tripId
      });

      if (!result) {
        setError('Trip not found or you do not have permission to view it');
        setLoading(false);
        return;
      }

      setTripData(result);
      setTripDetailInfo(result.tripDetail);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch trip:', err);
      setError('Failed to load trip details');
      setLoading(false);
    }
  }
  
  const handleBackNavigation = () => {
    router.back();
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleExportPDF = async () => {
    if (!tripData?.tripDetail) return;
    setExporting(true);
    try {
      const res = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripData: tripData.tripDetail,
          budget: budget ? {
            hotels: budget.hotels,
            food: budget.food,
            transport: budget.transport,
            activities: budget.activities,
            total: budget.total,
          } : null,
        }),
      });
      if (!res.ok) throw new Error('Export failed');
      const html = await res.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleRetry = () => {
    if (routeValidation.isValid) {
      GetTrip();
    } else {
      router.push('/create-new-trip');
    }
  };

  // Error state with recovery
  if (error) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Unable to Load Trip
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleRetry} variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={() => router.push('/create-new-trip')}>
                    Create New Trip
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
      {/* Header Section */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          {/* Back Button & Title */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackNavigation}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className='text-xl md:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2'>
                  <Plane className="h-5 w-5 text-ocean" />
                  {loading ? (
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  ) : (
                    <span>
                      Trip to <span className="text-transparent bg-clip-text bg-gradient-to-r from-deep to-ocean">{tripData?.tripDetail?.destination}</span>
                    </span>
                  )}
                </h1>
                {!loading && tripData?.tripDetail?.origin && (
                  <p className="text-sm text-gray-500 mt-0.5">From {tripData.tripDetail.origin}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!loading && tripData?.tripDetail && (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full"
                  onClick={handleExportPDF}
                  disabled={exporting}
                >
                  {exporting ? (
                    <><div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> Exporting...</>
                  ) : (
                    <><FileText className="h-4 w-4" /> Export PDF</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            )}

            {/* Trip Quick Info */}
            {!loading && tripData?.tripDetail && (
              <div className="hidden md:flex items-center gap-2">
                {tripData.tripDetail.duration && (
                  <div className="flex items-center gap-1.5 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <Calendar className="h-3.5 w-3.5 text-ocean" />
                    <span className="text-gray-700 dark:text-gray-300">{tripData.tripDetail.duration}</span>
                  </div>
                )}
                {tripData.tripDetail.budget && (
                  <div className="flex items-center gap-1.5 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <Wallet className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300">{tripData.tripDetail.budget}</span>
                  </div>
                )}
                {tripData.tripDetail.group_size && (
                  <div className="flex items-center gap-1.5 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <Users className="h-3.5 w-3.5 text-orange-500" />
                    <span className="text-gray-700 dark:text-gray-300">{tripData.tripDetail.group_size}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Quick Info */}
          {!loading && tripData?.tripDetail && (
            <div className="md:hidden flex flex-wrap items-center gap-2 mt-3 ml-12">
              {tripData.tripDetail.duration && (
                <div className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  <Calendar className="h-3 w-3 text-ocean" />
                  <span>{tripData.tripDetail.duration}</span>
                </div>
              )}
              {tripData.tripDetail.budget && (
                <div className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  <Wallet className="h-3 w-3 text-green-500" />
                  <span>{tripData.tripDetail.budget}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-8 space-y-6 animate-pulse">
            {/* Summary skeleton */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl h-48" />
            {/* Day cards skeleton */}
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-48" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop View - Workspace Layout */}
        {!loading && (
          <div className="hidden lg:flex gap-8 min-h-[60vh] mt-8 pb-12">
            <div className="flex-1 lg:max-w-[65%]">
              <Itinerary />
            </div>
            <div className="lg:w-[35%] max-w-sm shrink-0 space-y-6">
              {budget && (
                <BudgetDashboard budget={budget} />
              )}
              {validatedTripData && (
                <AIAssistantPanel tripData={validatedTripData} />
              )}
            </div>
          </div>
        )}

        {/* Mobile & Tablet View */}
        {!loading && (
          <div className="lg:hidden flex flex-col gap-6 mt-6 pb-10">
            {budget && (
              <BudgetDashboard budget={budget} compact />
            )}
            {validatedTripData && (
              <AIAssistantPanel tripData={validatedTripData} isMobile />
            )}
            <Itinerary />
          </div>
        )}
      </div>

      {/* Share Modal */}
      {tripData?.tripDetail && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          tripUrl={typeof window !== 'undefined' ? window.location.href : ''}
          tripName={`Trip to ${tripData.tripDetail.destination}`}
        />
      )}
    </div>
  )
}

export default ViewTrip