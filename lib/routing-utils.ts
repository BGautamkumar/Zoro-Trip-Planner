import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

/**
 * Production-grade route validation utilities
 */

export interface RouteValidationResult {
  isValid: boolean;
  tripId: string | null;
  error: string | null;
}

/**
 * Validates if a tripId is a valid UUID format
 */
export function validateTripId(tripId: string | null | undefined): RouteValidationResult {
  if (!tripId) {
    return {
      isValid: false,
      tripId: null,
      error: 'Trip ID is required'
    };
  }

  if (typeof tripId !== 'string') {
    return {
      isValid: false,
      tripId: null,
      error: 'Trip ID must be a string'
    };
  }

  if (!uuidValidate(tripId)) {
    return {
      isValid: false,
      tripId: null,
      error: 'Invalid trip ID format'
    };
  }

  return {
    isValid: true,
    tripId,
    error: null
  };
}

/**
 * Generates a valid UUID for new trips
 */
export function generateTripId(): string {
  return uuidv4();
}

/**
 * Creates a safe navigation path for trip viewing
 */
export function createTripViewPath(tripId: string | null | undefined): string {
  const validation = validateTripId(tripId);
  
  if (!validation.isValid) {
    console.error('Cannot create trip view path:', validation.error);
    return '/create-new-trip'; // Fallback to safe route
  }
  
  return `/view-trips/${validation.tripId}`;
}

/**
 * Validates route parameters and provides fallback
 */
export function validateRouteParams(params: { tripId?: string }): RouteValidationResult {
  return validateTripId(params.tripId);
}
