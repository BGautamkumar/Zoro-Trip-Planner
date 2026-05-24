/**
 * Production-grade database validation utilities
 * Ensures data integrity before database operations
 */

import { v } from "convex/values";
import { 
  ValidatedTripDetail, 
  ValidatedHotel, 
  ValidatedActivity, 
  ValidatedItinerary 
} from './database-types';
import { validateAITripData } from './ai-data-validator';

// Convex schema validators with strict typing
export const HotelValidator = v.object({
  hotel_name: v.string(),
  hotel_address: v.string(),
  price_per_night: v.string(),
  hotel_image_url: v.string(),
  geo_coordinates: v.object({
    latitude: v.number(),
    longitude: v.number(),
  }),
  rating: v.number(),
  description: v.string(),
});

export const ActivityValidator = v.object({
  place_name: v.string(),
  place_details: v.string(),
  place_image_url: v.string(),
  geo_coordinates: v.object({
    latitude: v.number(),
    longitude: v.number(),
  }),
  place_address: v.string(),
  ticket_pricing: v.string(),
  time_travel_each_location: v.string(),
  best_time_to_visit: v.string(),
  famous_features: v.optional(v.array(v.string())),
  estimated_cost: v.optional(v.string()),
  must_try_food: v.optional(v.array(v.string())),
});

export const ItineraryValidator = v.object({
  day: v.number(),
  day_plan: v.string(),
  best_time_to_visit_day: v.string(),
  must_try_food: v.optional(v.array(v.string())),
  local_transport: v.optional(v.string()),
  travel_tips: v.optional(v.array(v.string())),
  daily_food_budget: v.optional(v.string()),
  daily_transport_budget: v.optional(v.string()),
  activities: v.array(ActivityValidator),
  suggested_hotels: v.optional(v.array(HotelValidator)),
});

export const TripDetailValidator = v.object({
  destination: v.string(),
  origin: v.string(),
  duration: v.string(),
  budget: v.string(),
  group_size: v.string(),
  hotels: v.array(HotelValidator),
  itinerary: v.array(ItineraryValidator),
});

// Runtime validation functions using existing AI validator
export function validateHotel(data: any): ValidatedHotel {
  if (!data || typeof data !== 'object') {
    throw new Error('Hotel data must be an object');
  }
  
  const requiredFields = ['hotel_name', 'hotel_address', 'price_per_night', 'hotel_image_url', 'geo_coordinates', 'rating', 'description'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(`Missing required hotel field: ${field}`);
    }
  }
  
  if (typeof data.geo_coordinates !== 'object' || !('latitude' in data.geo_coordinates) || !('longitude' in data.geo_coordinates)) {
    throw new Error('Hotel geo_coordinates must include latitude and longitude');
  }
  
  return data as ValidatedHotel;
}

export function validateActivity(data: any): ValidatedActivity {
  if (!data || typeof data !== 'object') {
    throw new Error('Activity data must be an object');
  }
  
  const requiredFields = ['place_name', 'place_details', 'place_image_url', 'geo_coordinates', 'place_address', 'ticket_pricing', 'time_travel_each_location', 'best_time_to_visit'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(`Missing required activity field: ${field}`);
    }
  }
  
  if (typeof data.geo_coordinates !== 'object' || !('latitude' in data.geo_coordinates) || !('longitude' in data.geo_coordinates)) {
    throw new Error('Activity geo_coordinates must include latitude and longitude');
  }
  
  return data as ValidatedActivity;
}

export function validateItinerary(data: any): ValidatedItinerary {
  if (!data || typeof data !== 'object') {
    throw new Error('Itinerary data must be an object');
  }
  
  const requiredFields = ['day', 'day_plan', 'best_time_to_visit_day', 'activities'];
  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(`Missing required itinerary field: ${field}`);
    }
  }
  
  if (!Array.isArray(data.activities)) {
    throw new Error('Itinerary activities must be an array');
  }
  
  return data as ValidatedItinerary;
}

export function validateTripDetail(data: any): ValidatedTripDetail {
  // Use existing AI validator for consistency
  const validated = validateAITripData(data);
  if (!validated) {
    throw new Error('Invalid trip detail data: AI validation failed');
  }
  
  return validated;
}

// Database operation validators
export function validateCreateTripRequest(data: any) {
  return v.object({
    tripId: v.string(),
    uid: v.id('UserTable'),
    tripDetail: TripDetailValidator,
  });
}

export function validateGetTripRequest(data: any) {
  return v.object({
    tripId: v.string(),
    uid: v.id('UserTable'),
  });
}

export function validateDeleteTripRequest(data: any) {
  return v.object({
    tripId: v.string(),
    uid: v.id('UserTable'),
  });
}
