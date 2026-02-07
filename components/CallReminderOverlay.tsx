import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";

export default function CallReminderOverlay() {
    const { user, mounted } = useUser();
    const router = useRouter();
    const [upcomingCall, setUpcomingCall] = useState<any>(null);
    const [interactedKeys, setInteractedKeys] = useState<Set<string>>(new Set());
    const [conflictInfo, setConflictInfo] = useState<any>(null);
    const [debugForce, setDebugForce] = useState(false);
    const [lastPlayedId, setLastPlayedId] = useState<string | null>(null);
    const [isExiting, setIsExiting] = useState(false);
    
    // Auto-dismiss timer ref
    const [storageLoaded, setStorageLoaded] = useState(false);
    
    // Auto-dismiss timer ref
    const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);

    // active call flag state
    const [isCallingActive, setIsCallingActive] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const checkActive = () => {
                const active = localStorage.getItem('app_is_calling_active') === 'true';
                setIsCallingActive(active);
            };
            
            checkActive();
            window.addEventListener('app_call_state_change', checkActive);
            window.addEventListener('storage', checkActive);
            
            return () => {
                window.removeEventListener('app_call_state_change', checkActive);
                window.removeEventListener('storage', checkActive);
            };
        }
    }, []);

    // Initial position to right side (below header)
    const [position, setPosition] = useState({ x: 2000, y: 85 }); // Start far right
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number, startY: number, initialX: number, initialY: number } | null>(null);

    // Load interacted keys from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined" && mounted) {
            try {
                const stored = localStorage.getItem('tfc_interacted_reminders');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    const now = Date.now();
                    const filtered = Object.keys(parsed).reduce((acc: any, key: string) => {
                        if (now - parsed[key] < 24 * 60 * 60 * 1000) {
                            acc[key] = parsed[key];
                        }
                        return acc;
                    }, {});
                    
                    localStorage.setItem('tfc_interacted_reminders', JSON.stringify(filtered));
                    setInteractedKeys(new Set(Object.keys(filtered)));
                }
            } catch (e) {
                console.error("Error loading reminders from localStorage", e);
            } finally {
                setStorageLoaded(true);
            }
        }
    }, [mounted]);

    const saveInteractedKey = useCallback((callId: string, timestamp: string) => {
        const key = `${callId}_${timestamp}`;
        setInteractedKeys(prev => {
            const next = new Set(prev).add(key);
            try {
                const stored = localStorage.getItem('tfc_interacted_reminders');
                const parsed = stored ? JSON.parse(stored) : {};
                parsed[key] = Date.now();
                localStorage.setItem('tfc_interacted_reminders', JSON.stringify(parsed));
            } catch (e) {
                console.error("Error saving to localStorage", e);
            }
            return next;
        });
    }, []);

    // Check for debug force param on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.location.search.includes('show_reminder_debug=true')) {
                console.log("🛠️ [Reminder-Debug] Manual debug force enabled via URL.");
                setDebugForce(true);
            }
        }
    }, []);

    // Set real initial position on mount
    useEffect(() => {
        if (typeof window !== "undefined" && mounted) {
            const startX = window.innerWidth - 280;
            setPosition({ x: startX, y: 85 });
        }
    }, [mounted]);

    // Ref to ignore recently acted-upon calls immediately (prevents flicker return)
    const ignoreRef = useRef<Set<string>>(new Set());

    const handleDismiss = useCallback(() => {
        if (!upcomingCall?.id) return;
        
        // Immediate ignore
        ignoreRef.current.add(upcomingCall.id);
        
        setIsExiting(true);
        saveInteractedKey(upcomingCall.id, upcomingCall.next_called_at);
        
        if (audioInstanceRef.current) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.currentTime = 0;
        }
        
        setTimeout(() => {
            setUpcomingCall(null);
            setIsExiting(false);
        }, 700);
    }, [upcomingCall?.id, saveInteractedKey]);

    // Display timer ref for 3-minute logic
    const displayStartedAtRef = useRef<number | null>(null);

    const skipReminder = useCallback(async (call: any, reason: 'timeout' | 'missed') => {
        saveInteractedKey(call.id, call.next_called_at);
        
        // Insert into notifications
        const userId = user?.uid || (user as any)?.user_id;
        if (!userId) return;

        try {
           await supabase.from('notifications').insert({
               user_id: userId,
               type: 'skipped_reminder',
               message: `Missed call reminder for ${call.customer_name} (${new Date(call.next_called_at).toLocaleTimeString()})`,
               created_at: new Date().toISOString(), 
               is_seen: false,
               metadata: {
                   customer_id: call.id,
                   campaign_id: call.campaign_id,
                   reason: reason
               }
           });
        } catch(e) {
            console.error("Failed to insert notification", e);
        }
    }, [saveInteractedKey, user]);

    const checkUpcomingCalls = useCallback(async () => {
        if (!storageLoaded) return;
        
        const userId = user?.uid || (user as any)?.user_id;
        if (!userId) return;

        const now = new Date();
        const windowStart = new Date(now.getTime() - 60 * 60 * 1000); // Check past 1 hour for missed
        const windowEnd = new Date(now.getTime() + 2 * 60000); // Check 2 mins future

        try {
            const { data, error } = await supabase
                .from('customers')
                .select(`
                    id, 
                    customer_name, 
                    phone_no, 
                    next_called_at, 
                    campaign_id, 
                    disposition, 
                    sub_disposition, 
                    notes, 
                    outcome,
                    expiry_date
                `)
                .or(`managed_by.eq.${userId},assigned_to.eq.${userId}`)
                .eq('disposition', 'Call Back') // Changed ilike to eq for performance if schema matches
                .gte('next_called_at', windowStart.toISOString())
                .lte('next_called_at', windowEnd.toISOString())
                .order('next_called_at', { ascending: true })
                .limit(10); // Fetch more to analyze queue

            if (error) throw error;

            if (data && data.length > 0) {
                const nowMs = Date.now();
                let nextToDisplay = null;
                
                // Process Queue
                for (const call of data) {
                    const callTime = new Date(call.next_called_at).getTime();
                    const compositeKey = `${call.id}_${call.next_called_at}`;

                    // 1. Skip if already handled OR in ignore ref
                    if (interactedKeys.has(compositeKey) || ignoreRef.current.has(call.id)) continue;

                    // 2. Check for Missed/Expired (Older than 2 mins ago)
                    // We allow a small buffer (e.g., if it was due 1 min ago, it's still "Active" and Urgent)
                    // But if it was due > 5 mins ago and we just opened the app, we probably want to skip it?
                    // User said: "check kro... agr time nikal chuka hai to unhe skip kro"
                    // Let's define "Expired" as > 1 minute past due AND not currently shown.
                    // Actually, let's stick to the prompt: "3 min badh check... if time passed, skip"
                    
                    // Simple Rule:
                    // If (callTime < now - 30 seconds) -> Missed -> Skip
                    // This aggressively clears backlog so only future/current calls show up.
                    if (callTime < nowMs - 30 * 1000) {
                        // It's too old (Wait time over)
                         // Only skip if it's NOT the current one (prevent auto-closing active one instantly if simple lag)
                         if (upcomingCall?.id !== call.id) {
                             skipReminder(call, 'missed'); // Log as missed notification
                             continue; // Don't show in popup
                         }
                    }

                    // This is a valid candidate
                    if (!nextToDisplay) nextToDisplay = call;
                }

                if (!nextToDisplay) {
                     // No valid calls left
                     if (upcomingCall && !isExiting) {
                         // Keep current or let it expire naturally by 5 min timer
                     } else {
                         setUpcomingCall(null);
                     }
                     return;
                }

                
                // LOGIC: Should we switch?
                
                // Case A: No current call -> Show Next
                if (!upcomingCall) {
                    let campaignName = "Active Campaign"; // Fetch logic simplified for brevity or could fetch below
                    if (nextToDisplay.campaign_id) {
                        const { data: campData } = await supabase.from('campaigns').select('name').eq('id', nextToDisplay.campaign_id).maybeSingle();
                        if (campData?.name) campaignName = campData.name;
                    }
                    const enriched = { ...nextToDisplay, campaign_name: campaignName };
                    
                    setUpcomingCall(enriched);
                    displayStartedAtRef.current = Date.now();
                    return;
                }

                // Case B: Current call exists...
                if (upcomingCall.id === nextToDisplay.id) {
                    // Update current data if needed, or just do nothing
                    return;
                }

                // Case C: Current call is different from Next Candidate
                // This means Next Candidate is MORE URGENT or Current is finished/skipped
                
                // Check 3-Minute Rule
                if (displayStartedAtRef.current && (nowMs - displayStartedAtRef.current > 3 * 60 * 1000)) {
                    // 3 Minutes have passed!
                    // Is "nextToDisplay" urgent? (Due within next 2 mins)
                    const nextTime = new Date(nextToDisplay.next_called_at).getTime();
                    // We already filtered query by lte(now + 2 min), so it IS urgent.
                    
                    // SWAP!
                    console.log("Create Swap: 3 mins passed, swapping for urgent call", nextToDisplay.customer_name);
                    
                    // 1. Mark current as skipped/timeout
                    skipReminder(upcomingCall, 'timeout');
                    ignoreRef.current.add(upcomingCall.id); // Add current to ignore list so it doesn't bounce back
                    
                    // 2. Exit current
                    setIsExiting(true);
                    
                    // 3. Prep next
                    let campaignName = "Active Campaign";
                    if (nextToDisplay.campaign_id) {
                        const { data: campData } = await supabase.from('campaigns').select('name').eq('id', nextToDisplay.campaign_id).maybeSingle();
                        if (campData?.name) campaignName = campData.name;
                    }
                    const enriched = { ...nextToDisplay, campaign_name: campaignName };

                    setTimeout(() => {
                        setUpcomingCall(enriched);
                        displayStartedAtRef.current = Date.now(); 
                        setIsExiting(false);
                    }, 700);

                } else {
                    // Less than 3 minutes passed.
                    // Keep current one.
                    // The "nextToDisplay" will wait in queue until 3 mins pass OR user dismisses current.
                }

            } else {
                // No data found
                if (upcomingCall && !data?.find((c: any) => c.id === upcomingCall.id)) {
                     // Current call is no longer in valid list (e.g. date changed elsewhere), dismiss?
                     // Or just let it stay until timeout. Let's let it stay.
                }
            }
        } catch (err) {
            console.error("[Reminder-Debug] Error:", err);
        }
    }, [user, interactedKeys, upcomingCall, isExiting, saveInteractedKey, storageLoaded, skipReminder]);

    useEffect(() => {
        if (!mounted || !storageLoaded) return;
        
        checkUpcomingCalls();
        const interval = setInterval(checkUpcomingCalls, 10000); // Check every 10s for smoother queue handling
        return () => clearInterval(interval);
    }, [mounted, checkUpcomingCalls, storageLoaded]);

    // Auto-dismiss after 5 minutes
    useEffect(() => {
        if (upcomingCall?.id) {
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
            dismissTimerRef.current = setTimeout(() => {
                handleDismiss();
            }, 5 * 60 * 1000); // 5 minutes
        }
        return () => {
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        };
    }, [upcomingCall?.id, handleDismiss]);

    // Persistent Audio Management
    const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
    const lastRungIdRef = useRef<string | null>(null);
    const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize audio once
    useEffect(() => {
        if (typeof window !== "undefined" && !audioInstanceRef.current) {
            audioInstanceRef.current = new Audio();
            audioInstanceRef.current.volume = 0.6;
            audioInstanceRef.current.loop = true; // Loop sound until dismissed
        }
    }, []);

    // Master Audio Sync Logic
    useEffect(() => {
        if (!audioInstanceRef.current) return;

        // Clear any existing timeout on every effect run
        if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);

        const activeId = upcomingCall?.id;

        // STOP condition: No call active or popup is sliding out
        if (!activeId || isExiting) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.currentTime = 0;
            audioInstanceRef.current.src = ""; // Clear source
            return;
        }

        // PLAY condition: New ID arrives
        if (activeId !== lastRungIdRef.current) {
            audioInstanceRef.current.src = `https://assets.mixkit.co/active_storage/sfx/1354/1354-preview.mp3?v=${activeId}`;
            audioInstanceRef.current.loop = true; // Re-enforce loop on new source
            
            // Fallback: Manually restart if loop fails
            audioInstanceRef.current.onended = () => {
                if (audioInstanceRef.current && upcomingCall?.id === activeId && !isExiting) {
                    audioInstanceRef.current.play().catch(() => {});
                }
            };

            // Auto-trigger sound 1 second after popup shows
            playTimeoutRef.current = setTimeout(() => {
                // Final safety check: Popup must still be visible and NOT exiting
                if (upcomingCall?.id === activeId && !isExiting && audioInstanceRef.current) {
                    audioInstanceRef.current.play()
                        .then(() => {
                            lastRungIdRef.current = activeId;
                        })
                        .catch(err => {
                            console.log("[Reminder-Audio] Playback attempt:", err.name);
                        });
                }
            }, 1000);
        }

        return () => {
            if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
        };
    }, [upcomingCall?.id, isExiting]);

    // Drag handlers
    const onMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y
        };
    };

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dragRef.current) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            setPosition({
                x: dragRef.current.initialX + dx,
                y: dragRef.current.initialY + dy
            });
        };

        const onMouseUp = () => {
            setIsDragging(false);
            dragRef.current = null;
        };

        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging, position]);

    const handleCallNow = () => {
        if (!upcomingCall) return;
        
        // Immediate ignore
        ignoreRef.current.add(upcomingCall.id);

        if (audioInstanceRef.current) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.currentTime = 0;
        }

        setUpcomingCall(null);
        // Just navigate to profile, do not auto-dial here.
        // User said: "call open krne pr call place nahi krni sirf profile show krna hai"
        router.push(`/campaign/${upcomingCall.campaign_id}/${upcomingCall.id}`);
    };

    const handleSnooze = async (minutes: number) => {
        if (!upcomingCall) return;
        const newTimeDate = new Date(new Date().getTime() + minutes * 60000);
        const newTimeIso = newTimeDate.toISOString();

        try {
            const startOfMinute = new Date(newTimeDate);
            startOfMinute.setSeconds(0, 0);
            const endOfMinute = new Date(newTimeDate);
            endOfMinute.setSeconds(59, 999);

            const { data: conflicts } = await supabase
                .from('customers')
                .select('id, customer_name, next_called_at')
                .or(`managed_by.eq.${user?.uid},assigned_to.eq.${user?.uid}`)
                .eq('disposition', 'Call Back')
                .gte('next_called_at', startOfMinute.toISOString())
                .lte('next_called_at', endOfMinute.toISOString())
                .neq('id', upcomingCall.id);

            if (conflicts && conflicts.length > 0) {
                setConflictInfo({
                   time: newTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                   customer: conflicts[0].customer_name,
                   minutes: minutes
                });
                return;
            }

            await supabase.from('customers').update({ next_called_at: newTimeIso }).eq('id', upcomingCall.id);
            
            // Exit animation and Mark as seen
            setIsExiting(true);
            saveInteractedKey(upcomingCall.id, upcomingCall.next_called_at);
            setConflictInfo(null);
            if (audioInstanceRef.current) {
                audioInstanceRef.current.pause();
                audioInstanceRef.current.currentTime = 0;
            }

            setTimeout(() => {
                setUpcomingCall(null);
                setIsExiting(false);
            }, 700);

        } catch (err) { console.error(err); }
    };

    // Mobile Swipe Logic
    const [swipeX, setSwipeX] = useState(0);
    const swipeXRef = useRef(0); // Ref to track latest value for event listeners
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const checkMobile = () => setIsMobile(window.innerWidth < 768);
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, []);

    const onSwipeStart = (e: React.TouchEvent | React.MouseEvent) => {
        // Only allow swipe on the thumb
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        dragRef.current = {
            startX: clientX,
            startY: 0,
            initialX: 0, // Not used for swipeX logic directly but kept for type compat
            initialY: 0
        };
        console.log('🎯 Swipe Start at X:', clientX);
    };

    const onSwipeMove = (e: TouchEvent | MouseEvent) => {
        if (!isDragging || !dragRef.current) return;
        
        // Prevent default touch behavior (scrolling)
        if ('touches' in e) {
            e.preventDefault();
        }
        
        const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
        const diff = clientX - dragRef.current.startX;
        
        console.log('👆 Swipe Move - Current X:', clientX, 'Diff:', diff);
        
        // Limit swipe range
        if (diff > -140 && diff < 140) {
            setSwipeX(diff);
            swipeXRef.current = diff; // Update ref for listeners
        }
    };

    const onSwipeEnd = () => {
        setIsDragging(false);
        const currentX = swipeXRef.current; // Read from ref
        console.log('🏁 Swipe End at X:', currentX);

        if (currentX > 80) {
            // Right Swipe - Open Profile (Call)
            handleCallNow();
        } else if (currentX < -80) {
            // Left Swipe - Dismiss
            handleDismiss();
        }
        
        // Reset
        setSwipeX(0);
        swipeXRef.current = 0;
        dragRef.current = null;
    };

    useEffect(() => {
        if (isDragging && isMobile) {
            // Use passive: false to allow preventDefault in touchmove
            window.addEventListener('touchmove', onSwipeMove as any, { passive: false });
            window.addEventListener('touchend', onSwipeEnd);
            window.addEventListener('mousemove', onSwipeMove);
            window.addEventListener('mouseup', onSwipeEnd);
        }
        return () => {
            window.removeEventListener('touchmove', onSwipeMove as any);
            window.removeEventListener('touchend', onSwipeEnd);
            window.removeEventListener('mousemove', onSwipeMove);
            window.removeEventListener('mouseup', onSwipeEnd);
        };
    }, [isDragging, isMobile]); // Removed swipeX from dependencies


    if (!upcomingCall && !debugForce) return null;

    // Use dummy data if debugForce is on but no real call exists
    const displayCall = upcomingCall || {
        id: "debug-id",
        customer_name: "John Doe (Debug)",
        campaign_name: "Sample Campaign",
        disposition: "Call Back",
        sub_disposition: "Interested",
        outcome: "Success",
        next_called_at: new Date().toISOString(),
        notes: "This is a debug overlay for visual testing.",
        campaigns: { name: "Sample Campaign" }
    };



    // We only use isCallingActive now (from localStorage), not route-based busy detection
    console.log('🔍 Call Status Debug:', {
        isCallingActive,
        displayCallId: displayCall.id,
        debugForce,
        routerPath: router.pathname,
        swipeXCurrent: swipeX
    });

    // --- MOBILE VIEW ---
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[99999] bg-slate-900 text-white flex flex-col animate-in fade-in duration-300">
                {/* Top Actions: Close (Snooze Conflict Overlay handles its own dismissed state if needed, or we just overlay it) */}
                {conflictInfo && (
                     <div className="absolute inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
                         <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                            <i className="fi flex fi-rr-warning text-amber-500 text-3xl"></i>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Slot Conflict</h2>
                         <p className="text-slate-400 mb-8">
                            Already booked: <span className="text-white font-bold">{conflictInfo.customer}</span> at <span className="text-white font-bold">{conflictInfo.time}</span>.
                        </p>
                         <button onClick={() => setConflictInfo(null)} className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/20">
                            Try Another Time
                        </button>
                     </div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 relative overflow-hidden">
                    
                    {/* Expiry Badge (Top) */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 mb-2">
                        <i className="fi flex fi-rr-calendar-clock text-xs text-slate-400"></i>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                            Exp: {displayCall.expiry_date ? new Date(displayCall.expiry_date).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>

                    {/* Animated Avatar */}
                    <div className="relative z-10 my-4">
                        <div className="w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center shadow-2xl relative z-20">
                             <span className="text-5xl font-bold text-white/90">
                                {displayCall.customer_name.charAt(0).toUpperCase()}
                             </span>
                        </div>
                        {/* Animated Rings */}
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-blue-500/30 animate-[ping_2s_infinite]"></div>
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border border-blue-500/20 animate-[ping_2s_infinite_0.5s]"></div>
                        <div className="absolute -inset-4 rounded-full bg-blue-500/5 animate-pulse z-0"></div>
                    </div>

                    {/* Info */}
                    <div className="z-10 w-full flex flex-col items-center gap-1">
                        <h1 className="text-2xl font-bold tracking-tight leading-tight px-4">
                            {displayCall.customer_name}
                        </h1>
                         <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                             <i className="fi flex fi-rr-hashtag"></i>
                             {displayCall.campaign_name || 'Active Campaign'}
                        </div>
                    </div>

                    {/* Disposition Flow */}
                    <div className="flex flex-wrap justify-center gap-2 w-full px-4">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase rounded border border-blue-500/20">{displayCall.disposition}</span>
                        {displayCall.sub_disposition && <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase rounded border border-indigo-500/20">{displayCall.sub_disposition}</span>}
                        {displayCall.outcome && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase rounded border border-emerald-500/20">{displayCall.outcome}</span>}
                    </div>

                    {/* Notes & Time */}
                    <div className="w-full max-w-sm space-y-3">
                         {displayCall.notes && (
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 text-center">
                                <p className="text-slate-300 text-sm font-medium italic line-clamp-3">
                                    "{displayCall.notes}"
                                </p>
                            </div>
                        )}
                        
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                             <i className="fi flex fi-rr-clock text-sm"></i>
                             <span className="text-sm font-bold">
                                {new Date(displayCall.next_called_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                             </span>
                        </div>
                    </div>

                </div>

                {/* Bottom Actions Area */}
                <div className="p-6 pb-24 space-y-10 z-20 bg-slate-900">
                    <style dangerouslySetInnerHTML={{ __html: `
                        @keyframes ring {
                            0% { transform: rotate(0); }
                            5% { transform: rotate(15deg); }
                            10% { transform: rotate(-15deg); }
                            15% { transform: rotate(12deg); }
                            20% { transform: rotate(-12deg); }
                            25% { transform: rotate(0); }
                            100% { transform: rotate(0); }
                        }
                    `}} />
                    
                    {/* Snooze Options */}
                    <div className="flex justify-center gap-3">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest self-center mr-2">Snooze</span>
                        {[5, 10, 15].map(m => (
                            <button 
                                key={m}
                                onClick={() => handleSnooze(m)}
                                className="px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-white text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all"
                            >
                                +{m}m
                            </button>
                        ))}
                    </div>

                    {/* Conditional Swipe Logic */}
                    {isCallingActive ? (
                        <button 
                            onClick={handleDismiss}
                             className="w-full h-16 rounded-full bg-slate-800 border border-red-500/50 text-red-500 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                        >
                            <i className="fi flex fi-rr-cross-circle text-xl"></i>
                            Dismiss Reminder
                        </button>
                    ) : (
                        <div className="relative w-full max-w-[340px] mx-auto h-16 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-xl flex items-center justify-between px-6">
                            
                            {/* Inner Clipped Area for Hints and Labels */}
                            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                                {/* Swipe Indicators */}
                                <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${swipeX < -40 ? 'opacity-100' : 'opacity-30'}`}>
                                        
                                </div>
                                
                                <div className={`absolute right-6 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${swipeX > 40 ? 'opacity-100' : 'opacity-30'}`}>
                                    
                                </div>

                                {/* Labels */}
                                <div className="absolute inset-0 flex items-center justify-between px-14 opacity-40 text-[10px] font-bold uppercase tracking-widest">
                                    <span className={swipeX < 0 ? 'text-red-400' : 'text-slate-400'}>Dismiss</span>
                                    <span className={swipeX > 0 ? 'text-emerald-400' : 'text-slate-400'}>Open</span>
                                </div>

                                {/* Color Hints */}
                                <div 
                                    className="absolute inset-0 z-0 transition-opacity duration-300"
                                    style={{ 
                                        background: swipeX > 0 
                                            ? `linear-gradient(90deg, transparent 50%, rgba(16, 185, 129, ${Math.min(0.3, swipeX/150)}) 100%)`
                                            : swipeX < 0 
                                                ? `linear-gradient(-90deg, transparent 50%, rgba(239, 68, 68, ${Math.min(0.3, Math.abs(swipeX)/150)}) 100%)`
                                                : 'transparent'
                                    }}
                                />
                            </div>

                            {/* Draggable Thumb - LARGER (Google Dialer Style) */}
                            <div 
                                className={`absolute top-1/2 -mt-10 w-20 h-20 left-1/2 -ml-10 rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing z-30 touch-none border-4 transition-[background-color,border-color,box-shadow] duration-300
                                    ${!isDragging ? 'transition-transform' : ''}
                                    ${swipeX > 30 ? 'bg-emerald-500 border-emerald-400 shadow-emerald-500/50' : 
                                      swipeX < -30 ? 'bg-red-500 border-red-400 shadow-red-500/50' : 
                                      'bg-white border-slate-900/10'}`}
                                style={{ 
                                    transform: `translateX(${swipeX}px)` 
                                }}
                                onMouseDown={onSwipeStart}
                                onTouchStart={(e) => {
                                    console.log('📱 Thumb Touch Start - swipeX:', swipeX);
                                    onSwipeStart(e);
                                }}
                            >
                                <i className={`fi flex fi-sr-bell text-2xl transition-all origin-top 
                                    ${swipeX === 0 ? 'animate-[ring_2s_infinite]' : ''} 
                                    ${(swipeX > 30 || swipeX < -30) ? 'text-white scale-110' : 'text-slate-900'}`}></i>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    // --- DESKTOP VIEW (Original) ---
    return (
        <div 
            key={displayCall.id}
            style={{ left: `${position.x}px`, top: `${position.y}px`, width: '260px' }}
            onMouseDown={onMouseDown}
            className={`fixed z-[99999] bg-[#1a1f24] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden select-none border border-white/10 transition-transform 
                animate-in fade-in slide-in-from-right-full duration-700 ease-out 
                ${isExiting ? 'animate-out fade-out slide-out-to-right-full duration-700 ease-in' : ''}
                ${isDragging ? 'scale-105 cursor-grabbing' : 'cursor-grab'}`}
        >
            {/* Header: Compact Name & Campaign */}
            <div className="p-4 pb-1 relative">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDismiss();
                    }}
                     className="absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors z-[60]"
                >
                    <i className="fi flex fi-rr-cross-small text-[14px]"></i>
                </button>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center shadow-inner">
                            <i className="fi flex fi-sr-bell text-blue-400 text-xl animate-[ring_2s_infinite] origin-top"></i>
                        </div>
                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes ring {
                                0% { transform: rotate(0); }
                                5% { transform: rotate(15deg); }
                                10% { transform: rotate(-15deg); }
                                15% { transform: rotate(12deg); }
                                20% { transform: rotate(-12deg); }
                                25% { transform: rotate(0); }
                                100% { transform: rotate(0); }
                            }
                        `}} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-[14px] truncate leading-tight">
                            {displayCall.customer_name}
                        </h3>
                        <p className="text-[#00c985] text-[9px] font-bold uppercase tracking-wider mt-0.5">
                           CAMPAIGN : {displayCall.campaign_name || 'ACTIVE CAMPAIGN'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Section: More Compact */}
            <div className="px-4 space-y-2.5">
                <div className="bg-white/5 rounded-lg p-2.5 border border-white/5">
                    <div className="flex flex-wrap gap-1">
                        <span className="text-[8px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-sm uppercase border border-blue-400/10">{displayCall.disposition}</span>
                        {displayCall.sub_disposition && <span className="text-[8px] font-bold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded-sm uppercase border border-indigo-400/10">{displayCall.sub_disposition}</span>}
                        {displayCall.outcome && <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-sm uppercase border border-emerald-400/10">{displayCall.outcome}</span>}
                    </div>
                </div>

                 <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-400">
                        <i className="fi flex fi-rr-clock text-[10px]"></i>
                        <span className="text-[10px] font-medium">
                            {new Date(displayCall.next_called_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                    </div>
                     {displayCall.notes && (
                        <div className="flex items-start gap-2 text-slate-500">
                            <i className="fi flex fi-rr-document text-[10px] mt-0.5"></i>
                            <p className="text-[10px] font-medium leading-tight italic truncate opacity-70">
                                {displayCall.notes}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Conflict Window Overlay */}
            {conflictInfo && (
                <div className="absolute inset-0 bg-[#1a1f24]/98 z-50 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95">
                     <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-3">
                        <i className="fi flex fi-rr-warning text-amber-500 text-lg"></i>
                    </div>
                    <h4 className="text-white font-bold text-[12px] mb-1 uppercase tracking-wider">Conflict</h4>
                    <p className="text-slate-400 text-[10px] leading-tight mb-4 px-1">
                        Already have <span className="text-white font-bold">{conflictInfo.customer}</span> at <span className="text-white font-bold">{conflictInfo.time}</span>.
                    </p>
                    <div className="flex flex-col w-full gap-1.5">
                        <button onClick={() => setConflictInfo(null)} className="h-9 rounded-lg bg-white/5 text-white font-bold text-[11px] uppercase border border-white/10 hover:bg-white/10 transition-all">Try Another Time</button>
                    </div>
                </div>
            )}


            {/* Action Buttons: Slimmer */}
            <div className="p-4 pt-3 space-y-2.5">
                {isCallingActive ? (
                    <button 
                         onClick={handleDismiss}
                        className="w-full h-11 rounded-lg bg-slate-800 border border-red-500/50 text-red-500 font-bold text-[12px] uppercase tracking-wider transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                    >
                        <i className="fi flex fi-rr-cross-circle text-xs"></i>
                        Dismiss Reminder
                    </button>
                ) : (
                    <button 
                        onClick={() => {
                            setIsExiting(true);
                            saveInteractedKey(displayCall.id, displayCall.next_called_at);
                            if (audioInstanceRef.current) {
                                audioInstanceRef.current.pause();
                                audioInstanceRef.current.currentTime = 0;
                            }
                            setTimeout(() => {
                                router.push(`/campaign/${displayCall.campaign_id}/${displayCall.id}`);
                            }, 600);
                        }}
                         className="w-full h-11 rounded-lg bg-[#00c985] hover:bg-[#00ad73] text-white font-bold text-[12px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-500/5 flex items-center justify-center gap-2"
                    >
                        <i className="fi flex fi-rr-phone-call text-xs"></i>
                        Call Now
                    </button>
                )}

                <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map(m => (
                        <button 
                            key={m}
                            onClick={() => handleSnooze(m)}
                            className="h-9 rounded-full bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700 text-white font-bold text-[10px] transition-all active:scale-95 shadow-lg shadow-black/20"
                        >
                            +{m}M
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
