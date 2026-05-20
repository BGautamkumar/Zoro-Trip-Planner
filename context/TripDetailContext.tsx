import { ApplicationTrip } from "@/lib/application-types";
import { createContext } from "react";

export type TripContextType = {
    tripDetailInfo: ApplicationTrip | null,
    setTripDetailInfo: React.Dispatch<React.SetStateAction<ApplicationTrip | null>>,
    selectedLocation: { lat: number; lng: number } | null,
    setSelectedLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
};

export const TripDetailContext = createContext<TripContextType | undefined>(undefined);
