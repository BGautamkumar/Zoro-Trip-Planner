/**
 * AI Data Validator and Sanitizer
 * Provides comprehensive validation and sanitization for AI-generated trip data
 */

// Type definitions for AI response structure
export interface ValidatedTripInfo {
  destination: string;
  duration: string;
  origin: string;
  budget: string;
  group_size: string;
  hotels: ValidatedHotel[];
  itinerary: ValidatedItinerary[];
}

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

export interface ValidatedItinerary {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  must_try_food?: string[];
  local_transport?: string;
  travel_tips?: string[];
  daily_food_budget?: string;
  daily_transport_budget?: string;
  activities: ValidatedActivity[];
  suggested_hotels: ValidatedHotel[];
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
  famous_features: string[];
  must_try_food?: string[];
}

// Validation helpers
const sanitizeString = (value: any, fallback: string = ''): string => {
  if (typeof value !== 'string') return fallback;
  return value.trim() || fallback;
};

const sanitizeNumber = (value: any, fallback: number = 0): number => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

const sanitizeArray = <T>(value: any, sanitizer: (item: any) => T | null, fallback: T[] = []): T[] => {
  if (!Array.isArray(value)) return fallback;
  return value.map(sanitizer).filter((item): item is T => item !== null);
};

const sanitizeCoordinates = (coords: any): { latitude: number; longitude: number } => {
  if (!coords || typeof coords !== 'object') {
    return { latitude: 0, longitude: 0 };
  }
  
  return {
    latitude: sanitizeNumber(coords.latitude, 0),
    longitude: sanitizeNumber(coords.longitude, 0)
  };
};

const sanitizeImageUrl = (url: any): string => {
  if (typeof url !== 'string' || !url.trim()) {
    return '/placeholder.jpg';
  }
  
  const trimmedUrl = url.trim();
  
  // Basic URL validation
  if (!trimmedUrl.startsWith('http') && !trimmedUrl.startsWith('/')) {
    return '/placeholder.jpg';
  }
  
  return trimmedUrl;
};

// Activity sanitizer
const sanitizeActivity = (activity: any): ValidatedActivity | null => {
  if (!activity || typeof activity !== 'object') return null;
  
  return {
    place_name: sanitizeString(activity.place_name, 'Unknown Place'),
    place_details: sanitizeString(activity.place_details, 'No description available'),
    place_image_url: sanitizeImageUrl(activity.place_image_url),
    geo_coordinates: sanitizeCoordinates(activity.geo_coordinates),
    place_address: sanitizeString(activity.place_address, 'Address not available'),
    ticket_pricing: sanitizeString(activity.ticket_pricing, 'Price not available'),
    time_travel_each_location: sanitizeString(activity.time_travel_each_location, 'Travel time not specified'),
    best_time_to_visit: sanitizeString(activity.best_time_to_visit, 'Any time'),
    famous_features: sanitizeArray(activity.famous_features, (feature: any) => sanitizeString(feature)),
    must_try_food: activity.must_try_food ? 
      sanitizeArray(activity.must_try_food, (food: any) => sanitizeString(food)) : 
      undefined
  };
};

// Hotel sanitizer
const sanitizeHotel = (hotel: any): ValidatedHotel | null => {
  if (!hotel || typeof hotel !== 'object') return null;
  
  return {
    hotel_name: sanitizeString(hotel.hotel_name, 'Unknown Hotel'),
    hotel_address: sanitizeString(hotel.hotel_address, 'Address not available'),
    price_per_night: sanitizeString(hotel.price_per_night, 'Price not available'),
    hotel_image_url: sanitizeImageUrl(hotel.hotel_image_url),
    geo_coordinates: sanitizeCoordinates(hotel.geo_coordinates),
    rating: sanitizeNumber(hotel.rating, 3.0),
    description: sanitizeString(hotel.description, 'No description available')
  };
};

// Itinerary sanitizer
const sanitizeItinerary = (itinerary: any): ValidatedItinerary | null => {
  if (!itinerary || typeof itinerary !== 'object') return null;
  
  return {
    day: sanitizeNumber(itinerary.day, 1),
    day_plan: sanitizeString(itinerary.day_plan, 'Day Activities'),
    best_time_to_visit_day: sanitizeString(itinerary.best_time_to_visit_day, 'Any time'),
    must_try_food: itinerary.must_try_food
      ? sanitizeArray(itinerary.must_try_food, (food: any) => sanitizeString(food))
      : undefined,
    local_transport: itinerary.local_transport
      ? sanitizeString(itinerary.local_transport)
      : undefined,
    travel_tips: itinerary.travel_tips
      ? sanitizeArray(itinerary.travel_tips, (tip: any) => sanitizeString(tip))
      : undefined,
    daily_food_budget: itinerary.daily_food_budget
      ? sanitizeString(itinerary.daily_food_budget)
      : undefined,
    daily_transport_budget: itinerary.daily_transport_budget
      ? sanitizeString(itinerary.daily_transport_budget)
      : undefined,
    activities: sanitizeArray(itinerary.activities, sanitizeActivity),
    suggested_hotels: sanitizeArray(itinerary.suggested_hotels, sanitizeHotel)
  };
};

// Main trip data validator
export const validateAITripData = (rawData: any): ValidatedTripInfo => {
  if (!rawData || typeof rawData !== 'object') {
    // Return minimal safe structure
    return {
      destination: 'Unknown Destination',
      duration: 'Not specified',
      origin: 'Unknown Origin',
      budget: 'Not specified',
      group_size: 'Not specified',
      hotels: [],
      itinerary: []
    };
  }
  
  const tripPlan = rawData.trip_plan || rawData;
  
  return {
    destination: sanitizeString(tripPlan.destination),
    duration: sanitizeString(tripPlan.duration),
    origin: sanitizeString(tripPlan.origin),
    budget: sanitizeString(tripPlan.budget),
    group_size: sanitizeString(tripPlan.group_size),
    hotels: sanitizeArray(tripPlan.hotels, sanitizeHotel),
    itinerary: sanitizeArray(tripPlan.itinerary, sanitizeItinerary)
  };
};

// AI response validator for chat responses
export const validateAIResponse = (response: any): { resp: string; ui?: string } => {
  if (!response || typeof response !== 'object') {
    return {
      resp: 'I apologize, but I encountered an error processing your request. Please try again.',
      ui: undefined
    };
  }
  
  return {
    resp: sanitizeString(response.resp, 'I apologize, but I couldn\'t generate a response. Please try again.'),
    ui: sanitizeString(response.ui)
  };
};

// Safety check for trip plan completeness
export const isTripDataComplete = (tripData: ValidatedTripInfo): boolean => {
  const requiredFields = [
    tripData.destination,
    tripData.duration,
    tripData.origin,
    tripData.budget,
    tripData.group_size
  ];
  
  return requiredFields.every(field => field && field.trim() !== '') &&
         tripData.itinerary.length > 0 &&
         tripData.itinerary.some(day => day.activities.length > 0);
};

// Error recovery for partial AI data
export const createFallbackTripData = (partialData: Partial<ValidatedTripInfo>): ValidatedTripInfo => {
  return {
    destination: partialData.destination || 'Amazing Destination',
    duration: partialData.duration || '3 days',
    origin: partialData.origin || 'Your Location',
    budget: partialData.budget || 'Medium',
    group_size: partialData.group_size || '2 people',
    hotels: partialData.hotels || [],
    itinerary: partialData.itinerary || [{
      day: 1,
      day_plan: 'Exploration Day',
      best_time_to_visit_day: 'Morning',
      activities: [{
        place_name: 'Main Attraction',
        place_details: 'Visit the main attraction of this destination',
        place_image_url: '/placeholder.jpg',
        geo_coordinates: { latitude: 0, longitude: 0 },
        place_address: 'Main Street',
        ticket_pricing: 'Free',
        time_travel_each_location: '30 minutes',
        best_time_to_visit: '10:00 AM - 12:00 PM',
        famous_features: ['Scenic views', 'Cultural significance']
      }],
      suggested_hotels: []
    }]
  };
};
