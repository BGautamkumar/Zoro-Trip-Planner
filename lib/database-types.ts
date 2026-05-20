/**
 * Production-grade database types for AI Trip Planner
 * Ensures type safety and data integrity at the database level
 */

export interface ValidatedHotel {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
}

export interface ValidatedActivity {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
}

export interface ValidatedItinerary {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: ValidatedActivity[];
}

export interface ValidatedTripDetail {
  destination: string;
  origin: string;
  duration: string;
  budget: string;
  group_size: string;
  hotels: ValidatedHotel[];
  itinerary: ValidatedItinerary[];
}

export interface DatabaseTripDocument {
  _id: any; // Convex ID type
  _creationTime: number;
  tripId: string;
  uid: string; // UserTable ID
  tripDetail: ValidatedTripDetail;
  createdAt: number;
  updatedAt: number;
}

export interface CreateTripRequest {
  tripId: string;
  uid: string; // UserTable ID
  tripDetail: ValidatedTripDetail;
}

export interface CreateTripResponse {
  success: boolean;
  tripId: string;
  documentId?: any; // Convex document ID
}

export interface GetTripRequest {
  tripId: string;
  uid: string; // UserTable ID
}

export interface GetUserTripsRequest {
  uid: string; // UserTable ID
}

export interface DeleteTripRequest {
  tripId: string;
  uid: string; // UserTable ID
}

export interface DeleteTripResponse {
  success: boolean;
  deletedTripId: string;
}
