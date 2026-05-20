"use client"
import React, { useEffect, useState } from 'react'
import { Trip } from '../page'
import { ArrowRight, Trash2 } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUserDetail } from '../../Provider'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'

type Props = {
    trip: Trip
    onDelete?: (tripId: string) => void
}

function MyTripCardItem({ trip, onDelete }: Props) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const convex = useConvex();
  const { userDetail } = useUserDetail();

  useEffect(() => {
    const fetchImage = async () => {
      if (!trip?.tripDetail?.destination) {
        console.warn('No destination found for trip');
        setImageUrl('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop');
        setLoading(false);
        return;
      }

      const destination = trip.tripDetail.destination;
      console.log(`🖼️ Fetching image for: ${destination}`);
      
      try {
        const response = await axios.get('/api/fetch-image', {
          params: {
            location: destination,
            type: 'place',
          },
          timeout: 10000,
        });

        if (response.data?.imageUrl) {
          setImageUrl(response.data.imageUrl);
          console.log(`✅ Trip card image fetched for ${destination}`);
        } else {
          // Use fallback if API returns no image
          setImageUrl('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop');
        }
      } catch (error) {
        console.error('Error fetching trip image:', error);
        // Use fallback on error
        setImageUrl('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [trip?.tripDetail?.destination]);

  const handleDelete = async () => {
    if (!userDetail?._id || !trip?.tripId) {
      console.error('Missing user ID or trip ID');
      return;
    }

    setIsDeleting(true);
    
    try {
      await convex.mutation(api.tripDetail.DeleteTrip, {
        uid: userDetail._id,
        tripId: trip.tripId
      });
      
      console.log(`✅ Trip deleted: ${trip.tripId}`);
      
      // Notify parent component to update the list
      if (onDelete) {
        onDelete(trip.tripId);
      }
      
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting trip:', error);
      // You could show a toast here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div className='relative group'>
        <Link href={`/trip/${trip._id}`}>
          <div className='bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden card-hover h-full flex flex-col group-hover:border-ocean/30 transition-colors'>
            {/* Image Container with overlay */}
            <div className='relative w-full h-52 overflow-hidden bg-gray-100 dark:bg-gray-800'>
              {loading ? (
                <div className='w-full h-full bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer' />
              ) : (
                <>
                  <img 
                    src={imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'} 
                    alt={trip.tripDetail?.destination || 'Trip'}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                    onError={(e: any) => {
                      console.warn('Image failed to load, using fallback');
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop';
                    }}
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-deep-dark/80 via-deep-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  
                  {/* Badges on Image */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium rounded-full shadow-lg">
                      {trip?.tripDetail?.duration}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Delete Button - Floating top right */}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-full h-11 w-11 lg:h-8 lg:w-8 p-0"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>

            {/* Content Area */}
            <div className='p-6 flex flex-col grow relative'>
              <h2 className='flex flex-wrap gap-2 font-bold text-xl items-center text-deep dark:text-white mb-2 leading-tight'>
                <span>{trip?.tripDetail?.destination}</span>
              </h2>

              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex flex-col gap-1 text-sm">
                  <span className='font-medium text-ocean'>{trip?.tripDetail?.budget} Budget</span>
                  <span className='text-gray-500 dark:text-gray-400'>
                    {trip?.tripDetail?.group_size && `${trip.tripDetail.group_size} traveler(s)`}
                  </span>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-deep group-hover:bg-ocean group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this trip?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your trip to {trip?.tripDetail?.destination} and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default MyTripCardItem