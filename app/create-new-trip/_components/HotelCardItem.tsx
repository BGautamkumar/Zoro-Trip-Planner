'use client'

import React from 'react'
import Image from 'next/image';
import { Star, Wallet, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ValidatedHotel } from '@/lib/ai-data-validator';

type Props = {
    hotel: ValidatedHotel;
    photoUrl?: string;
}

function HotelCardItem({ hotel, photoUrl }: Props) {
    const imageUrl = photoUrl || '/placeholder.jpg';

    // Render star rating
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
            );
        }
        if (hasHalf) {
            stars.push(
                <Star key="half" className="w-3.5 h-3.5 fill-gold/50 text-gold" />
            );
        }
        return stars;
    };

    return (
        <div className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 card-hover flex flex-col h-full">
            {/* Image Section */}
            <div className="relative w-full h-40 overflow-hidden">
                <Image
                    src={imageUrl}
                    fill
                    alt={hotel?.hotel_name || 'Hotel Image'}
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/placeholder.jpg') {
                            target.src = '/placeholder.jpg';
                        }
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Price badge */}
                {hotel?.price_per_night && hotel.price_per_night !== 'Price not available' && (
                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                            {hotel.price_per_night}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-0.5">/night</span>
                    </div>
                )}

                {/* Rating badge */}
                {hotel?.rating > 0 && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {renderStars(hotel.rating)}
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 ml-1">
                            {hotel.rating}
                        </span>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-4">
                <h2 className='font-bold text-base text-deep dark:text-white leading-tight mb-1'>
                    {hotel?.hotel_name}
                </h2>

                {hotel?.hotel_address && hotel.hotel_address !== 'Address not available' && (
                    <p className='flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed'>
                        <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{hotel.hotel_address}</span>
                    </p>
                )}

                {hotel?.description && hotel.description !== 'No description available' && (
                    <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1'>
                        {hotel.description}
                    </p>
                )}

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Link
                        href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(hotel?.hotel_name || '')}
                        target='_blank'
                        className="block"
                    >
                        <Button
                            size={'sm'}
                            variant={'outline'}
                            className='w-full text-xs gap-1.5 border-gray-200 dark:border-gray-700 hover:border-ocean hover:text-ocean hover:bg-ocean/5 transition-all duration-200'
                        >
                            View on Map <ExternalLink className="w-3 h-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HotelCardItem
