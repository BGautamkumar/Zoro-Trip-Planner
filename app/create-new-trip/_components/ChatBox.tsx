"use client"

import { Button } from '@/components/ui/button'
import { Send, Loader2, Sparkles } from 'lucide-react'
import axios from 'axios'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
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
    ChatBoxProps,
    AIModelResponse,
} from '@/lib/application-types';
import {
    createUXState,
} from '@/lib/ux-reliability';
import { ReliableFeedback } from '@/components/ui/reliable-feedback';
import { TravelModeSelector, getTravelModePromptHint, type TravelMode } from '@/components/trip/TravelModeSelector';

// ── Typing indicator component ──
function TypingIndicator() {
    return (
        <div className="flex items-start gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep to-ocean flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-ocean rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-ocean rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-ocean rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}

function ChatBox({ onGenerationStart, viewMode = 'chat' }: ChatBoxProps) {
    const [messages, setMessages] = useState<ApplicationMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isFinal, setIsFinal] = useState<boolean>(false);
    const [savedTripId, setSavedTripId] = useState<string>('');
    const [retryCount, setRetryCount] = useState<number>(0);
    const [operationStartTime, setOperationStartTime] = useState<number>(Date.now());
    const [streamingText, setStreamingText] = useState<string>('');
    const [travelMode, setTravelMode] = useState<TravelMode | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [generationState, setGenerationState] = useState<TripGenerationState>({
        stage: 'idle',
        tripId: null,
        isProcessing: false,
        error: null,
        canNavigate: false
    });

    const uxState = useMemo(() => createUXState(generationState, generationState.error), [generationState, generationState.error]);

    const updateGenerationState = useCallback((updates: Partial<TripGenerationState>) => {
        setGenerationState(prev => {
            const newState = { ...prev, ...updates };
            if (newState.stage === 'saved' && newState.tripId && !newState.isProcessing) {
                return { ...newState, canNavigate: true };
            }
            return { ...newState, canNavigate: false };
        });
    }, []);

    const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
    const { userDetail } = useUserDetail();
    const router = useRouter();
    const { setTripDetailInfo } = useTripDetail();

    const canNavigateToTrip = generationState.canNavigate;

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading, streamingText]);

    // Auto-resize textarea
    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    };

    // Handle Enter key (without shift)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    /**
     * Stream the final trip generation using SSE
     * Optimizations:
     * - Weather is pre-fetched in parallel with LLM generation (P8)
     * - Convex save + image batch prefetch run concurrently (P9)
     */
    const streamFinalGeneration = async (allMessages: ApplicationMessage[]) => {
        const t0 = Date.now();
        onGenerationStart?.();

        updateGenerationState({
            stage: 'validating',
            isProcessing: true,
            error: null,
            canNavigate: false
        });

        setStreamingText('');

        try {
            // Inject travel mode hint
            const messagesWithMode = travelMode
                ? [
                    ...allMessages,
                    {
                        id: 'travel-mode-context',
                        role: 'user' as const,
                        content: `[Travel Style: ${travelMode}. ${getTravelModePromptHint(travelMode)}]`,
                        timestamp: Date.now()
                    }
                  ]
                : allMessages;

            // ── P8: Extract destination + days from conversation, prefetch weather ──
            // Runs concurrently with the LLM stream — free parallelism
            const conversationText = allMessages.map(m => m.content).join(' ');
            const destinationMatch = conversationText.match(
                /(?:to|destination[:\s]+|visiting|going to)\s+([A-Z][a-zA-Z\s,]+?)(?:\s+from|\s+for|\s+on|[.,!?]|$)/i
            );
            const daysMatch = conversationText.match(/(\d+)\s*(?:days?|nights?)/i);
            const extractedDestination = destinationMatch?.[1]?.trim();
            const extractedDays = daysMatch ? parseInt(daysMatch[1], 10) : 5;

            // Fire weather prefetch in background (non-blocking)
            if (extractedDestination) {
                fetch(`/api/weather?destination=${encodeURIComponent(extractedDestination)}&days=${extractedDays}`)
                    .catch(() => { /* Silently ignore — weather is non-critical */ });
            }

            // ── Primary: call the stream route (which internally uses parallel LLM) ──
            const response = await fetch('/api/aimodel/stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messagesWithMode }),
            });

            if (!response.ok) {
                throw new Error(`Stream request failed: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No response body');

            const decoder = new TextDecoder();
            let fullContent = '';
            let parsedResult: any = null;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value, { stream: true });
                const lines = text.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.error) {
                                throw new Error(data.error);
                            }

                            if (data.chunk) {
                                fullContent = data.partial || (fullContent + data.chunk);
                                setStreamingText(fullContent);
                            }

                            if (data.done) {
                                if (data.result) {
                                    parsedResult = data.result;
                                } else if (data.raw) {
                                    // Fallback: server sent raw string — try to parse it
                                    try { parsedResult = JSON.parse(data.raw); } catch { /* will retry below */ }
                                }
                                if (data.elapsed) {
                                    console.log(`[ChatBox] LLM generation done in ${data.elapsed}ms via ${data.method}`);
                                }
                            }
                        } catch (parseErr: any) {
                            if (parseErr.message && !parseErr.message.includes('JSON')) {
                                throw parseErr;
                            }
                        }
                    }
                }
            }

            // Last-resort: try parsing fullContent directly
            if (!parsedResult && fullContent) {
                try {
                    parsedResult = JSON.parse(fullContent);
                } catch {
                    throw new Error('Failed to parse AI response');
                }
            }

            if (!parsedResult) {
                throw new Error('No trip data received from AI');
            }

            // Normalize: handle { trip_plan: { trip_plan: {...} } } over-nesting from some paths
            let tripPayload = parsedResult?.trip_plan ?? parsedResult;
            if (tripPayload?.trip_plan) tripPayload = tripPayload.trip_plan;

            // Validate and process
            const validatedTripData = validateAITripData(tripPayload);

            if (!validatedTripData || !userDetail?._id) {
                throw new Error('Invalid trip data or user not authenticated');
            }

            // Show the itinerary immediately
            setTripDetailInfo(validatedTripData);

            const tripId = generateTripId();

            updateGenerationState({
                stage: 'saving',
                isProcessing: true,
                error: null
            });

            // ── Fire weather prefetch (non-blocking, warms the cache for WeatherWidget) ──
            const destination = validatedTripData.destination;
            const totalDays = validatedTripData.itinerary?.length || extractedDays;
            if (destination) {
                fetch(`/api/weather?destination=${encodeURIComponent(destination)}&days=${totalDays}`)
                    .catch(() => { /* non-critical — WeatherWidget will fetch on its own */ });
            }

            // ── Await Convex save directly (same as original, reliable) ──────
            const saveResult = await SaveTripDetail({
                tripDetail: validatedTripData,
                tripId: tripId,
                uid: userDetail._id
            });

            if (!saveResult?.success) {
                throw new Error('Backend failed to confirm trip save');
            }

            console.log(`[ChatBox] Total generation + save: ${Date.now() - t0}ms`);

            updateGenerationState({
                stage: 'saved',
                tripId: tripId,
                isProcessing: false,
                error: null,
                canNavigate: true
            });

            setSavedTripId(tripId);


        } catch (error) {
            console.error('Failed to generate/save trip:', error);
            updateGenerationState({
                stage: 'failed',
                isProcessing: false,
                error: error instanceof Error ? error.message : 'Failed to generate trip',
                canNavigate: false
            });
        } finally {
            setIsFinal(false);
            setStreamingText('');
        }
    };


    const onSend = async () => {

        if (!userInput?.trim()) return;

        setLoading(true);
        const currentInput = userInput;
        setUserInput('');

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        const newMsg: ApplicationMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: currentInput,
            timestamp: Date.now()
        };

        const newMessages = [...messages, newMsg];
        setMessages(newMessages);

        if (isFinal) {
            setLoading(false);
            await streamFinalGeneration(newMessages);
            return;
        }

        try {
            const result = await axios.post<AIModelResponse>('/api/aimodel', {
                messages: newMessages,
                isFinal: false
            });

            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: result?.data?.resp,
                ui: result?.data?.ui,
                timestamp: Date.now()
            }]);
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: 'Sorry, something went wrong. Please try again.',
                timestamp: Date.now()
            }]);
        }

        setLoading(false);
    };

    const handleViewTrip = () => {
        if (!generationState.canNavigate) return;

        const navigationPath = createTripViewPath(generationState.tripId);
        if (navigationPath === '/create-new-trip') {
            router.push('/create-new-trip');
            return;
        }

        router.push(navigationPath);
    };

    const RenderGenerativeUi = (ui: string) => {
        if (ui == 'budget') {
            return <BudgetUi onSelectedOption={(v: string) => { setUserInput(v); setTimeout(() => onSend(), 50) }} />
        } else if (ui == 'groupSize') {
            return <GroupSizeUi onSelectedOption={(v: string) => { setUserInput(v); setTimeout(() => onSend(), 50) }} />
        } else if (ui == 'tripDuration') {
            return <SelectDaysUi onSelectedOption={(v: string) => { setUserInput(v); setTimeout(() => onSend(), 50) }} />
        } else if (ui == 'travelMode') {
            return <TravelModeSelector
                selectedMode={travelMode}
                onSelectMode={(mode) => {
                    setTravelMode(mode);
                    setUserInput(mode.charAt(0).toUpperCase() + mode.slice(1) + ' travel');
                    setTimeout(() => onSend(), 100);
                }}
            />;
        } else if (ui == 'final') {
            return <ReliableFeedback
                uxState={uxState}
                onRetry={() => {
                    setRetryCount(prev => prev + 1);
                    setOperationStartTime(Date.now());
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

    // ── Completed view mode ──
    if (viewMode === 'completed') {
        return (
            <div className='flex flex-col border shadow-sm rounded-2xl p-5 min-h-[400px] bg-white dark:bg-gray-900'>
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
                                    "mt-4 font-medium py-2.5 px-6 rounded-xl transition-all duration-300",
                                    canNavigateToTrip
                                        ? "bg-gradient-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white shadow-lg shadow-ocean/25 hover:shadow-xl hover:-translate-y-0.5"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
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

    // ── Main chat view ──
    return (
        <div className='flex flex-col min-h-[400px] max-h-[70vh]'>
            {/* Messages Area */}
            <section className='flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700'>
                {messages?.length == 0 && (
                    <div className="flex-1 flex flex-col justify-between min-h-[300px]">
                        <EmptyBoxState
                            onSelectOption={(v: string) => { setUserInput(v); setTimeout(() => onSend(), 50) }}
                        />
                    </div>
                )}

                {messages.map((msg: ApplicationMessage, index) => (
                    msg.role === 'user' ? (
                        // ── User message: right-aligned, deep blue ──
                        <div className='flex justify-end mt-3' key={msg.id || index}>
                            <div className='max-w-[80%] sm:max-w-lg bg-gradient-to-r from-deep to-deep-light text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-sm'>
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                        </div>
                    ) : (
                        // ── Assistant message: left-aligned, light bg, with avatar ──
                        <div className='flex items-start gap-3 mt-3' key={msg.id || index}>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep to-ocean flex items-center justify-center shrink-0 shadow-md">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className='max-w-[80%] sm:max-w-lg'>
                                <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                </div>
                                {msg.ui && (
                                    <div className="mt-2">
                                        {RenderGenerativeUi(msg.ui)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                ))}

                {loading && <TypingIndicator />}

                {/* Streaming progress indicator */}
                {streamingText && (
                    <div className="flex items-start gap-3 mt-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep to-ocean flex items-center justify-center shrink-0 shadow-md animate-pulse">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-ocean/5 dark:bg-ocean/10 border border-ocean/20 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%]">
                            <div className="flex items-center gap-2 text-sm text-ocean font-medium">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Crafting your itinerary...</span>
                            </div>
                            <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-deep to-ocean rounded-full animate-pulse" style={{ width: '60%' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </section>

            {/* Input Area */}
            <section className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <div className='flex items-end gap-3'>
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            placeholder='Type your message...'
                            className='w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ocean/30 focus:border-ocean transition-all placeholder:text-gray-400'
                            onChange={handleTextareaInput}
                            onKeyDown={handleKeyDown}
                            value={userInput}
                            rows={1}
                            style={{ minHeight: '44px', maxHeight: '120px' }}
                        />
                    </div>
                    <Button
                        size={'icon'}
                        onClick={() => onSend()}
                        disabled={!userInput?.trim() || loading}
                        className="h-11 w-11 rounded-xl bg-gradient-to-r from-deep to-ocean hover:from-deep-light hover:to-ocean-light text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                        {loading ? (
                            <Loader2 className='w-4 h-4 animate-spin' />
                        ) : (
                            <Send className='w-4 h-4' />
                        )}
                    </Button>
                </div>
            </section>
        </div>
    )
}
export default ChatBox
