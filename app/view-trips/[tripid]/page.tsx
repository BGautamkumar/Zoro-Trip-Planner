"use client"
import Itinerary from '@/app/create-new-trip/_components/Itinerary';
import { Trip } from '@/app/my-trips/page';
import { useTripDetail, useUserDetail } from '@/app/Provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Calendar, Wallet, Users, Plane, Share2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AIAssistantPanel from '../_components/AIAssistantPanel';
import { validateRouteParams, createTripViewPath } from '@/lib/routing-utils';

function ViewTrip() {
  const params = useParams<{ tripId: string }>();
  const routeValidation = validateRouteParams(params);
  const { userDetail } = useUserDetail();
  const convex = useConvex();
  const [tripData, setTripData] = useState<Trip>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //@ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const router = useRouter();
  
  // Store the previous route for proper back navigation
  const [previousRoute, setPreviousRoute] = useState<string>('/create-new-trip');

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
    // Use router.back() to go to previous page in history
    router.back();
  };

  const handleRetry = () => {
    if (routeValidation.isValid) {
      GetTrip();
    } else {
      // Redirect to safe route if invalid
      router.push('/create-new-trip');
    }
  };

  // Error state with recovery
  if (error) {
    return (
      <div className='min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
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
    <div className='min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800'>
      {/* Header Section */}
      <div className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
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
                  <Plane className="h-5 w-5 text-primary" />
                  {loading ? (
                    <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  ) : (
                    <span>
                      Trip to <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">{tripData?.tripDetail?.destination}</span>
                    </span>
                  )}
                </h1>
                {!loading && tripData?.tripDetail?.origin && (
                  <p className="text-sm text-gray-500 mt-0.5">From {tripData.tripDetail.origin}</p>
                )}
              </div>
            </div>

            {/* Action Buttons: Share & Print */}
            {!loading && tripData?.tripDetail && (
              <div className="hidden md:flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            )}

            {/* Trip Quick Info */}
            {!loading && tripData?.tripDetail && (
              <div className="hidden md:flex items-center gap-3">
                {tripData.tripDetail.duration && (
                  <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{tripData.tripDetail.duration}</span>
                  </div>
                )}
                {tripData.tripDetail.budget && (
                  <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <Wallet className="h-4 w-4 text-blue-500" />
                    <span>{tripData.tripDetail.budget}</span>
                  </div>
                )}
                {tripData.tripDetail.group_size && (
                  <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span>{tripData.tripDetail.group_size}</span>
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
                  <Calendar className="h-3 w-3 text-primary" />
                  <span>{tripData.tripDetail.duration}</span>
                </div>
              )}
              {tripData.tripDetail.budget && (
                <div className="flex items-center gap-1.5 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  <Wallet className="h-3 w-3 text-blue-500" />
                  <span>{tripData.tripDetail.budget}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading your trip details...</p>
            </div>
          </div>
        )}

        {/* Desktop View - Workspace Layout */}
        {!loading && (
          <div className="hidden lg:flex gap-8 min-h-[60vh] mt-8">
            <div className="flex-1 lg:max-w-[65%]">
              <Itinerary />
            </div>
            <div className="lg:w-[35%] max-w-sm shrink-0">
              <AIAssistantPanel tripData={tripData?.tripDetail as any} />
            </div>
          </div>
        )}

        {/* Mobile & Tablet View */}
        {!loading && (
          <div className="lg:hidden flex flex-col gap-6 mt-6 pb-10">
            <AIAssistantPanel tripData={tripData?.tripDetail as any} isMobile />
            <Itinerary />
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewTrip