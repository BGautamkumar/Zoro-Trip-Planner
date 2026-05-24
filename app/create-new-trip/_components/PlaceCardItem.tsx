'use client'

import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock, ExternalLink, Ticket, MapPin } from 'lucide-react';
import { ValidatedActivity } from '@/lib/ai-data-validator';

type Props = {
    activity: ValidatedActivity;
    photoUrl?: string;
}

function PlaceCardItem({ activity, photoUrl }: Props) {
    const imageUrl = photoUrl || '/placeholder.jpg';

    return (
        <div className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 card-hover flex flex-col h-full">

            {/* Image Section */}
            <div className="relative w-full h-44 overflow-hidden">
                <Image
                    src={imageUrl}
                    fill
                    alt={activity?.place_name || 'Place Image'}
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

                {/* Time badge */}
                {activity?.best_time_to_visit && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <Clock className="w-3 h-3 text-ocean" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {activity.best_time_to_visit}
                        </span>
                    </div>
                )}

                {/* Price badge */}
                {activity?.ticket_pricing && activity.ticket_pricing !== 'Price not available' && (
                    <div className="absolute top-3 right-3 bg-ocean/90 text-white px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        {activity.ticket_pricing === 'Free' ? '🎉 Free' : activity.ticket_pricing}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1 p-4">
                <h2 className='font-bold text-base text-deep dark:text-white leading-tight mb-1.5'>
                    {activity?.place_name}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1 leading-relaxed'>
                    {activity?.place_details}
                </p>

                {/* Famous features */}
                {activity?.famous_features && activity.famous_features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {activity.famous_features.slice(0, 3).map((feature, i) => (
                            <span key={i} className="text-[11px] font-medium px-2 py-0.5 bg-ocean/8 text-ocean rounded-full">
                                {feature}
                            </span>
                        ))}
                    </div>
                )}

                {/* Travel time indicator */}
                {activity?.time_travel_each_location && activity.time_travel_each_location !== 'Travel time not specified' && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.time_travel_each_location} from previous</span>
                    </div>
                )}

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Link href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(activity?.place_name || '')} target='_blank' className="block">
                        <Button size={'sm'} variant={'outline'} className='w-full text-xs gap-1.5 border-gray-200 dark:border-gray-700 hover:border-ocean hover:text-ocean hover:bg-ocean/5 transition-all duration-200'>
                            View on Map <ExternalLink className="w-3 h-3" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PlaceCardItem