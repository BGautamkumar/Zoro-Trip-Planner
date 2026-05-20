'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { Star, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Hotel } from './ChatBox';
import { ValidatedHotel } from '@/lib/ai-data-validator';
import axios from 'axios';

type Props = {
    hotel: ValidatedHotel
}
function HotelCardItem({ hotel }: Props) {

    const [photoUrl, setPhotoUrl] = useState<string>();

    useEffect(() => {
        hotel && GetGooglePlaceDetail();
    }, [hotel])

    const GetGooglePlaceDetail = async () => {
        try {
            const result = await axios.post('/api/google-place-detail', {
                placeName: hotel?.hotel_name
            });
            
            // Check for error response or invalid data
            if (result?.data?.error || !result?.data || typeof result.data !== 'string') {
                console.warn('Failed to fetch hotel photo for:', hotel?.hotel_name);
                setPhotoUrl('/placeholder.jpg'); // Use fallback immediately
                return;
            }
            
            setPhotoUrl(result.data);
        } catch (error) {
            console.error('Error fetching hotel photo:', error);
            setPhotoUrl('/placeholder.jpg'); // Use fallback on error
        }
    }
    return (
        <div className='flex flex-col gap-1'>
            <Image
                src={photoUrl || '/placeholder.jpg'}
                alt={hotel?.hotel_name || 'Hotel Image'}
                width={400} height={200}
                className='rounded-xl shadow object-cover mb-2'
                onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/placeholder.jpg') {
                        target.src = '/placeholder.jpg';
                    }
                }}
            />
            <h2 className='font-semibold text-lg'>{hotel?.hotel_name}</h2>
            <h2 className='text-gray-500'>{hotel?.hotel_address}</h2>
            <div className='flex justify-between items-center'>
                <p className='flex gap-2 text-green-600'><Wallet /> {hotel?.price_per_night}</p>
                <p className='text-yellow-500 flex gap-2'><Star /> {hotel?.rating}</p>
            </div>
            <Link href={'https://www.google.com/maps/search/?api=1&query=' + hotel?.hotel_name} target='_blank'>
                <Button variant={'outline'} className='mt-1 w-full'>View</Button>
            </Link>
            {/* <p className='line-clamp-2 text-gray-500'>{hotel?.description}</p> */}
        </div>
    )
}

export default HotelCardItem