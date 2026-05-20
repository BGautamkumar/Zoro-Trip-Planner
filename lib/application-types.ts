/**
 * Production-grade application types for AI Trip Planner
 * Single source of truth for all type definitions
 */

// === CORE APPLICATION TYPES ===

export interface ApplicationHotel {
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

export interface ApplicationActivity {
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

export interface ApplicationItinerary {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: ApplicationActivity[];
}

export interface ApplicationTrip {
  destination: string;
  origin: string;
  duration: string;
  budget: string;
  group_size: string;
  hotels: ApplicationHotel[];
  itinerary: ApplicationItinerary[];
}

// === MESSAGE SYSTEM TYPES ===

export interface ApplicationMessage {
  readonly id: string; // Unique identifier for each message
  readonly role: 'user' | 'assistant';
  readonly content: string;
  readonly ui?: 'budget' | 'groupSize' | 'tripDuration' | 'final' | string | undefined;
  readonly timestamp: number; // For ordering and debugging
  readonly metadata?: {
    readonly processingTime?: number;
    readonly aiConfidence?: number;
    readonly validationStatus?: 'pending' | 'validated' | 'failed';
  };
}

// === STATE MACHINE TYPES ===

export type TripGenerationStage = 'idle' | 'validating' | 'saving' | 'saved' | 'failed';

export interface TripGenerationState {
  readonly stage: TripGenerationStage;
  readonly tripId: string | null;
  readonly isProcessing: boolean;
  readonly error: string | null;
  readonly canNavigate: boolean;
  readonly metadata?: {
    startTime?: number;
    endTime?: number;
    processingDuration?: number;
    retryCount?: number;
  };
}

export type NavigationState = {
  readonly currentRoute: string;
  readonly previousRoute: string | null;
  readonly isNavigating: boolean;
  readonly navigationHistory: readonly string[];
};

export type UserSessionState = {
  readonly isAuthenticated: boolean;
  readonly userId: string | null;
  readonly userEmail: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
};

// === UI STATE TYPES ===

export type ExperienceStage = 'chat' | 'generating' | 'exploring';

export type ViewMode = 'chat' | 'completed';

export interface UIState {
  readonly experienceStage: ExperienceStage;
  readonly viewMode: ViewMode;
  readonly isMobile: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
}

// === COMPONENT PROP TYPES ===

export interface ChatBoxProps {
  readonly onGenerationStart?: () => void;
  readonly viewMode?: ViewMode;
  readonly maxMessages?: number;
  readonly disabled?: boolean;
}

export interface WorkspacePanelProps {
  readonly activeMode: 'map' | 'itinerary' | 'explore' | 'insights';
  readonly tripData: ApplicationTrip | null;
  readonly onModeChange?: (mode: string) => void;
}

// === VALIDATION RESULT TYPES ===

export interface ValidationResult<T = any> {
  readonly isValid: boolean;
  readonly data?: T;
  readonly error: string | null;
  readonly warnings: readonly string[];
}

export interface RouteValidationResult {
  readonly isValid: boolean;
  readonly tripId: string | null;
  readonly error: string | null;
}

// === API RESPONSE TYPES ===

export interface AIModelResponse {
  readonly resp: string;
  readonly ui?: string;
  readonly trip_plan?: any;
  readonly metadata?: {
    model: string;
    tokens: number;
    processingTime: number;
  };
}

export interface APIError {
  readonly code: string;
  readonly message: string;
  readonly details?: any;
}

export interface ApplicationError {
  readonly code: string;
  readonly message: string;
  readonly details?: any;
  readonly timestamp: number;
  readonly stack?: string;
  readonly context?: {
    readonly component?: string;
    readonly action?: string;
    readonly userId?: string;
    readonly tripId?: string;
  };
}

// === AI MODEL CONTRACTS ===

export interface AIModelRequest {
  readonly messages: readonly {
    readonly role: string;
    readonly content: string;
    readonly ui?: string;
  }[];
  readonly isFinal: boolean;
  readonly context?: {
    readonly userId?: string;
    readonly sessionId?: string;
  };
}

export interface AIModelResponse {
  readonly resp: string;
  readonly ui?: string;
  readonly trip_plan?: ApplicationTrip | any; // Allow any for AI response flexibility
  readonly metadata?: {
    readonly model?: string;
    readonly tokens?: number;
    readonly processingTime?: number;
    readonly confidence?: number;
  };
}

// === DATABASE CONTRACTS ===

export interface CreateTripRequest {
  readonly tripId: string;
  readonly uid: string;
  readonly tripDetail: ApplicationTrip;
}

export interface CreateTripResponse {
  readonly success: boolean;
  readonly tripId: string;
  readonly documentId?: any;
  readonly timestamp: number;
}

// === TYPE GUARDS ===

export function isValidMessage(obj: any): obj is ApplicationMessage {
  return obj && 
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    (obj.role === 'user' || obj.role === 'assistant') &&
    typeof obj.content === 'string' &&
    typeof obj.timestamp === 'number';
}

export function isValidTrip(obj: any): obj is ApplicationTrip {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.destination === 'string' &&
    typeof obj.origin === 'string' &&
    typeof obj.duration === 'string' &&
    typeof obj.budget === 'string' &&
    typeof obj.group_size === 'string' &&
    Array.isArray(obj.hotels) &&
    Array.isArray(obj.itinerary);
}

export function isTripGenerationState(obj: any): obj is TripGenerationState {
  return obj &&
    typeof obj === 'object' &&
    ['idle', 'validating', 'saving', 'saved', 'failed'].includes(obj.stage) &&
    typeof obj.isProcessing === 'boolean' &&
    typeof obj.canNavigate === 'boolean';
}
