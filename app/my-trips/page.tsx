"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import { useUserDetail } from '../Provider';
import { api } from '@/convex/_generated/api';
import { useConvex } from "convex/react";
import { ApplicationTrip } from '@/lib/application-types';
import { Plus, Plane, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import MyTripCardItem from './_components/MyTripCardItem';

export type Trip = {
    tripId: any,
    tripDetail: ApplicationTrip,
    _id: String,
}

function MyTrips() {
    const [myTrips, setMyTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const { userDetail } = useUserDetail();
    const convex = useConvex();

    useEffect(() => {
        if (userDetail) {
            GetUserTrip();
        }
    }, [userDetail])

    const GetUserTrip = async () => {
        setLoading(true);
        const result = await convex.query(api.tripDetail.GetUserTrips, {
            uid: userDetail?._id
        });
        setMyTrips(result);
        setLoading(false);
    }

    const handleTripDelete = (deletedTripId: string) => {
        // Remove the deleted trip from the state
        setMyTrips(prevTrips => prevTrips.filter(trip => trip.tripId !== deletedTripId));
        console.log(`🗑️ Trip removed from UI: ${deletedTripId}`);
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-50 via-white to-ocean/3 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ocean/10 text-ocean text-sm font-medium">
                            <Plane className="h-3.5 w-3.5" />
                            Dashboard
                        </div>
                        <h1 className='text-3xl md:text-4xl font-bold text-deep dark:text-white tracking-tight'>
                            My{' '}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-deep to-ocean">
                                Trips
                            </span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {myTrips.length > 0
                                ? `You have ${myTrips.length} trip${myTrips.length > 1 ? 's' : ''} planned`
                                : 'Your travel adventures await'
                            }
                        </p>
                    </div>
                    <Link href={'/create-new-trip'}>
                        <Button className="gap-2 px-6 py-6 rounded-full shadow-lg shadow-ocean/20 hover:shadow-xl hover:shadow-ocean/30 transition-all duration-300 hover:-translate-y-0.5 bg-linear-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white group">
                            <Plus className="h-5 w-5" />
                            Create New Trip
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="h-52 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg w-3/4 animate-shimmer" />
                                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg w-1/2 animate-shimmer" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && myTrips?.length === 0 && (
                    <div className='bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm p-16 flex flex-col items-center justify-center text-center'>
                        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-deep to-ocean flex items-center justify-center mb-6 shadow-xl shadow-ocean/20">
                            <MapPin className="h-10 w-10 text-white" />
                        </div>
                        <h2 className='text-2xl font-bold text-deep dark:text-white mb-3'>No trips yet</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md leading-relaxed">
                            Your adventure starts here. Tell Zoro where you dream of going and get a complete trip plan in seconds.
                        </p>
                        <Link href={'/create-new-trip'}>
                            <Button className="gap-2 px-8 py-6 rounded-full text-base bg-linear-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white shadow-xl shadow-ocean/20 hover:shadow-2xl hover:shadow-ocean/30 transition-all duration-300 hover:-translate-y-1 group">
                                <Sparkles className="h-5 w-5" />
                                Plan Your First Trip
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Trips Grid */}
                {!loading && myTrips?.length > 0 && (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {myTrips.map((trip, index) => (
                            <MyTripCardItem
                                trip={trip}
                                key={trip.tripId || index}
                                onDelete={handleTripDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyTrips
