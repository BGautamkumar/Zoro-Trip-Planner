'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, ExternalLink, Ticket } from 'lucide-react';
import { ValidatedActivity } from '@/lib/ai-data-validator';
import axios from 'axios';

type Props = {
    activity: ValidatedActivity
}
function PlaceCardItem({ activity }: Props) {
    const [photoUrl, setPhotoUrl] = useState<string>();

    useEffect(() => {
        activity && GetGooglePlaceDetail();
    }, [activity])

    const GetGooglePlaceDetail = async () => {
        try {
            const result = await axios.post('/api/google-place-detail', {
                placeName: activity?.place_name + ":" + activity?.place_address
            });
            
            // Check for error response or invalid data
            if (result?.data?.error || !result?.data || typeof result.data !== 'string') {
                console.warn('Failed to fetch place photo for:', activity?.place_name);
                setPhotoUrl('/placeholder.jpg'); // Use fallback immediately
                return;
            }
            
            setPhotoUrl(result.data);
        } catch (error) {
            console.error('Error fetching place photo:', error);
            setPhotoUrl('/placeholder.jpg'); // Use fallback on error
        }
    }
    return (
        <div className="group relative bg-white dark:bg-gray-900 rounded-2xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 card-hover flex flex-col h-full overflow-hidden">
            
            {/* Image Section */}
            <div className="relative w-full h-40 rounded-xl overflow-hidden mb-4">
                <Image
                    src={photoUrl || '/placeholder.jpg'}
                    fill
                    alt={activity?.place_name || 'Place Image'}
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/placeholder.jpg') {
                            target.src = '/placeholder.jpg';
                        }
                    }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60" />
                
                {/* Action Menu overlay on hover */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="icon" variant="secondary" className="h-11 w-11 lg:h-8 lg:w-8 rounded-full bg-white/90 hover:bg-white text-ocean hover:text-ocean-dark shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
                    </Button>
                    <Button size="icon" variant="destructive" className="h-11 w-11 lg:h-8 lg:w-8 rounded-full bg-red-500/90 hover:bg-red-600 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1">
                <h2 className='font-bold text-lg text-deep dark:text-white leading-tight mb-1'>{activity?.place_name}</h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1'>{activity?.place_details}</p>
                
                <div className="space-y-1.5 mb-4">
                    <h2 className='flex items-center gap-2 text-sm font-medium text-ocean'>
                        <Ticket className="w-4 h-4" /> 
                        {activity?.ticket_pricing}
                    </h2>
                    <p className='flex items-center gap-2 text-sm font-medium text-orange-500'>
                        <Clock className="w-4 h-4" /> 
                        {activity?.best_time_to_visit}
                    </p>
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                    <Link href={'https://www.google.com/maps/search/?api=1&query=' + activity?.place_name} target='_blank' className="flex-1">
                        <Button size={'sm'} variant={'outline'} className='w-full text-xs gap-1.5 border-gray-200 hover:border-ocean hover:text-ocean hover:bg-ocean/5'>
                            Directions <ExternalLink className="w-3 h-3" />
                        </Button>
                    </Link>
                    <Button size={'sm'} variant={'ghost'} className='text-xs px-3 hover:bg-gray-100 text-gray-500'>
                        Edit
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PlaceCardItem