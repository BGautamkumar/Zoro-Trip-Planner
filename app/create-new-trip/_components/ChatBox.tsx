"use client"

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader, Send } from 'lucide-react'
import axios from 'axios'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import EmptyBoxState from './EmptyBoxState'
import GroupSizeUi from './GroupSizeUi'
import BudgetUi from './BudgetUi'
import FinalUi from './FinalUi'
import SelectDaysUi from './SelectDaysUi'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useTripDetail, useUserDetail } from '@/app/Provider'
import { validateAITripData } from '@/lib/ai-data-validator';
import { createTripViewPath, generateTripId } from '@/lib/routing-utils';
import {
    ApplicationMessage,
    ApplicationTrip,
    TripGenerationState,
    TripGenerationStage,
    ChatBoxProps,
    ViewMode,
    AIModelRequest,
    AIModelResponse,
    CreateTripRequest,
    CreateTripResponse,
    isValidMessage,
    isValidTrip,
    isTripGenerationState
} from '@/lib/application-types';
import { validateContract } from '@/lib/contracts';
import {
    UXState,
    createUXState,
    categorizeError,
    shouldRetry,
    getRetryDelay
} from '@/lib/ux-reliability';
import { ReliableFeedback } from '@/components/ui/reliable-feedback';

function ChatBox({ onGenerationStart, viewMode = 'chat' }: ChatBoxProps) {
    // Production-grade state management with UX reliability
    const [messages, setMessages] = useState<ApplicationMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFinal, setIsFinal] = useState<boolean>(false);
    const [tripDetail, setTripDetail] = useState<ApplicationTrip | null>(null);
    const [savedTripId, setSavedTripId] = useState<string>('');
    const [retryCount, setRetryCount] = useState<number>(0);
    const [operationStartTime, setOperationStartTime] = useState<number>(Date.now());

    // Production-grade state machine for trip generation flow
    const [generationState, setGenerationState] = useState<TripGenerationState>({
        stage: 'idle',
        tripId: null,
        isProcessing: false,
        error: null,
        canNavigate: false
    });

    // Create UX state for reliable feedback
    const uxState = useMemo(() => createUXState(generationState, generationState.error), [generationState, generationState.error]);

    // Atomic state transition helper with type safety
    const updateGenerationState = useCallback((updates: Partial<TripGenerationState>) => {
        setGenerationState(prev => {
            const newState = { ...prev, ...updates };
            // Ensure canNavigate is only true when save is confirmed
            if (newState.stage === 'saved' && newState.tripId && !newState.isProcessing) {
                return { ...newState, canNavigate: true };
            }
            return { ...newState, canNavigate: false };
        });
    }, []);

    const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
    const { userDetail, setUserDetail } = useUserDetail();
    const router = useRouter();
    const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

    // Defensive navigation guard using production-grade state machine
    const canNavigateToTrip = generationState.canNavigate;

    const onSend = async () => {
        if (!userInput?.trim()) return;

        setLoading(true);
        setUserInput('');
        const newMsg: ApplicationMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: userInput,
            timestamp: Date.now()
        }

        setMessages((prev: ApplicationMessage[]) => [...prev, newMsg]);

        const result = await axios.post<AIModelResponse>('/api/aimodel', {
            messages: [...messages, newMsg],
            isFinal: isFinal
        });

        console.log("TRIP", result.data);

        !isFinal && setMessages((prev: ApplicationMessage[]) => [...prev, {
            id: crypto.randomUUID(), // Generate unique ID for assistant messages
            role: 'assistant',
            content: result?.data?.resp,
            ui: result?.data?.ui,
            timestamp: Date.now()
        }]);

        if (isFinal) {
            // Trigger generation start callback for UX flow
            onGenerationStart?.();

            // Start atomic generation flow
            updateGenerationState({
                stage: 'validating',
                isProcessing: true,
                error: null,
                canNavigate: false
            });

            try {
                // Validate and sanitize AI response
                const validatedTripData = validateAITripData(result?.data?.trip_plan);

                if (!validatedTripData || !userDetail?._id) {
                    throw new Error('Invalid trip data or user not authenticated');
                }

                // Update local state first
                setTripDetail(validatedTripData);
                setTripDetailInfo(validatedTripData);

                // Generate trip ID using production-grade utility
                const tripId = generateTripId();

                // Move to saving state
                updateGenerationState({
                    stage: 'saving',
                    isProcessing: true,
                    error: null
                });

                // Save to database with confirmation
                const saveResult = await SaveTripDetail({
                    tripDetail: validatedTripData,
                    tripId: tripId,
                    uid: userDetail._id
                });

                // Verify backend confirmed successful save
                if (!saveResult.success) {
                    throw new Error('Backend failed to confirm trip save');
                }

                // Atomic success state - all operations complete
                updateGenerationState({
                    stage: 'saved',
                    tripId: tripId,
                    isProcessing: false,
                    error: null,
                    canNavigate: true
                });

                // Update legacy state for compatibility
                setSavedTripId(tripId);

            } catch (error) {
                console.error('Failed to save trip:', error);
                updateGenerationState({
                    stage: 'failed',
                    isProcessing: false,
                    error: error instanceof Error ? error.message : 'Failed to save trip',
                    canNavigate: false
                });
            } finally {
                setIsFinal(false);
            }
        }

        setLoading(false);
    }

    const handleViewTrip = () => {
        // Use new state machine for navigation guard
        if (!generationState.canNavigate) {
            console.error('Navigation not ready - trip not saved yet');
            return;
        }

        // Generate safe navigation path
        const navigationPath = createTripViewPath(generationState.tripId);
        if (navigationPath === '/create-new-trip') {
            console.error('Invalid navigation path - falling back to safe route');
            router.push('/create-new-trip');
            return;
        }

        // All checks passed - safe to navigate
        router.push(navigationPath);
    };

    const RenderGenerativeUi = (ui: string) => {
        if (ui == 'budget') {
            //Budget UI Component
            return <BudgetUi onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
        } else if (ui == 'groupSize') {
            //Group Size UI Component
            return <GroupSizeUi onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
        } else if (ui == 'tripDuration') {
            //Select Days Ui Component
            return <SelectDaysUi onSelectedOption={(v: string) => { setUserInput(v); onSend() }} />
        } else if (ui == 'final') {
            //Final Ui Component - Show production-grade reliable feedback
            return <ReliableFeedback
                uxState={uxState}
                onRetry={() => {
                    setRetryCount(prev => prev + 1);
                    // Reset operation start time for retry
                    setOperationStartTime(Date.now());
                    // Retry the entire operation
                    onSend();
                }}
                onAction={handleViewTrip}
                retryCount={retryCount}
                startTime={operationStartTime}
            />;
        }
        return null
    }

    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.ui == 'final') {
            setIsFinal(true);
            setUserInput('Ok, Great!');
            setTimeout(() => {
                onSend();
            }, 100);
        }
    }, [messages])

    // In completed mode, show summary instead of full chat
    if (viewMode === 'completed') {
        return (
            <div className='flex flex-col border shadow rounded-2xl p-4 min-h-[400px]'>
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Trip Planning Complete!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your personalized itinerary is ready. Explore your trip in the workspace.
                        </p>
                        {savedTripId && (
                            <button
                                onClick={handleViewTrip}
                                disabled={!canNavigateToTrip}
                                className={cn(
                                    "mt-4 font-medium py-2 px-6 rounded-lg transition-colors",
                                    canNavigateToTrip
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                )}
                            >
                                {canNavigateToTrip ? 'View Full Trip →' : 'Processing...'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col border shadow rounded-2xl p-4 min-h-[400px]'>
            {/* Display Messages */}
            <section className='flex-1 flex flex-col min-h-0 overflow-auto'>
                {messages?.length == 0 && (
                    <div className="flex-1 flex flex-col justify-between min-h-[300px]">
                        <EmptyBoxState
                            onSelectOption={(v: string) => { setUserInput(v); onSend() }}
                        />
                    </div>
                )}
                {messages.map((msg: ApplicationMessage, index) => (
                    msg.role == 'user' ?
                        <div className='flex justify-end mt-2' key={index}>
                            <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                                {msg.content}
                            </div>
                        </div> :
                        <div className='flex justify-start mt-2' key={index}>
                            <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                                {msg.content}
                                {RenderGenerativeUi(msg.ui ?? '')}
                            </div>
                        </div>
                ))}
                {loading && (
                    <div className='flex justify-start mt-2'>
                        <div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
                            <Loader className='animate-spin' />
                        </div>
                    </div>
                )}
            </section>
            {/* User Input */}
            <section className="mt-auto">
                <div className='w-full border rounded-2xl p-4 relative'>
                    <Textarea placeholder='Start typing here...'
                        className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
                        onChange={(event) => setUserInput(event.target.value)}
                        value={userInput}
                    />
                    <Button size={'icon'} className='absolute bottom-6 right-6' onClick={() => onSend()}>
                        <Send className='w-4 h-4' />
                    </Button>
                </div>
            </section>
        </div>
    )
}
export default ChatBox
