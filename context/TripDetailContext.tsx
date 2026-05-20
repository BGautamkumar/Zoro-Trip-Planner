import { TripInfo } from "@/app/create-new-trip/_components/ChatBox";
import { createContext } from "react";

export type TripContextType = {
    tripDetailInfo: TripInfo | null,
    setTripDetailInfo: React.Dispatch<React.SetStateAction<TripInfo | null>>,
    selectedLocation: { lat: number; lng: number } | null,
    setSelectedLocation: React.Dispatch<React.SetStateAction<{ lat: number; lng: number } | null>>
};

export const TripDetailContext = createContext<TripContextType | undefined>(undefined);