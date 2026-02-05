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

    const handleDismiss = useCallback(() => {
        if (!upcomingCall?.id) return;
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

    const checkUpcomingCalls = useCallback(async () => {
        if (!storageLoaded) return; // Prevent flickering by waiting for storage
        
        const userId = user?.uid || (user as any)?.user_id;

        if (!userId) {
            console.log("[Reminder-Debug] No User UID found. Auth check pending...");
            return;
        }

        const now = new Date();
        const windowStart = now; 
        const windowEnd = new Date(now.getTime() + 2 * 60000); 

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
                    outcome
                `)
                .or(`managed_by.eq.${userId},assigned_to.eq.${userId}`)
                .ilike('disposition', 'Call Back')
                .gte('next_called_at', windowStart.toISOString())
                .lte('next_called_at', windowEnd.toISOString())
                .order('next_called_at', { ascending: true })
                .limit(1);

            if (error) {
                console.error("[Reminder-Debug] Query Error:", error);
                throw error;
            }

            if (data && data.length > 0) {
                const call = data[0];
                const compositeKey = `${call.id}_${call.next_called_at}`;
                
                if (interactedKeys.has(compositeKey)) {
                    if (upcomingCall?.id === call.id && !isExiting) {
                        setUpcomingCall(null);
                    }
                    return;
                }

                if (upcomingCall && upcomingCall.id !== call.id && !isExiting) {
                    setIsExiting(true);
                    setTimeout(() => {
                        setUpcomingCall(null); 
                        setIsExiting(false);
                    }, 700);
                    return; 
                }

                if (!upcomingCall || upcomingCall.id !== call.id) {
                    let campaignName = "Active Campaign";
                    if (call.campaign_id) {
                        const { data: campData } = await supabase
                            .from('campaigns')
                            .select('name')
                            .eq('id', call.campaign_id)
                            .maybeSingle();
                        
                        if (campData?.name) {
                            campaignName = campData.name;
                        }
                    }

                    const enrichedCall = {
                        ...call,
                        campaign_name: campaignName
                    };

                    setUpcomingCall(enrichedCall);
                }
            } else {
                if (!isExiting) setUpcomingCall(null);
            }
        } catch (err) {
            console.error("[Reminder-Debug] Error:", err);
        }
    }, [user, interactedKeys, upcomingCall, isExiting, saveInteractedKey, storageLoaded]);

    useEffect(() => {
        if (!mounted || !storageLoaded) return;
        
        checkUpcomingCalls();
        const interval = setInterval(checkUpcomingCalls, 5000);
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
            
            // Auto-trigger sound 1 second after popup shows
            playTimeoutRef.current = setTimeout(() => {
                // Final safety check: Popup must still be visible and NOT exiting
                if (upcomingCall?.id === activeId && !isExiting && audioInstanceRef.current) {
                    audioInstanceRef.current.play()
                        .then(() => {
                            lastRungIdRef.current = activeId;
                        })
                        .catch(err => {
                            // Browsers may still block autoplay on first reload, but we try immediately
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
        router.push(`/campaign/${upcomingCall.campaign_id}/${upcomingCall.id}`);
        setUpcomingCall(null);
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
                    <i className="fi fi-rr-cross-small text-[14px]"></i>
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
                        <i className="fi fi-rr-clock text-[10px]"></i>
                        <span className="text-[10px] font-medium">
                            {new Date(displayCall.next_called_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                    </div>
                    {displayCall.notes && (
                        <div className="flex items-start gap-2 text-slate-500">
                            <i className="fi fi-rr-document text-[10px] mt-0.5"></i>
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
                        <i className="fi fi-rr-warning text-amber-500 text-lg"></i>
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
                    <i className="fi fi-rr-phone-call text-xs"></i>
                    Call Now
                </button>

                <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map(m => (
                        <button 
                            key={m}
                            onClick={() => handleSnooze(m)}
                            className="h-9 rounded-lg bg-[#f05a5a] hover:bg-[#d94e4e] text-white font-bold text-[10px] transition-all active:scale-95 shadow shadow-red-500/5"
                        >
                            +{m}M
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
