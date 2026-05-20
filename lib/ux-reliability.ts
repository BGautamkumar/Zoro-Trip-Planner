/**
 * Production-grade UX reliability utilities
 * Ensures trustworthy user experience with backend-synchronized states
 */

import { TripGenerationState, ApplicationError } from './application-types';

// === LOADING STATE CONFIGURATION ===

export interface LoadingState {
  readonly message: string;
  readonly progress: number; // 0-100 for progress indicators
  readonly stage: 'validating' | 'saving' | 'finalizing';
  readonly canCancel: boolean;
  readonly estimatedDuration?: number; // in milliseconds
}

export const LOADING_STATES: Record<string, LoadingState> = {
  VALIDATING: {
    message: 'Validating your trip details...',
    progress: 20,
    stage: 'validating',
    canCancel: true,
    estimatedDuration: 2000
  },
  SAVING: {
    message: 'Saving your trip to database...',
    progress: 60,
    stage: 'saving',
    canCancel: false,
    estimatedDuration: 3000
  },
  FINALIZING: {
    message: 'Finalizing your trip...',
    progress: 90,
    stage: 'finalizing',
    canCancel: false,
    estimatedDuration: 1000
  }
};

// === ERROR CATEGORIZATION ===

export type ErrorCategory = 
  | 'validation' 
  | 'network' 
  | 'database' 
  | 'authentication' 
  | 'timeout' 
  | 'unknown';

export interface ErrorInfo {
  readonly category: ErrorCategory;
  readonly userMessage: string;
  readonly technicalMessage: string;
  readonly canRetry: boolean;
  readonly recoveryAction?: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
}

export const ERROR_CATEGORIES: Record<ErrorCategory, ErrorInfo> = {
  validation: {
    category: 'validation',
    userMessage: 'Please check your trip details and try again.',
    technicalMessage: 'Trip validation failed',
    canRetry: true,
    recoveryAction: 'Review and correct trip information',
    severity: 'medium'
  },
  network: {
    category: 'network',
    userMessage: 'Connection issue detected. Please check your internet connection.',
    technicalMessage: 'Network request failed',
    canRetry: true,
    recoveryAction: 'Check internet connection and retry',
    severity: 'medium'
  },
  database: {
    category: 'database',
    userMessage: 'Unable to save your trip right now. Please try again.',
    technicalMessage: 'Database operation failed',
    canRetry: true,
    recoveryAction: 'Wait a moment and retry',
    severity: 'high'
  },
  authentication: {
    category: 'authentication',
    userMessage: 'Please sign in again to continue.',
    technicalMessage: 'Authentication expired',
    canRetry: false,
    recoveryAction: 'Sign in again',
    severity: 'critical'
  },
  timeout: {
    category: 'timeout',
    userMessage: 'Operation timed out. Please try again.',
    technicalMessage: 'Request timeout exceeded',
    canRetry: true,
    recoveryAction: 'Retry with better connection',
    severity: 'medium'
  },
  unknown: {
    category: 'unknown',
    userMessage: 'Something went wrong. Please try again.',
    technicalMessage: 'Unexpected error occurred',
    canRetry: true,
    recoveryAction: 'Refresh and retry',
    severity: 'medium'
  }
};

// === SUCCESS STATE CONFIGURATION ===

export interface SuccessState {
  readonly message: string;
  readonly actionText: string;
  readonly actionEnabled: boolean;
  readonly showConfetti: boolean;
  readonly nextSteps: readonly string[];
}

export const SUCCESS_STATES = {
  TRIP_SAVED: {
    message: 'Your trip has been saved successfully!',
    actionText: 'View Full Trip →',
    actionEnabled: true,
    showConfetti: true,
    nextSteps: [
      'View your detailed itinerary',
      'Explore destination on map',
      'Share your trip with friends'
    ]
  },
  TRIP_GENERATED: {
    message: 'Your personalized trip is ready!',
    actionText: 'Continue to Planning →',
    actionEnabled: true,
    showConfetti: false,
    nextSteps: [
      'Review your itinerary',
      'Make any adjustments',
      'Save your trip'
    ]
  }
};

// === UX STATE MANAGEMENT ===

export interface UXState {
  readonly loading: LoadingState | null;
  readonly error: ErrorInfo | null;
  readonly success: SuccessState | null;
  readonly canProceed: boolean;
  readonly canRetry: boolean;
  readonly canCancel: boolean;
}

// === HELPER FUNCTIONS ===

export function categorizeError(error: any): ErrorInfo {
  if (!error) {
    return ERROR_CATEGORIES.unknown;
  }

  // Network errors
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('network')) {
    return ERROR_CATEGORIES.network;
  }

  // Database errors
  if (error.code === 'DATABASE_ERROR' || error.message?.includes('database')) {
    return ERROR_CATEGORIES.database;
  }

  // Authentication errors
  if (error.code === 'AUTH_ERROR' || error.message?.includes('auth')) {
    return ERROR_CATEGORIES.authentication;
  }

  // Timeout errors
  if (error.code === 'TIMEOUT' || error.message?.includes('timeout')) {
    return ERROR_CATEGORIES.timeout;
  }

  // Validation errors
  if (error.code === 'VALIDATION_ERROR' || error.message?.includes('validation')) {
    return ERROR_CATEGORIES.validation;
  }

  return ERROR_CATEGORIES.unknown;
}

export function getLoadingState(stage: TripGenerationState['stage']): LoadingState | null {
  switch (stage) {
    case 'validating':
      return LOADING_STATES.VALIDATING;
    case 'saving':
      return LOADING_STATES.SAVING;
    case 'saved':
      return null; // No loading when saved
    case 'failed':
      return null; // No loading when failed
    default:
      return null;
  }
}

export function getSuccessState(stage: TripGenerationState['stage']): SuccessState | null {
  switch (stage) {
    case 'saved':
      return SUCCESS_STATES.TRIP_SAVED;
    default:
      return null;
  }
}

export function createUXState(
  tripGenerationState: TripGenerationState,
  error?: any
): UXState {
  const loading = getLoadingState(tripGenerationState.stage);
  const success = getSuccessState(tripGenerationState.stage);
  const errorInfo = error ? categorizeError(error) : null;

  return {
    loading,
    error: errorInfo,
    success,
    canProceed: tripGenerationState.canNavigate,
    canRetry: errorInfo?.canRetry ?? false,
    canCancel: loading?.canCancel ?? false
  };
}

// === PROGRESS CALCULATION ===

export function calculateProgress(
  stage: TripGenerationState['stage'],
  startTime?: number,
  currentTime?: number
): number {
  if (!startTime || !currentTime) return 0;

  const loadingState = getLoadingState(stage);
  if (!loadingState) return stage === 'saved' ? 100 : 0;

  const elapsed = currentTime - startTime;
  const estimated = loadingState.estimatedDuration || 3000;
  const stageProgress = loadingState.progress;

  // Calculate progress within current stage
  const stageElapsedProgress = Math.min((elapsed / estimated) * 30, 30); // Max 30% per stage
  
  return Math.min(stageProgress + stageElapsedProgress, 95); // Max 95% until completion
}

// === RETRY LOGIC ===

export function shouldRetry(error: ErrorInfo, retryCount: number): boolean {
  if (!error.canRetry) return false;
  if (retryCount >= 3) return false; // Max 3 retries
  if (error.severity === 'critical') return false;
  
  return true;
}

export function getRetryDelay(retryCount: number): number {
  // Exponential backoff: 1s, 2s, 4s
  return Math.min(1000 * Math.pow(2, retryCount), 4000);
}
