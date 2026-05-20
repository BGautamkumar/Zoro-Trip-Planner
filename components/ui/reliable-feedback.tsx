/**
 * Production-grade reliable feedback components
 * Trustworthy UX with backend-synchronized states
 */

import React from 'react';
import { Loader, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { 
  UXState, 
  LoadingState, 
  ErrorInfo, 
  SuccessState,
  shouldRetry,
  getRetryDelay 
} from '@/lib/ux-reliability';

interface ReliableFeedbackProps {
  uxState: UXState;
  onRetry?: () => void;
  onCancel?: () => void;
  onAction?: () => void;
  retryCount?: number;
  startTime?: number;
}

export function ReliableFeedback({
  uxState,
  onRetry,
  onCancel,
  onAction,
  retryCount = 0,
  startTime
}: ReliableFeedbackProps) {
  const progress = React.useMemo(() => {
    if (!uxState.loading || !startTime) return 0;
    
    const elapsed = Date.now() - startTime;
    const estimated = uxState.loading.estimatedDuration || 3000;
    const stageProgress = uxState.loading.progress;
    
    const stageElapsedProgress = Math.min((elapsed / estimated) * 30, 30);
    return Math.min(stageProgress + stageElapsedProgress, 95);
  }, [uxState.loading, startTime]);

  if (uxState.loading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Loader className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
            {uxState.loading.stage !== 'saving' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {uxState.loading.message}
            </h3>
            
            {/* Progress Bar */}
            <div className="w-full bg-blue-100 dark:bg-blue-800 rounded-full h-2 mb-3">
              <div 
                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Stage Indicators */}
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <div className={cn(
                "w-2 h-2 rounded-full",
                progress >= 20 ? "bg-blue-600" : "bg-blue-200"
              )} />
              <div className={cn(
                "w-2 h-2 rounded-full",
                progress >= 60 ? "bg-blue-600" : "bg-blue-200"
              )} />
              <div className={cn(
                "w-2 h-2 rounded-full",
                progress >= 90 ? "bg-blue-600" : "bg-blue-200"
              )} />
            </div>
            
            {uxState.loading.canCancel && onCancel && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCancel}
                className="mt-3"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (uxState.error) {
    const canRetry = shouldRetry(uxState.error, retryCount);
    
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shrink-0 mt-1">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              {uxState.error.severity === 'critical' ? 'Critical Error' : 'Something Went Wrong'}
            </h3>
            
            <p className="text-red-700 dark:text-red-300 mb-4">
              {uxState.error.userMessage}
            </p>
            
            {/* Error Details */}
            <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 mb-4">
              <div className="text-sm text-red-800 dark:text-red-200">
                <div className="font-medium mb-1">What happened:</div>
                <div className="text-red-600 dark:text-red-300">
                  {uxState.error.technicalMessage}
                </div>
                
                {uxState.error.recoveryAction && (
                  <div className="flex flex-col gap-2">
                    <div className="font-medium mt-2">Recommended action:</div>
                    <div className="text-red-600 dark:text-red-300">
                      {uxState.error.recoveryAction}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {canRetry && onRetry && (
                <Button 
                  onClick={onRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                  {retryCount > 0 && (
                    <span className="text-sm opacity-75">({retryCount + 1})</span>
                  )}
                </Button>
              )}
              
              {!canRetry && (
                <Button 
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (uxState.success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              {uxState.success.message}
            </h3>
            
            {/* Next Steps */}
            {uxState.success.nextSteps.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  What you can do next:
                </div>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  {uxState.success.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Action Button */}
            {uxState.success.actionEnabled && onAction && (
              <Button 
                onClick={onAction}
                className="flex items-center gap-2"
              >
                {uxState.success.actionText}
              </Button>
            )}
          </div>
        </div>
        
        {/* Confetti Effect */}
        {uxState.success.showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2">
              <div className="animate-bounce">
                <div className="text-4xl">🎉</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default/Idle state
  return null;
}

// === SPECIALIZED FEEDBACK COMPONENTS ===

export function LoadingFeedback({ 
  loading, 
  progress 
}: { 
  loading: LoadingState; 
  progress?: number; 
}) {
  return (
    <div className="flex items-center gap-3 p-4">
      <Loader className="w-5 h-5 text-blue-600 animate-spin" />
      <span className="text-blue-700 dark:text-blue-300">
        {loading.message}
      </span>
      {progress !== undefined && (
        <span className="text-blue-600 dark:text-blue-400 text-sm">
          ({Math.round(progress)}%)
        </span>
      )}
    </div>
  );
}

export function ErrorFeedback({ 
  error, 
  onRetry, 
  retryCount = 0 
}: { 
  error: ErrorInfo; 
  onRetry?: () => void; 
  retryCount?: number; 
}) {
  const canRetry = shouldRetry(error, retryCount);
  
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="font-medium text-red-800 dark:text-red-200 mb-1">
            {error.userMessage}
          </div>
          {canRetry && onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
              {retryCount > 0 && <span className="text-sm">({retryCount + 1})</span>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function SuccessFeedback({ 
  success, 
  onAction 
}: { 
  success: SuccessState; 
  onAction?: () => void; 
}) {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
        <div className="flex-1">
          <div className="font-medium text-green-800 dark:text-green-200 mb-1">
            {success.message}
          </div>
          {success.actionEnabled && onAction && (
            <Button 
              size="sm" 
              onClick={onAction}
              className="mt-2"
            >
              {success.actionText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
