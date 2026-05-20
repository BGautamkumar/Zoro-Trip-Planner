import React, { useContext, useEffect, useState, useRef, useMemo } from 'react'
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import Header from './_components/Header'
import { api } from '@/convex/_generated/api';
import { UserDetailContext } from '@/context/UserDetailContext';
import { TripContextType, TripDetailContext } from '../context/TripDetailContext';
import { ApplicationTrip } from '@/lib/application-types';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const CreateUser = useMutation(api.user.CreateNewUser)
  const [userDetail, setUserDetail] = useState<any>();
  const [tripDetailInfo, setTripDetailInfo] = useState<ApplicationTrip | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const hasCreatedUser = useRef(false);

  const { user } = useUser();

  useEffect(() => {
    if (user && !hasCreatedUser.current) {
      hasCreatedUser.current = true;
      CreateNewUser();
    }
  }, [user])

  const CreateNewUser = async () => {
    if (user) {
      // Save New User if Not Exits
      const result = await CreateUser({
        email: user?.primaryEmailAddress?.emailAddress ?? '',
        imageUrl: user?.imageUrl,
        name: user?.fullName ?? ''
      });
      setUserDetail(result);
    }
  }

  // Memoize context values to prevent cascading re-renders
  const userContextValue = useMemo(() => ({
    userDetail, setUserDetail
  }), [userDetail]);

  const tripContextValue = useMemo(() => ({
    tripDetailInfo, setTripDetailInfo,
    selectedLocation, setSelectedLocation
  }), [tripDetailInfo, selectedLocation]);

  return (
    <UserDetailContext.Provider value={userContextValue}>
      <TripDetailContext.Provider value={tripContextValue}>
        <div>
          <Header />
          {children}
        </div>
      </TripDetailContext.Provider>
    </UserDetailContext.Provider >
  )
}

export default Provider

export const useUserDetail = () => {
  return useContext(UserDetailContext);
}

export const useTripDetail = (): TripContextType => {
  const context = useContext(TripDetailContext);
  if (!context) {
    throw new Error('useTripDetail must be used within a TripDetailContext.Provider');
  }
  return context;
}