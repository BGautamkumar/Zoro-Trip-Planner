/**
 * Production-grade frontend/backend contracts
 * Ensures type-safe communication between all layers
 */

import { ApplicationTrip, ValidationResult } from './application-types';

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

export interface GetTripRequest {
  readonly tripId: string;
  readonly uid: string;
}

export interface GetTripResponse {
  readonly success: boolean;
  readonly trip: {
    readonly _id: any;
    readonly _creationTime: number;
    readonly tripId: string;
    readonly uid: string;
    readonly tripDetail: ApplicationTrip;
    readonly createdAt: number;
    readonly updatedAt: number;
  } | null;
  readonly error?: string;
}

export interface GetUserTripsRequest {
  readonly uid: string;
}

export interface GetUserTripsResponse {
  readonly success: boolean;
  readonly trips: readonly {
    readonly _id: any;
    readonly _creationTime: number;
    readonly tripId: string;
    readonly uid: string;
    readonly tripDetail: ApplicationTrip;
    readonly createdAt: number;
    readonly updatedAt: number;
  }[];
  readonly error?: string;
}

export interface DeleteTripRequest {
  readonly tripId: string;
  readonly uid: string;
}

export interface DeleteTripResponse {
  readonly success: boolean;
  readonly deletedTripId: string;
  readonly timestamp: number;
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
  readonly trip_plan?: ApplicationTrip;
  readonly metadata?: {
    readonly model: string;
    readonly tokens: number;
    readonly processingTime: number;
    readonly confidence: number;
  };
}

// === ROUTING CONTRACTS ===

export interface RouteParams {
  readonly tripId?: string;
  readonly userId?: string;
  readonly sessionId?: string;
}

export interface NavigationState {
  readonly currentPath: string;
  readonly previousPath: string | null;
  readonly isNavigating: boolean;
  readonly navigationStack: readonly string[];
}

// === VALIDATION CONTRACTS ===

export interface ValidationSchema<T> {
  readonly validate: (data: unknown) => ValidationResult<T>;
  readonly isValid: (data: unknown) => data is T;
  readonly required: readonly (keyof T)[];
  readonly optional: readonly (keyof T)[];
  readonly name?: string; // Add optional name property
}

// === ERROR CONTRACTS ===

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

export interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: ApplicationError | null;
  readonly errorInfo: {
    readonly componentStack: string;
    readonly errorBoundary: string;
    readonly error: Error | null;
  };
}

// === STATE MANAGEMENT CONTRACTS ===

export interface StateTransition<T> {
  readonly from: T;
  readonly to: T;
  readonly timestamp: number;
  readonly metadata?: any;
}

export interface StateMachineConfig<T> {
  readonly initialState: T;
  readonly transitions: readonly {
    readonly from: T;
    readonly to: T;
    readonly condition?: (state: T, payload?: any) => boolean;
    readonly action?: (state: T, payload?: any) => T;
  }[];
}

// === COMPONENT COMMUNICATION CONTRACTS ===

export interface ComponentEvent<T = any> {
  readonly type: string;
  readonly payload: T;
  readonly timestamp: number;
  readonly source: string;
}

export interface EventSubscription<T = any> {
  readonly eventType: string;
  readonly handler: (event: ComponentEvent<T>) => void;
  readonly once?: boolean;
}

// === PERFORMANCE MONITORING CONTRACTS ===

export interface PerformanceMetrics {
  readonly renderTime: number;
  readonly componentCount: number;
  readonly stateUpdates: number;
  readonly apiCalls: number;
  readonly errors: readonly ApplicationError[];
  readonly timestamp: number;
}

export interface PerformanceReport {
  readonly metrics: PerformanceMetrics;
  readonly summary: {
    readonly averageRenderTime: number;
    readonly totalErrors: number;
    readonly performanceGrade: 'A' | 'B' | 'C' | 'F';
  };
}

// === TYPE GUARDS ===

export function isValidCreateTripRequest(obj: any): obj is CreateTripRequest {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.tripId === 'string' &&
    typeof obj.uid === 'string' &&
    obj.tripId.length > 0 &&
    obj.uid.length > 0;
}

export function isValidGetTripRequest(obj: any): obj is GetTripRequest {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.tripId === 'string' &&
    typeof obj.uid === 'string' &&
    obj.tripId.length > 0 &&
    obj.uid.length > 0;
}

export function isValidAIModelResponse(obj: any): obj is AIModelResponse {
  return obj &&
    typeof obj === 'object' &&
    typeof obj.resp === 'string' &&
    (obj.ui === undefined || typeof obj.ui === 'string');
}

// === CONTRACT VALIDATION ===

export function validateContract<T>(data: unknown, contract: ValidationSchema<T>): ValidationResult<T> {
  try {
    if (contract.isValid(data)) {
      return {
        isValid: true,
        data: data as T,
        error: null,
        warnings: []
      };
    } else {
      return {
        isValid: false,
        data: undefined,
        error: `Contract validation failed for ${contract.name || 'unknown'}`,
        warnings: []
      };
    }
  } catch (error) {
    return {
      isValid: false,
      data: undefined,
      error: error instanceof Error ? error.message : 'Unknown validation error',
      warnings: []
    };
  }
}
