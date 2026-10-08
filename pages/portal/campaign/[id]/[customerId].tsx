import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useSession } from "@/context/SessionContext";
import { useUser } from "@/context/UserContext";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "@/lib/authService";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/BottomNav";
import { requestDeviceInfoFromFlutter } from "@/lib/flutterBridge";
import { decryptPhone, formatMaskedPhone, computePhoneHash } from "@/lib/phoneUtils";
import { updateSyncMetaCallStatus, updateSyncMetaCallingStatus } from "@/lib/flutterBridge";
import { logSystemEvent, estimateSize } from "@/lib/monitoring";
import { showWarning } from "@/lib/dialogUtils";
import { routeCallingCommand } from "@/lib/callingCommandRouter";
import { resolveActiveCallingProvider, getCallingProviderDetails, getCachedProviderDetails, type CallingProviderName, type ActiveProviderDetails } from "@/lib/callingProviderClient";
import { SmartfloOutboundFlowCard } from "@/components/campaign/SmartfloOutboundFlowCard";
import { SmartfloInboundFlowCard } from "@/components/campaign/SmartfloInboundFlowCard";
import { SmartfloLiveCallModal } from   "@/components/campaign/SmartfloLiveCallModal";
import { SmartfloSessionStore } from "@/lib/smartfloSessionStore";
import { useSmartfloCallFlow } from "@/hooks/useSmartfloCallFlow";


const DancingDots = ({ dotColor = "bg-white" }: { dotColor?: string }) => (
    <span className="inline-flex items-center gap-1.5 py-0.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-bounce [animation-delay:-0.3s]`}></span>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-bounce [animation-delay:-0.15s]`}></span>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-bounce`}></span>
    </span>
);

export default function CallingPage() {
    const router = useRouter();
    const { id: campaignId, customerId } = router.query;
    const { currentSession: globalHotSession, allSessions } = useSession();
    const { user: authUser } = useUser();

    const handleLogoutClick = async () => {
        await handleLogout(router);
    };
    
    const [user, setUser] = useState<UserProfile | null>(() => authUser);

    useEffect(() => {
        if (authUser) {
            setUser(authUser);
        }
    }, [authUser]);
    const [customer, setCustomer] = useState<any>(null);
    const [viewingDetailsKey, setViewingDetailsKey] = useState<string | null>(null);
    const [campaign, setCampaign] = useState<any>(null);
    // === 1. TIMELINE STATES & GHOST BUFFER ===
    const [history, setHistory] = useState<any[]>([]);
    const [totalAttemptsCount, setTotalAttemptsCount] = useState<number>(0);
    const [hasMoreTimeline, setHasMoreTimeline] = useState(false);
    const [isLoadingInitialTimeline, setIsLoadingInitialTimeline] = useState(false);
    const [isLoadingMoreTimeline, setIsLoadingMoreTimeline] = useState(false);
    const timelineGhostBufferRef = useRef<{ data: any[]; hasMore: boolean } | null>(null);
    const isGhostFetchingTimelineRef = useRef(false);
    const timelineOffsetRef = useRef(0);

    // === 2. MOBILE LOGS STATES & GHOST BUFFER ===
    const [mobileLogs, setMobileLogs] = useState<any[]>([]);
    const [hasMoreMobileLogs, setHasMoreMobileLogs] = useState(false);
    const [isLoadingMobileLogs, setIsLoadingMobileLogs] = useState(false);
    const [isLoadingMoreMobileLogs, setIsLoadingMoreMobileLogs] = useState(false);
    const mobileLogsGhostBufferRef = useRef<{ data: any[]; hasMore: boolean } | null>(null);
    const isGhostFetchingMobileLogsRef = useRef(false);
    const mobileLogsOffsetRef = useRef(0);

    // === 3. SCHEDULES STATES & GHOST BUFFER ===
    const [scheduledCalls, setScheduledCalls] = useState<any[]>([]);
    const [hasMoreSchedules, setHasMoreSchedules] = useState(false);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
    const [isLoadingMoreSchedules, setIsLoadingMoreSchedules] = useState(false);
    const schedulesGhostBufferRef = useRef<{ data: any[]; hasMore: boolean } | null>(null);
    const isGhostFetchingSchedulesRef = useRef(false);
    const schedulesOffsetRef = useRef(0);

    // === 4. SMARTFLO LOGS STATES ===
    const [timelineView, setTimelineView] = useState<'timeline' | 'call_logs' | 'schedules' | 'smartflo_logs'>('timeline');
    const [smartfloLogs, setSmartfloLogs] = useState<any[]>([]);
    const [smartfloVisibleCount, setSmartfloVisibleCount] = useState(5);
    const [isLoadingSmartfloLogs, setIsLoadingSmartfloLogs] = useState(false);
    const [activeCallingProvider, setActiveCallingProvider] = useState<CallingProviderName | null>(() => getCachedProviderDetails()?.activeProvider ?? null);
    const [callingProviderDetails, setCallingProviderDetails] = useState<ActiveProviderDetails | null>(() => getCachedProviderDetails());
    const cachedProviderDetailsRef = useRef<ActiveProviderDetails | null>(getCachedProviderDetails());
    const [lastCheckedRefId, setLastCheckedRefId] = useState<string | null>(null);
    const [lastCheckedCallId, setLastCheckedCallId] = useState<string | null>(null);
    const [isSmartfloLiveModalOpen, setIsSmartfloLiveModalOpen] = useState(false);
    const [smartfloLifecycle, setSmartfloLifecycle] = useState<{
        refId: string;
        agentColor: 'orange' | 'green' | 'violet' | 'red' | 'gray';
        agentSublabel: string;
        customerColor: 'orange' | 'green' | 'violet' | 'red' | 'gray';
        customerSublabel: string;
        hangupColor: 'gray' | 'indigo' | 'violet' | 'red';
        hangupSublabel: string;
        isEnded: boolean;
        isInbound?: boolean;
        rawPayload?: any;
    } | null>(null);
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
    const [selectedScheduleDate, setSelectedScheduleDate] = useState<Date | null>(new Date());
    const [managedByInfo, setManagedByInfo] = useState<{name: string, empId: string} | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignmentCountdown, setAssignmentCountdown] = useState(3);
    const [targetNextLead, setTargetNextLead] = useState<{ id: string, campaignId: string } | null>(null);
    const [isAccessDeniedManual, setIsAccessDeniedManual] = useState(false);
    
    // Call States
    const [isCalling, setIsCalling] = useState(false);
    const [isPlacingCall, setIsPlacingCall] = useState(false);
    const isPlacingCallRef = useRef(false);
    const lastCallPlacedAtRef = useRef(0);
    const [isEndingCall, setIsEndingCall] = useState(false);
    const [postCall, setPostCall] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const activeCallProviderRef = useRef<CallingProviderName | null>(null);
    const lastCallProviderRef = useRef<CallingProviderName | null>(null);
    const activeSmartfloRefIdRef = useRef<string | null>(null);
    const activeSmartfloCallIdRef = useRef<string | null>(null);
    const hasSeenCustomerRingingRef = useRef(false);
    const [callStartTime, setCallStartTime] = useState<number | null>(null);
    const [serverTimeOffset, setServerTimeOffset] = useState(0);
    const [disposition, setDisposition] = useState("");
    const [subDisposition, setSubDisposition] = useState("");
    const [callbackDate, setCallbackDate] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    });
    const [callbackTime, setCallbackTime] = useState(() => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    });
    const [tempHour, setTempHour] = useState("09");
    const [tempMinute, setTempMinute] = useState("00");
    const [tempAmPm, setTempAmPm] = useState("AM");
    const [notes, setNotes] = useState("");
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
    const [isAssignPickerOpen, setIsAssignPickerOpen] = useState(false);
    const [isPhoneUnmasked, setIsPhoneUnmasked] = useState(false);
    const [calendarViewDate, setCalendarViewDate] = useState(new Date());
    const [callAlive, setCallAlive] = useState(false);
    const [localCallingStatus, setLocalCallingStatus] = useState<string | null>(null);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [isNotesExpanded, setIsNotesExpanded] = useState(false);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [showAttachmentModal, setShowAttachmentModal] = useState(false);
    const [showEnlargedNotes, setShowEnlargedNotes] = useState(false);
    const [liveNotes, setLiveNotes] = useState("");
    const [isSavingLiveNotes, setIsSavingLiveNotes] = useState(false);
    const [attachmentSearch, setAttachmentSearch] = useState("");
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [customFileName, setCustomFileName] = useState("");
    
    // Conflict states
    const [conflictInfo, setConflictInfo] = useState<any>(null);
    const [checkingSlot, setCheckingSlot] = useState(false);

    const [showNewLeadAlert, setShowNewLeadAlert] = useState(false);
    const prevCustomerId = useRef<string | null>(null);

    const [isEditingExpiry, setIsEditingExpiry] = useState(false);
    const [tempExpiryDate, setTempExpiryDate] = useState("");
    const [isEditingDetails, setIsEditingDetails] = useState(false);
    const [tempDetails, setTempDetails] = useState<any[]>([]);
    const [prefetchStatus, setPrefetchStatus] = useState<'idle' | 'fetching' | 'ready' | 'none' | 'error'>('idle');
    const [dailyLeadCount, setDailyLeadCount] = useState(0);
    const [activePreset, setActivePreset] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isManualMode, setIsManualMode] = useState(false);
    const isManualUrl = router.query.isManual === 'true' || router.query.ismanual === 'true';
    const [isInterruption, setIsInterruption] = useState(false);
    const expiryDatePickerRef = useRef<HTMLDivElement>(null);
    const detailsEditRef = useRef<HTMLDivElement>(null);

    // 📊 REAL-TIME TELEMETRY & LATENCY BENCHMARK STATE
    const [telemetry, setTelemetry] = useState<{
        authTime: number;
        guardTime: number;
        leadTime: number;
        sessionTime: number;
        parallelGroupTime: number;
        managerTime: number;
        timelineTime: number;
        unblockTime: number;
        mobileLogsTime: number | null;
        schedulesTime: number | null;
        smartfloTime: number | null;
        leadId: string;
        measuredAt: string;
    } | null>(null);
    const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
    const [copiedTelemetry, setCopiedTelemetry] = useState(false);
    const [isReTestingTelemetry, setIsReTestingTelemetry] = useState(false);
    const showTelemetryHud = Boolean(router.query.hud === 'true' || router.query.debug === 'true');

    // Slider State
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startXRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderHandleRef = useRef<HTMLDivElement>(null);
    const skipTextRef = useRef<HTMLSpanElement>(null);
    const hourScrollRef = useRef<HTMLDivElement>(null);
    const minuteScrollRef = useRef<HTMLDivElement>(null);
    const hasMovedRef = useRef(false);

    const lastActiveRef = useRef<number>(Date.now());

    // 🔄 STALE SESSION AUTO-RELOAD (Reload if user returns after 5+ minutes)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                const now = Date.now();
                const diffMinutes = (now - lastActiveRef.current) / (1000 * 60);
                
                if (diffMinutes >= 5) {
                    console.log(`[AutoReload] Returning after ${Math.round(diffMinutes)} mins. Refreshing lead data.`);
                    window.location.reload();
                }
            } else {
                // Mark timestamp when the user leaves the tab
                lastActiveRef.current = Date.now();
            }
        };

        const updateActivityTime = () => {
            lastActiveRef.current = Date.now();
        };

        window.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("mousedown", updateActivityTime);
        document.addEventListener("keydown", updateActivityTime);

        return () => {
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("mousedown", updateActivityTime);
            document.removeEventListener("keydown", updateActivityTime);
        };
    }, []);

    // Time Picker Drag State
    const [timePickerPos, setTimePickerPos] = useState({ x: 0, y: 0 });
    const [isTimePickerDragging, setIsTimePickerDragging] = useState(false);
    const timePickerDragRef = useRef<{ startX: number, startY: number, initialX: number, initialY: number } | null>(null);

    // Time Picker Drag Logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isTimePickerDragging || !timePickerDragRef.current) return;
            const dx = e.clientX - timePickerDragRef.current.startX;
            const dy = e.clientY - timePickerDragRef.current.startY;
            setTimePickerPos({
                x: timePickerDragRef.current.initialX + dx,
                y: timePickerDragRef.current.initialY + dy
            });
        };

        const handleMouseUp = () => {
            setIsTimePickerDragging(false);
            timePickerDragRef.current = null;
        };

        if (isTimePickerDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isTimePickerDragging]);

    // 🕒 Auto-scroll Time Picker when opened or selection changes
    useEffect(() => {
        if (isTimePickerOpen) {
            // Small delay to ensure state and DOM are perfectly synced
            const timer = setTimeout(() => {
                const activeHour = hourScrollRef.current?.querySelector('[data-active="true"]');
                const activeMinute = minuteScrollRef.current?.querySelector('[data-active="true"]');

                if (activeHour) {
                    activeHour.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                if (activeMinute) {
                    activeMinute.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isTimePickerOpen, tempHour, tempMinute]);

    const handleTimePickerMouseDown = (e: React.MouseEvent) => {
        // Prevent drag on interactive elements
        if ((e.target as HTMLElement).closest('button')) return;
        
        setIsTimePickerDragging(true);
        timePickerDragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: timePickerPos.x,
            initialY: timePickerPos.y
        };
    };


    
    // Calculate Lead Score based on unique interactions
    const leadScore = (() => {
        const uniqueAgents = new Set([
            ...mobileLogs.map(log => log.employee_id).filter(Boolean),
            ...(history || []).map(log => log.created_by).filter(Boolean)
        ]);
        
        const count = uniqueAgents.size;
        
        if (count === 0) return { label: 'Fresh', color: 'text-emerald-500', icon: 'fi-rr-sparkles' };
        if (count <= 3) return { label: 'High', color: 'text-blue-500', icon: 'fi-sr-star' };
        if (count <= 8) return { label: 'Medium', color: 'text-amber-500', icon: 'fi-sr-star' };
        return { label: 'Low', color: 'text-rose-500', icon: 'fi-sr-star' };
    })();

    // --- 💾 STATE PERSISTENCE ENGINE ---
    const isApiUpdatingRef = useRef(false); // Prevents polling conflict during call start/end


    const datePickerRef = useRef<HTMLDivElement>(null);
    const timePickerRef = useRef<HTMLDivElement>(null);
    const assignPickerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    const syncScroll = () => {
        if (textareaRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    // Get Last Interaction for Follow Ups
    const lastInteraction = history?.length > 0 ? history[0] : null;
    
    const handleWhatsAppClick = useCallback(() => {
        if (!customer?.phone_no) {
            alert("No phone number available");
            return;
        }

        // 1. Decrypt if necessary
        let rawPhone = decryptPhone(customer.phone_no);

        // 2. Comprehensive Cleaning
        // Remove all non-numeric characters first
        let cleanNumber = rawPhone.replace(/\D/g, '');
        
        // 3. Remove all leading zeros (e.g., 0091... or 098...)
        cleanNumber = cleanNumber.replace(/^0+/, '');

        // 4. International Normalization (Primarily for India '91')
        if (cleanNumber.length === 10) {
            // Case: 9876543210 -> 919876543210 (Classic 10-digit)
            cleanNumber = '91' + cleanNumber;
        } else if (cleanNumber.length > 10) {
            // Check if it's an Indian number already (12 digits starting with 91)
            // But verify it doesn't have a '0' after 91 (e.g. 9109876...)
            const isStandardIndian = cleanNumber.startsWith('91') && cleanNumber.length === 12 && cleanNumber[2] !== '0';
            
            if (!isStandardIndian) {
                // If it's mangled (e.g. 009198..., 91098..., +91-98...), take the reliable last 10 digits
                const last10 = cleanNumber.slice(-10);
                cleanNumber = '91' + last10;
            }
        }
        
        // 5. Final validation: Ensure it's not empty and has a reasonable length
        if (cleanNumber.length < 10) {
            alert("Invalid phone number format: " + rawPhone);
            return;
        }

        console.log(`[WhatsApp] Final formatted number: ${cleanNumber}`);
        const waUrl = `https://wa.me/${cleanNumber}`;
        window.open(waUrl, '_blank');
    }, [customer?.phone_no]);


    const handleEndCall = useCallback(async (isFromBridge = false, providerOverride?: CallingProviderName | null) => {
        isApiUpdatingRef.current = true; // LOCK ON IMMEDIATELY
        console.log(`🤙 [EndCall] Initiated. Source: ${isFromBridge ? 'Native Bridge' : 'User UI'}`);
        const providerForCall = providerOverride ?? activeCallProviderRef.current;
        const hangupRefId = activeSmartfloRefIdRef.current || lastCheckedRefId;
        const hangupCallId = activeSmartfloCallIdRef.current || lastCheckedCallId;

        // If initiated from UI and Smartflo call is active, show dancing dots in disconnect button until hangup response arrives
        if (!isFromBridge && (providerForCall === 'smartflo' || hangupRefId || hangupCallId)) {
            setIsEndingCall(true);  
            if (hangupRefId || hangupCallId) {
                if (hangupRefId) cancelledRefIdsRef.current.add(hangupRefId);
                if (hangupCallId) cancelledRefIdsRef.current.add(hangupCallId);
                console.info('🛑 [Call Hangup] Initiating Smartflo disconnect request:', {
                    ref_id: hangupRefId,
                    call_id: hangupCallId,
                    customer_phone: customer?.phone_no ? decryptPhone(customer.phone_no) : undefined,
                    provider: providerForCall,
                    timestamp: new Date().toLocaleTimeString()
                });
                try {
                    const { data: { session: authSession } } = await supabase.auth.getSession();
                    if (authSession) {
                        const hangupPromise = fetch('/api/calling/smartflo-hangup', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authSession.access_token}`,
                            },
                            body: JSON.stringify({
                                ref_id: hangupRefId,
                                call_id: hangupCallId,
                                phone: customer?.phone_no ? decryptPhone(customer.phone_no) : undefined,
                            }),
                        }).then(async (res) => {
                            const data = await res.json().catch(() => null);
                            console.info('✅ [Call Hangup] Smartflo hangup completed:', {
                                status: res.status,
                                ok: res.ok,
                                response: data
                            });
                            return data;
                        });

                        // Max 3.5s wait so UI never gets stuck
                        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3500));
                        await Promise.race([hangupPromise, timeoutPromise]);
                    }
                } catch (e) {
                    console.warn('⚠️ [Call Hangup] Smartflo hangup exception:', e);
                }
            }

            if (hangupRefId || hangupCallId) {
                setSmartfloLifecycle(prev => prev ? ({
                    ...prev,
                    hangupColor: 'red',
                    hangupSublabel: 'Agent Ended',
                    isEnded: true,
                }) : {
                    refId: hangupRefId || hangupCallId || '',
                    agentColor: 'orange',
                    agentSublabel: 'Cancelled',
                    customerColor: 'gray',
                    customerSublabel: 'Cancelled',
                    hangupColor: 'red',
                    hangupSublabel: 'Agent Ended',
                    isEnded: true,
                });
                setTimeout(() => fetchSmartfloLogs(hangupRefId || undefined, hangupCallId || undefined), 500);
            }
        }

        activeCallProviderRef.current = null;
        activeSmartfloRefIdRef.current = null;
        
        // If a SIM call never reached 'connected' status, force duration to 0
        if (providerForCall === 'sim' && localCallingStatus !== 'connected') {
            console.log('🤙 [EndCall] SIM call never connected. Forcing Talk Time to 0.');
            setCallDuration(0);
        }

        setIsEndingCall(false);
        setIsCalling(false);    
        setIsPlacingCall(false);
        setPostCall(true);
        setCallAlive(false);
        setLocalCallingStatus(null);

        // Pre-fill callback date/time with current values + 5 mins for disposition
        const now = new Date();
        const future = new Date(now.getTime() + 5 * 60000); // Add 5 minutes
        const localDate = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;
        const localTime = future.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        setCallbackDate(localDate);
        setCallbackTime(localTime);
        console.log('🤙 [EndCall] State flags updated: isCalling=false, postCall=true, callAlive=false, localStatus=null');

        // Notify Flutter bridge to disconnect the call
        if (customer?.phone_no) {
            const decryptedPhone = decryptPhone(customer.phone_no);
            
            console.log(`🤙 [EndCall] Customer phone: ${decryptedPhone}`);
            
            // Only send command to flutter if we initiated it from UI
            if (!isFromBridge) {
                console.log('🤙 [EndCall] Notifying Flutter to disconnect...');
                try {
                    await routeCallingCommand('call_disconnect', decryptedPhone, providerForCall ?? cachedProviderDetailsRef.current?.activeProvider ?? undefined);
                } catch (providerError) {
                    console.warn('🤙 [EndCall] Provider routing failed; skipping native disconnect.', providerError);
                }
            } else {
                console.log('🤙 [EndCall] Skipping Flutter notification (already disconnected on native side)');
            }
            
            // Sync disconnect to SyncMeta table
            if (user?.employeeId) {
                if (isFromBridge) {
                    console.log(`🤙 [EndCall] Clearing SyncMeta busy status for employee: ${user.employeeId}`);
                    // If bridge already disconnected, just clear the busy state in DB
                    updateSyncMetaCallStatus(user.employeeId, '', "", providerForCall);
                } else {
                    console.log(`🤙 [EndCall] Updating SyncMeta with call_disconnect for: ${user.employeeId}`);
                    updateSyncMetaCallStatus(user.employeeId, 'call_disconnect', decryptedPhone || "", providerForCall);
                }
            } else {
                console.warn('🤙 [EndCall] Employee ID missing, skipping SyncMeta update');
            }
        }
 else {
            console.warn('🤙 [EndCall] Customer phone number missing');
        }

        // Update state to disposition_pending in call_sessions table & update user_profiles
        if (user?.uid) {
            const nowIso = new Date().toISOString();
            const updatePayload = {
                on_call: false,
                is_personal: false,
                idle_time: nowIso,
                updated_at: nowIso
            };
            void supabase.from('user_profiles').update(updatePayload).eq('user_id', user.uid);
            void supabase.from('user_profiles').update(updatePayload).eq('id', user.uid);

            console.log('🤙 [EndCall] Fetching auth session for API update...');
            const { data: { session: authSession } } = await supabase.auth.getSession();
            if (authSession) {
                console.log(`🤙 [EndCall] Auth session found. Updating session status for campaign ${campaignId}, customer ${customerId}`);
                try {
                    const response = await fetch("/api/auth/update-call-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authSession.access_token}`,
                        },
                        body: JSON.stringify({
                            campaign_id: campaignId,
                            customer_id: customerId,
                            status: 'disposition_pending',
                            is_manual_event: isManualMode || isManualUrl
                        })
                    });
                    const resData = await response.json();
                    console.log('🤙 [EndCall] API Update Response:', resData);
                    
                    // Release lock after a short delay to allow DB propagation
                    setTimeout(() => {
                        isApiUpdatingRef.current = false; // LOCK OFF
                    }, 2000);

                } catch (error) {
                    console.error('🤙 [EndCall] Failed to update call session via API:', error);
                    isApiUpdatingRef.current = false;
                }
            } else {
                console.error('🤙 [EndCall] No auth session found, cannot update session status');
                isApiUpdatingRef.current = false;
            }
        } else {
            console.warn('🤙 [EndCall] User UID missing, skipping call_sessions update');
            isApiUpdatingRef.current = false;
        }
        console.log('🤙 [EndCall] Process complete.');
    }, [campaignId, customerId, customer?.phone_no, user?.uid, user?.employeeId, user?.employeeId]);

    const isCallingRef = useRef(isCalling);
    useEffect(() => {
        isCallingRef.current = isCalling;
    }, [isCalling]);

    const isEndingCallRef = useRef(isEndingCall);
    useEffect(() => {
        isEndingCallRef.current = isEndingCall;
    }, [isEndingCall]);

    const handleEndCallRef = useRef(handleEndCall);
    useEffect(() => {
        handleEndCallRef.current = handleEndCall;
    }, [handleEndCall]);

    const {
        flowState: smartfloFlowState,
        activeCallType: smartfloActiveCallType,
        refreshFlowState: refreshSmartfloFlowState,
        resetFlowState: resetSmartfloFlowState,
    } = useSmartfloCallFlow({
        phone: customer?.phone_no ? decryptPhone(customer.phone_no) : null,
        customerId: customerId ? String(customerId) : null,
        activeCallingProvider,
        isPlacingCall,
        isCalling,
        isEndingCall,
        activeRefId: activeSmartfloRefIdRef.current || lastCheckedRefId,
        activeCallId: activeSmartfloCallIdRef.current || lastCheckedCallId,
        onCallEndDetected: (termCallId) => {
            console.log('🤙 [Smartflo-Flow] Webhook/CDR confirmed call completion:', termCallId);
            handleEndCall(true, 'smartflo');
        },
    });

    const cancelledRefIdsRef = useRef<Set<string>>(new Set());
    const autoHangsSentRef = useRef<Set<string>>(new Set());

    // =========================================================================
    // 🚀 OPTIMIZATION: 5-ITEM BATCHING & GHOST BUFFERING FOR ALL 4 TABS
    // =========================================================================

    // 1. TIMELINE GHOST PREFETCH & PAGINATION
    const ghostFetchTimeline = useCallback(async (cId: string, offset: number) => {
        if (!cId || isGhostFetchingTimelineRef.current) return;
        isGhostFetchingTimelineRef.current = true;
        try {
            const res = await fetch(`/api/call/history?customerId=${cId}&limit=5&offset=${offset}`);
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
                timelineGhostBufferRef.current = {
                    data: result.data,
                    hasMore: result.hasMore === true
                };
            }
        } catch (e) {
            console.warn('[Timeline-Ghost] Error prefetching:', e);
        } finally {
            isGhostFetchingTimelineRef.current = false;
        }
    }, []);

    const fetchInitialTimeline = useCallback(async (cId: string) => {
        if (!cId) return;
        setIsLoadingInitialTimeline(true);
        timelineOffsetRef.current = 0;
        timelineGhostBufferRef.current = null;
        const tStart = performance.now();
        try {
            const res = await fetch(`/api/call/history?customerId=${cId}&limit=5&offset=0`);
            const result = await res.json();
            const dur = Math.round(performance.now() - tStart);
            setTelemetry(prev => prev ? { ...prev, timelineTime: dur } : null);
            if (result.success && Array.isArray(result.data)) {
                setHistory(result.data);
                if (typeof result.totalCount === 'number') {
                    setTotalAttemptsCount(result.totalCount);
                }
                const hasMore = result.hasMore === true && result.data.length === 5;
                setHasMoreTimeline(hasMore);
                timelineOffsetRef.current = result.data.length;
                if (hasMore) {
                    void ghostFetchTimeline(cId, result.data.length);
                }
            } else {
                setHistory([]);
                setTotalAttemptsCount(0);
                setHasMoreTimeline(false);
            }
        } catch (e) {
            console.error('[Timeline] Initial fetch error:', e);
            setHistory([]);
            setHasMoreTimeline(false);
        } finally {
            setIsLoadingInitialTimeline(false);
        }
    }, [ghostFetchTimeline]);

    const handleLoadMoreTimeline = async () => {
        if (!customerId || isLoadingMoreTimeline) return;
        const cId = String(customerId);

        // Instant reveal from ghost buffer if available (0ms lag!)
        if (timelineGhostBufferRef.current && timelineGhostBufferRef.current.data.length > 0) {
            const buffer = timelineGhostBufferRef.current;
            timelineGhostBufferRef.current = null;
            setHistory(prev => [...prev, ...buffer.data]);
            setHasMoreTimeline(buffer.hasMore);
            timelineOffsetRef.current += buffer.data.length;

            if (buffer.hasMore) {
                void ghostFetchTimeline(cId, timelineOffsetRef.current);
            }
            return;
        } else if (timelineGhostBufferRef.current && timelineGhostBufferRef.current.data.length === 0) {
            timelineGhostBufferRef.current = null;
            setHasMoreTimeline(false);
            return;
        }

        // Direct fetch fallback
        setIsLoadingMoreTimeline(true);
        try {
            const offset = timelineOffsetRef.current;
            const res = await fetch(`/api/call/history?customerId=${cId}&limit=5&offset=${offset}`);
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
                setHistory(prev => [...prev, ...result.data]);
                const hasMore = result.hasMore === true && result.data.length === 5;
                setHasMoreTimeline(hasMore);
                timelineOffsetRef.current += result.data.length;
                if (hasMore) {
                    void ghostFetchTimeline(cId, timelineOffsetRef.current);
                }
            }
        } catch (e) {
            console.error('[Timeline] Error loading more:', e);
        } finally {
            setIsLoadingMoreTimeline(false);
        }
    };

    // 2. MOBILE LOGS GHOST PREFETCH & ENRICHMENT
    const enrichMobileLogs = async (rawLogs: any[]) => {
        if (!rawLogs || rawLogs.length === 0) return [];
        const empIds = [...new Set(rawLogs.map(l => l.employee_id).filter(Boolean))];
        const deviceIds = [...new Set(rawLogs.map(l => l.device_id).filter(Boolean))];

        const promises = [];
        if (empIds.length > 0) {
            promises.push(
                supabase.from('user_profiles').select('employee_id, user_name').in('employee_id', empIds)
            );
        }
        if (deviceIds.length > 0) {
            promises.push(
                supabase.from('sync_meta').select('device_id, device_model, employee_id').in('device_id', deviceIds)
            );
        }

        const results = await Promise.all(promises);
        const rawUsers = (empIds.length > 0 ? results[0]?.data : []) as any[] || [];
        const devices = (deviceIds.length > 0 ? (empIds.length > 0 ? results[1]?.data : results[0]?.data) : []) as any[] || [];

        let allUsers = [...rawUsers];
        const recoveredEmpIds = devices?.map(d => d.employee_id).filter(id => id && !empIds.includes(id));
        if (recoveredEmpIds && recoveredEmpIds.length > 0) {
            const { data: moreUsers } = await supabase
                .from('user_profiles')
                .select('employee_id, user_name')
                .in('employee_id', recoveredEmpIds);
            if (moreUsers) allUsers = [...allUsers, ...moreUsers];
        }

        return rawLogs.map(log => {
            const foundDevice = devices?.find((d: any) => d.device_id === log.device_id);
            const effectiveEmpId = log.employee_id || foundDevice?.employee_id;
            const foundUser = allUsers?.find((u: any) => u.employee_id === effectiveEmpId);
            return {
                ...log,
                employee_id: effectiveEmpId,
                agent_name: foundUser?.user_name,
                device_model: foundDevice?.device_model
            };
        });
    };

    const getCleanPhone = useCallback(() => {
        if (!customer?.phone_no) return null;
        const rawPhone = decryptPhone(customer.phone_no);
        const clean = String(rawPhone || "").replace(/\D/g, '').slice(-10);
        return (clean && clean.length >= 10) ? clean : null;
    }, [customer?.phone_no]);

    const ghostFetchMobileLogs = useCallback(async (phone: string, offset: number) => {
        if (!phone || isGhostFetchingMobileLogsRef.current) return;
        isGhostFetchingMobileLogsRef.current = true;
        try {
            const { data: rawLogs } = await supabase
                .from('call_history')
                .select('*')
                .eq('number', phone)
                .order('timestamp', { ascending: false })
                .range(offset, offset + 4);

            if (rawLogs && rawLogs.length > 0) {
                const enriched = await enrichMobileLogs(rawLogs);
                mobileLogsGhostBufferRef.current = {
                    data: enriched,
                    hasMore: rawLogs.length === 5
                };
            } else {
                mobileLogsGhostBufferRef.current = { data: [], hasMore: false };
            }
        } catch (e) {
            console.warn('[Mobile-Ghost] Error:', e);
        } finally {
            isGhostFetchingMobileLogsRef.current = false;
        }
    }, []);

    const fetchInitialMobileLogs = useCallback(async () => {
        const cleanPhone = getCleanPhone();
        if (!cleanPhone || isLoadingMobileLogs) return;
        setIsLoadingMobileLogs(true);
        mobileLogsOffsetRef.current = 0;
        mobileLogsGhostBufferRef.current = null;
        const tStart = performance.now();
        try {
            const { data: rawLogs, error } = await supabase
                .from('call_history')
                .select('*')
                .eq('number', cleanPhone)
                .order('timestamp', { ascending: false })
                .range(0, 4);

            if (error) throw error;

            if (rawLogs && rawLogs.length > 0) {
                const enriched = await enrichMobileLogs(rawLogs);
                setMobileLogs(enriched);
                const hasMore = rawLogs.length === 5;
                setHasMoreMobileLogs(hasMore);
                mobileLogsOffsetRef.current = rawLogs.length;
                if (hasMore) {
                    void ghostFetchMobileLogs(cleanPhone, rawLogs.length);
                }
            } else {
                setMobileLogs([]);
                setHasMoreMobileLogs(false);
            }
            const dur = Math.round(performance.now() - tStart);
            setTelemetry(prev => prev ? { ...prev, mobileLogsTime: dur } : null);
        } catch (e) {
            console.error('[MobileLogs] Error fetching initial logs:', e);
            setMobileLogs([]);
            setHasMoreMobileLogs(false);
        } finally {
            setIsLoadingMobileLogs(false);
        }
    }, [getCleanPhone, ghostFetchMobileLogs, isLoadingMobileLogs]);

    const handleLoadMoreMobileLogs = async () => {
        const cleanPhone = getCleanPhone();
        if (!cleanPhone || isLoadingMoreMobileLogs) return;

        // Instant reveal from ghost buffer!
        if (mobileLogsGhostBufferRef.current && mobileLogsGhostBufferRef.current.data.length > 0) {
            const buffer = mobileLogsGhostBufferRef.current;
            mobileLogsGhostBufferRef.current = null;
            setMobileLogs(prev => [...prev, ...buffer.data]);
            setHasMoreMobileLogs(buffer.hasMore);
            mobileLogsOffsetRef.current += buffer.data.length;

            if (buffer.hasMore) {
                void ghostFetchMobileLogs(cleanPhone, mobileLogsOffsetRef.current);
            }
            return;
        } else if (mobileLogsGhostBufferRef.current && mobileLogsGhostBufferRef.current.data.length === 0) {
            mobileLogsGhostBufferRef.current = null;
            setHasMoreMobileLogs(false);
            return;
        }

        setIsLoadingMoreMobileLogs(true);
        try {
            const offset = mobileLogsOffsetRef.current;
            const { data: rawLogs } = await supabase
                .from('call_history')
                .select('*')
                .eq('number', cleanPhone)
                .order('timestamp', { ascending: false })
                .range(offset, offset + 4);

            if (rawLogs && rawLogs.length > 0) {
                const enriched = await enrichMobileLogs(rawLogs);
                setMobileLogs(prev => [...prev, ...enriched]);
                const hasMore = rawLogs.length === 5;
                setHasMoreMobileLogs(hasMore);
                mobileLogsOffsetRef.current += rawLogs.length;
                if (hasMore) {
                    void ghostFetchMobileLogs(cleanPhone, mobileLogsOffsetRef.current);
                }
            } else {
                setHasMoreMobileLogs(false);
            }
        } catch (e) {
            console.error('[MobileLogs] Error loading more logs:', e);
        } finally {
            setIsLoadingMoreMobileLogs(false);
        }
    };

    // 3. SCHEDULES GHOST PREFETCH & PAGINATION
    const ghostFetchSchedules = useCallback(async (userId: string, offset: number) => {
        if (!userId || isGhostFetchingSchedulesRef.current) return;
        isGhostFetchingSchedulesRef.current = true;
        try {
            const { data } = await supabase
                .from('customers')
                .select('id, customer_name, next_called_at, campaign_id, disposition, sub_disposition, notes, phone_no')
                .or(`managed_by.eq.${userId},assigned_to.eq.${userId}`)
                .eq('disposition', 'Call Back')
                .not('next_called_at', 'is', null)
                .order('next_called_at', { ascending: true })
                .range(offset, offset + 4);

            schedulesGhostBufferRef.current = {
                data: data || [],
                hasMore: (data?.length || 0) === 5
            };
        } catch (e) {
            console.warn('[Schedules-Ghost] Error:', e);
        } finally {
            isGhostFetchingSchedulesRef.current = false;
        }
    }, []);

    const fetchInitialSchedules = useCallback(async () => {
        if (!user?.uid || isLoadingSchedules) return;
        setIsLoadingSchedules(true);
        schedulesOffsetRef.current = 0;
        schedulesGhostBufferRef.current = null;
        const tStart = performance.now();
        try {
            const { data, error } = await supabase
                .from('customers')
                .select('id, customer_name, next_called_at, campaign_id, disposition, sub_disposition, notes, phone_no')
                .or(`managed_by.eq.${user.uid},assigned_to.eq.${user.uid}`)
                .eq('disposition', 'Call Back')
                .not('next_called_at', 'is', null)
                .order('next_called_at', { ascending: true })
                .range(0, 4);

            if (error) throw error;
            setScheduledCalls(data || []);
            const hasMore = (data?.length || 0) === 5;
            setHasMoreSchedules(hasMore);
            schedulesOffsetRef.current = data?.length || 0;
            if (hasMore) {
                void ghostFetchSchedules(user.uid, 5);
            }
            const dur = Math.round(performance.now() - tStart);
            setTelemetry(prev => prev ? { ...prev, schedulesTime: dur } : null);
        } catch (err) {
            console.error("Error fetching schedules:", err);
            setScheduledCalls([]);
            setHasMoreSchedules(false);
        } finally {
            setIsLoadingSchedules(false);
        }
    }, [user?.uid, ghostFetchSchedules, isLoadingSchedules]);

    const fetchSchedules = fetchInitialSchedules;

    const handleLoadMoreSchedules = async () => {
        if (!user?.uid || isLoadingMoreSchedules) return;
        if (schedulesGhostBufferRef.current && schedulesGhostBufferRef.current.data.length > 0) {
            const buffer = schedulesGhostBufferRef.current;
            schedulesGhostBufferRef.current = null;
            setScheduledCalls(prev => [...prev, ...buffer.data]);
            setHasMoreSchedules(buffer.hasMore);
            schedulesOffsetRef.current += buffer.data.length;
            if (buffer.hasMore) {
                void ghostFetchSchedules(user.uid, schedulesOffsetRef.current);
            }
            return;
        } else if (schedulesGhostBufferRef.current && schedulesGhostBufferRef.current.data.length === 0) {
            schedulesGhostBufferRef.current = null;
            setHasMoreSchedules(false);
            return;
        }

        setIsLoadingMoreSchedules(true);
        try {
            const offset = schedulesOffsetRef.current;
            const { data } = await supabase
                .from('customers')
                .select('id, customer_name, next_called_at, campaign_id, disposition, sub_disposition, notes, phone_no')
                .or(`managed_by.eq.${user.uid},assigned_to.eq.${user.uid}`)
                .eq('disposition', 'Call Back')
                .not('next_called_at', 'is', null)
                .order('next_called_at', { ascending: true })
                .range(offset, offset + 4);

            if (data && data.length > 0) {
                setScheduledCalls(prev => [...prev, ...data]);
                const hasMore = data.length === 5;
                setHasMoreSchedules(hasMore);
                schedulesOffsetRef.current += data.length;
                if (hasMore) {
                    void ghostFetchSchedules(user.uid, schedulesOffsetRef.current);
                }
            } else {
                setHasMoreSchedules(false);
            }
        } catch (err) {
            console.error("Error loading more schedules:", err);
        } finally {
            setIsLoadingMoreSchedules(false);
        }
    };

    // Tab Switch Trigger for Logs
    useEffect(() => {
        if (timelineView === 'call_logs' && mobileLogs.length === 0 && customer?.phone_no && !isLoadingMobileLogs) {
            void fetchInitialMobileLogs();
        }
    }, [timelineView, mobileLogs.length, customer?.phone_no, isLoadingMobileLogs, fetchInitialMobileLogs]);

    // Tab Switch Trigger for Schedules
    useEffect(() => {
        if (timelineView === 'schedules' && scheduledCalls.length === 0 && !isLoadingSchedules) {
            void fetchInitialSchedules();
        }
    }, [timelineView, scheduledCalls.length, isLoadingSchedules, fetchInitialSchedules]);

    // Auto-scrolling for active tabs/buttons
    useEffect(() => {
        // We delay slightly to ensure DOM is updated and animations are ready
        const timer = setTimeout(() => {
            const activeElements = document.querySelectorAll('[data-active="true"]');
            activeElements.forEach(el => {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            });
        }, 100);
        return () => clearTimeout(timer);
    }, [timelineView]);

    const fetchSmartfloLogs = useCallback(async (refIdOverride?: string | null, callIdOverride?: string | null) => {
        if (!customer?.phone_no) return;
        setIsLoadingSmartfloLogs(true);
        const tStart = performance.now();
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const decrypted = decryptPhone(customer.phone_no);
            const currentRef = refIdOverride || activeSmartfloRefIdRef.current || lastCheckedRefId || '';
            const currentCallId = callIdOverride || activeSmartfloCallIdRef.current || lastCheckedCallId || '';

            const url = `/api/calling/smartflo-logs?phone=${encodeURIComponent(decrypted)}&customer_id=${encodeURIComponent(String(customerId || ''))}&ref_id=${encodeURIComponent(currentRef)}&call_id=${encodeURIComponent(currentCallId)}`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const data = await res.json();
            if (data.success && Array.isArray(data.logs)) {
                setSmartfloLogs(data.logs);
            }
            const dur = Math.round(performance.now() - tStart);
            setTelemetry(prev => prev ? { ...prev, smartfloTime: dur } : null);
        } catch (err) {
            console.warn('Failed to fetch Smartflo logs:', err);
        } finally {
            setIsLoadingSmartfloLogs(false);
        }
    }, [customer?.phone_no, customerId, lastCheckedRefId, lastCheckedCallId]);

    useEffect(() => {
        setLastCheckedRefId(null);
        setLastCheckedCallId(null);
        activeSmartfloRefIdRef.current = null;
        activeSmartfloCallIdRef.current = null;
        setSmartfloLifecycle(null);
    }, [customerId]);

    useEffect(() => {
        let isMounted = true;

        const loadProvider = async (force = false) => {
            try {
                const details = await getCallingProviderDetails(force);
                if (isMounted) {
                    cachedProviderDetailsRef.current = details;
                    setCallingProviderDetails(details);
                    setActiveCallingProvider(details.activeProvider);
                }
            } catch {
                // Ignore silent load errors
            }
        };

        void loadProvider(false);

        const handleCallingProviderUpdated = (event: Event) => {
            const detail = (event as CustomEvent<{ userId?: string; state?: any }>).detail;
            if (detail?.userId && user?.uid && detail.userId !== user.uid) return;

            if (detail?.state) {
                const state = detail.state;
                const details: ActiveProviderDetails = {
                    activeProvider: state.active_provider === 'sim' || state.active_provider === 'smartflo'
                        ? state.active_provider
                        : null,
                    user: state.user,
                    organization: state.organization,
                    smartfloAgent: state.smartflo_agent ?? null,
                    resolution: state.resolution,
                };
                cachedProviderDetailsRef.current = details;
                setCallingProviderDetails(details);
                setActiveCallingProvider(details.activeProvider);
                if (details.activeProvider !== 'smartflo' && timelineView === 'smartflo_logs') {
                    setTimelineView('timeline');
                }
                return;
            }
            void loadProvider(true);
        };

        window.addEventListener('calling-provider-updated', handleCallingProviderUpdated);
        return () => {
            isMounted = false;
            window.removeEventListener('calling-provider-updated', handleCallingProviderUpdated);
        };
    }, [user?.uid, timelineView]);

    useEffect(() => {
        if (timelineView === 'smartflo_logs') {
            fetchSmartfloLogs();
        }
    }, [timelineView, fetchSmartfloLogs]);

    // Bridge Message Listener
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleMessage = async (e: any) => {
            const data = e.detail;
            console.log('📬 [Bridge] Received Message:', data);
            
            const eventType = data?.type;
            const phoneNo = data?.value || data?.payload;
            const eventVal = String(phoneNo || "").toLowerCase();
            
            const isDisconnectMsg = eventType === 'call_disconected' || 
                                    eventType === 'call_disconnect' || 
                                    eventType === 'call_disconnected' ||
                                    eventType === 'disconnected' ||
                                    eventVal === 'disconnected';

            const isCallStatusMsg = isDisconnectMsg || eventType === 'connecting' || eventType === 'connected';
            if (!isCallStatusMsg) return;

            let eventProvider = activeCallProviderRef.current;
            if (!eventProvider) {
                try {
                    eventProvider = cachedProviderDetailsRef.current?.activeProvider || await resolveActiveCallingProvider();
                } catch (providerError) {
                    console.warn('📬 [Bridge] Unable to verify provider; ignoring native call event.', providerError);
                    return;
                }
            }
            if (eventProvider !== 'sim') {
                console.log('📬 [Bridge] Ignoring native call event because SIM is not the active provider.');
                return;
            }
            activeCallProviderRef.current = eventProvider;
            
            if (isDisconnectMsg) {
                console.log('📬 [Bridge] Disconnect event detected:', eventType || eventVal);
                
                // Clear calling_status on disconnect
                if (user?.employeeId) {
                    updateSyncMetaCallingStatus(user.employeeId, null, eventProvider);
                }
                setLocalCallingStatus(null);

                // Match logic: If no phone provided, assume it's the current call. 
                // If phone provided, check last 10 digits.
                const disconnectedPhone = phoneNo ? String(phoneNo).replace(/\D/g, '').slice(-10) : null;
                // Decrypt phone number for matching logic
                const rawCustomerPhone = customer?.phone_no ? decryptPhone(customer.phone_no) : "";
                const currentPhone = String(rawCustomerPhone || "").replace(/\D/g, '').slice(-10);

                console.log(`📬 [Bridge] Matching: Received=${disconnectedPhone || 'NONE'}, Current=${currentPhone}`);

                if (!disconnectedPhone || disconnectedPhone === currentPhone) {
                    console.log('📬 [Bridge] ✅ MATCH (or generic disconnect). Triggering handleEndCall(true)...');
                    handleEndCall(true, eventProvider);
                } else {
                    console.log('📬 [Bridge] ❌ NUMBER MISMATCH. Ignoring.');
                }
            } else if (eventType === 'connecting' || eventType === 'connected') {
                // --- NUMBER VERIFICATION FOR CONNECTING/CONNECTED ---
                const incomingPhone = phoneNo ? String(phoneNo).replace(/\D/g, '').slice(-10) : null;
                const rawCustomerPhone = customer?.phone_no ? decryptPhone(customer.phone_no) : "";
                const currentPhone = String(rawCustomerPhone || "").replace(/\D/g, '').slice(-10);

                if (incomingPhone && incomingPhone !== currentPhone) {
                    console.log(`📬 [Bridge] ❌ NUMBER MISMATCH for ${eventType}. Incoming: ${incomingPhone}, Profile: ${currentPhone}. Ignoring.`);
                    return;
                }

                console.log(`📬 [Bridge] Setting status to: ${eventType}`);
                setLocalCallingStatus(eventType);
                
                // RESET TIMER ON CONNECTION: Talk time only starts when 'connected'
                if (eventType === 'connected') {
                    const actualNow = Date.now();
                    setCallStartTime(actualNow);
                    setCallDuration(0);
                    console.log('📬 [Bridge] ⏱️ Call CONNECTED. Resetting timer to start accurate Talk Time.');
                    
                    // Sync this accurate start time to server session so other devices match
                    if (user?.uid) {
                        const syncConnectedTime = async () => {
                             const { data: { session: authSession } } = await supabase.auth.getSession();
                             if (authSession) {
                                 await fetch("/api/auth/update-call-session", {
                                     method: "POST",
                                     headers: {
                                         "Content-Type": "application/json",
                                         Authorization: `Bearer ${authSession.access_token}`,
                                     },
                                     body: JSON.stringify({
                                         campaign_id: campaignId,
                                         customer_id: customerId,
                                         status: 'active' // This will set call_start_at to 'now' on server
                                     })
                                 });
                             }
                        };
                        syncConnectedTime();
                    }
                }

                // Sync to DB so Header and other components see it
                if (user?.employeeId) {
                    updateSyncMetaCallingStatus(user.employeeId, eventType, eventProvider);
                }
            }
        };

        window.addEventListener('tfc-bridge-message' as any, handleMessage);

        // Request device info as soon as bridge is ready
        requestDeviceInfoFromFlutter();

        return () => {
            window.removeEventListener('tfc-bridge-message' as any, handleMessage);
        };
    }, [user, campaignId, customerId, customer?.phone_no, isCalling, handleEndCall]);

    // Track lead changes for notification
    useEffect(() => {
        if (customerId && prevCustomerId.current && customerId !== prevCustomerId.current) {
            console.log('[Lead-Change] New lead detected, showing alert');
            setShowNewLeadAlert(true);
            const timer = setTimeout(() => setShowNewLeadAlert(false), 8000);
            return () => clearTimeout(timer);
        }
        if (customerId) {
            prevCustomerId.current = customerId as string;
        }
    }, [customerId]);

    // Close pickers on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsDatePickerOpen(false);
            }
            if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
                setIsTimePickerOpen(false);
            }
            if (assignPickerRef.current && !assignPickerRef.current.contains(event.target as Node)) {
                setIsAssignPickerOpen(false);
            }
            if (expiryDatePickerRef.current && !expiryDatePickerRef.current.contains(event.target as Node)) {
                setIsEditingExpiry(false);
            }
            if (detailsEditRef.current && !detailsEditRef.current.contains(event.target as Node)) {
                setIsEditingDetails(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dispositionHierarchy: Record<string, string[]> = {
        "Not Intrested": [],
        "Language barrier": [],
        "DND": [],
        "Wrong NO": [],
        "Ported / Expired": [],
        "Already Renewed": [],
        "Not Contactable": ["busy","Switch off", "Ring", "not reachable", "others"],
      "Call Back": ["Interested", "Follow up", "Not Connected"],
        "Deal Done": [],
    };

    const [outcome, setOutcome] = useState("");
    const [userOutcomes, setUserOutcomes] = useState<any[]>([]);
    const [newOutcomeInput, setNewOutcomeInput] = useState("");
    const [isAddingOutcome, setIsAddingOutcome] = useState(false);

    useEffect(() => {
        if (user && subDisposition && (disposition === 'Call Back' || disposition === 'Not Contactable')) {
            fetchUserOutcomes();
        } else {
            setUserOutcomes([]);
        }
    }, [user, subDisposition, disposition]);

    const fetchUserOutcomes = async () => {
        if (!user?.uid || !subDisposition) return;
        const { data } = await supabase
            .from('user_outcomes')
            .select('*')
            .eq('user_id', user.uid)
            .eq('parent_category', subDisposition);
        setUserOutcomes(data || []);
    };

    const handleAddOutcome = async () => {
        if (!newOutcomeInput.trim() || !user?.uid || !subDisposition) return;
        
        try {
            const { error } = await supabase.from('user_outcomes').insert({
                user_id: user.uid,
                parent_category: subDisposition,
                outcome_label: newOutcomeInput.trim()
            });
            if (error) throw error;
            setNewOutcomeInput("");
            setIsAddingOutcome(false);
            fetchUserOutcomes();
        } catch (e) {
            console.error("Error adding outcome:", e);
            alert("Failed to add outcome");
        }
    };

    const handleDeleteOutcome = async (id: string) => {
        try {
            await supabase.from('user_outcomes').delete().eq('id', id);
            fetchUserOutcomes();
        } catch (e) {
            console.error("Error deleting outcome:", e);
        }
    };

    const handleSkipCall = async () => {
        if (!user?.uid || !campaignId || !customerId) return;
        try {
            // Update the callback timestamp to null effectively skipping/rescheduling it later
            // Or better, keep it but just move to next lead without calling.
            // Requirement was: "skip follow up call" which usually means treat as done or move forward.
            // Let's assume it means "Mark as skipped/done for now" or just find next lead.
            // Based on context of "Skip", we probably just want to execute "End/Next" logic without placing a call.
            
            // Actually, handleEndCall(false) might try to update SyncMeta logs which is fine.
            // But we didn't start a call.
            
            // To be safe, let's just use the router logic to go to next or dashboard 
            // similar to handleSaveDisposition's flow but simpler.
            // OR reuse handleEndCall logic if it handles "no call started" gracefully.
            // Looking at handleEndCall: "if localCallingStatus !== connected ... setCallDuration(0)"
            // It seems safe to call handleEndCall(false) to trigger the "Post Call" state 
            // so user can disposition it as "Skipped" or "Not Contactable" etc.
            
            // Wait, UI text says "Skip Follow Up". If we drag, does it mean "Don't call this guy, give me next"?
            // If so, we should probably just navigate away.
            // Let's assume the user wants to Disposition it as "Skipped" or just return to queue.
            
            // For now, let's make it trigger the "Post Call" view immediately without dialing.
            // Reset manual mode in DB immediately if we are skipping 
            // so that if redirection fails, we aren't stuck.
            if (user?.uid && campaignId) {
                await supabase.from('call_sessions').update({
                    is_manual: false,
                    manual_campaign_id: null,
                    manual_customer_id: null,
                    manual_status: null,
                    updated_at: new Date().toISOString()
                }).eq('user_id', user.uid).eq('campaign_id', campaignId);
            }
            
            handleEndCall(false); 
        } catch (error) {
            console.error("Error skipping call:", error);
        }
    };

    const primaryDispositions = (isAccessDeniedManual && customer?.disposition !== 'Not Contactable') 
        ? ["Call Back", "Deal Done"] 
        : Object.keys(dispositionHierarchy);

    const isSmartfloCall = activeCallProviderRef.current === 'smartflo' || Boolean(activeSmartfloRefIdRef.current) || Boolean(smartfloLifecycle);

    const isAgentAnswered = Boolean(
        isCalling && (
            isSmartfloCall
                ? (smartfloLifecycle?.agentColor === 'green')
                : (localCallingStatus === 'connected' || !isPlacingCall)
        )
    );

    const isCustomerAnswered = Boolean(
        isCalling && isAgentAnswered && (
            isSmartfloCall
                ? (smartfloLifecycle?.customerColor === 'green' || smartfloLifecycle?.customerSublabel === 'Speaking' || smartfloLifecycle?.customerSublabel === 'Connected')
                : (localCallingStatus === 'connected')
        )
    );

    const isCustomerRinging = Boolean(
        isCalling && isAgentAnswered && !isCustomerAnswered
    );

    const isWaitingForAgent = isPlacingCall || (isCalling && !isAgentAnswered);

    const agentAnsweredAtRef = useRef<number | null>(null);
    const customerAnsweredAtRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isCalling) {
            agentAnsweredAtRef.current = null;
            customerAnsweredAtRef.current = null;
            return;
        }

        if (isAgentAnswered && agentAnsweredAtRef.current === null) {
            agentAnsweredAtRef.current = Date.now();
        }

        if (isCustomerAnswered && customerAnsweredAtRef.current === null) {
            const answerTime = Date.now();
            customerAnsweredAtRef.current = answerTime;
            setCallStartTime(answerTime);
            setCallDuration(0);
        }
    }, [isCalling, isAgentAnswered, isCustomerAnswered]);

    useEffect(() => {
        let interval: any;
        
        const updateDuration = () => {
            if (isCalling && isCustomerAnswered && callStartTime) {
                // Calibrate duration using server offset
                const now = Date.now() + serverTimeOffset;
                const diff = Math.floor((now - callStartTime) / 1000);
                setCallDuration(diff > 0 ? diff : 0);
            }
        };

        if (isCalling && isCustomerAnswered && callStartTime && !isAssigning) {
            updateDuration(); // Sync immediately
            interval = setInterval(updateDuration, 1000);
        } else {
            clearInterval(interval);
            if (!isCustomerAnswered) {
                setCallDuration(0);
            }
        }
        return () => clearInterval(interval);
    }, [isCalling, isCustomerAnswered, callStartTime, serverTimeOffset, isAssigning]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '—';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear());
            return `${day}/${month}/${year}`;
        } catch (e) {
            return '—';
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    useEffect(() => {
        if (customer?.customer_details) {
            try {
                const data = typeof customer.customer_details === 'string' ? JSON.parse(customer.customer_details) : customer.customer_details;
                if (data?.active_details) {
                    setViewingDetailsKey(data.active_details);
                }
            } catch (e) {}
        }
    }, [customer]);

    const renderCleanedDetails = (details: any) => {
        if (!details) return <p className="text-gray-400 italic">No information available</p>;
        
        let rawData = details;
        if (typeof details === 'string') {
            try {
                rawData = JSON.parse(details);
            } catch (e) {
                return <p className="italic">"{details}"</p>;
            }
        }

        if (typeof rawData !== 'object' || rawData === null) {
            return <p className="italic">"{String(rawData)}"</p>;
        }

        let data = rawData;
        let isStructured = false;
        let keys: string[] = [];
        
        if (rawData.active_details && rawData.history) {
            isStructured = true;
            keys = Object.keys(rawData.history).sort((a, b) => {
                const numA = parseInt(a.split('-')[1]);
                const numB = parseInt(b.split('-')[1]);
                return numA - numB;
            });
            const currentKey = viewingDetailsKey || rawData.active_details;
            data = rawData.history[currentKey] || {};
        }

        const handleNext = () => {
            const currentKey = viewingDetailsKey || rawData.active_details;
            const currentIndex = keys.indexOf(currentKey);
            const nextIndex = (currentIndex + 1) % keys.length;
            setViewingDetailsKey(keys[nextIndex]);
        };

        const handlePrev = () => {
            const currentKey = viewingDetailsKey || rawData.active_details;
            const currentIndex = keys.indexOf(currentKey);
            const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
            setViewingDetailsKey(keys[prevIndex]);
        };

        return (
            <div className="flex flex-col h-full">
                {isStructured && keys.length > 1 && (
                    <div className="flex items-center justify-between mb-5 bg-indigo-50 p-1.5 rounded-2xl border border-indigo-100 shadow-sm">
                        <button 
                            onClick={handlePrev}
                            className="w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm"
                        >
                            <i className="fi flex fi-rr-angle-left mt-0.5"></i>
                        </button>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] font-black text-indigo-300 uppercase tracking-tighter">DATA HISTORY</span>
                            <span className="text-xs font-black text-indigo-900">
                                {String(viewingDetailsKey || rawData.active_details).replace('details-', 'RECORD #')}
                            </span>
                        </div>

                        <button 
                            onClick={handleNext}
                            className="w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm"
                        >
                            <i className="fi flex fi-rr-angle-right mt-0.5"></i>
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-1 gap-3">
                    {Object.entries(data).map(([key, value]) => {
                        const cleanKey = key.replace(/_(un)?checked/gi, '').replace(/_/g, ' ');
                        return (
                            <div key={key} className="flex flex-col border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                <span className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>{cleanKey}</span>
                                <span className="text-[13px] font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{String(value)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };


    const handleUpdateManagedBy = async (userId: string) => {
        if (!customer?.id) return;
        try {
            const { error } = await supabase
                .from('customers')
                .update({ managed_by: userId })
                .eq('id', customer.id);
            
            if (error) throw error;
            
            setCustomer((prev: any) => ({ ...prev, managed_by: userId }));
            
            // Update local info immediately
            const foundInCampaign = campaign?.users?.find((u: any) => (u.user_id || u.id) === userId);
            if (foundInCampaign) {
                setManagedByInfo({ 
                    name: foundInCampaign.name, 
                    empId: foundInCampaign.employee_id || userId.slice(0, 8).toUpperCase()
                });
            } else {
                setManagedByInfo({ name: "Self", empId: "" });
            }

            setIsAssignPickerOpen(false);
        } catch (err) {
            console.error("Error updating managed_by:", err);
            alert("Failed to update manager");
        }
    };

    const handleUpdateExpiry = async (newDate: string) => {
        if (!customer?.id || !newDate) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('customers')
                .update({ expiry_date: newDate })
                .eq('id', customer.id);
            
            if (error) throw error;
            
            setCustomer((prev: any) => ({ ...prev, expiry_date: newDate }));
            setIsEditingExpiry(false);
        } catch (err) {
            console.error("Error updating expiry_date:", err);
            alert("Failed to update expiry date");
        } finally {
            setSaving(false);
        }
    };

    const handleEditDetailsClick = () => {
        let currentData = {};
        if (customer?.customer_details) {
            try {
                const rawData = typeof customer.customer_details === 'string' ? JSON.parse(customer.customer_details) : customer.customer_details;
                if (rawData?.active_details && rawData?.history) {
                    const activeKey = viewingDetailsKey || rawData.active_details;
                    currentData = rawData.history[activeKey] || {};
                } else if (rawData && typeof rawData === 'object') {
                    currentData = rawData;
                }
            } catch (e) {
                console.error("Error parsing details for editor:", e);
                // If it's a string but NOT JSON, we treat it as value for a generic 'Note' field
                if (typeof customer.customer_details === 'string') {
                    currentData = { "Details": customer.customer_details };
                }
            }
        }
        
        // Convert to array of objects for easier editing
        const detailsArray = Object.entries(currentData).map(([key, value]) => ({
            id: Math.random().toString(36).substring(2, 9),
            key: key.replace(/_(un)?checked/gi, '').replace(/_/g, ' '),
            originalKey: key,
            value: String(value)
        }));
        
        setTempDetails(detailsArray);
        setIsEditingDetails(true);
    };

    const handleSaveDetails = async () => {
        if (!customer?.id) return;
        setSaving(true);
        try {
            const updatedSubData: Record<string, any> = {};
            tempDetails.forEach(item => {
                if (!item.key.trim()) return;
                // Use original key if it hasn't changed, otherwise derive from key name
                const k = item.originalKey || item.key.trim().replace(/\s+/g, '_').toLowerCase();
                updatedSubData[k] = item.value;
            });

            let finalDetails = customer.customer_details;
            if (typeof finalDetails === 'string') {
                try {
                    finalDetails = JSON.parse(finalDetails);
                } catch (e) {
                    // Not JSON? Overwrite with object
                    finalDetails = updatedSubData;
                }
            }

            if (finalDetails && typeof finalDetails === 'object' && finalDetails.active_details && finalDetails.history) {
                const activeKey = viewingDetailsKey || finalDetails.active_details;
                finalDetails.history[activeKey] = updatedSubData;
            } else {
                finalDetails = updatedSubData;
            }

            const { error } = await supabase
                .from('customers')
                .update({ 
                    customer_details: typeof finalDetails === 'string' ? finalDetails : JSON.stringify(finalDetails) 
                })
                .eq('id', customer.id);
            
            if (error) throw error;
            
            setCustomer((prev: any) => ({ ...prev, customer_details: finalDetails }));
            setIsEditingDetails(false);
        } catch (err) {
            console.error("Error saving details:", err);
            alert("Failed to save details");
        } finally {
            setSaving(false);
        }
    };

    const fetchData = async (overrideId?: string) => {
        const idToFetch = overrideId || customerId;
        if (!campaignId || !idToFetch || !user) return;
        
        setError("");
        
        // ⚡ INSTANT PRE-FETCH RESTORATION
        const isPrefetched = prefetchedDataRef.current && String(prefetchedDataRef.current.id) === String(idToFetch);
        
        if (isPrefetched) {
            setCustomer(prefetchedDataRef.current.customer);
            setLiveNotes(prefetchedDataRef.current.customer?.live_notes || "");
            if (prefetchedDataRef.current.history) {
                setHistory(prefetchedDataRef.current.history);
                if (typeof prefetchedDataRef.current.totalCount === 'number') {
                    setTotalAttemptsCount(prefetchedDataRef.current.totalCount);
                }
                const hasMore = prefetchedDataRef.current.hasMore === true;
                setHasMoreTimeline(hasMore);
                timelineOffsetRef.current = prefetchedDataRef.current.history.length;
                if (hasMore) {
                    void ghostFetchTimeline(String(idToFetch), prefetchedDataRef.current.history.length);
                }
            }
            setLoading(false);
            setTelemetry({
                authTime: 0,
                guardTime: 0,
                leadTime: 0,
                sessionTime: 0,
                parallelGroupTime: 0,
                managerTime: 0,
                timelineTime: 0,
                unblockTime: 0,
                mobileLogsTime: null,
                schedulesTime: null,
                smartfloTime: null,
                leadId: String(idToFetch),
                measuredAt: `${new Date().toLocaleTimeString()} (Instant Prefetch)`
            });
        } else {
            setLoading(true);
        }
        
        // (Note: Schedules & Mobile Logs are lazy loaded on their respective tab clicks)
        setTimeout(() => void fetchDailyStats(), 150);
        
        const tTotalStart = performance.now();
        let guardDuration = 0;
        let custDuration = 0;
        let sessionDuration = 0;
        
        try {

            // ⚡ ATOMIC UNIFIED RPC: 1 Single Server Round-Trip (Eliminates multiple network flights to Sydney)
            const tBundle0 = performance.now();
            let bundleRes: any = null;
            if (isPrefetched && prefetchedDataRef.current?.customer) {
                bundleRes = {
                    data: {
                        success: true,
                        has_access: true,
                        is_access_denied_manual: false,
                        campaign: campaign,
                        customer: prefetchedDataRef.current.customer,
                        session: null,
                        manager: null,
                        attempts_count: typeof prefetchedDataRef.current.totalCount === 'number' 
                            ? prefetchedDataRef.current.totalCount 
                            : (prefetchedDataRef.current.customer?.attempt_count || 0)
                    },
                    error: null
                };
            } else {
                bundleRes = await supabase.rpc('get_lead_page_bundle', {
                    p_campaign_id: String(campaignId),
                    p_user_id: user?.uid,
                    p_customer_id: idToFetch || null
                });
            }
            const bundleDuration = Math.round(performance.now() - tBundle0);
            guardDuration = bundleDuration;
            custDuration = bundleDuration;
            sessionDuration = bundleDuration;
            
            // Process Lead Page Bundle
            const bundleErr = bundleRes?.error;
            const bundleResult = bundleRes?.data;
            if (bundleErr) {
                console.error("[Bundle] RPC error:", bundleErr);
                throw bundleErr;
            }

            if (!bundleResult || bundleResult.success === false) {
                throw new Error(bundleResult?.error || "Failed to load lead bundle");
            }

            if (bundleResult.has_access === false) {
                console.warn(`[Guard] Access Denied for ${user?.email} to Campaign ${campaignId}. Redirecting.`);
                setLoading(false);
                router.push('/portal/campaign');
                return;
            }

            if (bundleResult.is_access_denied_manual) {
                console.log("[Guard] Allowing temporary access for unauthorized manual dial.");
                setIsAccessDeniedManual(true);
            }

            const campData = bundleResult.campaign;
            if (campData) {
                setCampaign(campData);
            }

            // Process Customer Lead
            let foundCustomer: any = null;
            if (isPrefetched && prefetchedDataRef.current?.customer) {
                foundCustomer = prefetchedDataRef.current.customer;
                prefetchedDataRef.current = null;
                console.log('⚡ [Pre-fetch] Sync complete!');
            } else if (bundleResult.customer) {
                foundCustomer = bundleResult.customer;
            } else {
                // Fallbacks: Try closed_deals, then rejected_leads
                const { data: clDataRows } = await supabase
                    .from('closed_deals')
                    .select('*')
                    .eq('id', idToFetch)
                    .limit(1);
                
                if (clDataRows && clDataRows[0]) {
                    foundCustomer = clDataRows[0];
                } else {
                    const { data: rDataRows } = await supabase
                        .from('rejected_leads')
                        .select('*')
                        .eq('id', idToFetch)
                        .limit(1);
                    if (rDataRows && rDataRows[0]) {
                        foundCustomer = {
                            ...rDataRows[0],
                            assigned_to: rDataRows[0].assigned_to || rDataRows[0].agent_id || null,
                            _isFromRejectedLeads: true
                        };
                    }
                }
            }

            if (foundCustomer) {
                if (foundCustomer.assigned_to && String(foundCustomer.assigned_to) !== String(user.uid)) {
                    console.warn(`[Guard] Lead assigned to another user: ${foundCustomer.assigned_to}. Restricting access.`);
                    setIsAccessDeniedManual(true);
                }

                setCustomer(foundCustomer);
                setLiveNotes(foundCustomer.live_notes || "");
                if (typeof bundleResult.attempts_count === 'number') {
                    setTotalAttemptsCount(bundleResult.attempts_count);
                } else if (!isPrefetched) {
                    setTotalAttemptsCount(prev => (prev > 0 ? prev : (foundCustomer.attempt_count || 0)));
                }
                if (typeof customerId === 'string') {
                    fetchAttachments(String(customerId));
                }
                
                // Resolve Manager Info: Check bundle's pre-computed manager info (0ms)
                const tManager0 = performance.now();
                if (bundleResult.manager && bundleResult.manager.name) {
                    setManagedByInfo(bundleResult.manager);
                } else if (foundCustomer.managed_by) {
                    const campUser = (campData?.users || campaign?.users)?.find(
                        (u: any) => (u.user_id || u.id) === foundCustomer.managed_by
                    );
                    
                    if (campUser) {
                        setManagedByInfo({
                            name: campUser.name || "Unknown",
                            empId: campUser.employee_id || foundCustomer.managed_by.slice(0, 8).toUpperCase()
                        });
                    } else {
                        const { data: mRows } = await supabase
                            .from('user_profiles')
                            .select('user_name, employee_id')
                            .eq('user_id', foundCustomer.managed_by)
                            .limit(1);
                        
                        const mData = mRows ? mRows[0] : null;
                        if (mData) {
                            setManagedByInfo({
                                name: mData.user_name || "Unknown",
                                empId: mData.employee_id || foundCustomer.managed_by.slice(0, 8).toUpperCase()
                            });
                        } else {
                            setManagedByInfo({ name: "Unknown", empId: foundCustomer.managed_by.slice(0, 8).toUpperCase() });
                        }
                    }
                } else {
                    setManagedByInfo({ name: "Self", empId: "" });
                }
                const managerDuration = Math.round(performance.now() - tManager0);

                // Restore active call session immediately (from atomic bundleResult.session)
                const currentSession = bundleResult.session;
                if (currentSession) {
                    const session = currentSession;
                    const isManualModeFromSession = session.is_manual === true;
                    const sessionCustomerId = isManualModeFromSession ? session.manual_customer_id : session.customer_id;
                    const sessionStatus = isManualModeFromSession ? (session.manual_status || session.status) : session.status;
                    const sessionStartTime = session.call_start_at;

                    if (String(sessionCustomerId) === String(idToFetch)) {
                        console.log(`[Fetch-Session] Active session found for this lead: ${sessionStatus}`);
                        setIsManualMode(isManualModeFromSession);
                        if (isManualModeFromSession && session.manual_customer_id && session.customer_id && String(session.manual_customer_id) !== String(session.customer_id)) {
                            setIsInterruption(true);
                        } else {
                            setIsInterruption(false);
                        }

                        if (sessionStatus === 'active') {
                            setIsCalling(true);
                            setPostCall(false);
                            if (sessionStartTime) {
                                const start = parseUTCtoMS(sessionStartTime);
                                if (start) setCallStartTime(start);
                            }
                        } else if (sessionStatus === 'disposition_pending') {
                            setIsCalling(false);
                            setPostCall(true);
                        }
                    }
                }

                // ⚡ UNBLOCK SCREEN: Customer & session data ready, reveal UI immediately!
                setLoading(false);
                const unblockDuration = Math.round(performance.now() - tTotalStart);
                setTelemetry(prev => ({
                    authTime: 0,
                    guardTime: guardDuration,
                    leadTime: custDuration,
                    sessionTime: sessionDuration,
                    parallelGroupTime: bundleDuration,
                    managerTime: managerDuration,
                    timelineTime: prev?.timelineTime || 0,
                    unblockTime: unblockDuration,
                    mobileLogsTime: prev?.mobileLogsTime ?? null,
                    schedulesTime: prev?.schedulesTime ?? null,
                    smartfloTime: prev?.smartfloTime ?? null,
                    leadId: String(idToFetch),
                    measuredAt: new Date().toLocaleTimeString()
                }));
            } else {
                console.warn(`[Fetch] Customer ${idToFetch} not found in any table.`);
                const sessionData = bundleResult.session;

                // If user has a session for THIS missing customer, clear and re-assign
                if (sessionData && sessionData.customer_id === idToFetch) {
                    console.log(`[Ghost-Recovery] Ghost session detected for customer ${idToFetch}. Clearing and re-assigning...`);
                    
                    await supabase
                        .from('call_sessions')
                        .delete()
                        .eq('user_id', user.uid)
                        .eq('campaign_id', campaignId);

                    const { data: nextLeadId } = await supabase.rpc('assign_next_lead', {
                        p_campaign_id: campaignId,
                        p_user_id: user.uid
                    });

                    const targetCampaignId = campaignId || campaign?.id;
                    if (nextLeadId && targetCampaignId) {
                        await supabase.from('call_sessions').upsert({
                            user_id: user.uid,
                            campaign_id: targetCampaignId,
                            customer_id: nextLeadId,
                            organization_id: campData?.organization_id,
                            status: 'assigned',
                            is_manual: false, // STANDARD CRM WORKFLOW
                            manual_campaign_id: null,
                            manual_customer_id: null,
                            manual_status: null,
                            call_start_at: null,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'user_id,campaign_id' });
                        setLocalCallingStatus(null);
                        setIsAssigning(true);
                        setAssignmentCountdown(3);
                        setTargetNextLead({ id: nextLeadId, campaignId: targetCampaignId });
                        fetchDailyStats();
                        return;
                    } else if (targetCampaignId) {
                        setIsAssigning(true);
                        setAssignmentCountdown(3);
                        setTargetNextLead({ id: "", campaignId: targetCampaignId }); // fallback to campaign list
                        fetchDailyStats();
                        return;
                    } else {
                        setIsAssigning(true);
                        setAssignmentCountdown(3);
                        setTargetNextLead(null); // default fallback
                        fetchDailyStats();
                        return;
                    }
                } else {
                    // No matching session for this missing customer, but page is broken. 
                    // Redirect to dashboard to be safe.
                    console.warn(`[Fetch] No session matches missing customer ${idToFetch}. Redirecting to safety.`);
                    const targetCampaignId = campaignId || campaign?.id;
                    if (targetCampaignId) {
                        // CRITICAL FIX: Clear the session in DB to prevent SessionContext from looping back here
                        await supabase.from('call_sessions').delete().eq('user_id', user.uid).eq('campaign_id', targetCampaignId);
                        router.push(`/portal/campaign/${targetCampaignId}`);
                    } else {
                        router.push('/portal/campaign');
                    }
                    return;
                }
            }

            // 3. Fetch Initial Timeline (Latest 5 notes only with Ghost Buffer)
            if (!isPrefetched) {
                void fetchInitialTimeline(String(idToFetch));
            } else {
                setTimeout(() => void fetchInitialTimeline(String(idToFetch)), 500);
            }
            // (Mobile Logs and Schedules are lazy-loaded on respective tab clicks)

            // (Active call session state was already initialized concurrently in Step 0)
        } catch (err: any) {
            console.error("[Fetch] Error in fetchData:", err);
            setError(err.message);
        } finally {
            setLoading(false);
            // Automatically clear transition screen after 3.5s if it gets stuck
            if (isAssigning) {
                setTimeout(() => setIsAssigning(false), 3500);
            }
        }
    };


    useEffect(() => {
        if (router.isReady && user) {
            // Reset states for new customer
            setCustomer(null);
            setHistory([]);
            setMobileLogs([]);
            setScheduledCalls([]);
            setHasMoreTimeline(false);
            setHasMoreMobileLogs(false);
            setHasMoreSchedules(false);
            setIsLoadingInitialTimeline(false);
            setIsLoadingMoreTimeline(false);
            setIsLoadingMobileLogs(false);
            setIsLoadingMoreMobileLogs(false);
            setIsLoadingSchedules(false);
            setIsLoadingMoreSchedules(false);
            setSmartfloVisibleCount(5);
            timelineGhostBufferRef.current = null;
            mobileLogsGhostBufferRef.current = null;
            schedulesGhostBufferRef.current = null;
            timelineOffsetRef.current = 0;
            mobileLogsOffsetRef.current = 0;
            schedulesOffsetRef.current = 0;
            setDisposition("");
            setSubDisposition("");
            setNotes("");
            const cNow = new Date();
            const futureLoad = new Date(cNow.getTime() + 5 * 60000);
            setCallbackDate(`${futureLoad.getFullYear()}-${String(futureLoad.getMonth() + 1).padStart(2, '0')}-${String(futureLoad.getDate()).padStart(2, '0')}`);
            setCallbackTime(futureLoad.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
            setCallDuration(0);
            setIsCalling(false);
            setPostCall(false);
            setLocalCallingStatus(null);
            setIsAccessDeniedManual(false);
            setError("");
            
            setLocalCallingStatus(null);
            setIsAccessDeniedManual(false);
            setError("");
            
            // Reset assignment ONLY if it wasn't triggered intentionally (safety)
            if (!targetNextLead) {
                setIsAssigning(false);
                setAssignmentCountdown(3);
            }
            setIsPhoneUnmasked(false);
            
            fetchData();
        }
    }, [router.isReady, campaignId, customerId, user?.uid]);

    // ⏱️ Consolidated Countdown & Navigation Logic
    useEffect(() => {
        if (!isAssigning) return;
        
        const timer = setInterval(() => {
            setAssignmentCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Navigation trigger
                    if (targetNextLead?.id) {
                        router.push(`/portal/campaign/${targetNextLead.campaignId}/${targetNextLead.id}`);
                    } else if (targetNextLead?.campaignId) {
                        router.push(`/portal/campaign/${targetNextLead.campaignId}`);
                    } else {
                        router.push('/portal/campaign');
                    }
                    setIsAssigning(false);
                    setTargetNextLead(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isAssigning, targetNextLead, router]);

    const parseUTCtoMS = (timestamp: string) => {
        if (!timestamp) return null;
        // Normalize: replace space with T, and handle offsets
        let normalized = timestamp.replace(" ", "T");
        
        // If it ends with +00 or +00:00, replace with Z for absolute UTC parsing
        if (normalized.includes("+00")) {
            normalized = normalized.split("+")[0] + "Z";
        }

        const date = new Date(normalized);
        const ms = date.getTime();
        
        if (isNaN(ms)) {
            console.error('[Time] Invalid timestamp format:', timestamp);
            return null;
        }
        
        return ms; // Returns UTC milliseconds
    };

useEffect(() => {
    if (isApiUpdatingRef.current) return;
    
    const currentCustomerId = String(customerId || "");
    
    // Find if there's a session for the lead we are CURRENTLY viewing
    // This allows the UI to stay 'active' even if we are manually inspecting while another lead is 'Hot'
    const thisLeadSession = allSessions.find(s => String(s.customer_id) === currentCustomerId);
    
    // We prioritize the globalHotSession if we are NOT manually locked, 
    // but if we are manually on THIS page, we use thisLeadSession to drive the buttons/timer.
    const sessionToProcess = thisLeadSession || globalHotSession;

    if (!sessionToProcess) {
        setIsCalling(false);
        setPostCall(false);
        setCallDuration(0);
        return;
    }

    const isManualModeFromSession = sessionToProcess.is_manual === true;
    const sessionStatus = isManualModeFromSession ? (sessionToProcess.manual_status || sessionToProcess.status) : sessionToProcess.status;

    setIsManualMode(isManualModeFromSession);
    setIsInterruption(!!(isManualModeFromSession && sessionToProcess.manual_customer_id && sessionToProcess.customer_id && String(sessionToProcess.manual_customer_id) !== String(sessionToProcess.customer_id)));

    if (sessionStatus === 'active') {
        setPostCall(false);
        setIsCalling(true);
        if (sessionToProcess.call_start_at) {
            const start = parseUTCtoMS(sessionToProcess.call_start_at);
            if (start) setCallStartTime(start);
        }
    } else if (sessionStatus === 'assigned') {
        setIsCalling(false);
        setPostCall(false);
        setIsAssigning(false); 
        setCallDuration(0);
        setCallStartTime(null);
    } else if (sessionStatus === 'disposition_pending') {
        setIsCalling(false);
        setIsEndingCall(false);
        setPostCall(true);
    } else if (sessionStatus === 'closed') {
        setIsCalling(false);
        setIsEndingCall(false);
        setPostCall(false);
        setIsAssigning(false);
        setCallDuration(0);
        setCallStartTime(null);
    }
}, [globalHotSession, allSessions, customerId]);

    useEffect(() => {
        // Only check status if calling is active
        if (!user?.employeeId || !isCalling) return;

        const fetchStatus = async () => {
            try {
                const { data } = await supabase
                    .from('sync_meta')
                    .select('calling_status')
                    .eq('employee_id', user.employeeId)
                    .eq('is_primary', true)
                    .maybeSingle();
                
                if (data?.calling_status) {
                    setLocalCallingStatus(data.calling_status);
                }
            } catch (e) {
                console.error("Status polling error:", e);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 30000); // 30s status polling (matching heartbeat)

        return () => clearInterval(interval);
    }, [user?.employeeId, isCalling]);

    // Initial State Restoration
    useEffect(() => {
        if (user && campaignId && customerId) {
            const session = user.currentCallSession as any;
            // Check if this is the active session for the current page
            if (session && String(session.campaign_id) === String(campaignId) && String(session.customer_id) === String(customerId)) {
                if (session.status === 'active') {
                    setIsCalling(true);
                    setPostCall(false);
                    // Calculate duration since start
                    if (session.call_start_at) {
                        const start = parseUTCtoMS(session.call_start_at);
                        if (start) setCallStartTime(start);
                    }
                } else if (session.status === 'assigned') {
                    setIsCalling(false);
                    setPostCall(false);
                } else if (session.status === 'disposition_pending') {
                    setIsCalling(false);
                    setPostCall(true);
                }
            }
        }
    }, [user, campaignId, customerId]);

    // Prevent Past Time Selection: If user picks a time that passed today, show alert
    useEffect(() => {
        if (!callbackTime || !callbackDate || loading) return;

        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        if (callbackDate === todayStr) {
            const [hours, minutes] = callbackTime.split(':').map(Number);
            const selectedDateTime = new Date();
            selectedDateTime.setHours(hours, minutes, 0, 0);

            // 1-minute grace period to avoid annoying alerts on just-passed seconds
            if (selectedDateTime.getTime() < now.getTime() - 60000) {
                alert("⚠️ Cannot schedule a callback in the past! Please select a future time.");
                // Reset to current time
                const correctedTime = new Date();
                setCallbackTime(correctedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
            }
        }
        
        // Clear conflict on change to allow new check
        if (conflictInfo) setConflictInfo(null);
    }, [callbackTime, callbackDate, loading]);

    const fetchDailyStats = async () => {
        if (!user?.uid || !campaignId) return;
        try {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            
            const { count, error } = await supabase
                .from('call_logs')
                .select('*', { count: 'exact', head: true })
                .eq('last_updated_by', user.uid)
                .eq('campaign_id', campaignId)
                .gte('created_at', todayStart.toISOString());
            
            if (!error && count !== null) {
                setDailyLeadCount(count);
            }
        } catch (e) {
            console.error("Error fetching daily stats:", e);
        }
    };
    
    // 🔥 SYNC GLOBAL CALL STATUS FLAG
    // This ensures that the CallReminderOverlay (and other components) know the user is busy
    // whenever they are either on an active call OR pending a disposition.
    useEffect(() => {
        const isBusy = isCalling || postCall;
        if (typeof window !== "undefined") {
            const currentVal = localStorage.getItem('app_is_calling_active');
            const targetVal = isBusy ? 'true' : 'false';
            
            if (currentVal !== targetVal) {
                console.log(`[Busyness-Sync] Setting app_is_calling_active = ${targetVal} (isCalling: ${isCalling}, postCall: ${postCall})`);
                localStorage.setItem('app_is_calling_active', targetVal);
                window.dispatchEvent(new Event('app_call_state_change'));
            }
        }
    }, [isCalling, postCall]);

    // Background Lead Pre-fetching
    const prefetchPromiseRef = useRef<any>(null);
    const prefetchedDataRef = useRef<any>(null);

    useEffect(() => {
        // USER RULE: 
        // 1. Standard CRM Lead (isManualMode == false) -> Prefetch Next
        // 2. Manual Call on THE SAME lead (Manual == System) -> Prefetch Next
        // 3. Manual Interruption (Manual != System) -> DONT Prefetch
        const shouldPrefetch = !isManualMode || (isManualMode && !isInterruption);

        if (disposition && user?.uid && campaignId && customerId && prefetchStatus === 'idle' && shouldPrefetch) {
            console.log('⚡ [Pre-fetch] Background fetching next lead & data...');
            setPrefetchStatus('fetching');
            
            const performPrefetch = async (retryCount = 0) => {
                let timerId: any = null;
                try {
                    // Safe 10s timeout that cleans up immediately upon resolution
                    const timeoutPromise = new Promise<never>((_, rej) => {
                        timerId = setTimeout(() => rej(new Error("Prefetch timeout")), 10000);
                    });
                    
                    const rpcPromise = supabase.rpc('assign_next_lead', {
                        p_campaign_id: String(campaignId),
                        p_user_id: user.uid,
                        p_exclude_lead_id: (typeof customerId === 'string' && customerId.length === 36) ? customerId : null
                    });

                    const res: any = await Promise.race([rpcPromise, timeoutPromise]);
                    if (timerId) clearTimeout(timerId);
                    
                    if (res?.error) {
                        console.warn('[Pre-fetch] assign_next_lead RPC error:', res.error);
                        setPrefetchStatus('error');
                        return;
                    }

                    if (res?.data) {
                        const nextId = res.data;

                        // Case 4: Duplicate Check -> Recount if we got the same lead back
                        if (String(nextId) === String(customerId) && retryCount < 2) {
                            console.log('🔄 [Pre-fetch] Duplicate lead detected. Retrying...');
                            return performPrefetch(retryCount + 1);
                        }

                        try {
                            const [cRes, hRes, countRes] = await Promise.all([
                                supabase.from('customers').select('*').eq('id', nextId).limit(1).maybeSingle(),
                                fetch(`/api/call/history?customerId=${nextId}&limit=5&offset=0`).then(r => r.json()).catch(() => null),
                                supabase.from('call_logs').select('*', { count: 'exact', head: true }).eq('customer_id', nextId)
                            ]);
                            
                            const exactCount = typeof countRes?.count === 'number'
                                ? countRes.count
                                : (typeof hRes?.totalCount === 'number'
                                    ? hRes.totalCount
                                    : (cRes.data?.attempt_count || 0));

                            prefetchedDataRef.current = {
                                id: nextId,
                                customer: cRes.data,
                                history: hRes?.success ? hRes.data : [],
                                totalCount: exactCount,
                                hasMore: hRes?.hasMore === true && hRes?.data?.length === 5
                            };

                            // ⚡ MULTI-DEVICE STAGING BUFFER: Sync staged_next_lead_id to call_sessions
                            // Keeps current customer_id (Lead A) unchanged so other devices never flicker!
                            if (user?.uid && campaignId) {
                                supabase
                                    .from('call_sessions')
                                    .update({
                                        staged_next_lead_id: String(nextId),
                                        updated_at: new Date().toISOString()
                                    })
                                    .eq('user_id', user.uid)
                                    .eq('campaign_id', campaignId)
                                    .then(() => {}, (e: any) => console.warn('[Staged Buffer] Sync warning:', e));
                            }

                            setPrefetchStatus('ready');
                            console.log('⚡ [Pre-fetch] Ready for:', nextId);
                        } catch (e) {
                             console.error('Prefetch data error:', e);
                             setPrefetchStatus('ready'); // Fallback: ID is ready even if profile fetch failed
                        }
                    } else {
                        // Case 1: No Lead Available
                        console.log('🚫 [Pre-fetch] No more leads in campaign.');
                        setPrefetchStatus('none');
                    }
                } catch (err: any) {
                    if (timerId) clearTimeout(timerId);
                    console.warn('[Pre-fetch] Background prefetch warning (handled non-blocking):', err?.message || err);
                    setPrefetchStatus('error');
                    // Case 3 fallback: Handled during Save attempt
                }
            };
            
            performPrefetch();
            prefetchPromiseRef.current = true; // Mark as started
        }
        
        // Reset if disposition is cleared
        if (!disposition) {
            setPrefetchStatus('idle');
            prefetchPromiseRef.current = null;
            prefetchedDataRef.current = null;

            // Clear staged buffer in database if user resets disposition
            if (user?.uid && campaignId) {
                supabase
                    .from('call_sessions')
                    .update({
                        staged_next_lead_id: null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.uid)
                    .eq('campaign_id', campaignId)
                    .then(() => {}, () => {});
            }
        }
    }, [disposition, user?.uid, campaignId, customerId, prefetchStatus, isManualMode, isInterruption]);

    type Data = {
        success?: boolean;
        error?: string;
        session?: any;
        message?: string;
        server_now?: string;
    };

    const handleStartCall = async () => {
        const callInitiatedAt = Date.now();
        if (isPlacingCallRef.current || isPlacingCall || isCalling || (callInitiatedAt - lastCallPlacedAtRef.current < 2500)) {
            console.warn('⚠️ [Click-to-Call] Blocked duplicate call initiation attempt');
            return;
        }
        isPlacingCallRef.current = true;
        lastCallPlacedAtRef.current = callInitiatedAt;
        setIsPlacingCall(true);
        isApiUpdatingRef.current = true; // LOCK ON IMMEDIATELY
        const cId = campaignId as string;
        const custId = customerId as string;

        if (!cId || !custId) {
            console.error('[Session] Missing campaignId or customerId in router query');
            isPlacingCallRef.current = false;
            isApiUpdatingRef.current = false;
            setIsPlacingCall(false);
            return;
        }

        // Reset all previous call diagnostics, session state & flow engine for clean new call data
        resetSmartfloFlowState('outbound');
        activeSmartfloRefIdRef.current = null;
        activeSmartfloCallIdRef.current = null;
        setLastCheckedRefId(null);
        setLastCheckedCallId(null);
        setSmartfloLifecycle(null);
        setSmartfloLogs([]);
        SmartfloSessionStore.setActiveSessionId(null);

        let providerToUse: CallingProviderName = "sim";
        let decryptedPhone = "";

        if (customer?.phone_no) {
            try {
                // Read from pre-fetched cached provider details — avoid network fetch on every call!
                let providerDetails = cachedProviderDetailsRef.current || getCachedProviderDetails();
                if (!providerDetails) {
                    providerDetails = await getCallingProviderDetails();
                    cachedProviderDetailsRef.current = providerDetails;
                    setCallingProviderDetails(providerDetails);
                    setActiveCallingProvider(providerDetails.activeProvider);
                }

                // If user selected smartflo in-use but it is not mapped
                if (providerDetails.user?.smartflo?.in_use && !providerDetails.user?.smartflo?.is_mapped) {
                    isPlacingCallRef.current = false;
                    isApiUpdatingRef.current = false;
                    setIsPlacingCall(false);
                    showWarning(
                        "DID number not avilable config softllow setting. Please contact your admin.",
                        "Smartflo Configuration"
                    );
                    return;
                }

                // SIM check: active provider is SIM or user's in_use is SIM with organization enabled
                const isSimInUse = providerDetails.activeProvider === 'sim' ||
                    (Boolean(providerDetails.user?.sim?.in_use) && Boolean(providerDetails.organization?.sim?.enable));

                let activeProvider = providerDetails.activeProvider;
                if (!activeProvider && isSimInUse) {
                    activeProvider = 'sim';
                }

                if (!activeProvider) {
                    isPlacingCallRef.current = false;
                    isApiUpdatingRef.current = false;
                    setIsPlacingCall(false);
                    showWarning(
                        "No enabled calling provider is selected. Please check your SIM / Smartflo settings.",
                        "Calling Provider"
                    );
                    return;
                }

                providerToUse = activeProvider;
                activeCallProviderRef.current = activeProvider;
            } catch (providerError) {
                isPlacingCallRef.current = false;
                isApiUpdatingRef.current = false;
                setIsPlacingCall(false);
                showWarning(
                    providerError instanceof Error
                        ? providerError.message
                        : "Unable to verify the active calling provider.",
                    "Calling Provider"
                );
                return;
            }

            decryptedPhone = decryptPhone(customer.phone_no);
            if (!decryptedPhone) {
                isPlacingCallRef.current = false;
                isApiUpdatingRef.current = false;
                setIsPlacingCall(false);
                showWarning("Customer phone number is invalid or could not be decrypted.", "Calling Error");
                return;
            }

            // --- Smartflo Click-to-Call Originate ---
            if (providerToUse === "smartflo") {
                try {
                    const { data: { session: authSession } } = await supabase.auth.getSession();
                    if (!authSession) {
                        throw new Error("Please sign in again to place the call.");
                    }

                    const isManualEvent = Boolean(isManualMode || isManualUrl);
                    const response = await fetch("/api/calling/smartflo-call", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authSession.access_token}`,
                            "customer-id": String(custId || ""),
                            "rynxly_user_id": String(user?.uid || ""),
                            "campaign_id": String(cId || ""),
                            "org_id": String(user?.organization_id || ""),
                            "is_manual": String(isManualEvent),
                            "call_type": "c2c_cus_out",
                        },
                        body: JSON.stringify({
                            destination_number: decryptedPhone,
                            campaign_id: cId,
                            customer_id: custId,
                            rynxly_user_id: user?.uid,
                            org_id: user?.organization_id,
                            is_manual: isManualEvent,
                            call_type: "c2c_cus_out",
                        }),
                    });

                    const result = await response.json();
                    if (!response.ok || !result.success) {
                        throw new Error(result.message || result.error || "Smartflo call initiation failed.");
                    }

                    if (result.ref_id || result.call_id || result.success) {
                        const rId = result.ref_id || result.call_id;
                        const cIdVal = result.call_id || result.ref_id;
                        activeSmartfloRefIdRef.current = rId;
                        activeSmartfloCallIdRef.current = cIdVal;
                        setLastCheckedRefId(rId);
                        setLastCheckedCallId(cIdVal);
                        hasSeenCustomerRingingRef.current = false;
                        setSmartfloLifecycle(null);

                        // Initialize fresh isolated session store for this new call
                        SmartfloSessionStore.createSession({
                            direction: 'outbound',
                            phone: decryptedPhone,
                            customerId: custId,
                            ref_id: rId,
                            call_id: cIdVal,
                            initialPayload: result,
                        });

                        if (rId) {
                            setTimeout(() => {
                                fetchSmartfloLogs(rId, cIdVal);
                                refreshSmartfloFlowState();
                            }, 500);
                        }

                        if (user?.uid) {
                            const updatePayload = {
                                on_call: true,
                                is_personal: false,
                                updated_at: new Date().toISOString()
                            };
                            void supabase.from('user_profiles').update(updatePayload).eq('user_id', user.uid);
                            void supabase.from('user_profiles').update(updatePayload).eq('id', user.uid);
                        }
                    }
                    console.info("📞 [Smartflo] Originate queued successfully, ref_id:", result.ref_id, "call_id:", result.call_id);
                } catch (callErr: any) {
                    isPlacingCallRef.current = false;
                    isApiUpdatingRef.current = false;
                    setIsPlacingCall(false);
                    showWarning(
                        callErr?.message || "Failed to initiate call via Smartflo.",
                        "Smartflo Calling"
                    );
                    return;
                }
            }
        }

        // Flag is now handled automatically by the centralized useEffect watcher above

        // --- Optimistic UI Update ---
        setCallStartTime(null);
        setIsCalling(true);
        isPlacingCallRef.current = false;
        setIsPlacingCall(false);
        setPostCall(false);
        setCallDuration(0);
        setCallAlive(true);
        // ----------------------------

        if (customer?.phone_no && decryptedPhone) {
            if (providerToUse === "sim") {
                // Trigger Flutter bridge call event
                // SET FLAG: Inform GlobalCallHandler that this is NOT a manual dial
                if (typeof window !== 'undefined') {
                    (window as any).isCrmCallActive = true;
                    // Safety timeout to reset flag in case start fails or disconnect event is missed
                    setTimeout(() => { 
                        if ((window as any).isCrmCallActive) {
                            console.log('[CRM-Call] 🛡️ Safety timeout triggered. Re-enabling GlobalCallHandler.');
                            (window as any).isCrmCallActive = false; 
                        }
                    }, 20000);
                }
                
                const routedCommand = await routeCallingCommand('call_to', decryptedPhone, 'sim');
                const bridgeConnected = routedCommand.bridgeConnected;
                
                if (!bridgeConnected) {
                    window.location.href = `tel:${decryptedPhone}`;
                }

                if (user?.uid) {
                    supabase.from('user_profiles').update({
                        on_call: true,
                        is_personal: false,
                        updated_at: new Date().toISOString()
                    }).eq('user_id', user.uid).then();
                }
            }

            // Sync to SyncMeta table for real-time header reflection
            if (user?.employeeId) {
                updateSyncMetaCallStatus(user.employeeId, 'call_to', decryptedPhone || "", providerToUse);
                updateSyncMetaCallingStatus(user.employeeId, providerToUse === 'smartflo' ? 'connected' : 'preparing', providerToUse);
            }
            setLocalCallingStatus(providerToUse === 'smartflo' ? 'connected' : 'preparing');
        }

        setDisposition("");
        setSubDisposition("");
        setNotes("");
        const now = new Date();
        const futureCall = new Date(now.getTime() + 5 * 60000);
        setCallbackDate(`${futureCall.getFullYear()}-${String(futureCall.getMonth() + 1).padStart(2, '0')}-${String(futureCall.getDate()).padStart(2, '0')}`);
        setCallbackTime(futureCall.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

        // Persist session to call_sessions table in real-time
        if (user?.uid) {
            console.log('[Session] Attempting to create active session in DB...');
            try {
                const { data: { session: authSession } } = await supabase.auth.getSession();
                if (authSession) {
                    const response = await fetch("/api/auth/update-call-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authSession.access_token}`,
                        },
                        body: JSON.stringify({
                            campaign_id: cId,
                            customer_id: custId,
                            status: 'active',
                            is_manual_event: isManualMode || isManualUrl
                        })
                    });
                    const result = await response.json();
                    if (result.success && result.session?.call_start_at) {
                        console.log('[Session] Active session synced with server time');
                        
                        // Recalibrate offset
                        if (result.server_now) {
                            const sNow = new Date(result.server_now).getTime();
                            const lNow = Date.now();
                            setServerTimeOffset(sNow - lNow);
                        }

                        // Sync with server time to ensure all devices are identical
                        const serverStart = parseUTCtoMS(result.session.call_start_at);
                        if (serverStart) setCallStartTime(serverStart);
                    } else if (!result.success) {
                        console.error('[Session] Failed to persist session:', result.error);
                    }
                } else {
                    isApiUpdatingRef.current = false;
                }
                
                // Release lock after a short delay for DB to propagate
                setTimeout(() => {
                    isApiUpdatingRef.current = false; // LOCK OFF
                }, 2000);

            } catch (err) {
                console.error('[Session] Network error persisting session:', err);
                isApiUpdatingRef.current = false;
            }
        }
    };


    const handleSaveLiveNotes = async (content?: string) => {
        const finalContent = content !== undefined ? content : liveNotes;
        if (!customerId || !user?.uid) return;
        
        setIsSavingLiveNotes(true);
        try {
            const { error } = await supabase
                .from('customers')
                .update({ 
                    live_notes: finalContent,
                    last_updated_by: user.uid,
                    updated_at: new Date().toISOString()
                })
                .eq('id', customerId);
            
            if (error) throw error;
        } catch (err) {
            console.error("Error saving live notes:", err);
        } finally {
            setIsSavingLiveNotes(false);
        }
    };

    const fetchAttachments = async (cid: string) => {
        try {
            const { data, error } = await supabase
                .from('customer_attachments')
                .select('*')
                .eq('customer_id', cid)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setAttachments(data || []);
        } catch (err) {
            console.error("Error fetching attachments:", err);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setPendingFile(file);
        setCustomFileName(file.name.split('.').slice(0, -1).join('.'));
    };

    const confirmUpload = async () => {
        if (!pendingFile || !customerId || !user?.uid) return;
        
        setSaving(true);
        try {
            const fileExt = pendingFile.name.split('.').pop();
            const fileName = customFileName ? `${customFileName}.${fileExt}` : pendingFile.name;
            const filePath = `${customerId}/${Date.now()}_${fileName}`;
            
            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('customer_attachments')
                .upload(filePath, pendingFile);
            
            if (uploadError) throw uploadError;
            
            // 2. Save Meta to DB
            const { error: dbError } = await supabase
                .from('customer_attachments')
                .insert({
                    customer_id: customerId,
                    file_path: filePath,
                    file_name: fileName,
                    file_type: pendingFile.type,
                    file_size: pendingFile.size,
                    uploaded_by: user.uid
                });
            
            if (dbError) throw dbError;
            
            // Success
            setPendingFile(null);
            setCustomFileName("");
            fetchAttachments(customerId as string);
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload file. Please check storage permissions.");
        } finally {
            setSaving(false);
        }
    };

    const deleteAttachment = async (id: string, path: string) => {
        if (!confirm("Remove this attachment forever?")) return;
        
        try {
            // 1. Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('customer_attachments')
                .remove([path]);
                
            if (storageError) throw storageError;
            
            // 2. Delete from DB
            const { error: dbError } = await supabase
                .from('customer_attachments')
                .delete()
                .eq('id', id);
                
            if (dbError) throw dbError;
            
            fetchAttachments(customerId as string);
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete attachment.");
        }
    };


    const handlePointerDown = (e: React.PointerEvent) => {
        if((customer?.status || 'Active').toLowerCase() !== 'followup') return;
        setIsDragging(true);
        startXRef.current = e.clientX;
        try {
            (e.target as Element).setPointerCapture(e.pointerId);
        } catch(err) {
             // Ignore
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
         if (!isDragging) return;
         const currentX = e.clientX;
         const diff = currentX - startXRef.current;
         if (diff > 0) {
             setDragX(diff);
         }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        try {
            (e.target as Element).releasePointerCapture(e.pointerId);
        } catch(err) {}

        const containerWidth = containerRef.current?.clientWidth || 300; 
        const threshold = containerWidth * 0.4; 

        if (dragX > threshold) {
            handleSkipCall(); 
            setTimeout(() => setDragX(0), 500);
        } else {
             if (dragX < 5) {
                 handleStartCall();
             }
             setDragX(0);
        }
    };

    const handleSkipCalendar = async () => {
        if (!user?.uid) return;
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ google_calendar_skipped: true })
                .eq('user_id', user.uid);
            
            if (!error) {
                setUser(prev => prev ? { ...prev, googleCalendarSkipped: true } : null);
                setShowCalendarModal(false);
                // Continue with saving disposition after state is updated
                executeSaveDisposition();
            }
        } catch (err) {
            console.error("Error skipping calendar:", err);
            setShowCalendarModal(false);
            executeSaveDisposition();
        }
    };

    const handleConnectCalendar = () => {
        // Redirect to Google OAuth
        // Note: Client ID and Redirect URI are managed in Supabase Dashboard
        supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                scopes: 'https://www.googleapis.com/auth/calendar.events',
                redirectTo: `${window.location.origin}/campaign/${campaignId}/${customerId}`
            }
        });
    };

    const handleSaveDisposition = async () => {
        if (!disposition) {
            alert("Please select a primary status");
            return;
        }

        // Flag will be cleared automatically by the watcher when postCall becomes false


        if (dispositionHierarchy[disposition]?.length > 0 && !subDisposition) {
            alert("Please select a specific sub-disposition");
            return;
        }

        if (disposition === 'Call Back') {
            if (!callbackDate || !callbackTime) {
                alert("Please select both Date and Time for Call Back");
                return;
            }
            const selectedDateTime = new Date(`${callbackDate}T${callbackTime}`);
            const now = new Date();
            if (selectedDateTime < now) {
                alert("Cannot schedule a call for a past date/time. Please select a future time.");
                // Reset to current time if past
                const currentFormattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const currentFormattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                setCallbackDate(currentFormattedDate);
                setCallbackTime(currentFormattedTime);
                return;
            }

            // Slot conflict check before saving
            setCheckingSlot(true);
            try {
                // Ensure minute-level precision by truncating seconds/ms
                const checkDate = new Date(selectedDateTime);
                checkDate.setSeconds(0, 0);
                
                // Use a 1-minute window check (00 to 59 seconds)
                const startRange = checkDate.toISOString();
                const endRange = new Date(checkDate.getTime() + 59999).toISOString();

                // BUG FIX: Use .limit(1) instead of .maybeSingle(). 
                // .maybeSingle() errors out if multiple conflicts already exist, 
                // which was allowing even more duplicates to be created!
                const { data: conflicts, error: conflictErr } = await supabase
                    .from('customers')
                    .select('id, customer_name, campaign_id, disposition, sub_disposition, outcome, next_called_at')
                    .or(`managed_by.eq.${user?.uid},assigned_to.eq.${user?.uid}`)
                    .gte('next_called_at', startRange)
                    .lte('next_called_at', endRange)
                    .neq('id', customerId)
                    .limit(1);

                if (conflictErr) console.error("Slot check DB error:", conflictErr);

                if (conflicts && conflicts.length > 0) {
                    setConflictInfo(conflicts[0]);
                    setCheckingSlot(false);
                    return;
                }
            } catch (err) {
                console.error("Slot check execution error:", err);
            }
            setCheckingSlot(false);
        }

        const isFollowup = disposition === 'Call Back' || subDisposition?.toLowerCase().includes('interested') || subDisposition?.toLowerCase().includes('follow up');
        
        // Show Calendar Modal if user hasn't connected or skipped, AND NOT on mobile (Flutter)
        const isMobile = typeof window !== 'undefined' && !!(window as any).flutter_inappwebview;
        
        if (isFollowup && user && !user.googleCalendarConnected && !user.googleCalendarSkipped && !isMobile) {
            setShowCalendarModal(true);
            return;
        }

        executeSaveDisposition();
    };

    const executeSaveDisposition = async (overrideDate?: string, overrideTime?: string) => {
        if (typeof window !== 'undefined') localStorage.setItem('lead_save_in_progress', 'true');
        try {
            setSaving(true);
            const finalDate = overrideDate || callbackDate;
            const finalTime = overrideTime || callbackTime;

            // 0. CAPTURE CAMPAIGN PERMISSION EARLY
            let isAssignedToCampaign = false;
            try {
                const { data: campData } = await supabase
                    .from('campaigns')
                    .select('users')
                    .eq('id', campaignId)
                    .single();
                
                if (campData?.users && user?.uid) {
                    const assignedUsers = Array.isArray(campData.users) ? campData.users : [];
                    isAssignedToCampaign = assignedUsers.some((u: any) => String(u.user_id) === String(user.uid));
                }
                if (user && !user.isClient) isAssignedToCampaign = true;
            } catch (err) {
                console.error("[Disposition] Permission check failed:", err);
            }
            
            const now = new Date().toISOString();

            // Determine Connection Status
            const isConnected = (disposition === 'Call Back' || disposition === 'Deal Done' || disposition === 'Not Intrested' || disposition === 'Language barrier' || disposition === 'DND' || disposition === 'Wrong NO' || disposition === 'Already Renewed') 
                ? 'contactable' 
                : (disposition === 'Not Contactable' ? 'uncontactable' : null);

            // Calculate preliminary log values
            const isRejected = disposition === 'DND' || disposition === 'Language barrier' || disposition === 'Wrong NO' || disposition === 'Ported / Expired' || disposition === 'Not Intrested' || disposition === 'Already Renewed';
            const isClosed = disposition === 'Deal Done';
            
            let logNextCalledAt = null;
            let logStatus = 'active';
            let logAssignedTo = null;

            // Pre-calculate status for log
            if (isRejected) logStatus = 'rejected';
            else if (isClosed) logStatus = 'closed';
            else if (disposition === 'Call Back' || subDisposition === 'intrested' || subDisposition === 'Interested' || subDisposition === 'follow up' || subDisposition === 'Follow up') {
                logStatus = 'followup';
                logAssignedTo = user?.uid;
                if (disposition === 'Call Back' && finalDate) {
                     const combinedDT = finalTime 
                        ? new Date(`${finalDate}T${finalTime}`)
                        : new Date(finalDate);
                     // Always truncate to the start of the minute for consistency in conflict checks
                     combinedDT.setSeconds(0, 0);
                     logNextCalledAt = combinedDT.toISOString();
                }
            }

            // Determine Correct Assignment for Log
            // Priority: Existing Owner > New Owner (Self)
            const currentOwner = customer?.assigned_to;
            let finalLogAssignedTo = currentOwner; 

            // If no owner, or if we are taking ownership (logic below handles the DB update, but log needs to reflect INTENT)
            // Ideally, we should mirror the logic we are about to run?
            // "assigned_to" in call_logs usually means "Who is responsible for this lead AFTER this call?"
            
            // Re-evaluating the user requirement: "assigned_to me actual assigned user id"
            // If I am overriding, the actual assigned user is the OTHER person.
            // If I am taking ownership, the actual assigned user is ME.
            
            const shouldAssignToSelfLog = !currentOwner || currentOwner === user?.uid;
            
            if (shouldAssignToSelfLog) {
                // If it was unassigned, or mine, it is now mine (or stays mine)
                // UNLESS it is valid for retry/followup?
                if (logStatus === 'followup' || logStatus === 'active') { // Only active/followup have owners
                     finalLogAssignedTo = user?.uid;
                } else {
                     finalLogAssignedTo = null; // Closed/Rejected have no owner usually
                }
            } else {
                // It is owned by someone else. We preserve that owner in the log.
                finalLogAssignedTo = currentOwner;
            }

            // Determine Smartflo vs SIM context
            const isSmartflo = lastCallProviderRef.current === 'smartflo' ||
                activeCallProviderRef.current === 'smartflo' ||
                Boolean(lastCheckedRefId || activeSmartfloRefIdRef.current);

            let logDuration = (disposition === 'Not Contactable') ? 0 : callDuration;
            let logRefId: string | null = null;
            let logRecordingUrl: string | null = null;

            if (isSmartflo) {
                const targetRef = lastCheckedRefId || activeSmartfloRefIdRef.current;
                const targetCall = lastCheckedCallId || activeSmartfloCallIdRef.current;
                
                const matchedSfLog = smartfloLogs.find((l: any) => {
                    const raw = (l.rawPayload || {}) as any;
                    return (
                        (targetRef && (l.refId === targetRef || l.callId === targetRef || raw.ref_id === targetRef || raw.call_id === targetRef || raw.uuid === targetRef)) ||
                        (targetCall && (l.callId === targetCall || l.refId === targetCall || raw.call_id === targetCall || raw.ref_id === targetCall || raw.uuid === targetCall))
                    );
                }) || (targetRef && smartfloLogs.length > 0 ? smartfloLogs[0] : null);

                const raw = (matchedSfLog?.rawPayload || {}) as any;
                logRefId = targetRef || matchedSfLog?.refId || raw.ref_id || raw.call_id || null;
                
                const sfOutboundSec = Number(
                    raw.outbound_sec ??
                    raw.outbound_talktime ??
                    raw.outbound_talk_time ??
                    matchedSfLog?.duration ??
                    raw.duration ??
                    raw.billsec ??
                    (disposition === 'Not Contactable' ? 0 : callDuration) ??
                    0
                );

                logDuration = (disposition === 'Not Contactable') ? 0 : sfOutboundSec;
                logRecordingUrl = matchedSfLog?.recordingUrl || raw.recording_url || raw.record_url || null;
            }

            // 1. Save Call Log FIRST
            // agent_id: The "Lead Owner" (or the person responsible).
            //           If lead is owned by someone else -> Use THEIR ID.
            //           If lead is mine or fresh -> Use MY ID.
            // last_updated_by: The person doing the work (Me/TL)
            
            const logAgentId = finalLogAssignedTo || user?.uid; 

            const { error: logError } = await supabase
                .from('call_logs')
                .insert({
                    customer_id: customerId, // Ensure this is not null/undefined from scope
                    campaign_id: campaignId,
                    organization_id: campaign?.organization_id || customer?.organization_id,
                    agent_id: logAgentId, // The Owner
                    last_updated_by: user?.uid, // The Actor (Me)
                    disposition: disposition,
                    sub_disposition: subDisposition,
                    is_connected: isConnected,
                    notes: notes,
                    duration: logDuration,
                    last_called_at: now,
                    updated_at: now,
                    next_called_at: logNextCalledAt,
                    status: logStatus,
                    assigned_to: finalLogAssignedTo, // The Assigned To
                    outcome: outcome, // New outcome field
                    ref_id: logRefId,
                    call_recording: logRecordingUrl
                });

            if (logError) throw logError;
            setTotalAttemptsCount(prev => prev + 1);

            // 2. Perform Movement Logic or Update Status
            const isFromRejected = Boolean(customer?._isFromRejectedLeads || customer?.rejected_at);
            const targetCustomerId = customer?.customer_id || customer?.id || customerId;

            if (isRejected) {
                if (isFromRejected) {
                    // Already in rejected_leads: update rejected_leads record directly
                    const { error: rejectUpdateError } = await supabase
                        .from('rejected_leads')
                        .update({
                            disposition: disposition,
                            sub_disposition: subDisposition,
                            notes: notes,
                            outcome: outcome,
                            is_connected: isConnected || 'contactable',
                            last_called_at: now,
                            updated_at: now,
                            last_updated_by: user?.uid,
                            ...(customer?.source_id ? { source_id: customer.source_id } : {})
                        })
                        .or(`id.eq.${customerId},customer_id.eq.${customerId}`);
                    if (rejectUpdateError) throw rejectUpdateError;
                } else {
                    // Move to rejected table and delete from customers
                    const { error: rejectError } = await supabase.rpc('move_to_rejected', {
                        p_customer_id: customerId,
                        p_agent_id: user?.uid,
                        p_notes: notes,
                        p_disposition: disposition,
                        p_sub_disposition: subDisposition,
                        p_phone_search_hash: customer?.phone_search_hash || computePhoneHash(decryptPhone(customer?.phone_no)),
                        p_outcome: outcome
                    });
                    if (rejectError) throw rejectError;

                    // Ensure is_connected column is updated on rejected_leads
                    await supabase
                        .from('rejected_leads')
                        .update({ 
                            is_connected: isConnected || 'contactable',
                            ...(customer?.source_id ? { source_id: customer.source_id } : {})
                        })
                        .or(`id.eq.${customerId},customer_id.eq.${customerId}`);
                }

                fetchSchedules();
            } else if (isClosed) {
                // Move to closed table and delete from customers
                const finalDisposition = subDisposition ? `${disposition} > ${subDisposition}` : disposition;
                const { error: closeError } = await supabase.rpc('move_to_closed', {
                    p_customer_id: customerId,
                    p_agent_id: user?.uid,
                    p_notes: notes,
                    p_final_disposition: finalDisposition,
                    p_phone_search_hash: customer?.phone_search_hash || computePhoneHash(decryptPhone(customer?.phone_no)),
                    p_outcome: outcome
                });
                if (closeError) throw closeError;

                // If it came from rejected_leads, ensure it's deleted from rejected_leads
                if (isFromRejected) {
                    await supabase
                        .from('rejected_leads')
                        .delete()
                        .or(`id.eq.${customerId},customer_id.eq.${customerId}`);
                }

                // Ensure is_connected column is updated on closed_deals
                await supabase
                    .from('closed_deals')
                    .update({ 
                        is_connected: isConnected || 'contactable',
                        ...(customer?.source_id ? { source_id: customer.source_id } : {})
                    })
                    .or(`id.eq.${customerId},customer_id.eq.${customerId}`);

                fetchSchedules();
            } else if (disposition === 'Not Contactable') {
                // Return to General Pool immediately (per new user requirement)
                
                const updatePayload: any = {
                    last_called_at: now,
                    updated_at: now,
                    last_updated_by: user?.uid,
                    is_connected: isConnected,
                    
                    // Reset assignment (Keep attempts tracking)
                    attempt_count: (customer?.attempt_count || 0) + 1,
                    last_attempt_at: now,
                    next_called_at: null,
                    ref_date: now, // Ensure retries are available immediately in Priority 4 pool
                    assigned_to: null, 
                    
                    status: 'active',
                    disposition: disposition,
                    sub_disposition: subDisposition,
                    outcome: outcome
                };

                logStatus = 'active';

                if (isFromRejected) {
                    // Restore from rejected_leads to customers table
                    const {
                        id: _rId,
                        customer_id: _rCustId,
                        agent_id: _rAgentId,
                        rejected_at: _rRejectedAt,
                        status: _rStatus,
                        idx: _rIdx,
                        _isFromRejectedLeads: _rFlag,
                        ...commonFields
                    } = customer || {};

                    const restoredCustomer = {
                        ...commonFields,
                        id: targetCustomerId,
                        ...updatePayload
                    };

                    const { error: upsertError } = await supabase
                        .from('customers')
                        .upsert(restoredCustomer);

                    if (upsertError) throw upsertError;

                    // Delete from rejected_leads
                    await supabase
                        .from('rejected_leads')
                        .delete()
                        .or(`id.eq.${customerId},customer_id.eq.${customerId}`);
                } else {
                    const { error: customerUpdateError } = await supabase
                        .from('customers')
                        .update(updatePayload)
                        .eq('id', customerId);

                    if (customerUpdateError) throw customerUpdateError;
                }

                fetchSchedules();
            } else {
                // Regular Update (Call Back, etc.)
                const isFollowup = disposition === 'Call Back' || subDisposition === 'intrested' || subDisposition === 'Interested' || subDisposition === 'follow up' || subDisposition === 'Follow up';
                
                let updatePayload: any = { 
                    disposition: disposition,
                    sub_disposition: subDisposition,
                    notes: notes,
                    is_connected: isConnected,
                    status: isFollowup ? 'followup' : 'active',
                    last_called_at: now,
                    updated_at: now,
                    last_updated_by: user?.uid,
                    outcome: outcome
                };

                // ASSIGNMENT GUARD LOGIC:
                const currentAssignedTo = customer?.assigned_to;
                const shouldAssignToSelf = !currentAssignedTo || currentAssignedTo === user?.uid;

                if (isFollowup && shouldAssignToSelf && isAssignedToCampaign) {
                    updatePayload.assigned_to = user?.uid;
                    logAssignedTo = user?.uid;
                } else if (isFollowup && !isAssignedToCampaign) {
                    // Unauthorized: Preserve existing owner for manual lead.
                    updatePayload.assigned_to = currentAssignedTo;
                    logAssignedTo = currentAssignedTo;
                    console.warn("[Disposition] Unauthorized assignment preserved for manual lead.");
                }
                
                // Else: if follow-up but owned by someone else -> Keep original owner
                // Unless we want to explicitly steal it? Requirement says NO conflict. 
                // So we preserve the original owner.

                if (!isFollowup && shouldAssignToSelf) {
                     // If moving back to active/fresh state and was mine -> release it?
                     // Usually standard flow releases it to NULL.
                     updatePayload.assigned_to = null;
                     logAssignedTo = null;
                }

                updatePayload.attempt_count = (customer?.attempt_count || 0) + 1;
                updatePayload.last_attempt_at = now;

                if (disposition === 'Call Back' && finalDate) {
                    const combinedDT = finalTime 
                        ? new Date(`${finalDate}T${finalTime}`)
                        : new Date(finalDate);
                    // Force minute-level alignment for all callbacks
                    combinedDT.setSeconds(0, 0);
                    const finalISO = combinedDT.toISOString();
                    
                    updatePayload.next_called_at = finalISO;
                    updatePayload.ref_date = finalISO; // Unified priority column
                    logNextCalledAt = finalISO;

                    // --- Google Calendar Sync Logic ---
                    if (user?.googleCalendarConnected) {
                        try {
                            const { data: { session } } = await supabase.auth.getSession();
                            let providerToken = session?.provider_token;

                            // Fallback: Try to retrieve from localStorage if session token is missing
                            if (!providerToken) {
                                providerToken = localStorage.getItem("google_provider_token");
                                if (providerToken) console.log("🔄 [Calendar] Using fallback stored token.");
                            }

                            if (providerToken) {
                                const endTime = new Date(new Date(finalISO).getTime() + 30 * 60000).toISOString(); // +30 mins

                                fetch('/api/google/create-event', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        summary: `Call Back: ${customer?.customer_name || 'Customer'}`,
                                        description: `
👤 Customer: ${customer?.customer_name || 'N/A'}
📅 Expiry Date: ${customer?.expiry_date ? new Date(customer.expiry_date).toDateString() : 'N/A'}

📋 Customer Details:
${(() => {
    let details = customer?.customer_details;
    if (!details) return 'N/A';
    if (typeof details === 'string') { try { details = JSON.parse(details); } catch { return String(details); } }
    if (typeof details !== 'object') return String(details);
    return Object.entries(details).map(([k, v]) => `• ${k.replace(/_(un)?checked/gi, '').replace(/_/g, ' ').toUpperCase()}: ${v}`).join('\n');
})()}

📊 Status:
• Disposition: ${disposition}
• Sub-Disposition: ${subDisposition || 'N/A'}
• Outcome: ${outcome || 'N/A'}

📝 Notes: 
${notes || 'No notes provided'}

Campaign: ${campaign?.name || campaignId}
                                        `.trim(),
                                        startTime: finalISO,
                                        endTime: endTime,
                                        providerToken: providerToken
                                    })
                                }).then(async (res) => {
                                    const data = await res.json();
                                    if (data.success) {
                                        console.log("✅ [Calendar] Event created successfully:", data.eventId);
                                        alert("Calendar invite sent!");
                                    } else {
                                        console.warn("⚠️ [Calendar] Failed to create event:", data.error);
                                        alert(`Failed to create calendar event: ${data.error}`);
                                    }
                                }).catch(err => {
                                    console.error("❌ [Calendar] Network error:", err);
                                    alert("Network error while creating calendar event.");
                                });
                            } else {
                                console.warn("⚠️ [Calendar] No provider_token found in session or storage.");
                                alert("Google Calendar Token missing. Please go to Settings > Integrations and Reconnect Google Calendar.");
                            }
                        } catch (calErr) {
                            console.error("❌ [Calendar] execution error:", calErr);
                        }
                    }
                } else {
                    updatePayload.next_called_at = null;
                    updatePayload.ref_date = now; // For active leads, ref_date defaults to current time
                }

                logStatus = updatePayload.status;

                if (isFromRejected) {
                    // Restore from rejected_leads to customers table
                    const {
                        id: _rId,
                        customer_id: _rCustId,
                        agent_id: _rAgentId,
                        rejected_at: _rRejectedAt,
                        status: _rStatus,
                        idx: _rIdx,
                        _isFromRejectedLeads: _rFlag,
                        ...commonFields
                    } = customer || {};

                    const restoredCustomer = {
                        ...commonFields,
                        id: targetCustomerId,
                        ...updatePayload
                    };

                    const { error: upsertError } = await supabase
                        .from('customers')
                        .upsert(restoredCustomer);

                    if (upsertError) throw upsertError;

                    // Delete from rejected_leads
                    await supabase
                        .from('rejected_leads')
                        .delete()
                        .or(`id.eq.${customerId},customer_id.eq.${customerId}`);
                } else {
                    const { error: customerUpdateError } = await supabase
                        .from('customers')
                        .update(updatePayload)
                        .eq('id', customerId);

                    if (customerUpdateError) throw customerUpdateError;
                }

                // Success: Refresh schedules to show the newly added/removed callback
                fetchSchedules();

                // Log monitoring event
                logSystemEvent({
                    event_type: 'WRITE',
                    description: `Disposition Saved: ${disposition} for ${customer?.customer_name || 'Customer'}`,
                    metadata: { disposition, sub_disposition: subDisposition, customer_id: customerId, duration: callDuration },
                    payload_size: estimateSize(updatePayload),
                    user_name: user?.displayName || 'Agent',
                    organization_id: user?.organization_id || undefined
                });
            }

            // 1. Save Call Log (Moved here to include calculated metadata)
            // (Call log already saved above)

            // 2.5 Check if this is a manual call before clearing session
            let isManualCall = false;
            let isUnassignedCall = false;
            let currentIsInterruption = false;
            let preservedCampaignId = null;
            let preservedCustomerId = null;
            let preservedStatus = null;

            if (user?.uid) {
                const { data: sRows } = await supabase
                    .from('call_sessions')
                    .select('is_manual, campaign_id, customer_id, manual_customer_id, is_unassigned, status')
                    .eq('user_id', user.uid)
                    .eq('campaign_id', campaignId)
                    .limit(1);

                const currentSession = sRows ? sRows[0] : null;

                if (currentSession) {
                    isManualCall = currentSession.is_manual || false;
                    isUnassignedCall = currentSession.is_unassigned || false;
                    preservedCampaignId = currentSession.campaign_id;
                    preservedCustomerId = currentSession.customer_id;
                    preservedStatus = currentSession.status;
                    const manualCustId = currentSession.manual_customer_id;

                    console.log('[Disposition] Session Match Check:', { isManualCall, preservedCustomerId, manualCustId, savingId: customerId });

                    // 🛡️ MANUAL SHIELD: Check if this was a manual dial (Ad-hoc)
                    if (isManualCall) {
                        // Determine if we should go back to a DIFFERENT lead (Interruption)
                        if (manualCustId && String(manualCustId) !== String(preservedCustomerId)) {
                            currentIsInterruption = true;
                        }
                    }

                    console.log('[Disposition] Final check:', { isManualCall, isUnassignedCall, currentIsInterruption });
                }
            }

            // 3. Handle Manual Call vs CRM Call differently
            // USER RULE (Updated): 
            // - Interrupted manual dials (Manual != System) restore to the preserved lead.
            // - Same-lead manual dials (Manual == System) proceed to NEXT lead (CRM Flow).
            
                // Redirect Logic
                if (isAccessDeniedManual || !isAssignedToCampaign || (isManualCall && currentIsInterruption)) {
                    console.log(`[Disposition] Flow Exit Path: IsAccessDeniedManual=${isAccessDeniedManual}, IsManual=${isManualCall}, IsUnassigned=${isUnassignedCall}, IsAuthorized=${isAssignedToCampaign}.`);
                    
                    try {
                        const { data: { session: authSession } } = await supabase.auth.getSession();
                        if (!authSession) throw new Error("No Auth Session");

                        if (isAccessDeniedManual || isUnassignedCall || !isAssignedToCampaign) {
                            // Scenario 2: Unassigned or Unauthorized Manual Call -> DELETE & REDIRECT
                            console.log(`[Disposition] Cleaning up unauthorized/unassigned session: ${campaignId}`);
                            
                            // Terminate the session via API for reliable cleanup
                            await fetch("/api/auth/update-call-session", {
                               method: "POST",
                               headers: {
                                   "Content-Type": "application/json",
                                   Authorization: `Bearer ${authSession.access_token}`,
                               },
                               body: JSON.stringify({
                                   campaign_id: campaignId,
                                   terminate: true 
                               })
                            });

                            // Find another session to redirect to
                            const { data: otherSessions } = await supabase
                                .from('call_sessions')
                                .select('campaign_id, customer_id, is_manual, manual_customer_id, status, manual_status')
                                .eq('user_id', user?.uid)
                                .neq('campaign_id', campaignId)
                                .or('status.in.(active,disposition_pending,assigned),manual_status.in.(active,disposition_pending)')
                                .order('updated_at', { ascending: false })
                                .limit(1);
                            
                            if (otherSessions && otherSessions.length > 0) {
                                const target = otherSessions[0];
                                const isManualTarget = target.manual_status === 'active' || target.manual_status === 'disposition_pending';
                                const tid = isManualTarget ? target.manual_customer_id : target.customer_id;
                                router.push(`/portal/campaign/${target.campaign_id}/${tid}`);
                            } else {
                                router.push(`/portal/campaign`);
                            }
                        } else {
                            // Scenario 1: Authorized Manual Interrupt -> RESTORE Primary Lead Context
                            if (preservedCampaignId && preservedCustomerId) {
                                await fetch("/api/auth/update-call-session", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${authSession.access_token}`,
                                    },
                                    body: JSON.stringify({
                                        campaign_id: preservedCampaignId,
                                        customer_id: preservedCustomerId,
                                        status: preservedStatus || 'assigned',
                                        manual_override: true 
                                    })
                                });
                                setIsManualMode(false);
                                router.push(`/portal/campaign/${preservedCampaignId}/${preservedCustomerId}`);
                            } else {
                                // Clear manual flags in DB
                                if (user?.uid && campaignId) {
                                    await supabase.from('call_sessions').update({
                                        is_manual: false,
                                        manual_campaign_id: null,
                                        manual_customer_id: null,
                                        manual_status: null
                                    }).eq('user_id', user.uid).eq('campaign_id', campaignId);
                                }
                                setIsManualMode(false);
                                router.push(`/portal/campaign/${campaignId}`);
                            }
                        }
                    } catch (err) {
                        console.error("[Disposition] Cleanup/Redirect error:", err);
                        router.push(`/portal/campaign`);
                    }
                    setSaving(false);
                    return;
                } else {
                    // CRM/Primary lead disposed
                    if (prefetchStatus === 'error') {
                        alert("⚠️ Connection issue. Redirection might be delayed. Refreshing...");
                        window.location.reload();
                        setSaving(false);
                        return;
                    }

                    if (prefetchStatus === 'fetching') {
                        alert("Please wait a moment for the system to finalize the next lead...");
                        setSaving(false);
                        return;
                    }

                    if (prefetchStatus === 'none') {
                        alert("✅ Good job! Campaign completed.");
                        try {
                            const { data: { session: authSession } } = await supabase.auth.getSession();
                            if (authSession && authSession.access_token) {
                                await fetch("/api/auth/update-call-session", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${authSession.access_token}`,
                                    },
                                    body: JSON.stringify({ campaign_id: campaignId, terminate: true })
                                });
                            }
                        } catch (e) { console.error(e); }
                        router.push(`/portal/campaign/${campaignId}`);
                        setSaving(false);
                        return;
                    }

                    const nextLeadId = prefetchedDataRef.current?.id;
                    const effectiveCampaignId = campaignId || campaign?.id || preservedCampaignId;

                    if (nextLeadId && user && user.uid && effectiveCampaignId) {
                        await supabase.from('call_sessions').upsert({
                            user_id: user.uid,
                            campaign_id: effectiveCampaignId,
                            customer_id: nextLeadId,
                            staged_next_lead_id: null, // Clear staging buffer since lead is now active
                            organization_id: campaign?.organization_id,
                            status: 'assigned',
                            is_manual: false,
                            manual_campaign_id: null,
                            manual_customer_id: null,
                            manual_status: null,
                            call_start_at: null,
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'user_id,campaign_id' });
                        
                        setLocalCallingStatus(null);
                        setIsAssigning(true);
                        setAssignmentCountdown(3);
                        setTargetNextLead({ id: nextLeadId, campaignId: effectiveCampaignId });
                        fetchDailyStats();
                        return; 
                    } else {
                        // Fallback
                        if (user && user.uid && effectiveCampaignId) {
                            await supabase.from('call_sessions').update({
                                is_manual: false,
                                manual_campaign_id: null,
                                manual_customer_id: null,
                                manual_status: null,
                                updated_at: new Date().toISOString()
                            }).eq('user_id', user.uid).eq('campaign_id', effectiveCampaignId);
                            
                            setIsManualMode(false);
                            router.push({ pathname: `/portal/campaign/${effectiveCampaignId}`, query: {} });
                            setSaving(false);
                            return;
                        }
                        setIsManualMode(false);
                        setIsAssigning(true);
                        setAssignmentCountdown(3);
                        setTargetNextLead({ id: "", campaignId: String(effectiveCampaignId || "") });
                        fetchDailyStats();
                        return;
                    }
                }


            // Reset state for non-redirecting cases
            setPostCall(false);
            setLocalCallingStatus(null);
            setDisposition("");
            setSubDisposition("");
            setNotes("");
            setCallDuration(0);
            setCallbackDate("");
            setCallbackTime("");
            
        } catch (err: any) {
            console.error("Error saving disposition:", err);
            alert("Failed to save disposition. Please try again.");
        } finally {
            setSaving(false);
            if (typeof window !== 'undefined') localStorage.removeItem('lead_save_in_progress');
        }
    };


    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const generateCalendarDays = () => {
        const year = calendarViewDate.getFullYear();
        const month = calendarViewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        const days = [];
        
        // Prev month days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: daysInPrevMonth - i, currentMonth: false, month: month - 1, year });
        }
        
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ day: i, currentMonth: true, month, year });
        }
        
        // Next month days
        const totalSlots = 42;
        const remainingSlots = totalSlots - days.length;
        for (let i = 1; i <= remainingSlots; i++) {
            days.push({ day: i, currentMonth: false, month: month + 1, year });
        }
        
        return days;
    };

    const handleDateSelect = (day: number, month: number, year: number) => {
        const selectedDate = new Date(year, month, day);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (selectedDate < now) {
            alert("⚠️ Cannot select a past date.");
            return;
        }

        const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        setCallbackDate(dateStr);
        setActivePreset(null);
        setIsDatePickerOpen(false);
    };

    const timeOptions = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", 
        "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", 
        "18:00", "18:30", "19:00", "19:30", "20:00"
    ];

    if (isAssigning) {
        // Dynamic Motivational Messages
        const getMotivationalQuote = () => {
             if (dailyLeadCount <= 5) return "Great start! Momentum is building.";
             if (dailyLeadCount <= 20) return "You're on fire! Keep it up.";
             if (dailyLeadCount <= 50) return "Unstoppable! You're dominating.";
             return "Absolute Legend! Dialling machine.";
        };

        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] relative overflow-hidden font-sans">
                {/* 🌈 Subtle Background Glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-200/20 rounded-full blur-[100px]"></div>
                </div>

                <div className="relative z-10 w-full max-w-[340px] sm:max-w-md mx-4 text-center">
                    {/* Compact Glass Card */}
                    <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[2rem] p-6 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] animate-in fade-in zoom-in duration-700">
                        
                        {/* Status Icon Area with Countdown */}
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            {/* Circular Progress Background */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="44"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-slate-100"
                                />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="44"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={276}
                                    strokeDashoffset={276 - (276 * (3 - assignmentCountdown + 1)) / 3}
                                    className="text-indigo-600 transition-all duration-1000 ease-linear"
                                    strokeLinecap="round"
                                />
                            </svg>
                            
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-indigo-600 tabular-nums animate-pulse">{assignmentCountdown}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest -mt-1">Sec</span>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="mb-8">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-1">Assigning Lead</h2>
                            <p className="text-[10px] sm:text-[11px] font-bold text-indigo-500 uppercase tracking-[0.2em] opacity-70">Syncing Next Opportunity</p>
                        </div>
                        
                        {/* Elegant Progress/Stats Pill */}
                        <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white mb-8 shadow-xl shadow-indigo-100/50 group hover:scale-[1.02] transition-transform duration-500">
                            <div className="flex items-center justify-between px-2">
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-0.5">Today</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black tabular-nums tracking-tighter">{dailyLeadCount}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Dials</span>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-slate-800"></div>
                                <div className="text-right max-w-[50%]">
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Spirit</p>
                                    <p className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-2">
                                        "{getMotivationalQuote()}"
                                    </p>
                                </div>
                            </div>
                            
                            {/* Micro Progress Bar */}
                            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-[progress_3s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
                            </div>
                        </div>

                        {/* Loading Indicator */}
                        <div className="flex justify-center gap-1.5 mb-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-[bounce_1s_infinite_-0.3s]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_-0.15s]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-[bounce_1s_infinite]"></div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col gap-6">
                            <button 
                                onClick={() => router.push(`/portal/campaign/${campaignId}`)}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all duration-300 group"
                            >
                                <i className="fi flex fi-rr-exit text-sm transition-transform group-hover:-translate-x-1"></i>
                                <span className="text-[10px] font-black uppercase tracking-widest">Cancel Assignment</span>
                            </button>
                            
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">Rynxly Engine 2.5</p>
                        </div>
                    </div>
                </div>

                {/* Internal Keyframes */}
                <style jsx>{`
                    @keyframes progress {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(250%); }
                    }
                `}</style>
            </div>
        );
    }

    if (!user || loading || !customer) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="flex flex-col items-center max-w-xs text-center px-6">
                    {/* Compact Modern Loader */}
                    <div className="relative w-14 h-14 mb-6">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent border-l-transparent"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fi flex fi-rr-shuffle text-indigo-600 text-sm animate-pulse"></i>
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mb-1">
                        {!user ? "Authenticating Session" : "Assigning Lead"}
                    </h2>
                    <p className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                        {!user ? "Connecting to account..." : "Syncing your lead data..."}
                    </p>
                    
                    {/* Minimal Progress indicator */}
                    <div className="mt-6 flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full" style={{ backgroundColor: "#f8fafc", maxWidth: "100vw" }}>
            <Sidebar 
                activeNav="campaign" 
                user={user ? {
                    displayName: user.displayName,
                    email: user.email,
                    employeeId: user.employeeId,
                    profilePicUrl: user.profilePicUrl,
                    isClient: user.isClient,
                    designation: user.designation,
                    lastSignInAt: user.lastSignInAt
                } : undefined}
                onLogout={handleLogoutClick}
            />
            
            {/* <div className="hidden">{console.log('Campaign[id]/[customerId] User:', user)}</div> */}
            
            <div className="flex-1 flex flex-col w-full min-w-0">
                <Header 
                    user={user ? {
                        displayName: user.displayName,
                        email: user.email,
                        employeeId: user.employeeId,
                        profilePicUrl: user.profilePicUrl,
                        lastSignInAt: user.lastSignInAt,
                        uid: user.uid
                    } : undefined} 
                    onLogout={handleLogoutClick} 
                    hideSidebar={false}
                />
                
                <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full relative" style={{ backgroundColor: "#f8fafc" }}>
                    {/* Floating New Lead Alert */}
                    {showNewLeadAlert && (
                        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                        <i className="fi flex  fi-rr-bolt text-lg"></i>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Assignment Success</span>
                                        <span className="text-sm font-bold truncate max-w-[200px]">{customer?.customer_name || 'New Lead Assigned'}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowNewLeadAlert(false)}
                                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                                >
                                    <i className="fi flex  fi-rr-cross-small"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-32 lg:pb-12 max-w-7xl">

                        {/* 2. Primary Customer Profile Card */}
                        {/* REDESIGNED LAYOUT: Profile Side-by-Side with Call Engine */}
                        <div className="grid grid-cols-1 md:grid-cols-24 gap-2 mb-3">
                            
                            {/* LEFT: Profile Card (Takes 11 columns) */}
                            <div className="md:col-span-11">
                                <div className="h-full relative rounded-[1rem] bg-white border border-slate-200 overflow-hidden group       transition-shadow duration-500">
                                    {/* Modern Background */}
                                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50/30 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

                                    <div className="relative z-10 p-6 h-full flex flex-col justify-between gap-3">
                                        {/* Top Section: Identity */}
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between w-full">
                                            {/* Lead Score (Mobile Only) */}
                                            <div className="sm:hidden mb-3 text-center">
                                                <div className={`flex items-center justify-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100`}>
                                                    <i className={`fi ${leadScore.icon} ${leadScore.color} text-[10px]`}></i>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{leadScore.label} Lead</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                                                {/* Avatar with Ring (Desktop Only) */}
                                                <div className="relative hidden sm:block">
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white text-xl font-bold">
                                                        {customer?.customer_name?.charAt(0) || 'C'}
                                                    </div>
                                                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-[3px] border-white flex items-center justify-center ${
                                                         customer?.status === 'followup' ? 'bg-amber-400' : 'bg-emerald-500'
                                                    }`}>
                                                         {customer?.status === 'followup' ? (
                                                            <i className="fi flex fi-rr-clock text-[10px] text-white mt-0.5"></i>
                                                         ) : (
                                                            <i className="fi flex fi-rr-check text-[10px] text-white mt-0.5"></i>
                                                         )}
                                                    </div>
                                                </div>

                                                {/* Name & ID */}
                                                <div className="text-center sm:text-left">
                                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                                                            {customer?.customer_name || 'Anonymous User'}
                                                        </h2>
                                                    </div>
                                                    <div className="flex   items-center justify-center sm:justify-start gap-4 text-slate-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <i className="fi flex  fi-rr-id-badge text-xs opacity-50"></i>
                                                            <span className="text-[10px] font-semibold tracking-wide">
                                                                #{customer?.lead_id || '---'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* KPI / Lead Score Badge (Desktop Only) */}
                                            <div className="hidden sm:block text-right">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Lead Score</p>
                                                <div className="flex items-center justify-end gap-1">
                                                    <i className={`fi flex mr-2 ${leadScore.icon} ${leadScore.color} text-sm`}></i>
                                                    <span className="text-xl font-black text-slate-800">{leadScore.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Interaction & Status Summary (New Addition) */}
                                        <div className="flex  flex-wrap md:flex-nowrap items-center gap-2 px-1 w-full">
                                            {/* Total Interactions Badge */}
                                            <div className="order-1 flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 shrink-0">
                                                <i className="fi flex  fi-rr-clock-three text-slate-400 text-[10px]"></i>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                                                    {(totalAttemptsCount > 0 ? totalAttemptsCount : (customer?.attempt_count || history?.length || 0))} Attempts
                                                </span>
                                            </div>

                                            {/* Last Status Chain - Responsive & Reordered */}
                                            {lastInteraction && (
                                                <div className="order-3 md:order-2 w-full md:w-auto flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100 md:flex-none md:max-w-[60%] min-w-0 overflow-hidden">
                                                     <i className="fi flex  fi-rr-vector-alt text-purple-400 text-[10px] shrink-0"></i>
                                                     <div className="flex items-center gap-1 text-[10px] font-semibold text-purple-700 truncate">
                                                        <span className="truncate">{lastInteraction.disposition || 'N/A'}</span>
                                                        {lastInteraction.sub_disposition && (
                                                            <>
                                                                <span className="text-purple-300">/</span>
                                                                <span className="truncate">{lastInteraction.sub_disposition}</span>
                                                            </>
                                                        )}
                                                        {lastInteraction.outcome && (
                                                            <>
                                                                <span className="text-purple-300">/</span>
                                                                <span className="truncate text-purple-900 font-bold">{lastInteraction.outcome}</span>
                                                            </>
                                                        )}
                                                     </div>
                                                </div>
                                            )}

                                            {/* Last 3 Interactions (Right Aligned - Avatar Group Style) */}
                                            <div className="order-2 md:order-3 flex items-center -space-x-2 shrink-0 ml-auto pl-2">
                                                {mobileLogs?.slice(0, 3).map((log, i) => {
                                                    const type = (log.type || '').toLowerCase();
                                                    // Mobile logs usually have 'incoming', 'outgoing', 'missed' as types
                                                    const isMissed = type === 'missed' || type === 'rejected';
                                                    const isIncoming = type === 'incoming';
                                                    
                                                    let bgClass = 'bg-blue-500';
                                                    let iconClass = 'fi-rr-arrow-up-right';
                                                    let rotateClass = 'rotate-12';

                                                    if (isMissed) {
                                                        bgClass = 'bg-red-500';
                                                        iconClass = 'fi-rr-arrow-up-right'; // Or different icon for missed
                                                        rotateClass = 'rotate-45';
                                                    } else if (isIncoming) {
                                                        bgClass = 'bg-emerald-500';
                                                        iconClass = 'fi-rr-arrow-down-left';
                                                        rotateClass = '-rotate-12';
                                                    }

                                                    return (
                                                        <div 
                                                            key={i} 
                                                            className={`relative flex items-center justify-center w-8 h-8 rounded-full ${bgClass} border-2 border-white ring-1 ring-slate-100 shadow-sm transition-transform hover:scale-110 hover:z-50`}
                                                            style={{ zIndex: 30 - (i * 10) }}
                                                            title={`${isMissed ? 'Missed Call' : isIncoming ? 'Incoming Call' : 'Outgoing Call'} • ${log.duration ? formatTime(log.duration) : '0s'}`}
                                                        >
                                                            <i className={`fi flex ${iconClass} text-white text-[10px] transform ${rotateClass}`}></i>
                                                        </div>
                                                    );
                                                })}
                                                {(!mobileLogs || mobileLogs.length === 0) && (
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center">
                                                        <i className="fi flex  fi-rr-minus text-slate-200 text-xs"></i>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bottom Section: Info Tiles */}
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {/* Manager Tile */}
                                            <div className="p-1 sm:p-2 rounded-2xl bg-transparent flex flex-col items-center justify-center text-center gap-0.5 hover:bg-slate-50 transition-all cursor-default group/tile">
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 mb-0.5 group-hover/tile:scale-110 transition-transform">
                                                     <i className="fi flex  fi-rr-user flex text-xs sm:text-sm"></i>
                                                </div>
                                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">Manager</p>
                                                <p className="text-[10px] sm:text-xs font-bold text-slate-800 truncate w-full px-1 sm:px-2">{managedByInfo?.name || 'Self'}</p>
                                            </div>

                                            {/* Disposition Tile */}
                                            <div className="p-1 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-0.5 hover:bg-slate-50 transition-all cursor-default group/tile">
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-purple-400 mb-0.5 group-hover/tile:scale-110 transition-transform">
                                                     <i className="fi flex  fi-rr-comment-alt text-xs sm:text-sm"></i>
                                                </div>
                                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</p>
                                                <p className="text-[10px] sm:text-xs font-bold text-purple-600 truncate w-full px-1 sm:px-2">{customer?.disposition || 'Fresh'}</p>
                                            </div>

                                             {/* Valid Until Tile */}
                                             <div className="p-1 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-0.5 hover:bg-slate-50 transition-all cursor-default group/tile relative">
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-amber-400 mb-0.5 group-hover/tile:scale-110 transition-transform">
                                                     <i className="fi flex  fi-rr-calendar-clock text-xs sm:text-sm"></i>
                                                </div>
                                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">Expiry</p>
                                                <div className="flex items-center gap-1 group/expiry">
                                                    <p className="text-[10px] sm:text-xs font-bold text-slate-700 truncate max-w-[80px] px-1 sm:px-2">{formatDate(customer?.expiry_date)}</p>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Convert to YYYY-MM-DD for input date
                                                            let dStr = "";
                                                            if (customer?.expiry_date) {
                                                                try {
                                                                    const d = new Date(customer.expiry_date);
                                                                    if (!isNaN(d.getTime())) {
                                                                        dStr = d.toISOString().split('T')[0];
                                                                    }
                                                                } catch(err) {}
                                                            }
                                                            setTempExpiryDate(dStr);
                                                            setIsEditingExpiry(!isEditingExpiry);
                                                        }}
                                                        className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-amber-50 text-slate-300 hover:text-amber-500 transition-all opacity-0 group-hover/tile:opacity-100"
                                                    >
                                                        <i className="fi flex fi-rr-edit text-[10px]"></i>
                                                    </button>
                                                </div>

                                                {/* Expiry Date Picker Popper */}
                                                {isEditingExpiry && (
                                                    <div 
                                                        ref={expiryDatePickerRef}
                                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[60] bg-white p-3 rounded-2xl shadow-2xl border border-slate-300 w-48 animate-in fade-in zoom-in duration-200"
                                                    >
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Update Expiry</p>
                                                        <div className="relative mb-3 group/exp-input">
                                                            <div className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-between">
                                                                <span className="text-slate-700">
                                                                    {tempExpiryDate ? (() => {
                                                                        const [y, m, d] = tempExpiryDate.split('-');
                                                                        return `${d}/${m}/${y}`;
                                                                    })() : 'DD/MM/YYYY'}
                                                                </span>
                                                                <i className="fi fi-rr-calendar text-slate-400"></i>
                                                            </div>
                                                            <input 
                                                                type="date" 
                                                                value={tempExpiryDate}
                                                                onChange={(e) => setTempExpiryDate(e.target.value)}
                                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIsEditingExpiry(false);
                                                                }}
                                                                className="flex-1 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold hover:bg-slate-200 transition-all"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleUpdateExpiry(tempExpiryDate);
                                                                }}
                                                                disabled={saving}
                                                                className="flex-1 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-1"
                                                            >
                                                                {saving ? '...' : (
                                                                    <>
                                                                        <i className="fi flex fi-rr-check text-[8px]"></i>
                                                                        Save
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                             {/* Campaign Tile */}
                                             <div className="p-1 sm:p-3 rounded-2xl flex flex-col items-center justify-center text-center gap-0.5 hover:bg-slate-50 transition-all cursor-default group/tile">
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center text-emerald-500 mb-0.5 group-hover/tile:scale-110 transition-transform">
                                                     <i className="fi flex  fi-rr-bullhorn text-xs sm:text-sm"></i>
                                                </div>
                                                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">Campaign</p>
                                                <p className="text-[10px] sm:text-xs font-bold text-emerald-600 truncate w-full px-1 sm:px-2">{campaign?.name || 'Global'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
 
                            {/* MIDDLE: Live Notes (Takes 6 columns) */}
                            <div className="md:col-span-6 flex flex-col">
                                <div className="h-full relative rounded-2xl bg-white border border-slate-200 overflow-hidden group transition-all duration-500 flex flex-col pt-4">
                                    {/* Abstract Background matching Call Engine */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-indigo-50/50 blur-[80px]" />
                                        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-violet-50/50 blur-[80px]" />
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full gap-2 px-4 pb-4">
                                        <div 
                                            className="flex items-center justify-between mb-1 cursor-pointer md:cursor-default"
                                            onClick={() => {
                                                if (window.innerWidth < 768) {
                                                    setIsNotesExpanded(!isNotesExpanded);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-widest" style={{ fontFamily: "'Poppins', sans-serif" }}>Persistent Notes</h3>
                                                    <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${liveNotes.trim().length > 0 ? (isSavingLiveNotes ? 'bg-amber-400' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]') : 'bg-slate-200'}`} />
                                                    {isSavingLiveNotes && <span className="text-[8px] font-bold text-amber-500 tracking-tighter animate-pulse">Saving...</span>}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowEnlargedNotes(true);
                                                    }}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all"
                                                    title="Expand Notes"
                                                >
                                                    <i className="fi flex  fi-rr-expand text-[10px]"></i>
                                                </button>
                                                {/* Expand/Collapse Arrow (Mobile Only) */}
                                               
                                                <button 
                                                    className={`md:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-400 transition-transform duration-300 ${isNotesExpanded ? 'rotate-180' : ''}`}
                                                >
                                                    <i className="fi flex  fi-rr-angle-small-down"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className={`transition-all duration-500 ease-in-out overflow-hidden flex-1 flex flex-col ${isNotesExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 md:max-h-none opacity-0 md:opacity-100'}`}>
                                            <div className="h-[180px] relative flex bg-slate-50/30 rounded-xl border border-slate-200 overflow-hidden focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all">
                                                {/* Line Numbers Column */}
                                                <div 
                                                    ref={lineNumbersRef}
                                                    className="w-8 py-3 bg-slate-100/30 border-r border-slate-200 flex flex-col items-center text-[8px] font-bold text-slate-300 select-none overflow-hidden"
                                                >
                                                    {(liveNotes.split('\n').length > 0 ? liveNotes.split('\n') : ['']).map((_, i) => (
                                                        <div key={i} className="leading-6 h-6">{i + 1}</div>
                                                    ))}
                                                </div>
                                                <textarea 
                                                    ref={textareaRef}
                                                    onScroll={syncScroll}
                                                    value={liveNotes}
                                                    onChange={(e) => {
                                                        setLiveNotes(e.target.value);
                                                    }}
                                                    onBlur={() => handleSaveLiveNotes()}
                                                    placeholder="Write Something Here..."
                                                    className="flex-1 h-full bg-transparent text-slate-700 p-3 pt-[13px] text-[12px] font-medium outline-none transition-all resize-none leading-6 placeholder:text-slate-300 overflow-y-auto custom-scrollbar"
                                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1.5">
                                                    <input 
                                                        type="file" 
                                                        ref={fileInputRef} 
                                                        className="hidden" 
                                                        multiple
                                                        onChange={handleFileSelect} 
                                                    />
                                                    <button 
                                                        onClick={() => setShowAttachmentModal(true)}
                                                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100 transition-all duration-300 group/attach"
                                                        title="Manage Attachments"
                                                    >
                                                        <i className="fi flex  fi-rr-clip text-[10px] group-hover/attach:rotate-12 transition-transform"></i>
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Attachment</span>
                                                        {attachments.length > 0 && (
                                                            <span className="ml-0.5 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white text-[8px] flex items-center justify-center font-bold">
                                                                {attachments.length}
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        if (confirm("Clear all persistent notes?")) {
                                                            setLiveNotes("");
                                                            handleSaveLiveNotes("");
                                                        }
                                                    }}
                                                    className={`p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 ${liveNotes.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                                                    title="Clear All"
                                                >
                                                    <i className="fi flex  fi-rr-trash-undo text-xs"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <div className="md:col-span-7 flex flex-col">
                                {/* The Call Engine */}
                                <div className={`flex-1 relative overflow-hidden rounded-[1rem] transition-all duration-1000 flex flex-col ${
                                    isCalling && isAgentAnswered 
                                    ? 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800' 
                                    : 'bg-white border border-slate-200   '
                                }`}>
                                    {/* Abstract Background Visuals */}
                                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                        <div className={`absolute -top-24 -left-24 w-80 h-80 rounded-full blur-[100px] transition-all duration-1000 ${isCalling && isAgentAnswered ? 'bg-white/15' : 'bg-indigo-50/50'}`} />
                                        <div className={`absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-[100px] transition-all duration-1000 ${isCalling && isAgentAnswered ? 'bg-purple-500/20' : 'bg-violet-50/50'}`} />
                                        
                                    </div>
                                    
                                     {/* Keypad / Actions */}
                                     {/* ... keeping existing keypad code ... */}
                                     {/* I need to make sure I don't delete the keypad logic. 
                                         Since I cannot "skip" content in Replace, 
                                         I must include the entire Call Engine content or find a precise insertion point.
                                     */
                                     } 
                                     {/* This is risky. The Call Engine is huge. */}
                                     
                                     {/* BETTER STRATEGY: 
                                        I already replaced the START of Call Engine                                     {/* Content Container */}
                                    <div className="relative z-10 p-3 h-full flex flex-col">
                                    <div className="flex flex-col h-full justify-between gap-1 relative z-20">
                                            
                                            {/* LEFT: Branding & Status */}
                                            {/* ULTRA COMPACT STATUS SECTION */}
                                            <div className="w-full text-center space-y-1 pt-1">
                                                {/* Dynamic Status Badge */}
                                                {!isCustomerRinging && (
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border backdrop-blur-md transition-all duration-500 mx-auto ${
                                                        isCalling && isCustomerAnswered 
                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' 
                                                        : isWaitingForAgent
                                                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                                                        : 'bg-white/60 border-indigo-100 text-indigo-600'
                                                    }`}>
                                                        
                                                        <div className="relative flex h-1.5 w-1.5">
                                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                                                isCalling && isCustomerAnswered ? 'bg-emerald-400' : isWaitingForAgent ? 'bg-amber-400' : 'bg-indigo-400'
                                                            }`}></span>
                                                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                                                                isCalling && isCustomerAnswered ? 'bg-emerald-500' : isWaitingForAgent ? 'bg-amber-500' : 'bg-indigo-500'
                                                            }`}></span>
                                                        </div>
                                                        <span className="text-[8px] font-black uppercase tracking-widest leading-none pt-px">
                                                            {isWaitingForAgent ? 'Connecting' :
                                                             isCalling && isCustomerAnswered ? 'Live' :
                                                             postCall ? 'Done' : 
                                                             'Ready'}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Compact Timer / Title */}
                                                <div>
                                                    {isCalling && isCustomerAnswered ? (
                                                        <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                                                            <h1 className="text-2xl sm:text-3xl mt-2 font-bold text-white tracking-tighter tabular-nums " style={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                                                {formatTime(callDuration)}
                                                            </h1>
                                                        </div>
                                                    ) : isCustomerRinging ? (
                                                        <div className="animate-in zoom-in duration-300 flex flex-col items-center">
                                                            <h1 className="text-2xl sm:text-3xl mt-2 font-extrabold text-white tracking-tight animate-pulse" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                                                Ringing...
                                                            </h1>
                                                            <p className="text-[10px] font-semibold text-indigo-100/90 mt-1 flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                                                                Agent Answered • Calling Customer
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <h2 className={`text-xl mt-4 sm:text-2xl font-extrabold tracking-tight ${postCall ? 'text-slate-400' : 'text-slate-800'}`}>
                                                                {isWaitingForAgent ? 'Connecting Call...' : postCall ? 'Ended' : 'Ready To Call'}
                                                            </h2>
                                                            <p className="text-[9px] font-medium text-slate-400 max-w-[200px] leading-tight mt-0.5">
                                                                {isWaitingForAgent
                                                                 ? 'Waiting for agent response...'
                                                                 : postCall 
                                                                 ? 'Mark outcome.' 
                                                                 : 'Line ready.'}
                                                            </p>
                                                             <div 
                                                                onClick={() => setIsPhoneUnmasked(!isPhoneUnmasked)}
                                                                className="flex mt-4 flex-wrap justify-center items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 border border-blue-100 transition-all hover:bg-blue-100 hover:border-blue-200 cursor-pointer group/phone active:scale-95"
                                                            >
                                                                <i className="fi flex fi-rr-phone-call text-xs text-blue-400 group-hover/phone:text-blue-500 transition-colors"></i>
                                                                <span className="text-xs font-bold font-heading text-blue-700 group-hover/phone:text-blue-800 transition-colors">
                                                                    {isPhoneUnmasked 
                                                                        ? (customer?.phone_no ? decryptPhone(customer.phone_no) : 'N/A') 
                                                                        : (formatMaskedPhone(customer?.phone_no) || 'N/A')
                                                                    }
                                                                </span>
                                                            <span className={`px-2 ml-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                                (customer?.status || 'Active') !== 'Active'
                                                                ? 'bg-orange-50 text-orange-600 border-orange-200'
                                                                : 'bg-slate-100 text-slate-500 border-slate-200'
                                                            }`}>
                                                            {customer?.status || 'Active'}
                                                        </span>
                                                        </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Visualizer Spacer (Middle) */}
                                                <div className="flex mt-4 items-center justify-center min-h-[16px] py-1">
                                                    {(isCalling && (isCustomerAnswered || isCustomerRinging)) && (
                                                        <div className="flex items-center gap-1.5 h-4">
                                                            {[40, 75, 100, 70, 45].map((h, i) => (
                                                                <div 
                                                                    key={i} 
                                                                    className={`w-1 rounded-full origin-center ${
                                                                        isCustomerAnswered ? 'bg-white/80' : 'bg-white/60'
                                                                    }`} 
                                                                    style={{ 
                                                                        height: `${h}%`,
                                                                        animation: 'gentleWave 2.2s ease-in-out infinite',
                                                                        animationDelay: `${i * 0.28}s`
                                                                    }} 
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* RIGHT: Dynamic Action & Stats Area */}
                                            {/* 3. ULTRA COMPACT ACTIONS */}
                                            <div className="w-full pb-0">
                                                {isCalling && isAgentAnswered ? (
                                                    <div className="grid grid-cols-[1fr_auto] gap-2">
                                                        <button 
                                                            onClick={() => handleEndCall(false)}
                                                            disabled={isEndingCall}
                                                            className={`w-full h-12 rounded-xl text-white transition-all flex items-center justify-center gap-2 group overflow-hidden relative bg-red-500 ${
                                                                isEndingCall
                                                                    ? 'opacity-60 cursor-not-allowed shadow-none pointer-events-none'
                                                                    : 'hover:bg-red-600 active:bg-red-700 shadow-lg shadow-red-500/20 hover:scale-[1.01] active:scale-95'
                                                            }`}
                                                        >
                                                            {isEndingCall ? (
                                                                <div className="flex items-center justify-center">
                                                                    <DancingDots dotColor="bg-white" />
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="w-6 h-6 mr-2 rounded-full bg-white/20 flex items-center justify-center relative z-10 group-hover:rotate-12 transition-transform">
                                                                        <i className="fi flex  fi-rr-phone-slash text-sm"></i>
                                                                    </div>
                                                                    <span className="font-extrabold text-[10px] uppercase tracking-widest relative z-10">
                                                                        Disconnect
                                                                    </span>
                                                                </>
                                                            )}
                                                        </button>
                                                          <button 
                                                            onClick={handleWhatsAppClick}
                                                            disabled={isEndingCall}
                                                            className={`h-12 w-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group ${isEndingCall ? 'opacity-50 pointer-events-none' : ''}`}
                                                        >
                                                            <i className="fi flex  fi-brands-whatsapp text-xl group-hover:rotate-12 transition-transform"></i>
                                                        </button>
                                                        
                                                       
                                                    </div>
                                                ) : !postCall ? (
                                                    // CONDITIONAL LAYOUT: Follow-up vs Standard
                                                    (customer?.status || 'Active').toLowerCase() === 'followup' ? (
                                                        // FOLLOW-UP LAYOUT (Unified Container)
                                                        <div className="w-full flex flex-col gap-2 p-2 rounded-2xl bg-orange-50/80 border border-orange-100">
                                                            {/* Row 1: Last Interaction Context (Column Wise) */}
                                                            <div className="px-1 flex flex-col gap-0.5">
                                                                 <div className="flex justify-between items-end">
                                                                    <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider">Last Interaction</span>
                                                                    <span className="text-[9px] font-medium text-orange-800/60">{lastInteraction ? formatDate(lastInteraction.created_at) : 'No history'}</span>
                                                                 </div>
                                                                 <p className="text-[10px] font-semibold text-orange-900 border-l-2 border-orange-300 pl-2 line-clamp-2 italic leading-tight">
                                                                    "{lastInteraction?.notes || 'No notes available'}"
                                                                 </p>
                                                            </div>

                                                            {/* Row 2: Actions Row (Slider + WhatsApp) */}
                                                            <div className="flex items-center gap-2 w-full">
                                                                    {/* Slider Button (Grow) */}
                                                                    <div 
                                                                        ref={containerRef}
                                                                        className={`relative h-[54px] flex-1 rounded-2xl bg-orange-100/50 overflow-hidden select-none touch-none shadow-inner border border-orange-200 group/slider ${isPlacingCall ? 'pointer-events-none' : ''}`}
                                                                        onPointerDown={(e) => {
                                                                            if (isPlacingCall) return;
                                                                            setIsDragging(true);
                                                                            startXRef.current = e.clientX;
                                                                            hasMovedRef.current = false;
                                                                            if (sliderHandleRef.current) {
                                                                                sliderHandleRef.current.style.transition = 'none';
                                                                            }
                                                                            if (skipTextRef.current) {
                                                                                skipTextRef.current.style.transition = 'none';
                                                                            }
                                                                            try {
                                                                                 (e.target as Element).setPointerCapture(e.pointerId);
                                                                            } catch(err) {}
                                                                        }}
                                                                        onPointerMove={(e) => {
                                                                            if (!isDragging || !containerRef.current || !sliderHandleRef.current || !skipTextRef.current) return;
                                                                            const currentX = e.clientX;
                                                                            const diff = currentX - startXRef.current;
                                                                            
                                                                            if (Math.abs(diff) > 10) {
                                                                                hasMovedRef.current = true;
                                                                            }

                                                                            const containerWidth = containerRef.current.clientWidth;
                                                                            const maxDrag = containerWidth * 0.85; 
                                                                            
                                                                            const x = Math.max(0, Math.min(diff, maxDrag));
                                                                            sliderHandleRef.current.style.transform = `translateX(${x}px)`;
                                                                            
                                                                            // Subtle Reveal logic (x/10 factor for subtle movement)
                                                                            const opacity = Math.min(1, x / 40); 
                                                                            const lateralMove = Math.min(0, (x / 10) - 15);
                                                                            skipTextRef.current.style.opacity = String(opacity);
                                                                            skipTextRef.current.style.transform = `translateX(${lateralMove}px)`;
                                                                        }}
                                                                        onPointerUp={(e) => {
                                                                            if (!isDragging) return;
                                                                            setIsDragging(false);
                                                                            try {
                                                                                (e.target as Element).releasePointerCapture(e.pointerId);
                                                                            } catch(err) {}

                                                                            const containerWidth = containerRef.current?.clientWidth || 300;
                                                                            const currentTransform = sliderHandleRef.current?.style.transform || "";
                                                                            const match = currentTransform.match(/translateX\(([\d.]+)px\)/);
                                                                            const x = match ? parseFloat(match[1]) : 0;
                                                                            
                                                                            const threshold = containerWidth * 0.4;
                                                                            
                                                                            if (x > threshold) {
                                                                                handleSkipCall();
                                                                            } else if (!hasMovedRef.current && x < 5) {
                                                                                handleStartCall();
                                                                            }
                                                                            
                                                                            if (sliderHandleRef.current) {
                                                                                sliderHandleRef.current.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                                                                                sliderHandleRef.current.style.transform = 'translateX(0px)';
                                                                            }
                                                                            if (skipTextRef.current) {
                                                                                skipTextRef.current.style.transition = 'all 0.3s ease';
                                                                                skipTextRef.current.style.opacity = '0';
                                                                                skipTextRef.current.style.transform = 'translateX(-15px)';
                                                                            }
                                                                        }}
                                                                        onPointerLeave={() => {
                                                                            if (isDragging) {
                                                                                setIsDragging(false);
                                                                                if (sliderHandleRef.current) {
                                                                                    sliderHandleRef.current.style.transition = 'transform 0.3s ease';
                                                                                    sliderHandleRef.current.style.transform = 'translateX(0px)';
                                                                                }
                                                                                if (skipTextRef.current) {
                                                                                    skipTextRef.current.style.transition = 'all 0.3s ease';
                                                                                    skipTextRef.current.style.opacity = '0';
                                                                                    skipTextRef.current.style.transform = 'translateX(-15px)';
                                                                                }
                                                                            }
                                                                        }}
                                                                    >
                                                                        {/* Background Layer - revealing "Skip Lead" as we slide right */}
                                                                        <div className="absolute inset-0 flex items-center justify-start pl-6 bg-transparent pointer-events-none">
                                                                            <span 
                                                                                ref={skipTextRef}
                                                                                className="text-orange-500 font-black uppercase text-[11px] tracking-widest flex items-center gap-2 opacity-0 inline-block"
                                                                                style={{ transform: 'translateX(-15px)' }}
                                                                            >
                                                                                 <i className="fi flex  fi-rr-forward-step text-sm"></i> Skip Lead
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        {/* Draggable Button (Foreground) */}
                                                                        <div 
                                                                            ref={sliderHandleRef}
                                                                            className={`absolute inset-0 w-full rounded-2xl flex items-center justify-center gap-3 will-change-transform z-10 transition-all bg-gradient-to-r from-orange-500 to-amber-600 ${
                                                                                isWaitingForAgent || isPlacingCall 
                                                                                    ? 'opacity-60 cursor-not-allowed shadow-none pointer-events-none' 
                                                                                    : `shadow-lg shadow-orange-500/30 ${isDragging ? 'shadow-2xl brightness-110' : ''}`
                                                                            }`}
                                                                            style={{ 
                                                                                cursor: isWaitingForAgent || isPlacingCall ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab')
                                                                            }}
                                                                        >
                                                                            {isWaitingForAgent || isPlacingCall ? (
                                                                                <div className="flex items-center justify-center">
                                                                                    <DancingDots dotColor="bg-white" />
                                                                                </div>
                                                                            ) : (
                                                                                <>
                                                                                    <i className="fi flex  fi-rr-phone-call text-white text-lg"></i>
                                                                                    <div className="flex flex-col items-start leading-none">
                                                                                        <span className="text-white font-black text-xs uppercase tracking-widest">Connect Now</span>
                                                                                        <span className="text-white/70 font-bold text-[8px] uppercase tracking-tighter">Follow Up Call</span>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                {/* WhatsApp Button (Inside Row) */}
                                                                <button 
                                                                    onClick={handleWhatsAppClick}
                                                                    disabled={isPlacingCall}
                                                                    className={`h-[54px] w-[54px] rounded-2xl bg-emerald-500 text-white transition-all flex items-center justify-center group shrink-0 ${
                                                                        isPlacingCall 
                                                                            ? 'opacity-60 cursor-not-allowed shadow-none pointer-events-none' 
                                                                            : 'hover:bg-emerald-600 hover:scale-105 active:scale-95'
                                                                    }`}
                                                                >
                                                                    <i className="fi flex  fi-brands-whatsapp text-2xl group-hover:rotate-12 transition-transform"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // STANDARD LAYOUT (Grid)
                                                        <div className="grid grid-cols-[1fr_auto] gap-2">
                                                            <button 
                                                                onClick={handleStartCall}
                                                                disabled={isWaitingForAgent || isPlacingCall}
                                                                className={`h-12 rounded-xl text-white font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group relative overflow-hidden bg-indigo-600 ${
                                                                    isWaitingForAgent || isPlacingCall 
                                                                        ? 'opacity-60 cursor-not-allowed shadow-none pointer-events-none' 
                                                                        : 'hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:scale-95'
                                                                }`}
                                                            >
                                                                {isWaitingForAgent || isPlacingCall ? (
                                                                    <div className="flex items-center justify-center relative z-10">
                                                                        <DancingDots dotColor="bg-white" />
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="w-6 h-6 rounded-lg flex items-center justify-center relative z-10 group-hover:shake">
                                                                            <i className="fi flex  fi-rr-phone-call text-sm"></i>
                                                                        </div>
                                                                        <span className="relative z-10">Call Now</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                            
                                                            <button 
                                                                onClick={handleWhatsAppClick}
                                                                disabled={isWaitingForAgent || isPlacingCall}
                                                                className={`h-12 w-12 rounded-xl transition-all flex items-center justify-center group bg-emerald-500 ${
                                                                    isWaitingForAgent || isPlacingCall 
                                                                        ? 'opacity-60 cursor-not-allowed shadow-none pointer-events-none' 
                                                                        : 'hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'
                                                                }`}
                                                            >
                                                                <i className="fi flex  fi-brands-whatsapp text-xl group-hover:rotate-12 transition-transform"></i>
                                                            </button>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                        <button 
                                                            onClick={handleStartCall}
                                                            disabled={isPlacingCall}
                                                            className={`h-10 rounded-lg font-bold text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-600 ${
                                                                isPlacingCall 
                                                                    ? 'opacity-60 cursor-not-allowed shadow-none pointer-events-none' 
                                                                    : 'hover:bg-indigo-100'
                                                            }`}
                                                        >
                                                            {isPlacingCall ? (
                                                                <div className="flex items-center justify-center">
                                                                    <DancingDots dotColor="bg-indigo-600" />
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <i className="fi flex  fi-rr-refresh text-xs"></i> Redial
                                                                </>
                                                            )}
                                                        </button>
                                                        <button 
                                                            onClick={handleWhatsAppClick}
                                                            className="h-10 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 font-bold text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 hover:  "
                                                        >
                                                            <i className="fi flex  fi-brands-whatsapp text-xs"></i> Chat
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                </div>
                                </div>
                        </div>
                        </div>
                        </div>


                        {/* 3. Main Content Grid (Bottom Row) - Equal 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    {/* INFO CARD */}
                                    <div className="md:col-span-3 bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 relative overflow-hidden h-auto xl:min-h-[800px] flex flex-col">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-bl-[3rem] -z-0" />
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-100 flex items-center justify-center text-white">
                                                    <i className="fi flex   fi-rr-info text-sm"></i>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-semibold text-slate-800"> Details</h3>
                                                        <button 
                                                            onClick={handleEditDetailsClick}
                                                            className="flex items-center  px-3 py-3 rounded-lg bg-indigo-50  text-indigo-600 hover:bg-slate-900 hover:text-white transition-all group/editbtn"
                                                        >
                                                            <i className="fi flex fi-rr-edit text-[9px] group-hover/editbtn:text-indigo-300"></i>
                                                          
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] font-semibold text-slate-400 ">Reference Data</p>
                                                </div>
                                            </div>
                                             <div className="flex-initial xl:flex-1 xl:overflow-y-auto overflow-visible pr-2 custom-scrollbar">
                                                {renderCleanedDetails(customer?.customer_details)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* OUTCOME FORM */}
                                    <div className={`md:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 relative transition-opacity duration-500 h-auto xl:min-h-[800px] flex flex-col ${!postCall ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/30 rounded-bl-[3rem] z-0" />
                                         <div className="relative z-10 space-y-6 flex-1 pb-24">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-purple-600 shadow-lg shadow-purple-100 flex items-center justify-center text-white">
                                                    <i className="fi flex   fi-rr-check-circle text-sm"></i>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Set Outcome</h3>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Post-Call Disposition</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {/* Primary Dispositions */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between px-1">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Status</p>
                                                        
                                                        <div className="relative" ref={assignPickerRef}>
                                                            <button 
                                                                onClick={() => setIsAssignPickerOpen(!isAssignPickerOpen)}
                                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/50 hover:bg-slate-900 hover:text-white transition-all group"
                                                            >
                                                                <i className="fi flex fi-rr-user-gear flex text-[10px] text-indigo-500 group-hover:text-indigo-300"></i>
                                                                <span className="text-[9px] font-bold uppercase tracking-tight text-indigo-600 group-hover:text-white">Assigned To</span>
                                                                <i className={`fi fi-rr-angle-small-down flex text-[10px] transition-transform ${isAssignPickerOpen ? 'rotate-180' : ''}`}></i>
                                                            </button>

                                                            {isAssignPickerOpen && (
                                                                <div className="absolute top-full mt-2 right-0 w-[180px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[110] animate-in fade-in zoom-in-95 duration-200">
                                                                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                                                                        {(!campaign?.users || campaign.users.length === 0) ? (
                                                                            <div className="p-4 text-center">
                                                                                <p className="text-[10px] text-slate-400 font-bold uppercase">No Users Found</p>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="space-y-1">
                                                                                 {campaign.users.map((u: any) => {
                                                                                     const targetId = u.user_id || u.id;
                                                                                     const isSelected = customer?.managed_by === targetId;
                                                                                     return (
                                                                                        <button
                                                                                            key={u.id}
                                                                                            onClick={() => handleUpdateManagedBy(targetId)}
                                                                                            className={`w-full flex items-center gap-2 p-2 rounded-xl transition-all hover:bg-indigo-50 ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-600' : 'text-slate-600'}`}
                                                                                        >
                                                                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${isSelected ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`}>
                                                                                                {u.name?.charAt(0) || 'U'}
                                                                                            </div>
                                                                                            <div className="text-left overflow-hidden">
                                                                                                <p className="text-[10px] font-bold truncate leading-tight">{u.name || 'Unknown'}</p>
                                                                                                <p className={`text-[8px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>{u.email || 'No email'}</p>
                                                                                            </div>
                                                                                        </button>
                                                                                     );
                                                                                 })}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {primaryDispositions.map((item) => (
                                                            <button
                                                                key={item}
                                                                onClick={() => {
                                                                    setDisposition(item);
                                                                    setSubDisposition(""); 
                                                                    // Auto-set current time + 5m when selecting Call Back
                                                                    if (item === 'Call Back') {
                                                                        const now = new Date();
                                                                        const futureBtn = new Date(now.getTime() + 5 * 60000);
                                                                        const dStr = `${futureBtn.getFullYear()}-${String(futureBtn.getMonth() + 1).padStart(2, '0')}-${String(futureBtn.getDate()).padStart(2, '0')}`;
                                                                        const tStr = futureBtn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                                                        setCallbackDate(dStr);
                                                                        setCallbackTime(tStr);
                                                                    }
                                                                }}
                                                                className={`px-3 py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                                                    disposition === item 
                                                                    ? 'bg-indigo-600 text-white border-indigo-600   scale-105' 
                                                                    : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:  '
                                                                }`}
                                                            >
                                                                {item}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Sub Dispositions (Conditional) */}
                                                {disposition && dispositionHierarchy[disposition]?.length > 0 && (
                                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest pl-1 text-[10px]">Reason / Type</p>
                                                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                            {dispositionHierarchy[disposition].map((sub) => (
                                                                    <button
                                                                        key={sub}
                                                                        onClick={() => {
                                                                            setSubDisposition(sub);
                                                                            setOutcome("");
                                                                        }}
                                                                        className={`px-1 py-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                                                            subDisposition === sub 
                                                                            ? 'bg-indigo-600 text-white border-indigo-600   scale-105' 
                                                                            : 'bg-white text-indigo-500 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 hover:  '
                                                                        }`}
                                                                    >
                                                                    {sub}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Outcomes (Conditional on Sub-Disposition for Call Back and Not Contactable) */}
                                                {(disposition === 'Call Back' || disposition === 'Not Contactable') && subDisposition && (
                                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <div className="flex items-center justify-between pl-1">
                                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Outcome</p>
                                                            <button 
                                                                onClick={() => setIsAddingOutcome(true)}
                                                                className="text-[10px] text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 transition-all hover:bg-indigo-100"
                                                            >
                                                                <i className="fi flex  fi-rr-plus-small"></i> Add New
                                                            </button>
                                                        </div>
                                                        
                                                        {isAddingOutcome && (
                                                            <div className="flex items-center gap-2 mb-2 animate-in fade-in slide-in-from-top-1 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100">
                                                                <input 
                                                                    type="text" 
                                                                    value={newOutcomeInput}
                                                                    onChange={(e) => setNewOutcomeInput(e.target.value)}
                                                                    className="flex-1 text-gray-500 px-3 py-2 text-xs border border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 bg-white"
                                                                    placeholder="New outcome label..."
                                                                    autoFocus
                                                                />
                                                                <button 
                                                                    onClick={handleAddOutcome}
                                                                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200"
                                                                >
                                                                    Add
                                                                </button>
                                                                <button 
                                                                     onClick={() => setIsAddingOutcome(false)}
                                                                     className="px-3 py-2 bg-white text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 border border-slate-200"
                                                                >
                                                                     Cancel
                                                                </button>
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap gap-2">
                                                            {userOutcomes.map((out) => (
                                                                <div 
                                                                    key={out.id}
                                                                    className={`group relative flex items-center px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                                                                        outcome === out.outcome_label 
                                                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' 
                                                                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                                                    }`}
                                                                    onClick={() => setOutcome(out.outcome_label)}
                                                                >
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">{out.outcome_label}</span>
                                                                    <button 
                                                                        onClick={(e) => {
                                                                             e.stopPropagation();
                                                                             handleDeleteOutcome(out.id);
                                                                        }}
                                                                        className={`absolute -top-2 -right-2 w-5 h-5 bg-white text-red-500 border border-red-100 rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex    hover:bg-red-50`}
                                                                    >
                                                                         <i className="fi flex fi-rr-cross-small text-[10px]"></i>
                                                                    </button>
                                                                </div>
                                                            ))}
                                                             {userOutcomes.length === 0 && !isAddingOutcome && (
                                                                 <div className="w-full text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                                    <p className="text-[10px] text-slate-400 italic">No custom outcomes added yet. Click "+ Add New" to create one.</p>
                                                                 </div>
                                                             )}
                                                        </div>
                                                    </div>
                                                )}

                                              

                                                {/* Call Back Scheduling (Modern Version) */}
                                                {disposition === 'Call Back' && (
                                                    <div className="space-y-3 p-6 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 backdrop-blur-sm animate-in zoom-in-95 duration-500 relative">
                                                        {/* Isolated Background Decorative elements to prevent horizontal overflow */}
                                                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16" />
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between relative z-10">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                                                                    <i className="fi flex  fi-rr-calendar-clock text-xs"></i>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest leading-none mb-1">Schedule Call</p>
                                                                    <p className="text-[12px] font-semibold text-slate-400">
                                                                        {callbackDate ? `Interaction set for ${formatDate(callbackDate)}` : 'Next interaction timeline'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Quick Presets */}
                                                        <div className="flex flex-wrap mt-4 gap-1.5 relative z-10">
                                                             {[
                                                                 { 
                                                                     label: '10 Min', 
                                                                     icon: 'clock', 
                                                                     action: () => {
                                                                         const now = new Date();
                                                                         now.setMinutes(now.getMinutes() + 10);
                                                                         const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                         setCallbackDate(localDate);
                                                                         setCallbackTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                                                                         setActivePreset('10 Min');
                                                                     }
                                                                 },
                                                                 { 
                                                                     label: 'In 1 Hr', 
                                                                     icon: 'clock-three', 
                                                                     action: () => {
                                                                         const now = new Date();
                                                                         now.setHours(now.getHours() + 1);
                                                                         const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                         setCallbackDate(localDate);
                                                                         setCallbackTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                                                                         setActivePreset('In 1 Hr');
                                                                     }
                                                                 },
                                                                 { 
                                                                     label: '3 Hr', 
                                                                     icon: 'stopwatch', 
                                                                     action: () => {
                                                                         const now = new Date();
                                                                         now.setHours(now.getHours() + 3);
                                                                         const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                                                                         setCallbackDate(localDate);
                                                                         setCallbackTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                                                                         setActivePreset('3 Hr');
                                                                     }
                                                                 },
                                                                
                                                                 { 
                                                                     label: 'Tomorrow', 
                                                                     icon: 'sunrise', 
                                                                     action: () => {
                                                                         const now = new Date();
                                                                         const tomorrow = new Date(now);
                                                                         tomorrow.setDate(tomorrow.getDate() + 1);
                                                                         const localDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
                                                                         setCallbackDate(localDate);
                                                                         setCallbackTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
                                                                         setActivePreset('Tomorrow');
                                                                     }
                                                                 }
                                                             ].map((preset) => (
                                                                <button
                                                                    key={preset.label}
                                                                    type="button"
                                                                    onClick={preset.action}
                                                                    className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                                                                        activePreset === preset.label
                                                                        ? 'bg-indigo-600 text-white border-indigo-600 transform scale-105'
                                                                        : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50'
                                                                    }`}
                                                                >
                                                                    <i className={`fi flex fi-rr-${preset.icon} text-[10px]`}></i>
                                                                    {preset.label}
                                                                </button>
                                                            ))}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-50">
                                                            {/* Custom Date Picker Trigger */}
                                                            <div className="relative group/date" ref={datePickerRef}>
                                                                <div className="absolute  inset-y-0 left-3 flex items-center pointer-events-none z-10">
                                                                    <i className="fi flex  fi-rr-calendar text-slate-400 text-[12px]"></i>
                                                                </div>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                                                    className="w-full h-[40px] bg-white rounded-xl pl-9 pr-3 text-[10px] font-bold text-slate-700 border border-slate-200 flex items-center hover:border-indigo-200 transition-all uppercase tracking-tight"
                                                                >
                                                                    {callbackDate ? formatDate(callbackDate) : 'Select Date'}
                                                                </button>

                                                                {isDatePickerOpen && (
                                                                    <div className="absolute top-full mt-2 left-0 w-[240px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-[100] animate-in fade-in zoom-in-95 duration-200">
                                                                        {/* Calendar Header */}
                                                                        <div className="flex items-center justify-between mb-4">
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1))}
                                                                                className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400"
                                                                            >
                                                                                <i className="fi flex fi-rr-angle-left text-[10px]"></i>
                                                                            </button>
                                                                            <p className="text-[12px] font-bold text-slate-800">
                                                                                {months[calendarViewDate.getMonth()]} {calendarViewDate.getFullYear()}
                                                                            </p>
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => setCalendarViewDate(new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1))}
                                                                                className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400"
                                                                            >
                                                                                <i className="fi flex fi-rr-angle-right text-[10px]"></i>
                                                                            </button>
                                                                        </div>

                                                                        {/* Week Days */}
                                                                        <div className="grid grid-cols-7 mb-2">
                                                                            {weekDays.map(d => (
                                                                                <div key={d} className="text-[10px] font-bold text-slate-400 text-center">{d}</div>
                                                                            ))}
                                                                        </div>

                                                                        {/* Dates Grid */}
                                                                        <div className="grid grid-cols-7 gap-1">
                                                                            {generateCalendarDays().map((d, i) => {
                                                                                const dateObj = new Date(d.year, d.month, d.day);
                                                                                const isToday = new Date().toDateString() === dateObj.toDateString();
                                                                                const isSelected = callbackDate === `${d.year}-${String(d.month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
                                                                                
                                                                                return (
                                                                                    <button
                                                                                        key={i}
                                                                                        type="button"
                                                                                        onClick={() => handleDateSelect(d.day, d.month, d.year)}
                                                                                        className={`h-7 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                                                                                            isSelected 
                                                                                            ? 'bg-indigo-600 text-white' 
                                                                                            : !d.currentMonth 
                                                                                                ? 'text-slate-300 hover:bg-slate-50' 
                                                                                                : isToday 
                                                                                                    ? 'text-indigo-600 bg-indigo-50' 
                                                                                                    : 'text-slate-600 hover:bg-slate-50'
                                                                                        }`}
                                                                                    >
                                                                                        {d.day}
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Custom Time Picker Trigger */}
                                                            <div className="relative" ref={timePickerRef}>
                                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                                    <i className="fi flex  fi-rr-clock-three text-slate-400 text-[12px]"></i>
                                                                </div>
                                                                 <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (!isTimePickerOpen) {
                                                                            setTimePickerPos({ x: 0, y: 0 });
                                                                            if (callbackTime) {
                                                                                const [h24, m] = callbackTime.split(':').map(Number);
                                                                                const h12 = h24 % 12 || 12;
                                                                                setTempHour(String(h12).padStart(2, '0'));
                                                                                setTempMinute(String(m || 0).padStart(2, '0'));
                                                                                setTempAmPm(h24 >= 12 ? "PM" : "AM");
                                                                            } else {
                                                                                const now = new Date();
                                                                                const h24 = now.getHours();
                                                                                const h12 = h24 % 12 || 12;
                                                                                setTempHour(String(h12).padStart(2, '0'));
                                                                                setTempMinute(String(now.getMinutes()).padStart(2, '0'));
                                                                                setTempAmPm(h24 >= 12 ? "PM" : "AM");
                                                                            }
                                                                        }
                                                                        setIsTimePickerOpen(!isTimePickerOpen);
                                                                    }}
                                                                    className="w-full h-[40px] bg-white rounded-xl pl-9 pr-3 text-[10px] font-bold text-slate-700 border border-slate-200 flex items-center hover:border-indigo-200 transition-all uppercase tracking-tight"
                                                                >
                                                                    {callbackTime ? (
                                                                        (() => {
                                                                            const [h24, min] = callbackTime.split(':').map(Number);
                                                                            const h12 = h24 % 12 || 12;
                                                                            const ampm = h24 >= 12 ? 'PM' : 'AM';
                                                                            return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${ampm}`;
                                                                        })()
                                                                    ) : 'Select Time'}
                                                                </button>

                                                                 {isTimePickerOpen && (
                                                                    <div 
                                                                        className="absolute top-full mt-2 right-0 w-[240px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-[100] animate-in fade-in zoom-in-95 duration-200"
                                                                        style={{ transform: `translate(${timePickerPos.x}px, ${timePickerPos.y}px)` }}
                                                                    >
                                                                        <div 
                                                                            className="flex items-center justify-between mb-4 pl-1 cursor-grab active:cursor-grabbing select-none"
                                                                            onMouseDown={handleTimePickerMouseDown}
                                                                        >
                                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Set Callback Time</p>
                                                                            <div className="p-1 hover:bg-slate-50 rounded-md transition-colors">
                                                                                 <i className="fi flex fi-rr-apps text-slate-300 text-xs"></i>
                                                                            </div>
                                                                        </div>
                                                                        
                                                                        <div className="flex items-center justify-between gap-2 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                                            {/* Hour Column */}
                                                                            <div className="flex-1 flex flex-col items-center gap-1">
                                                                                <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">HH</span>
                                                                                <div 
                                                                                    ref={hourScrollRef}
                                                                                    className="h-[120px] overflow-y-auto w-full custom-scrollbar flex flex-col gap-1 items-center px-1 py-[44px]"
                                                                                >
                                                                                    {Array.from({ length: 12 }).map((_, i) => {
                                                                                        const h = String(i + 1).padStart(2, '0');
                                                                                        const isSel = tempHour === h;
                                                                                        return (
                                                                                            <button 
                                                                                                key={h} 
                                                                                                onClick={() => setTempHour(h)}
                                                                                                data-active={isSel}
                                                                                                className={`w-full py-2 rounded-xl text-[11px] font-bold transition-all ${isSel ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`}
                                                                                            >
                                                                                                {h}
                                                                                            </button>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>

                                                                            <div className="text-slate-300 font-bold">:</div>

                                                                            {/* Minute Column */}
                                                                            <div className="flex-1 flex flex-col items-center gap-1">
                                                                                <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">MM</span>
                                                                                <div 
                                                                                    ref={minuteScrollRef}
                                                                                    className="h-[120px] overflow-y-auto w-full custom-scrollbar flex flex-col gap-1 items-center px-1 py-[44px]"
                                                                                >
                                                                                    {Array.from({ length: 60 }).map((_, i) => {
                                                                                        const m = String(i).padStart(2, '0');
                                                                                        const isSel = tempMinute === m;
                                                                                        return (
                                                                                            <button 
                                                                                                key={m} 
                                                                                                onClick={() => setTempMinute(m)}
                                                                                                data-active={isSel}
                                                                                                className={`w-full py-2 rounded-xl text-[11px] font-bold transition-all ${isSel ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-white hover:text-indigo-600'}`}
                                                                                            >
                                                                                                {m}
                                                                                            </button>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>

                                                                            <div className="w-px bg-slate-200 h-10 mx-1" />

                                                                            {/* AM/PM Column */}
                                                                            <div className="flex-none w-[50px] flex flex-col items-center gap-1">
                                                                                <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">Period</span>
                                                                                <div className="flex flex-col gap-1 w-full">
                                                                                    {["AM", "PM"].map(p => (
                                                                                        <button 
                                                                                            key={p}
                                                                                            onClick={() => setTempAmPm(p)}
                                                                                            data-active={tempAmPm === p}
                                                                                            className={`w-full py-2 rounded-xl text-[10px] font-black transition-all ${tempAmPm === p ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}
                                                                                        >
                                                                                            {p}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setIsTimePickerOpen(false)}
                                                                                className="py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-slate-100"
                                                                            >
                                                                                Cancel
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    let h = Number(tempHour);
                                                                                    if (tempAmPm === "PM" && h < 12) h += 12;
                                                                                    if (tempAmPm === "AM" && h === 12) h = 0;
                                                                                    setCallbackTime(`${String(h).padStart(2, '0')}:${tempMinute}`);
                                                                                    setActivePreset(null);
                                                                                    setIsTimePickerOpen(false);
                                                                                }}
                                                                                className="py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                                                                            >
                                                                                Apply
                                                                            </button>
                                                                        </div>

                                                                        <div className="h-px bg-slate-100 mb-4" />

                                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Popular Slots</p>
                                                                        <div className="grid grid-cols-2 gap-2 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
                                                                            {timeOptions.map(t => (
                                                                                <button
                                                                                    key={t}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setCallbackTime(t);
                                                                                        setActivePreset(null);
                                                                                        setIsTimePickerOpen(false);
                                                                                    }}
                                                                                    className={`py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                                                                                        callbackTime === t
                                                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                                                                                    }`}
                                                                                >
                                                                                    {(() => {
                                                                                        const [h24, min] = t.split(':').map(Number);
                                                                                        const h12 = h24 % 12 || 12;
                                                                                        const p = h24 >= 12 ? 'PM' : 'AM';
                                                                                        return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${p}`;
                                                                                    })()}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {callbackDate && callbackTime && new Date(`${callbackDate}T${callbackTime}`) < new Date() && (
                                                                <div className="flex items-center gap-2 mt-2 px-1 animate-pulse">
                                                                    <i className="fi flex fi-rr-info text-red-500 text-[12px]"></i>
                                                                    <p className="text-red-500 text-[10px] font-bold uppercase tracking-tight">Cannot schedule for a past time!</p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Conflict UI */}
                                                        {conflictInfo && (
                                                            <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 animate-in fade-in slide-in-from-top-2 duration-300 relative z-10">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                                                                        <i className="fi flex  fi-rr-triangle-warning text-rose-500 text-sm"></i>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[11px] font-black text-rose-900 uppercase tracking-widest mb-1">Slot Conflict Detected</p>
                                                                        <div className="space-y-1 bg-white/50 p-2 rounded-lg border border-rose-100/50 mb-3">
                                                                            <p className="text-[12px] font-bold text-slate-800 truncate">👤 {conflictInfo.customer_name}</p>
                                                                            <p className="text-[10px] text-slate-500 font-medium truncate">📂 Campaign ID: {conflictInfo.campaign_id}</p>
                                                                            <p className="text-[10px] text-slate-500 font-medium">🏷️ {conflictInfo.disposition} - {conflictInfo.sub_disposition || 'N/A'}</p>
                                                                        </div>
                                                                        
                                                                        <div className="flex flex-col gap-2">
                                                                            <button 
                                                                                onClick={async () => {
                                                                                    const dt = new Date(`${callbackDate}T${callbackTime}`);
                                                                                    dt.setMinutes(dt.getMinutes() + 15);
                                                                                    const newDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
                                                                                    const newTime = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
                                                                                    
                                                                                    setCallbackDate(newDate);
                                                                                    setCallbackTime(newTime);
                                                                                    setConflictInfo(null);
                                                                                    
                                                                                    // Recursive check
                                                                                    const nextDt = new Date(`${newDate}T${newTime}`);
                                                                                    nextDt.setSeconds(0, 0);
                                                                                    const sR = nextDt.toISOString();
                                                                                    const eR = new Date(nextDt.getTime() + 59999).toISOString();
                                                                                    
                                                                                    const { data: nextConflicts, error: nextConflictErr } = await supabase
                                                                                        .from('customers')
                                                                                        .select('id, customer_name, campaign_id, disposition, sub_disposition, outcome')
                                                                                        .or(`managed_by.eq.${user?.uid},assigned_to.eq.${user?.uid}`)
                                                                                        .gte('next_called_at', sR)
                                                                                        .lte('next_called_at', eR)
                                                                                        .neq('id', customerId)
                                                                                        .limit(1);
                                                                                    
                                                                                    if (nextConflicts && nextConflicts.length > 0) {
                                                                                        setConflictInfo(nextConflicts[0]);
                                                                                    } else {
                                                                                        // If slot free, proceed with save using the updated time directly
                                                                                        executeSaveDisposition(newDate, newTime);
                                                                                    }
                                                                                }}
                                                                                className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                                                                            >
                                                                                Check Next Slot (+15m)
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => {
                                                                                    setConflictInfo(null);
                                                                                    setCallbackDate("");
                                                                                    setCallbackTime("");
                                                                                }}
                                                                                className="w-full py-2.5 bg-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
                                                                            >
                                                                                Cancel & Reset
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                <div className="space-y-2">
                                                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest pl-1">Session Notes</p>
                                                    <textarea 
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        placeholder="Add specific details about the conversation..."
                                                        className="w-full bg-slate-50/50 text-gray-700 rounded-2xl p-4 text-xs font-semibold border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:bg-white focus:outline-none transition-all min-h-[80px] resize-none"
                                                    />
                                                </div>

                                                <button 
                                                    disabled={saving || !postCall || prefetchStatus === 'fetching'}
                                                    onClick={handleSaveDisposition}
                                                    className={`w-full h-11 rounded-2xl font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${prefetchStatus === 'fetching' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-slate-900 text-white shadow-lg active:scale-95'}`}
                                                >
                                                    {saving ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            <span>Processing...</span>
                                                        </>
                                                    ) : prefetchStatus === 'fetching' ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                                                            <span>Syncing Lead...</span>
                                                        </>
                                                    ) : (
                                                        'Save & Continue'
                                                    )}
                                                </button>
                                           </div>
                                        </div>
                                    </div>
                            
                            {/* ACTIVITY SIDEBAR (Right) */}
                            <div className="md:col-span-4 flex flex-col gap-4">

                                        {/* Smartflo Outbound Calling Flow Stepper */}
                                        <SmartfloOutboundFlowCard
                                            isVisible={activeCallingProvider === 'smartflo' && smartfloActiveCallType === 'outbound'}
                                            flowState={smartfloFlowState}
                                            onOpenLogsModal={() => setIsSmartfloLiveModalOpen(true)}
                                        />

                                        {/* Smartflo Inbound Calling Flow Stepper */}
                                        <SmartfloInboundFlowCard
                                            isVisible={activeCallingProvider === 'smartflo' && smartfloActiveCallType === 'inbound'}
                                            flowState={smartfloFlowState}
                                            onOpenLogsModal={() => setIsSmartfloLiveModalOpen(true)}
                                        />

                                        {/* Smartflo Live Call Diagnostics & Realtime Logs Modal */}
                                        <SmartfloLiveCallModal
                                            isOpen={isSmartfloLiveModalOpen}
                                            onClose={() => setIsSmartfloLiveModalOpen(false)}
                                            flowState={smartfloFlowState}
                                            onRefresh={() => refreshSmartfloFlowState()}
                                        />

                                        {/* Activity Sidebar / Timeline Container */}
                                        <div className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 h-auto xl:min-h-[800px] flex flex-col flex-1">
                                            <div className="flex items-center justify-between mb-6 gap-4">
                                            <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto whitespace-nowrap custom-scrollbar no-scrollbar scroll-smooth">
                                            <button 
                                                onClick={() => setTimelineView('timeline')}
                                                data-active={timelineView === 'timeline'}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timelineView === 'timeline' ? 'bg-white    text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                <i className="fi flex fi-rr-time-past"></i>
                                                Timeline
                                            </button>
                                            <button 
                                                onClick={() => setTimelineView('call_logs')}
                                                data-active={timelineView === 'call_logs'}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timelineView === 'call_logs' ? 'bg-white    text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                <i className="fi flex fi-rr-call-history"></i>
                                                Logs
                                            </button>
                                            <button 
                                                onClick={() => setTimelineView('schedules')}
                                                data-active={timelineView === 'schedules'}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timelineView === 'schedules' ? 'bg-white    text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                <i className="fi flex fi-rr-calendar-clock"></i>
                                                Schedules
                                            </button>
                                            {/* Smartflo Logs Tab */}
                                            {activeCallingProvider === 'smartflo' && (
                                                <button 
                                                    onClick={() => setTimelineView('smartflo_logs')}
                                                    data-active={timelineView === 'smartflo_logs'}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${timelineView === 'smartflo_logs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                >
                                                    <i className="fi flex fi-rr-phone-call text-indigo-500"></i>
                                                    Smartflo logs
                                                </button>
                                            )}
                                        </div>
                                        <div className="min-w-9 h-9 px-2 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-[11px] font-bold text-slate-600 border border-slate-200 shadow-sm">
                                            {timelineView === 'timeline'
                                                ? (totalAttemptsCount > 0 ? `${totalAttemptsCount}` : `${history.length}${hasMoreTimeline ? '+' : ''}`)
                                                : timelineView === 'call_logs'
                                                ? `${mobileLogs.length}${hasMoreMobileLogs ? '+' : ''}`
                                                : timelineView === 'schedules'
                                                ? `${scheduledCalls.length}${hasMoreSchedules ? '+' : ''}`
                                                : `${Math.min(smartfloVisibleCount, smartfloLogs.length)}${smartfloLogs.length > smartfloVisibleCount ? '+' : ''}`}
                                        </div>
                                    </div>

                                    {timelineView === 'timeline' ? (
                                        <div className="h-[650px] overflow-y-auto px-4 custom-scrollbar">
                                            {isLoadingInitialTimeline && history.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                                    <i className="fi flex fi-rr-spinner animate-spin text-2xl text-indigo-600 mb-3"></i>
                                                    <p className="text-xs font-bold text-slate-700">Loading Activity...</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">Fetching latest call notes</p>
                                                </div>
                                            ) : history.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale py-20">
                                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                                        <i className="fi flex   fi-rr-box-open text-2xl"></i>
                                                    </div>
                                                    <p className="text-xs font-semibold ">No Activity Yet</p>
                                                </div>
                                        ) : (
                                            <>
                                            <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                                                {history.map((log: any) => (
                                                    <div key={log.id} className="relative">
                                                        {/* Timeline Marker */}
                                                        <div className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-4 border-white    ${
                                                            log.disposition === 'Deal Done' ? 'bg-green-500' :
                                                            log.disposition === 'Call Back' ? 'bg-amber-500' :
                                                            log.disposition === 'Not Contactable' ? 'bg-red-400' :
                                                            'bg-indigo-500'
                                                        }`} />
                                                        
                                                        <div className="space-y-2">
                                                            {/* Header: Disposition + Date */}
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`text-[10px] font-bold uppercase tracking-tight ${
                                                                        log.disposition === 'Deal Done' ? 'text-green-600' :
                                                                        log.disposition === 'Call Back' ? 'text-amber-600' :
                                                                        log.disposition === 'Not Contactable' ? 'text-red-500' :
                                                                        'text-slate-900'
                                                                    }`}>{log.disposition || 'N/A'}</span>
                                                                    {log.sub_disposition && (
                                                                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                                            {log.sub_disposition}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-[10px] font-semibold text-slate-400">
                                                                    {formatDate(log.created_at)}
                                                                </span>
                                                            </div>

                                                            {/* Content Card */}
                                                            <div className="p-4 rounded-2xl  border border-slate-200 group hover:border-indigo-100 hover:bg-white    transition-all space-y-3">
                                                                {/* Notes */}
                                                                {log.notes && (
                                                                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                                                                        "{log.notes}"
                                                                    </p>
                                                                )}

                                                                {/* Metadata Grid */}
                                                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                                                                   
                                                                    {/* Next Follow Up */}
                                                                    {log.next_called_at && (
                                                                        <div className="flex items-center gap-1.5 col-span-2">
                                                                            
                                                                            <div className="flex grid">
                                                                                <span className="text-[10px] flex font-medium text-slate-400"> <i className="fi flex  mr-2 fi-rr-calendar-clock text-[10px] text-amber-400"></i> Follow Up: </span>
                                                                                <span className="text-[10px] font-semibold text-amber-600">
                                                                                    {new Date(log.next_called_at).toLocaleString('en-IN', {
                                                                                        day: '2-digit',
                                                                                        month: 'short',
                                                                                        year: 'numeric',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Duration + Time */}
                                                                <div className="flex items-center gap-3 pt-2">
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[12px] font-semibold uppercase">
                                                                        <i className="fi flex  fi-rr-clock-three"></i>
                                                                        {formatTime(log.duration || 0)}
                                                                    </div>
                                                                    {log.ref_id && (
                                                                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md" title={`Ref ID: ${log.ref_id}`}>
                                                                            Ref: {log.ref_id.slice(0, 8)}...
                                                                        </span>
                                                                    )}
                                                                    <span className="text-[12px] font-semibold text-slate-300">
                                                                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>

                                                                {/* Recording Player */}
                                                                {log.call_recording && (
                                                                    <div className="pt-2 border-t border-slate-100">
                                                                        <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 mb-1">
                                                                            <i className="fi flex fi-rr-headphones text-xs"></i> Call Recording
                                                                        </span>
                                                                        <audio controls className="w-full h-8 rounded-lg" src={log.call_recording} preload="none" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                             {/* Agent */}
                                                                    <div className="flex items-center gap-1.5">
                                                                        <i className="fi flex  fi-rr-user mt-1 text-[12px] text-indigo-400"></i>
                                                                        <div className="truncate">
                                                                            <span className="text-[12px] font-semibold text-slate-400">Agent: </span>
                                                                            <span className="text-[12px] font-bold text-slate-600">
                                                                                {log.agent?.user_name || 'N/A'}
                                                                                {log.agent?.employee_id && (
                                                                                    <span className="text-slate-400"> ({log.agent.employee_id})</span>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    {/* Last Updated By */}
                                                                    <div className="flex items-center gap-1.5">
                                                                        <i className="fi flex  fi-rr-pencil mt-1 text-[12px] text-purple-400"></i>
                                                                        <div className="truncate">
                                                                            <span className="text-[12px] font-semibold text-slate-400">Updated: </span>
                                                                            <span className="text-[12px] font-bold text-slate-600">
                                                                                {log.updater?.user_name || 'N/A'}
                                                                                {log.updater?.employee_id && (
                                                                                    <span className="text-slate-400"> ({log.updater.employee_id})</span>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    </div>



                                                            
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {hasMoreTimeline && (
                                                <div className="pt-4 pb-2 flex justify-center">
                                                    <button
                                                        onClick={handleLoadMoreTimeline}
                                                        disabled={isLoadingMoreTimeline}
                                                        className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                                    >
                                                        {isLoadingMoreTimeline ? (
                                                            <>
                                                                <i className="fi flex fi-rr-spinner animate-spin text-xs"></i>
                                                                Loading older activity...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fi flex fi-rr-angle-small-down text-base"></i>
                                                                View More Activity
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                        )}
                                    </div>
                                        ) : timelineView === 'call_logs' ? (
                                             // MOBILE LOGS VIEW
                                             <div className="h-[650px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                            {isLoadingMobileLogs && mobileLogs.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                                    <i className="fi flex fi-rr-spinner animate-spin text-2xl text-indigo-600 mb-3"></i>
                                                    <p className="text-xs font-bold text-slate-700">Loading Mobile Call Logs...</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">Fetching matching records from phone history</p>
                                                </div>
                                            ) : mobileLogs.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale py-20">
                                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                                        <i className="fi flex  fi-rr-smartphone text-2xl"></i>
                                                    </div>
                                                    <p className="text-xs font-semibold ">No Mobile Logs Found</p>
                                                </div>
                                            ) : (
                                                <>
                                                {mobileLogs.map((log: any) => (
                                                    <div key={log.id} className="relative p-4 rounded-xl bg-white border border-slate-200/80 hover:border-slate-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
                                                         {/* Background Decoration */}
                                                         <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-5 transition-colors ${
                                                             log.type === 'INCOMING' ? 'bg-emerald-500' :
                                                             log.type === 'OUTGOING' ? 'bg-blue-500' :
                                                             'bg-red-500'
                                                         }`} />

                                                         <div className="flex items-start gap-4 relative z-10">
                                                            {/* Icon Box */}
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transform transition-transform group-hover:scale-110 duration-300 mt-1 ${
                                                                log.type === 'INCOMING' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200' :
                                                                log.type === 'OUTGOING' ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-200' :
                                                                'bg-gradient-to-br from-red-400 to-red-600 shadow-red-200'
                                                            }`}>
                                                                <i className={`fi text-lg flex ${
                                                                    log.type === 'INCOMING' ? 'fi-rr-call-incoming' :
                                                                    log.type === 'OUTGOING' ? 'fi-rr-call-outgoing' :
                                                                    'fi-rr-phone-cross'
                                                                }`}></i>
                                                            </div>

                                                            {/* Main Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-bold text-slate-800 tracking-tight font-heading">{formatMaskedPhone(log.number)}</span>
                                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                                                                             log.type === 'INCOMING' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                                             log.type === 'OUTGOING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                             'bg-red-50 text-red-600 border-red-100' 
                                                                        }`}>{log.type}</span>
                                                                    </div>
                                                                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                                                        <i className="fi flex fi-rr-calendar-clock text-[10px] opacity-60"></i>
                                                                        {new Date(log.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                                                    </span>
                                                                </div>
                                                                
                                                                {/* Secondary Info Row */}
                                                                 <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium mt-1.5">
                                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                                                                         <i className="fi flex fi-rr-clock-three text-[10px] text-slate-400"></i>
                                                                         <span className="text-slate-600 font-bold">{formatTime(log.duration || 0)}</span>
                                                                    </div>
                                                                    <div className="h-4 w-px bg-slate-200"></div>
                                                                    <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </div>
                                                            </div>
                                                         </div>

                                                         {/* Footer Meta - Full Width */}
                                                         <div className="relative z-10 flex items-center justify-between mt-4 pt-4 border-t border-dashed border-slate-200">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
                                                                     <i className="fi flex fi-rr-circle-user text-[14px]"></i>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-[11px] font-bold text-slate-700 leading-none mb-0.5">
                                                                        {log.agent_name || 'Unknown Agent'}
                                                                    </span>
                                                                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                                                                        <span className="w-1 h-1 rounded-full bg-indigo-400"></span>
                                                                        {log.employee_id || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200" title={`Device / Ext: ${log.device_id || 'Unknown'}`}>
                                                                <i className={`fi flex ${log.ref_id ? 'fi-rr-headset text-indigo-500' : 'fi-rr-smartphone text-slate-400'} text-[12px]`}></i>
                                                                <span className="text-[10px] font-semibold text-slate-500 font-mono tracking-tight">
                                                                    {log.device_model || log.device_id || 'Unknown'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Recording Player for Call History */}
                                                        {log.call_recording && (
                                                            <div className="relative z-10 mt-3 pt-2 border-t border-dashed border-slate-200">
                                                                <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 mb-1">
                                                                    <i className="fi flex fi-rr-headphones text-xs"></i> Call Recording
                                                                </span>
                                                                <audio controls className="w-full h-8 rounded-lg" src={log.call_recording} preload="none" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {hasMoreMobileLogs && (
                                                    <div className="pt-2 pb-4 flex justify-center">
                                                        <button
                                                            onClick={handleLoadMoreMobileLogs}
                                                            disabled={isLoadingMoreMobileLogs}
                                                            className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                                        >
                                                            {isLoadingMoreMobileLogs ? (
                                                                <>
                                                                    <i className="fi flex fi-rr-spinner animate-spin text-xs"></i>
                                                                    Loading older logs...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="fi flex fi-rr-angle-small-down text-base"></i>
                                                                    View More Mobile Logs
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                            )}
                                        </div>
                                    ) : timelineView === 'schedules' ? (
                                        // SCHEDULES VIEW
                                        <div className="h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="mb-8">
                                                <div className="flex items-center justify-start mb-6">
                                                    
                                                    <div className="flex items-center">
                                                        <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
                                                            <button 
                                                                onClick={() => {
                                                                    const current = selectedScheduleDate || new Date();
                                                                    const prev = new Date(current);
                                                                    prev.setDate(prev.getDate() - 1);
                                                                    setSelectedScheduleDate(prev);
                                                                }}
                                                                className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-95 border-none"
                                                            >
                                                                <i className="fi flex fi-rr-angle-small-left text-lg"></i>
                                                            </button>

                                                            <div className="relative px-4 flex flex-col items-center min-w-[130px]">
                                                                <div className="relative cursor-pointer group/date-input">
                                                                    <div className="flex items-center gap-2 py-1">
                                                                        <i className={`fi fi-rr-calendar text-[10px] ${selectedScheduleDate && new Date().toDateString() === selectedScheduleDate.toDateString() ? 'text-indigo-600' : 'text-slate-300'}`}></i>
                                                                        <span className={`text-[11px] font-bold uppercase tracking-tight ${selectedScheduleDate && new Date().toDateString() === selectedScheduleDate.toDateString() ? 'text-indigo-600' : 'text-slate-600'}`}>
                                                                            {selectedScheduleDate ? selectedScheduleDate.toLocaleDateString('en-GB') : 'Select Date'}
                                                                        </span>
                                                                    </div>
                                                                    <input 
                                                                        type="date"
                                                                        value={selectedScheduleDate ? `${selectedScheduleDate.getFullYear()}-${String(selectedScheduleDate.getMonth() + 1).padStart(2, '0')}-${String(selectedScheduleDate.getDate()).padStart(2, '0')}` : ''}
                                                                        onChange={(e) => {
                                                                            if (e.target.value) {
                                                                                const [y, m, d] = e.target.value.split('-').map(Number);
                                                                                setSelectedScheduleDate(new Date(y, m - 1, d));
                                                                            } else {
                                                                                setSelectedScheduleDate(null);
                                                                            }
                                                                        }}
                                                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <button 
                                                                onClick={() => {
                                                                    const current = selectedScheduleDate || new Date();
                                                                    const next = new Date(current);
                                                                    next.setDate(next.getDate() + 1);
                                                                    setSelectedScheduleDate(next);
                                                                }}
                                                                className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all active:scale-95 border-none"
                                                            >
                                                                <i className="fi flex fi-rr-angle-small-right text-lg"></i>
                                                            </button>
                                                        </div>
                                                        
                                                        {selectedScheduleDate && (
                                                            <button 
                                                                onClick={() => setSelectedScheduleDate(new Date())}
                                                                className="ml-2 w-11 h-11 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all border-none"
                                                                title="Reset to Today"
                                                            >
                                                                <i className="fi flex fi-rr-undo text-[14px]"></i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {isLoadingSchedules && scheduledCalls.length === 0 ? (
                                                    <div className="h-[300px] flex flex-col items-center justify-center text-center py-10">
                                                        <i className="fi flex fi-rr-spinner animate-spin text-2xl text-indigo-600 mb-3"></i>
                                                        <p className="text-xs font-bold text-slate-700">Loading Schedules...</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">Fetching your scheduled callbacks</p>
                                                    </div>
                                                ) : (() => {
                                                    const now = new Date();
                                                    const filtered = (selectedScheduleDate 
                                                        ? scheduledCalls.filter(c => new Date(c.next_called_at).toDateString() === selectedScheduleDate.toDateString())
                                                        : scheduledCalls).sort((a, b) => {
                                                            const timeA = new Date(a.next_called_at).getTime();
                                                            const timeB = new Date(b.next_called_at).getTime();
                                                            const nowTime = now.getTime();
                                                            
                                                            const isAFuture = timeA >= nowTime;
                                                            const isBFuture = timeB >= nowTime;
                                                            
                                                            // If one is future and other is past, future comes first
                                                            if (isAFuture && !isBFuture) return -1;
                                                            if (!isAFuture && isBFuture) return 1;
                                                            
                                                            // If both are future, closest to 'now' first (Ascending)
                                                            if (isAFuture && isBFuture) return timeA - timeB;
                                                            
                                                            // If both are past, most recently missed first (Descending)
                                                            return timeB - timeA;
                                                        });
                                                    
                                                    if (filtered.length === 0) {
                                                        return (
                                                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                                                <div className="opacity-30 grayscale flex flex-col items-center">
                                                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                                                        <i className="fi flex  fi-rr-calendar-clock text-2xl"></i>
                                                                    </div>
                                                                    <p className="text-xs font-semibold ">No Schedules Found</p>
                                                                </div>
                                                                {hasMoreSchedules && (
                                                                    <div className="pt-4 flex justify-center">
                                                                        <button
                                                                            onClick={handleLoadMoreSchedules}
                                                                            disabled={isLoadingMoreSchedules}
                                                                            className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                                                        >
                                                                            {isLoadingMoreSchedules ? (
                                                                                <>
                                                                                    <i className="fi flex fi-rr-spinner animate-spin text-xs"></i>
                                                                                    Checking more schedules...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <i className="fi flex fi-rr-angle-small-down text-base"></i>
                                                                                    Load More Schedules
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <>
                                                        <div className="relative pl-16 space-y-1 py-4">
                                                            {/* Vertical Timeline Line */}
                                                            <div className="absolute left-16 top-0 bottom-0 w-px bg-slate-100" />
                                                            
                                                            {filtered.map((call: any) => {
                                                                const date = new Date(call.next_called_at);
                                                                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                                                                
                                                                return (
                                                                    <div key={call.id} className="relative py-3 group cursor-pointer" onClick={() => router.push(`/campaign/${call.campaign_id}/${call.id}`)}>
                                                                        {/* Time Label on the Left */}
                                                                        <div className="absolute -left-16 w-12 text-right">
                                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1.5">
                                                                                {timeStr}
                                                                            </p>
                                                                        </div>

                                                                        {/* Tiny marker on the line */}
                                                                        <div className="absolute left-[-4px] top-4 w-2 h-2 rounded-full border-2 border-white bg-slate-200 group-hover:bg-indigo-500 z-10 transition-colors" />

                                                                        {/* Modern Calendar-like Card */}
                                                                        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex flex-col gap-1 hover:border-indigo-200 hover:shadow-md transition-all duration-300 ml-4 group-hover:bg-indigo-50/10">
                                                                            <div className="flex items-center justify-between">
                                                                                <p className="text-[13px] font-bold text-slate-800 tracking-tight">
                                                                                    {call.customer_name || 'Customer'}
                                                                                </p>
                                                                                <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center shadow-sm shrink-0">
                                                                                    <span className="text-[10px] font-black text-indigo-400">G</span>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="px-2 py-0.5 rounded-full bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-100">
                                                                                    {call.disposition}{call.sub_disposition ? ` - ${call.sub_disposition}` : ''}
                                                                                </span>
                                                                            </div>

                                                                            {call.notes && (
                                                                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed bg-slate-50/50 p-2 rounded-lg border border-slate-50 italic">
                                                                                    "{call.notes}"
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                        {hasMoreSchedules && (
                                                            <div className="pt-4 pb-2 flex justify-center ml-4">
                                                                <button
                                                                    onClick={handleLoadMoreSchedules}
                                                                    disabled={isLoadingMoreSchedules}
                                                                    className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                                                >
                                                                    {isLoadingMoreSchedules ? (
                                                                        <>
                                                                            <i className="fi flex fi-rr-spinner animate-spin text-xs"></i>
                                                                            Loading more schedules...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <i className="fi flex fi-rr-angle-small-down text-base"></i>
                                                                            View More Schedules
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    ) : (
                                        // SMARTFLO LOGS VIEW
                                        <div className="h-[650px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                            {/* Point-by-point Call Lifecycle Tracker */}
                                            {/* Smartflo Logs List */}
                                            {isLoadingSmartfloLogs && smartfloLogs.length === 0 ? (
                                                <div className="h-[280px] flex flex-col items-center justify-center text-center py-10">
                                                    <i className="fi flex fi-rr-spinner animate-spin text-3xl text-indigo-600 mb-3"></i>
                                                    <p className="text-xs font-bold text-slate-700">Querying Smartflo API...</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">Fetching latest call records & webhook events</p>
                                                </div>
                                            ) : smartfloLogs.length === 0 ? (
                                                <div className="h-[300px] flex flex-col items-center justify-center text-center opacity-70 py-12 bg-white rounded-2xl border border-slate-200/80">
                                                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
                                                        <i className="fi flex fi-rr-cloud-download text-2xl text-indigo-400"></i>
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-700">No Smartflo Records Yet</p>
                                                    <p className="text-[10px] text-slate-400 mt-1 max-w-[220px]">
                                                        Place a call or click Refresh to fetch call status directly from Smartflo.
                                                    </p>
                                                    <button
                                                        onClick={() => fetchSmartfloLogs()}
                                                        className="mt-4 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                                                    >
                                                        <i className="fi flex fi-rr-refresh"></i>
                                                        Fetch Now
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {!lastCheckedRefId && (
                                                        <div className="flex items-center justify-between pb-1 px-1">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Call Records</span>
                                                            <button
                                                                onClick={() => fetchSmartfloLogs()}
                                                                disabled={isLoadingSmartfloLogs}
                                                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[10px] font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                                                                title="Refresh logs"
                                                            >
                                                                <i className={`fi flex fi-rr-refresh text-[10px] ${isLoadingSmartfloLogs ? 'animate-spin' : ''}`}></i>
                                                                Refresh
                                                            </button>
                                                        </div>
                                                    )}
                                                    {smartfloLogs.slice(0, smartfloVisibleCount).map((log: any, idx: number) => {
                                                        const isAnswered = String(log.status || '').toLowerCase().includes('answer') || log.callType === 'Answered';
                                                        const isMissed = String(log.status || '').toLowerCase().includes('miss') || log.callType === 'Missed';
                                                        const isExpanded = expandedLogId === (log.id || String(idx));
                                                        const raw = (log.rawPayload || {}) as any;
                                                        const outboundSec = Number(
                                                            raw.outbound_sec ??
                                                            raw.outbound_talktime ??
                                                            raw.outbound_talk_time ??
                                                            log.duration ??
                                                            raw.duration ??
                                                            raw.billsec ??
                                                            0
                                                        );
                                                        const mins = Math.floor(outboundSec / 60);
                                                        const secs = outboundSec % 60;
                                                        const durationFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

                                                        return (
                                                            <div key={log.id || idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all duration-300">
                                                                <div className="flex items-center justify-between gap-2 mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${
                                                                            isAnswered ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                                            isMissed ? 'bg-red-50 text-red-700 border border-red-200' :
                                                                            'bg-blue-50 text-blue-700 border border-blue-200'
                                                                        }`}>
                                                                            {log.status || log.callType || 'Call'}
                                                                        </span>
                                                                        <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-tight">
                                                                            {log.callType || 'Click to Call'}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-[9px] text-slate-400 font-medium">
                                                                        {log.receivedAt ? formatDate(log.receivedAt) : 'Recent'}
                                                                    </span>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                                                                    <div>
                                                                        <span className="text-slate-400 block text-[8px] uppercase font-bold">Ref ID</span>
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="font-mono text-slate-700 truncate max-w-[120px]" title={log.refId}>
                                                                                {log.refId || 'N/A'}
                                                                            </span>
                                                                            {log.refId && (
                                                                                <button 
                                                                                    onClick={() => {
                                                                                        navigator.clipboard.writeText(log.refId);
                                                                                        alert('Copied Ref ID');
                                                                                    }}
                                                                                    className="text-slate-400 hover:text-indigo-600"
                                                                                    title="Copy Ref ID"
                                                                                >
                                                                                    <i className="fi flex fi-rr-copy text-[10px]"></i>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-slate-400 block text-[8px] uppercase font-bold">Outbound Talktime</span>
                                                                        <span className="font-bold text-slate-800 font-mono">
                                                                            {durationFormatted} ({outboundSec}s)
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-slate-400 block text-[8px] uppercase font-bold">Agent / Ext</span>
                                                                        <span className="text-slate-700 font-medium truncate block">
                                                                            {log.agentNumber || 'Default'}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-slate-400 block text-[8px] uppercase font-bold">Hangup Cause</span>
                                                                        <span className="text-slate-700 font-semibold truncate block" title={log.hangupCause}>
                                                                            {log.hangupCause || 'NORMAL_CLEARING'}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {log.recordingUrl && (
                                                                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <span className="text-[9px] font-bold text-indigo-600 flex items-center gap-1">
                                                                                <i className="fi flex fi-rr-headphones text-xs"></i> Call Recording
                                                                            </span>
                                                                            <a 
                                                                                href={log.recordingUrl} 
                                                                                target="_blank" 
                                                                                rel="noreferrer" 
                                                                                className="text-[9px] text-indigo-500 hover:underline flex items-center gap-1 font-semibold"
                                                                            >
                                                                                Open <i className="fi flex fi-rr-arrow-up-right-from-square text-[9px]"></i>
                                                                            </a>
                                                                        </div>
                                                                        <audio controls className="w-full h-8 mt-1 rounded-lg" src={log.recordingUrl} preload="none" />
                                                                    </div>
                                                                )}

                                                                {log.rawPayload && (
                                                                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col">
                                                                        <button 
                                                                            onClick={() => setExpandedLogId(isExpanded ? null : (log.id || String(idx)))}
                                                                            className="text-[9px] font-bold text-slate-400 hover:text-indigo-600 flex items-center justify-between"
                                                                        >
                                                                            <span>{isExpanded ? 'Hide Payload' : 'View Smartflo Payload (Debug)'}</span>
                                                                            <i className={`fi flex fi-rr-angle-small-${isExpanded ? 'up' : 'down'}`}></i>
                                                                        </button>
                                                                        {isExpanded && (
                                                                            <pre className="mt-1.5 p-2 bg-slate-900 text-slate-200 text-[9px] font-mono rounded-lg overflow-x-auto max-h-40 custom-scrollbar">
                                                                                {JSON.stringify(log.rawPayload, null, 2)}
                                                                            </pre>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {smartfloLogs.length > smartfloVisibleCount && (
                                                        <div className="pt-2 pb-2 flex justify-center">
                                                            <button
                                                                onClick={() => setSmartfloVisibleCount(prev => prev + 5)}
                                                                className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 text-xs font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
                                                            >
                                                                <i className="fi flex fi-rr-angle-small-down text-base"></i>
                                                                View More Smartflo Logs ({smartfloLogs.length - smartfloVisibleCount} remaining)
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="mt-8 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                                <i className="fi flex   fi-rr-phone-call text-xs"></i>
                                            </div>
                                            <span className="text-[10px] font-semibold ">Total Connects</span>
                                    </div>
                                    <span className="text-sm font-semibold">{history.filter(h => h.duration > 0).length}{hasMoreTimeline ? '+' : ''}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </main>
            </div>
            <BottomNav activeNav="campaign" userRole={user?.role || null} />
            
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }

                @keyframes gentleWave {
                    0%, 100% {
                        transform: scaleY(0.35);
                        opacity: 0.45;
                    }
                    50% {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                }
            `}</style>

            {/* Google Calendar Prompt Modal */}
            {showCalendarModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
                        {/* Header Image/Icon */}
                        <div className="h-32 bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center relative">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                                <i className="fi flex fi-brands-google text-3xl text-indigo-600"></i>
                            </div>
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg absolute transform translate-x-8 translate-y-4 rotate-12">
                                <i className="fi flex fi-rr-calendar-clock text-3xl text-blue-500"></i>
                            </div>
                        </div>

                        <div className="p-8 pt-10 text-center">
                            <h3 className="text-2xl font-black text-slate-800 mb-2">Connect Google Calendar?</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8">
                                Get automatic reminders for your follow-ups directly on your phone and laptop by connecting your Google Calendar.
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={handleConnectCalendar}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                >
                                    <i className="fi flex fi-brands-google"></i>
                                    Connect & Sync Now
                                </button>
                                
                                <button
                                    onClick={handleSkipCalendar}
                                    className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-bold transition-all active:scale-95 text-sm"
                                >
                                    Skip for now
                                </button>
                            </div>

                            <p className="mt-6 text-[11px] text-slate-400 font-medium">
                                You can also connect this later from your Profile Settings.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Attachment Manager Modal - Redesigned to be Compact & Card-like */}
            {showAttachmentModal && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md h-[520px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100">
                        {/* Compact Header */}
                        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                    <i className="fi flex fi-rr-clip text-lg"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800 tracking-tight">Lead Attachments</h3>
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{attachments.length} Files</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowAttachmentModal(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                            >
                                <i className="fi flex fi-rr-cross-small text-lg"></i>
                            </button>
                        </div>

                        {/* Search & Add bar - Stacked or tighter */}
                        <div className="px-5 py-4 flex flex-col gap-3 bg-slate-50/30">
                            <div className="relative">
                                <i className="fi flex fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs"></i>
                                <input 
                                    type="text"
                                    placeholder="Search..."
                                    value={attachmentSearch}
                                    onChange={(e) => setAttachmentSearch(e.target.value)}
                                    className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-50 focus:border-indigo-200 transition-all outline-none"
                                />
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 active:scale-95"
                            >
                                <i className="fi flex fi-rr-plus-small text-lg"></i>
                                <span>Upload Attachment</span>
                            </button>
                        </div>

                        {/* Files List - More Compact / Or Naming View */}
                        <div className="flex-1 overflow-y-auto px-5 pb-5 custom-scrollbar">
                            {pendingFile ? (
                                <div className="py-6 animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 mb-4 text-center">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-2 shadow-sm">
                                            <i className={`fi ${
                                                pendingFile.type.includes('image') ? 'fi-rr-picture' : 
                                                pendingFile.type.includes('pdf') ? 'fi-rr-document' : 'fi-rr-file'
                                            } text-xl`}></i>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Selected File</p>
                                        <p className="text-[11px] font-bold text-slate-600 truncate px-4">{pendingFile.name}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px]  font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Document Name</label>
                                            <input 
                                                type="text"
                                                autoFocus
                                                placeholder="Enter a friendly name..."
                                                value={customFileName}
                                                onChange={(e) => setCustomFileName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && confirmUpload()}
                                                className="w-full h-11 text-gray-400 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-300 transition-all outline-none"
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    setPendingFile(null);
                                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                                }}
                                                className="flex-1 h-11 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-slate-100 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={confirmUpload}
                                                className="flex-[2] h-11 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                            >
                                                Finalize Upload
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1.5 pt-2">
                                    {attachments
                                         .filter(a => a.file_name.toLowerCase().includes(attachmentSearch.toLowerCase()))
                                         .map((file) => (
                                         <div 
                                             key={file.id} 
                                             className="p-3 rounded-2xl bg-white border border-slate-100 hover:border-indigo-50 hover:bg-indigo-50/10 transition-all group flex items-center justify-between"
                                         >
                                             <div className="flex items-center gap-3 flex-1 min-w-0">
                                                 <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 shadow-sm transition-colors border border-transparent group-hover:border-indigo-50">
                                                     <i className={`fi ${
                                                         file.file_type?.includes('image') ? 'fi-rr-picture' : 
                                                         file.file_type?.includes('pdf') ? 'fi-rr-document' : 'fi-rr-file'
                                                     } text-sm`}></i>
                                                 </div>
                                                 <div className="truncate">
                                                     <h4 className="text-[11px] font-bold text-slate-700 truncate leading-tight">{file.file_name}</h4>
                                                     <div className="flex items-center gap-2 mt-0.5">
                                                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{formatFileSize(file.file_size)}</span>
                                                         <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                         <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">{formatDate(file.created_at)}</span>
                                                     </div>
                                                 </div>
                                             </div>

                                             <div className="flex items-center gap-1.5 ml-3">
                                                 <button 
                                                     className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:border-indigo-600 hover:text-white hover:bg-indigo-600 text-slate-400 shadow-sm transition-all flex items-center justify-center"
                                                     title="View"
                                                     onClick={async () => {
                                                        const { data, error } = await supabase.storage
                                                            .from('customer_attachments')
                                                            .createSignedUrl(file.file_path, 3600);
                                                        if (error) {
                                                            alert("Failed to create viewing link.");
                                                        } else if (data?.signedUrl) {
                                                            window.open(data.signedUrl, '_blank');
                                                        }
                                                     }}
                                                 >
                                                     <i className="fi flex fi-rr-eye text-xs"></i>
                                                 </button>
                                                 <button 
                                                     className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:border-rose-500 hover:text-white hover:bg-rose-500 text-slate-400 shadow-sm transition-all flex items-center justify-center"
                                                     title="Delete"
                                                     onClick={() => deleteAttachment(file.id, file.file_path)}
                                                 >
                                                     <i className="fi flex fi-rr-trash text-xs"></i>
                                                 </button>
                                             </div>
                                         </div>
                                     ))}

                                    {attachments.length === 0 && (
                                        <div className="py-12 text-center">
                                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                                                <i className="fi flex fi-rr-folder-open text-2xl text-slate-200"></i>
                                            </div>
                                            <h4 className="text-slate-600 text-sm font-bold mb-1">Empty Vault</h4>
                                            <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest">No attachments found</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Enlarged Notes Modal - Compact Version */}
            {showEnlargedNotes && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[70vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 flex flex-col relative">
                        <div className="relative z-10 flex flex-col h-full">
                            {/* Modal Header - Compact */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                                        <i className="fi flex fi-rr-edit text-white text-sm"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Focus Notes</h3>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Editing Mode • {notes.split('\n').length} Lines</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowEnlargedNotes(false)}
                                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center group"
                                >
                                    <i className="fi flex fi-rr-cross-small text-lg group-hover:rotate-90 transition-transform"></i>
                                </button>
                            </div>

                            {/* Modal Body: Compact Textarea */}
                            <div className="flex-1 p-3 overflow-hidden">
                                <div className="h-full relative flex bg-slate-50/20 rounded-xl border border-slate-200 overflow-hidden focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50/30 transition-all">
                                    {/* Line Numbers - Thinner */}
                                    <div 
                                        className="w-8 py-3 bg-slate-100/30 border-r border-slate-100 flex flex-col items-center text-[8px] font-bold text-slate-300 select-none overflow-hidden"
                                    >
                                        {liveNotes.split('\n').map((_, i) => (
                                            <div key={i} className="leading-6 h-6">{i + 1}</div>
                                        ))}
                                    </div>
                                    <textarea 
                                        autoFocus
                                        value={liveNotes}
                                        onChange={(e) => setLiveNotes(e.target.value)}
                                        onBlur={() => handleSaveLiveNotes()}
                                        placeholder="Start typing..."
                                        className="flex-1 h-full bg-transparent text-slate-700 p-3 pt-[13px] text-[13px] font-medium outline-none transition-all resize-none leading-6 placeholder:text-slate-300 custom-scrollbar"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    />
                                </div>
                            </div>

                            {/* Modal Footer - Compact */}
                            <div className="px-4 py-2 flex items-center justify-between bg-slate-50/50 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${notes.length > 0 ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.3)]' : 'bg-slate-300'}`}></span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                        {notes.length} Characters
                                    </span>
                                </div>
                                <button 
                                    onClick={() => {
                                        handleSaveLiveNotes();
                                        setShowEnlargedNotes(false);
                                    }}
                                    className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-600 transition-all shadow-sm"
                                >
                                    Save & Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Edit Details Modal */}
            {isEditingDetails && (
                <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        ref={detailsEditRef}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 ring-1 ring-slate-200"
                    >
                        {/* Compact Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
                                    <i className="fi flex fi-rr-edit-alt text-sm"></i>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-800 tracking-tight">Modify Details</h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Customer Reference Data</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsEditingDetails(false)}
                                className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors"
                            >
                                <i className="fi flex fi-rr-cross-small text-lg"></i>
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar bg-white">
                            <div className="space-y-3">
                                {tempDetails.map((item, index) => (
                                    <div key={item.id} className="group relative p-2 px-3 rounded-2xl bg-white border border-slate-200/60 hover:border-slate-300 transition-all">
                                        <div className="flex items-center gap-2">
                                            {/* Extra Minimal Inputs */}
                                            <div className="flex-1 space-y-0.5">
                                                <input 
                                                    type="text"
                                                    value={item.key}
                                                    onChange={(e) => {
                                                        const newArr = [...tempDetails];
                                                        newArr[index].key = e.target.value;
                                                        setTempDetails(newArr);
                                                    }}
                                                    className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest bg-transparent border-none outline-none placeholder:text-slate-200"
                                                    placeholder="LABEL"
                                                />
                                                <textarea 
                                                    value={item.value}
                                                    onChange={(e) => {
                                                        const newArr = [...tempDetails];
                                                        newArr[index].value = e.target.value;
                                                        setTempDetails(newArr);
                                                    }}
                                                    rows={1}
                                                    className="w-full min-h-[20px] bg-transparent border-none p-0 text-[12px] font-semibold text-slate-700 outline-none resize-none placeholder:text-slate-300 custom-scrollbar"
                                                    placeholder="Add information..."
                                                />
                                            </div>
                                            
                                            <button 
                                                onClick={() => {
                                                    const newArr = tempDetails.filter((_, i) => i !== index);
                                                    setTempDetails(newArr);
                                                }}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-200 hover:text-rose-500 transition-colors shrink-0"
                                            >
                                                <i className="fi flex fi-rr-trash text-[10px]"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {tempDetails.length === 0 && (
                                    <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No details recorded</p>
                                    </div>
                                )}

                                <button 
                                    onClick={() => {
                                        setTempDetails([...tempDetails, { id: Math.random().toString(36).substring(2, 9), key: "", value: "" }]);
                                    }}
                                    className="w-full py-3 rounded-2xl border border-dashed border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-all flex items-center justify-center gap-2 group/add"
                                >
                                    <i className="fi flex fi-rr-plus-small text-lg"></i>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">New Field</span>
                                </button>
                            </div>
                        </div>

                        {/* Streamlined Footer */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 font-semibold">
                            <button 
                                onClick={() => setIsEditingDetails(false)}
                                className="px-4 py-2 text-slate-500 text-xs hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveDetails}
                                disabled={saving}
                                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? (
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <i className="fi flex fi-rr-disk-check"></i>
                                )}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ⚡ FLOATING TELEMETRY & LATENCY BENCHMARK HUD (Hidden by default; enable via ?hud=true or ?debug=true) */}
            {showTelemetryHud && (
                <div className="fixed bottom-5 right-5 z-[9999] font-sans antialiased text-left">
                {!isTelemetryOpen ? (
                    /* COLLAPSED FLOATING PILL */
                    <button
                        type="button"
                        onClick={() => setIsTelemetryOpen(true)}
                        className="group relative flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white border border-slate-700/80 shadow-[0_12px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                        title="Click to view live latency & query breakdown"
                    >
                        <div className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                            <span>⚡</span>
                            <span>{telemetry ? `${telemetry.unblockTime} ms` : 'Profiling...'}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-300 border-l border-slate-700/80 pl-2 group-hover:text-white transition-colors">
                            Delay HUD
                        </span>
                        <i className="fi flex fi-rr-angle-small-up text-slate-400 text-xs group-hover:text-white transition-colors"></i>
                    </button>
                ) : (
                    /* EXPANDED TELEMETRY MODAL / CARD */
                    <div className="w-[430px] max-w-[calc(100vw-2rem)] max-h-[85vh] flex flex-col bg-slate-950/95 text-slate-100 rounded-3xl border border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
                                    ⚡
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">Live Query Telemetry</h3>
                                    <p className="text-[10px] text-slate-400 font-mono">
                                        {telemetry?.measuredAt || 'Profiling'} {telemetry?.leadId ? `• Lead ${telemetry.leadId.slice(0, 8)}...` : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setIsReTestingTelemetry(true);
                                        prefetchedDataRef.current = null;
                                        try {
                                            await fetchData(typeof customerId === 'string' ? customerId : undefined);
                                        } finally {
                                            setIsReTestingTelemetry(false);
                                        }
                                    }}
                                    disabled={isReTestingTelemetry}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-[11px] font-medium text-slate-200 hover:text-white transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                                    title="Force live re-fetch from database to measure fresh latency"
                                >
                                    <i className={`fi flex fi-rr-refresh text-[10px] ${isReTestingTelemetry ? 'animate-spin text-emerald-400' : ''}`}></i>
                                    <span>{isReTestingTelemetry ? 'Testing...' : 'Re-test'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!telemetry) return;
                                        const report = [
                                            `===========================================`,
                                            `🚀 TFC-CONNECT LIVE LATENCY TELEMETRY REPORT`,
                                            `===========================================`,
                                            `Lead ID:       ${telemetry.leadId}`,
                                            `Measured At:   ${telemetry.measuredAt}`,
                                            `-------------------------------------------`,
                                            `[BLOCKING INITIAL QUERIES]`,
                                            `1. Auth Session:          ${telemetry.authTime} ms (In-Memory Cache)`,
                                            `2. Unified Atomic Bundle: ${telemetry.parallelGroupTime} ms (Single RPC Flight)`,
                                            `   - Campaign Guard:      Included (0ms extra)`,
                                            `   - Customer Lead:       Included (0ms extra)`,
                                            `   - Call Session State:  Included (0ms extra)`,
                                            `3. Manager Resolution:    ${telemetry.managerTime} ms (In-RPC Pre-computed)`,
                                            `-------------------------------------------`,
                                            `⚡ TOTAL SCREEN UNBLOCK TIME: ${telemetry.unblockTime} ms`,
                                            `🔥 Baseline (Before):       ~5,150 ms`,
                                            `✨ Latency Reduction:       Saved ~${Math.max(0, 5150 - telemetry.unblockTime)} ms (${Math.round((1 - telemetry.unblockTime / 5150) * 100)}% faster!)`,
                                            `-------------------------------------------`,
                                            `[NON-BLOCKING / LAZY TAB QUERIES]`,
                                            `- Timeline (First 5):     ${telemetry.timelineTime} ms`,
                                            `- Mobile Logs:            ${typeof telemetry.mobileLogsTime === 'number' ? `${telemetry.mobileLogsTime} ms` : 'Lazy (0ms on start)'}`,
                                            `- Schedules:              ${typeof telemetry.schedulesTime === 'number' ? `${telemetry.schedulesTime} ms` : 'Lazy (0ms on start)'}`,
                                            `- Smartflo Logs:          ${typeof telemetry.smartfloTime === 'number' ? `${telemetry.smartfloTime} ms` : 'Lazy (0ms on start)'}`,
                                            `===========================================`
                                        ].join('\n');
                                        void navigator.clipboard.writeText(report);
                                        setCopiedTelemetry(true);
                                        setTimeout(() => setCopiedTelemetry(false), 2000);
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-[11px] font-medium text-slate-200 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
                                    title="Copy benchmark stats to clipboard"
                                >
                                    <i className={`fi flex ${copiedTelemetry ? 'fi-rr-check text-emerald-400' : 'fi-rr-copy'} text-[10px]`}></i>
                                    <span>{copiedTelemetry ? 'Copied!' : 'Copy'}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsTelemetryOpen(false)}
                                    className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs ml-1"
                                    title="Minimize HUD"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Body */}
                        <div className="overflow-y-auto px-5 py-4 space-y-3.5 flex-1 max-h-[calc(85vh-75px)] text-xs">
                            {/* Hero Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-indigo-950/50 border border-emerald-500/30 p-4">
                                <div className="flex items-baseline justify-between mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                                        Screen Unblock Time
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        ⚡ OPTIMIZED
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-black font-mono text-white tracking-tight">
                                        {telemetry?.unblockTime ?? 0}
                                    </span>
                                    <span className="text-xs font-semibold text-emerald-400 font-mono">ms</span>
                                    <span className="text-[11px] text-slate-400 ml-auto">
                                        (Spinner cleared & UI interactive)
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                                    <span className="text-slate-400">
                                        Previous Baseline: <strong className="text-slate-300">~5,150 ms</strong>
                                    </span>
                                    <span className="font-bold text-emerald-400">
                                        ~{telemetry?.unblockTime ? Math.max(0, Math.round((1 - telemetry.unblockTime / 5150) * 100)) : 94}% Faster
                                    </span>
                                </div>
                            </div>

                            {/* Section: Blocking Initial Queries */}
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
                                    <span>Core Queries (Parallelized)</span>
                                    <span className="text-slate-500">Run simultaneously</span>
                                </div>
                                <div className="space-y-1.5 font-mono text-[11px]">
                                    {/* 1. Auth */}
                                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/70">
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">1</span>
                                            <div>
                                                <div className="font-sans font-medium text-slate-200">Auth Verification</div>
                                                <div className="font-sans text-[10px] text-slate-500">Session in-memory cache</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-emerald-400">{telemetry?.authTime ?? 0} ms</span>
                                            <div className="text-[9px] text-emerald-500 font-sans">0 network hops</div>
                                        </div>
                                    </div>

                                    {/* 2. Unified Atomic Bundle */}
                                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] flex items-center justify-center font-bold">2</span>
                                            <div>
                                                <div className="font-sans font-semibold text-indigo-200">Unified Atomic Lead Bundle (RPC)</div>
                                                <div className="font-sans text-[10px] text-indigo-400/80">Guard + Lead + Session + Manager in 1 flight</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-indigo-300">{telemetry?.parallelGroupTime ?? 0} ms</span>
                                            <div className="text-[9px] text-indigo-400/70 font-sans">Single DB roundtrip</div>
                                        </div>
                                    </div>

                                    {/* 3. Lead Manager */}
                                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/70">
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">3</span>
                                            <div>
                                                <div className="font-sans font-medium text-slate-200">Lead Manager Info</div>
                                                <div className="font-sans text-[10px] text-slate-500">Pre-computed inside RPC</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-emerald-400">{telemetry?.managerTime ?? 0} ms</span>
                                            <div className="text-[9px] text-emerald-500 font-sans">Instant 0ms resolve</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Non-Blocking & Tab Queries */}
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
                                    <span>Tabs & Background Queries</span>
                                    <span className="text-slate-500">Non-blocking / On Demand</span>
                                </div>
                                <div className="space-y-1.5 font-mono text-[11px]">
                                    {/* Timeline */}
                                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/70">
                                        <div>
                                            <div className="font-sans font-medium text-slate-200">Timeline (First 5 Items)</div>
                                            <div className="font-sans text-[10px] text-slate-500">Non-blocking + Ghost Buffer</div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold text-emerald-400">{telemetry?.timelineTime ?? 0} ms</span>
                                            <div className="text-[9px] text-emerald-400/80 font-sans">Async fetch</div>
                                        </div>
                                    </div>

                                    {/* Mobile Logs */}
                                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/70">
                                        <div>
                                            <div className="font-sans font-medium text-slate-200">Mobile Logs (6.5L rows scan)</div>
                                            <div className="font-sans text-[10px] text-slate-500">
                                                {typeof telemetry?.mobileLogsTime === 'number' ? 'Indexed batch load' : 'Deferred until "Logs" tab clicked'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {typeof telemetry?.mobileLogsTime === 'number' ? (
                                                <>
                                                    <span className="font-bold text-emerald-400">{telemetry.mobileLogsTime} ms</span>
                                                    <div className="text-[9px] text-emerald-400/80 font-sans">Loaded live</div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-bold text-amber-400/80">0 ms (Lazy)</span>
                                                    <div className="text-[9px] text-slate-500 font-sans">Click tab to load</div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Schedules */}
                                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/70">
                                        <div>
                                            <div className="font-sans font-medium text-slate-200">Scheduled Calls</div>
                                            <div className="font-sans text-[10px] text-slate-500">
                                                {typeof telemetry?.schedulesTime === 'number' ? 'Indexed batch load' : 'Deferred until "Schedules" tab clicked'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {typeof telemetry?.schedulesTime === 'number' ? (
                                                <>
                                                    <span className="font-bold text-emerald-400">{telemetry.schedulesTime} ms</span>
                                                    <div className="text-[9px] text-emerald-400/80 font-sans">Loaded live</div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-bold text-amber-400/80">0 ms (Lazy)</span>
                                                    <div className="text-[9px] text-slate-500 font-sans">Click tab to load</div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Smartflo */}
                                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/70">
                                        <div>
                                            <div className="font-sans font-medium text-slate-200">Smartflo Telephony Logs</div>
                                            <div className="font-sans text-[10px] text-slate-500">
                                                {typeof telemetry?.smartfloTime === 'number' ? 'API Webhook response' : 'Deferred until "Smartflo" tab clicked'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {typeof telemetry?.smartfloTime === 'number' ? (
                                                <>
                                                    <span className="font-bold text-emerald-400">{telemetry.smartfloTime} ms</span>
                                                    <div className="text-[9px] text-emerald-400/80 font-sans">Loaded live</div>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-bold text-amber-400/80">0 ms (Lazy)</span>
                                                    <div className="text-[9px] text-slate-500 font-sans">Click tab to load</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info tip */}
                            <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/50 text-[10px] text-slate-400 flex items-start gap-2 font-sans">
                                <span className="text-emerald-400 mt-0.5">💡</span>
                                <span>
                                    Switching tabs (Logs, Schedules, Smartflo) will fetch only 5 items at a time and update the live latency stats above in real time.
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            )}
        </div>
    );
}
