import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import { supabase } from "../lib/supabase";

type UtilityApp = 'notes' | 'todo' | 'calendar' | 'calculator' | 'age' | 'bmi' | 'alarm' | 'ai';

// Google Calendar API Helper (Server-side handled)
const fetchGoogleHolidays = async (year: number, month: number): Promise<Record<string, any[]>> => {
    try {
        const token = localStorage.getItem('google_provider_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`/api/google/fetch-holidays?year=${year}&month=${month}`, { headers });
        const data = await response.json();
        if (data.success) {
            const mapped: Record<string, any[]> = {};
            data.holidays.forEach((h: any) => {
                // Handle multi-day events
                const start = new Date(h.start);
                const end = new Date(h.end);
                
                // For all-day events, the end date is exclusive. 
                // We'll iterate through each day the event encompasses.
                let current = new Date(start);
                while (current < end) {
                    const dateStr = current.toISOString().split('T')[0];
                    if (!mapped[dateStr]) mapped[dateStr] = [];
                    mapped[dateStr].push(h);
                    
                    // Increment one day
                    current.setDate(current.getDate() + 1);
                    // Break if it's a one-day event that somehow has a duration but doesn't cross midnight
                    if (h.allDay && current >= end) break;
                    if (!h.allDay) break; // If not all-day, we typically just show on start date for simplicity in this UI
                }

                // If it's not all-day and while loop skipped or only one day, ensure it's mapped to start date
                const startDateStr = h.start.split('T')[0];
                if (!mapped[startDateStr]) {
                    mapped[startDateStr] = [h];
                } else if (!mapped[startDateStr].find(item => item.id === h.id)) {
                    mapped[startDateStr].push(h);
                }
            });
            return mapped;
        }
        return {};
    } catch (e) {
        console.error("Google Calendar Sync Error", e);
        return {};
    }
};

// Helper for Age Calculation
const calculateAge = (dob: string) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return { y, m, d };
};

const calculateBMI = (h: string, w: string) => {
    if (!h || !w) return null;
    const height = Number(h) / 100; // cm to m
    const weight = Number(w);
    const bmi = weight / (height * height);
    if (!isFinite(bmi) || isNegative(bmi) || isNaN(bmi)) return null;
    return bmi.toFixed(1);
};
function isNegative(num: number) { return num < 0; }
const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface DatePickerProps {
    date: string;
    setDate: (d: string) => void;
    label?: string;
    placeholder?: string;
}

const CustomDatePicker = ({ date, setDate, label, placeholder = "DD/MM/YYYY" }: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [pickerDate, setPickerDate] = useState(new Date());
    const triggerRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    useEffect(() => {
        if (isOpen && date) {
            setPickerDate(new Date(date));
        }
    }, [isOpen]);

    // Handle scroll to update position if needed, or close on scroll? 
    // For simplicity, we just calculate on open. 
    // And add a click-outside listener via a fixed overlay.

    const togglePicker = () => {
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Adjust if potential overflow bottom of screen, but simplifying for now
            setCoords({ 
                top: rect.bottom + 8, 
                left: rect.left 
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="space-y-1.5 relative w-full">
            {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>}
            
            {/* Custom Date Trigger */}
            <div 
                ref={triggerRef}
                onClick={togglePicker}
                className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-[#263238] cursor-pointer flex items-center justify-between transition-all hover:bg-white hover:border-indigo-100 ${isOpen ? 'ring-2 ring-indigo-100 bg-white' : ''}`}
            >
                <span>
                    {date ? (() => {
                        const [y, m, d] = date.split('-');
                        return `${d}/${m}/${y}`;
                    })() : <span className="text-gray-400">{placeholder}</span>}
                </span>
                <i className="fi flex fi-rr-calendar text-gray-400"></i>
            </div>

            {/* Custom Date Picker Dropdown - Fixed Position Portal */}
            {isOpen && mounted && createPortal(
                <>
                    {/* Backdrop to close on click outside */}
                    <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)}></div>
                    
                    <div 
                        style={{ top: coords.top, left: coords.left }}
                        className="fixed bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] p-3 animate-in fade-in zoom-in-95 duration-200 w-[220px]"
                    >
                         {/* Header Selectors */}
                         <div className="flex gap-2 mb-3">
                            <select 
                                value={pickerDate.getFullYear()}
                                onChange={(e) => {
                                    const newDate = new Date(pickerDate);
                                    newDate.setFullYear(Number(e.target.value));
                                    setPickerDate(newDate);
                                }}
                                className="flex-1 bg-gray-50 border-none rounded-lg text-xs font-bold text-[#263238] py-1.5 px-2 focus:ring-0 cursor-pointer"
                            >
                                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <select 
                                value={pickerDate.getMonth()}
                                onChange={(e) => {
                                    const newDate = new Date(pickerDate);
                                    newDate.setMonth(Number(e.target.value));
                                    setPickerDate(newDate);
                                }}
                                className="flex-[1.5] bg-gray-50 border-none rounded-lg text-xs font-bold text-[#263238] py-1.5 px-2 focus:ring-0 cursor-pointer"
                            >
                                {Array.from({ length: 12 }, (_, i) => i).map(m => (
                                    <option key={m} value={m}>{new Date(2000, m, 1).toLocaleString('default', { month: 'long' })}</option>
                                ))}
                            </select>
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                            {['S','M','T','W','T','F','S'].map(d => (
                                <div key={d} className="text-[9px] font-bold text-gray-300">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: getFirstDayOfMonth(pickerDate.getFullYear(), pickerDate.getMonth()) }).map((_, i) => (
                                <div key={`empty-${i}`}></div>
                            ))}
                            {Array.from({ length: getDaysInMonth(pickerDate.getFullYear(), pickerDate.getMonth()) }).map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${pickerDate.getFullYear()}-${String(pickerDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const isSelected = date === dateStr;
                                const isToday = new Date().toDateString() === new Date(pickerDate.getFullYear(), pickerDate.getMonth(), day).toDateString();
                                
                                return (
                                    <div 
                                        key={day}
                                        onClick={() => {
                                            setDate(dateStr);
                                            setIsOpen(false);
                                        }}
                                        className={`aspect-square flex items-center justify-center text-[10px] rounded-md cursor-pointer transition-all font-medium ${isSelected ? 'bg-[#4b33e8] text-white shadow-md' : isToday ? 'bg-indigo-50 text-[#4b33e8] font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        {day}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

interface TimePickerProps {
    time: string;
    setTime: (t: string) => void;
    label?: string;
}

const CustomTimePicker = ({ time, setTime, label }: TimePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const togglePicker = () => {
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({ top: rect.bottom + 8, left: rect.left });
        }
        setIsOpen(!isOpen);
    };

    const currentH = time ? time.split(':')[0] : '12';
    const currentM = time ? time.split(':')[1] : '00';

    const updateH = (h: string) => setTime(`${h}:${currentM}`);
    const updateM = (m: string) => setTime(`${currentH}:${m}`);

    return (
        <div className="space-y-1.5 relative w-full">
            {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>}
            <div 
                ref={triggerRef}
                onClick={togglePicker}
                className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-[#263238] cursor-pointer flex items-center justify-between transition-all hover:bg-white hover:border-indigo-100 ${isOpen ? 'ring-2 ring-indigo-100 bg-white' : ''}`}
            >
                <span>{time || <span className="text-gray-400">Select Time</span>}</span>
                <i className="fi flex fi-rr-clock text-gray-400"></i>
            </div>

            {isOpen && mounted && createPortal(
                <>
                    <div className="fixed inset-0 z-[9998]" onClick={() => setIsOpen(false)}></div>
                    <div 
                        style={{ top: coords.top, left: coords.left }}
                        className="fixed bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] p-4 animate-in fade-in zoom-in-95 duration-200 w-[200px]"
                    >
                        <div className="flex gap-4">
                            {/* Hours */}
                            <div className="flex-1">
                                <p className="text-[8px] font-black text-gray-300 uppercase mb-2 text-center">Hrs</p>
                                <div className="h-40 overflow-y-auto custom-scrollbar space-y-1">
                                    {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => (
                                        <div 
                                            key={h} 
                                            onClick={() => updateH(h)}
                                            className={`text-center py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-all ${currentH === h ? 'bg-[#4b33e8] text-white shadow-md' : 'hover:bg-gray-50 text-gray-500'}`}
                                        >
                                            {h}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Minutes */}
                            <div className="flex-1">
                                <p className="text-[8px] font-black text-gray-300 uppercase mb-2 text-center">Min</p>
                                <div className="h-40 overflow-y-auto custom-scrollbar space-y-1">
                                    {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                                        <div 
                                            key={m} 
                                            onClick={() => updateM(m)}
                                            className={`text-center py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-all ${currentM === m ? 'bg-[#4b33e8] text-white shadow-md' : 'hover:bg-gray-50 text-gray-500'}`}
                                        >
                                            {m}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest"
                        >
                            Done
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

export default function UtilitySidebar() {
    const router = useRouter();
    const { user } = useUser();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => { setMounted(true); }, []);
    const [activeApp, setActiveApp] = useState<UtilityApp>('notes');
    
    // --- APP STATES ---
    const [notesList, setNotesList] = useState<{id: number, title: string, content: string, type: 'text' | 'audio', audioUrl?: string}[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
    const [noteCreationType, setNoteCreationType] = useState<'text' | 'audio'>('text');
    
    // --- AUDIO RECORDING & PLAYBACK ---
    const [isRecording, setIsRecording] = useState(false);
    const [recordDuration, setRecordDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioNodeRef = useRef<HTMLAudioElement | null>(null);
    const [todoProjects, setTodoProjects] = useState<{id: number, title: string, tasks: {id: number, text: string, completed: boolean}[]}[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
    const [newTask, setNewTask] = useState('');
    const [calcDisplay, setCalcDisplay] = useState('0');
    const [calcPrev, setCalcPrev] = useState<string | null>(null);
    const [calcOp, setCalcOp] = useState<string | null>(null);
    const [calcHistory, setCalcHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [dob, setDob] = useState('');
    const [ageResult, setAgeResult] = useState<{y: number, m: number, d: number} | null>(null);
    const [activeAgeTab, setActiveAgeTab] = useState<'single' | 'family'>('single');
    const [familyCards, setFamilyCards] = useState<{id: number, name: string, members: {id: number, type: 'Adult' | 'Child', dob: string, height?: string, weight?: string}[]}[]>([]);
    const [activeCardId, setActiveCardId] = useState<number | null>(null);
    const [bmiHeight, setBmiHeight] = useState('');
    const [bmiWeight, setBmiWeight] = useState('');
    const [nextMemberId, setNextMemberId] = useState(1);
    const [calDate, setCalDate] = useState(new Date());
    const [calEvents, setCalEvents] = useState<{id: number, date: string, title: string}[]>([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
    const [isSyncing, setIsSyncing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [googleHolidays, setGoogleHolidays] = useState<Record<string, any[]>>({});

    // --- ALARM STATES ---
    const [alarms, setAlarms] = useState<{id: number, time: string, message: string, enabled: boolean}[]>([]);
    const [alarmTime, setAlarmTime] = useState('');
    const [alarmMessage, setAlarmMessage] = useState('');
    const [activeToast, setActiveToast] = useState<{message: string, type: 'alarm' | 'info'} | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // --- AI CHAT & COPILOT STATES ---
    const [chatMessages, setChatMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiConfig, setAiConfig] = useState<{instructions: string, knowledgeBase: string}>({
        instructions: '',
        knowledgeBase: ''
    });
    const [showAiSettings, setShowAiSettings] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    // --- DRAG STATE ---
    const [posY, setPosY] = useState(50); // percentage from top
    const [isDragging, setIsDragging] = useState(false);
    const dragStarted = useRef(false);
    const startY = useRef(0);
    const startPosY = useRef(50);

    // --- DRAWER RESIZE STATE ---
    const [drawerWidth, setDrawerWidth] = useState(320);
    const [isResizing, setIsResizing] = useState(false);
    const resizeStartX = useRef(0);
    const resizeStartWidth = useRef(320);

    // Load states from localStorage
    useEffect(() => {
        // ... Notes loading logic ...
        const savedNotes = localStorage.getItem('tfc_util_notes_v2');
        const lastActiveNoteId = localStorage.getItem('tfc_util_active_note');
        if (savedNotes) {
            const parsed = JSON.parse(savedNotes);
            const migrated = parsed.map((n: any) => ({
                ...n,
                type: n.type || 'text'
            }));
            setNotesList(migrated);
            if (lastActiveNoteId) setActiveNoteId(Number(lastActiveNoteId));
            else if (parsed.length > 0) setActiveNoteId(parsed[0].id);
        } else {
            const firstNote: {id: number, title: string, content: string, type: 'text' | 'audio'} = { id: Date.now(), title: 'Draft Note', content: '', type: 'text' };
            setNotesList([firstNote]);
            setActiveNoteId(firstNote.id);
        }

        // --- Multi-Todo Loading ---
        const savedProjects = localStorage.getItem('tfc_util_todo_v2');
        const lastActiveProjId = localStorage.getItem('tfc_util_active_todo');
        const oldTasks = localStorage.getItem('tfc_util_tasks');
        
        if (savedProjects) {
            const parsed = JSON.parse(savedProjects);
            setTodoProjects(parsed);
            if (lastActiveProjId) setActiveProjectId(Number(lastActiveProjId));
            else if (parsed.length > 0) setActiveProjectId(parsed[0].id);
        } else if (oldTasks) {
            // Migrate old single list to new multi-list format
            const firstProj = { id: Date.now(), title: 'General Tasks', tasks: JSON.parse(oldTasks) };
            setTodoProjects([firstProj]);
            setActiveProjectId(firstProj.id);
        } else {
            // Default first project
            const firstProj = { id: Date.now(), title: 'General Tasks', tasks: [] };
            setTodoProjects([firstProj]);
            setActiveProjectId(firstProj.id);
        }

        const savedEvents = localStorage.getItem('tfc_util_events');
        if (savedEvents) setCalEvents(JSON.parse(savedEvents));

        const savedCards = localStorage.getItem('tfc_util_family_cards');
        const oldFamily = localStorage.getItem('tfc_util_family_members');
        const savedAgeTab = localStorage.getItem('tfc_util_age_tab');

        if (savedCards) {
            const parsed = JSON.parse(savedCards);
            setFamilyCards(parsed);
             // find max id for members across all cards to prevent collisions
            let maxId = 0;
            parsed.forEach((c: any) => {
                c.members.forEach((m: any) => {
                    maxId = Math.max(maxId, m.id);
                });
            });
            setNextMemberId(maxId + 1);
        } else if (oldFamily) {
             // Migrate old single family to cards
             const parsed = JSON.parse(oldFamily);
             const firstCard = { id: Date.now(), name: 'My Family', members: parsed };
             setFamilyCards([firstCard]);
             const maxId = parsed.reduce((max: number, m: any) => Math.max(max, m.id), 0);
             setNextMemberId(maxId + 1);
        }

        if (savedAgeTab) setActiveAgeTab(savedAgeTab as 'single' | 'family');
    }, []);

    // --- SUPABASE SYNC LOGIC ---
    useEffect(() => {
        const fetchRemoteData = async () => {
            const currentId = user?.uid || (user as any)?.id;
            if (!currentId) {
                setIsInitialLoad(false);
                return;
            }
            
            try {
                const { data, error } = await supabase
                    .from('utility_data')
                    .select('*')
                    .eq('user_id', currentId)
                    .single();
                
                if (data) {
                    if (data.notes) setNotesList(data.notes);
                    if (data.todos) setTodoProjects(data.todos);
                    if (data.calendar) setCalEvents(data.calendar);
                    if (data.family) setFamilyCards(data.family);
                    if (data.alarms) setAlarms(data.alarms);
                    if (data.ai_config) setAiConfig(data.ai_config);
                    if (data.ai_chat_history) setChatMessages(data.ai_chat_history);
                }
            } catch (e) {
                console.error("Supabase load error", e);
            } finally {
                setIsInitialLoad(false);
            }
        };

        if (mounted && user) {
            fetchRemoteData();
        } else if (mounted && !user) {
            setIsInitialLoad(false);
        }
    }, [user, mounted]);

    useEffect(() => {
        const syncToRemote = async () => {
            const currentId = user?.uid || (user as any)?.id;
            if (isInitialLoad || !currentId) return;

            try {
                await supabase.from('utility_data').upsert({
                    user_id: currentId,
                    notes: notesList,
                    todos: todoProjects,
                    calendar: calEvents,
                    family: familyCards,
                    alarms: alarms,
                    ai_config: aiConfig,
                    ai_chat_history: chatMessages,
                    updated_at: new Date().toISOString()
                });
            } catch (e) {
                console.error("Supabase sync error", e);
            }
        };

        const timer = setTimeout(syncToRemote, 2000); // 2s debounce to avoid over-calling
        return () => clearTimeout(timer);
    }, [notesList, todoProjects, calEvents, familyCards, alarms, user, isInitialLoad]);

    // Save states
    useEffect(() => {
        if (notesList.length > 0) localStorage.setItem('tfc_util_notes_v2', JSON.stringify(notesList));
    }, [notesList]);

    useEffect(() => {
        if (activeNoteId) localStorage.setItem('tfc_util_active_note', String(activeNoteId));
    }, [activeNoteId]);

    useEffect(() => {
        if (todoProjects.length > 0) localStorage.setItem('tfc_util_todo_v2', JSON.stringify(todoProjects));
    }, [todoProjects]);

    useEffect(() => {
        if (activeProjectId) localStorage.setItem('tfc_util_active_todo', String(activeProjectId));
    }, [activeProjectId]);

    useEffect(() => {
        localStorage.setItem('tfc_util_events', JSON.stringify(calEvents));
    }, [calEvents]);

    useEffect(() => {
        localStorage.setItem('tfc_util_family_cards', JSON.stringify(familyCards));
    }, [familyCards]);

    // --- ALARM PERSISTENCE ---
    useEffect(() => {
        const savedAlarms = localStorage.getItem('tfc_util_alarms');
        if (savedAlarms) setAlarms(JSON.parse(savedAlarms));
    }, []);

    useEffect(() => {
        localStorage.setItem('tfc_util_alarms', JSON.stringify(alarms));
    }, [alarms]);

    // --- ALARM TRIGGER LOGIC ---
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            
            alarms.forEach(alarm => {
                if (alarm.enabled && alarm.time === currentTime) {
                    // Trigger
                    setActiveToast({ message: alarm.message || 'Alarm Ringing!', type: 'alarm' });
                    if (audioRef.current) {
                        audioRef.current.play().catch(e => console.log("Audio play failed", e));
                    }
                    // Disable it so it doesn't trigger again in the same minute
                    setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, enabled: false } : a));
                }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [alarms]);

    const addAlarm = () => {
        if (!alarmTime) {
            alert("Please select a time first!");
            return;
        }
        const newAlarm = {
            id: Date.now(),
            time: alarmTime,
            message: alarmMessage,
            enabled: true
        };
        setAlarms(prev => [...prev, newAlarm]);
        setAlarmTime('');
        setAlarmMessage('');
    };

    const deleteAlarm = (id: number) => {
        setAlarms(alarms.filter(a => a.id !== id));
    };

    const toggleAlarm = (id: number) => {
        setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    };

    const stopAlarm = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setActiveToast(null);
    };

    // --- AI HANDLERS ---
    const getAiContext = async () => {
        const currentId = user?.uid || (user as any)?.id;
        if (!currentId) return "No user logged in.";

        try {
            // Fetch Recent Call Logs
            const { data: callLogs } = await supabase
                .from('call_logs')
                .select('*')
                .eq('user_id', currentId)
                .order('created_at', { ascending: false })
                .limit(10);

            // Fetch Customer Context
            const { data: customers } = await supabase
                .from('customers')
                .select('*')
                .limit(5);

            // Fetch Followups / Outcomes
            const { data: outcomes } = await supabase
                .from('user_outcomes')
                .select('*')
                .eq('user_id', currentId)
                .limit(5);

            return JSON.stringify({
                currentUser: { name: user?.displayName, role: user?.designation, level: user?.user_level },
                recentCallLogs: callLogs,
                sampleCustomers: customers,
                userFollowups: outcomes,
                currentDrafts: notesList.slice(0, 3).map(n => ({ title: n.title, content: n.content })),
                activeTasks: todoProjects.map(p => ({ project: p.title, tasks: p.tasks.filter(t => !t.completed).map(t => t.text) })),
                customInstructions: aiConfig.instructions,
                knowledgeBase: aiConfig.knowledgeBase,
                current_time: new Date().toLocaleString()
            });
        } catch (e) {
            console.error("Context fetch error", e);
            return "Error fetching context.";
        }
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || isAiLoading) return;
        
        const userMsg = { role: 'user' as const, content: userInput };
        setChatMessages(prev => [...prev, userMsg]);
        setUserInput('');
        setIsAiLoading(true);

        try {
            const contextContent = await getAiContext();
            
            const response = await fetch('/api/ai/copilot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    messages: [...chatMessages, userMsg],
                    context: contextContent 
                })
            });
            
            const data = await response.json();
            if (data.reply) {
                setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setChatMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I couldn't process that. Please try again." }]);
            }
        } catch (e) {
            console.error("AI Chat error", e);
            setChatMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please check if the AI service is active." }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const clearChat = () => {
        if(confirm("Clear chat history?")) setChatMessages([]);
    };

    useEffect(() => {
        // Cleaning up active Age Tab storage as it's no longer used
        localStorage.removeItem('tfc_util_age_tab');
    }, []);

    // --- NOTES HANDLERS ---
    const addNote = () => {
        const newNote = { 
            id: Date.now(), 
            title: `${noteCreationType === 'audio' ? 'Voice memo' : 'Draft Note'} ${notesList.length + 1}`, 
            content: '',
            type: noteCreationType
        };
        setNotesList([...notesList, newNote]);
        setActiveNoteId(newNote.id);
    };

    const deleteNote = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newList = notesList.filter(n => n.id !== id);
        setNotesList(newList);
        if (activeNoteId === id) {
            setActiveNoteId(newList.length > 0 ? newList[0].id : null);
        }
    };

    const updateNoteContent = (content: string) => {
        setNotesList(notesList.map(n => n.id === activeNoteId ? { ...n, content } : n));
    };

    const updateNoteTitle = (title: string) => {
        setNotesList(notesList.map(n => n.id === activeNoteId ? { ...n, title } : n));
    };

    // --- AUDIO HANDLING ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await uploadAudioToSupabase(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordDuration(0);
            recordingIntervalRef.current = setInterval(() => {
                setRecordDuration(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Microphone access error:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        }
    };

    const uploadAudioToSupabase = async (blob: Blob) => {
        if (!user || !activeNoteId) return;
        try {
            const fileName = `memos/${user.uid}/${activeNoteId}_${Date.now()}.webm`;
            const { data, error } = await supabase.storage
                .from('voice-memos')
                .upload(fileName, blob);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('voice-memos')
                .getPublicUrl(fileName);

            setNotesList(prev => prev.map(n => n.id === activeNoteId ? { ...n, audioUrl: publicUrl } : n));
        } catch (err) {
            console.error("Upload failed", err);
        }
    };

    const togglePlayback = (url: string) => {
        if (!audioNodeRef.current || audioNodeRef.current.src !== url) {
            if (audioNodeRef.current) audioNodeRef.current.pause();
            audioNodeRef.current = new Audio(url);
            audioNodeRef.current.onloadedmetadata = () => {
                setAudioDuration(audioNodeRef.current?.duration || 0);
            };
            audioNodeRef.current.onended = () => {
                setIsPlaying(false);
                setAudioProgress(0);
                if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
            };
        }

        if (isPlaying) {
            audioNodeRef.current.pause();
            setIsPlaying(false);
            if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
        } else {
            audioNodeRef.current.play();
            setIsPlaying(true);
            playbackIntervalRef.current = setInterval(() => {
                if (audioNodeRef.current) {
                    setAudioProgress(audioNodeRef.current.currentTime);
                }
            }, 100);
        }
    };

    const seekAudio = (time: number) => {
        if (audioNodeRef.current) {
            audioNodeRef.current.currentTime = time;
            setAudioProgress(time);
        }
    };

    // --- TODO/PROJECT HANDLERS ---
    const addTodoProject = () => {
        const newProj = { id: Date.now(), title: `List ${todoProjects.length + 1}`, tasks: [] };
        setTodoProjects([...todoProjects, newProj]);
        setActiveProjectId(newProj.id);
    };

    const deleteTodoProject = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newList = todoProjects.filter(p => p.id !== id);
        setTodoProjects(newList);
        if (activeProjectId === id) {
            setActiveProjectId(newList.length > 0 ? newList[0].id : null);
        }
    };

    const updateProjectTitle = (title: string) => {
        setTodoProjects(todoProjects.map(p => p.id === activeProjectId ? { ...p, title } : p));
    };

    const addTask = () => {
        if (!newTask.trim() || !activeProjectId) return;
        setTodoProjects(todoProjects.map(p => p.id === activeProjectId ? { 
            ...p, 
            tasks: [...p.tasks, { id: Date.now(), text: newTask, completed: false }] 
        } : p));
        setNewTask('');
    };

    const toggleTask = (taskId: number) => {
        setTodoProjects(todoProjects.map(p => p.id === activeProjectId ? { 
            ...p, 
            tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        } : p));
    };

    const deleteTask = (taskId: number) => {
        setTodoProjects(todoProjects.map(p => p.id === activeProjectId ? { 
            ...p, 
            tasks: p.tasks.filter(t => t.id !== taskId)
        } : p));
    };

    // --- CALCULATOR HANDLERS ---
    const handleCalcInput = (val: string) => {
        if (['+', '-', '*', '/'].includes(val)) {
            setCalcPrev(calcDisplay);
            setCalcOp(val);
            setCalcDisplay('0');
            return;
        }
        if (val === '=' || val === 'Enter') {
            if (!calcPrev || !calcOp) return;
            const prev = parseFloat(calcPrev);
            const curr = parseFloat(calcDisplay);
            let res = 0;
            if (calcOp === '+') res = prev + curr;
            if (calcOp === '-') res = prev - curr;
            if (calcOp === '*') res = prev * curr; 
            if (calcOp === '/') res = prev / curr;
            // Round to avoid float errors
            const finalRes = String(Math.round(res * 100000000) / 100000000);
            
            // Add to history
            const historyEntry = `${prev} ${calcOp} ${curr} = ${finalRes}`;
            setCalcHistory(h => [historyEntry, ...h].slice(0, 20)); // Keep last 20
            
            setCalcDisplay(finalRes);
            setCalcPrev(null);
            setCalcOp(null);
            return;
        }
        if (val === 'C' || val === 'Escape' || val === 'Delete') {
            setCalcDisplay('0');
            setCalcPrev(null);
            setCalcOp(null);
            return;
        }
        if (val === 'Backspace') {
            setCalcDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
            return;
        }
        // Prevent multiple decimals
        if (val === '.' && calcDisplay.includes('.')) return;
        
        setCalcDisplay(prev => prev === '0' && val !== '.' ? val : prev + val);
    };

    // Keyboard support for calculator
    useEffect(() => {
        if (!isOpen || activeApp !== 'calculator') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;
            
            // Numbers and Dot
            if (/^[0-9.]$/.test(key)) {
                e.preventDefault();
                handleCalcInput(key);
            }
            // Operators
            else if (['+', '-', '*', '/'].includes(key)) {
                e.preventDefault();
                handleCalcInput(key);
            }
            // Equals
            else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                handleCalcInput('=');
            }
            // Clear
            else if (key === 'Escape' || key === 'Delete') {
                e.preventDefault();
                handleCalcInput('C');
            }
            // Backspace
            else if (key === 'Backspace') {
                e.preventDefault();
                handleCalcInput('Backspace');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeApp, calcDisplay, calcPrev, calcOp]); // Dependencies for closure freshness

    // --- CALENDAR HANDLERS ---
    const changeMonth = (offset: number) => {
        const next = new Date(calDate.getFullYear(), calDate.getMonth() + offset, 1);
        setCalDate(next);
        // Reset selected day if needed or keep it
        setSelectedDay(null);
    };

    // Automatically sync holidays when month/year changes
    useEffect(() => {
        const sync = async () => {
            setIsSyncing(true);
            const holidays = await fetchGoogleHolidays(calDate.getFullYear(), calDate.getMonth());
            setGoogleHolidays(holidays);
            setIsSyncing(false);
        };
        sync();
    }, [calDate.getFullYear(), calDate.getMonth(), refreshKey]);

    const currentMonthFestivals = googleHolidays;

    const handleSync = () => {
        setRefreshKey(prev => prev + 1);
    };

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const addEvent = () => {
        if (!newEventTitle.trim() || !selectedDay) return;
        const dateStr = `${calDate.getFullYear()}-${String(calDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        setCalEvents([...calEvents, { id: Date.now(), date: dateStr, title: newEventTitle }]);
        setNewEventTitle('');
    };

    const deleteEvent = (id: number) => {
        setCalEvents(calEvents.filter(e => e.id !== id));
    };

    // --- AGE CALC HANDLER ---
    useEffect(() => {
        setAgeResult(calculateAge(dob));
    }, [dob]);

    const addFamilyCard = () => {
        const newCard = { id: Date.now(), name: `Family ${familyCards.length + 1}`, members: [] };
        setFamilyCards([...familyCards, newCard]);
        setActiveCardId(newCard.id);
    };

    const deleteFamilyCard = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newCards = familyCards.filter(c => c.id !== id);
        setFamilyCards(newCards);
        if (activeCardId === id) setActiveCardId(null);
    };

    const updateCardName = (name: string) => {
        setFamilyCards(familyCards.map(c => c.id === activeCardId ? { ...c, name } : c));
    };

    const addFamilyMember = (type: 'Adult' | 'Child') => {
        if (!activeCardId) return;
        setFamilyCards(familyCards.map(c => c.id === activeCardId ? {
            ...c,
            members: [...c.members, { id: nextMemberId, type, dob: '' }]
        } : c));
        setNextMemberId(prev => prev + 1);
    };

    const updateMemberDob = (memberId: number, dob: string) => {
        if (!activeCardId) return;
        setFamilyCards(familyCards.map(c => c.id === activeCardId ? {
            ...c,
            members: c.members.map(m => m.id === memberId ? { ...m, dob } : m)
        } : c));
    };

    const updateMemberMetrics = (memberId: number, field: 'height' | 'weight', value: string) => {
        if (!activeCardId) return;
        setFamilyCards(familyCards.map(c => c.id === activeCardId ? {
            ...c,
            members: c.members.map(m => m.id === memberId ? { ...m, [field]: value } : m)
        } : c));
    };

    const deleteFamilyMember = (memberId: number) => {
        if (!activeCardId) return;
        setFamilyCards(familyCards.map(c => c.id === activeCardId ? {
            ...c,
            members: c.members.filter(m => m.id !== memberId)
        } : c));
    };

    const apps = [
        { id: 'notes', icon: 'flex fi-rr-note', label: 'Notes' },
        { id: 'todo', icon: 'flex fi-rr-list-check', label: 'Tasks' },
        { id: 'calendar', icon: 'flex fi-rr-calendar', label: 'Calendar' },
        { id: 'calculator', icon: 'flex fi-rr-calculator', label: 'Calc' },
        { id: 'age', icon: 'flex fi-rr-user-time', label: 'Age' },
        { id: 'bmi', icon: 'flex fi-rr-ruler-combined', label: 'BMI' },
        { id: 'alarm', icon: 'flex fi-rr-bell', label: 'Alarm' },
        { id: 'ai', icon: 'flex fi-rr-brain', label: 'AI Bot' }
    ].filter(app => app.id !== 'ai');

    // --- DRAGGING LOGIC ---
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!dragStarted.current) return;
            
            const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
            
            // Minimal threshold to consider it a drag
            if (Math.abs(clientY - startY.current) > 5) {
                setIsDragging(true);
            }

            if (dragStarted.current) {
                const deltaY = ((clientY - startY.current) / window.innerHeight) * 100;
                let newPos = startPosY.current + deltaY;
                newPos = Math.max(5, Math.min(95, newPos)); 
                setPosY(newPos);
            }
        };

        const handleUp = () => {
            if (dragStarted.current) {
                dragStarted.current = false;
                // Keep isDragging true for a moment to prevent onClick from firing immediately
                setTimeout(() => setIsDragging(false), 100);
            }
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, []);

    // --- RESIZE LOGIC ---
    useEffect(() => {
        const handleResizeMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const deltaX = resizeStartX.current - e.clientX;
            let newWidth = resizeStartWidth.current + deltaX;
            // Min 250px, Max 80% of window width
            newWidth = Math.max(250, Math.min(window.innerWidth * 0.8, newWidth));
            setDrawerWidth(newWidth);
        };

        const handleResizeUp = () => {
            setIsResizing(false);
            document.body.style.cursor = '';
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeUp);
        };
    }, [isResizing]);

    const onResizeStart = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
        resizeStartX.current = e.clientX;
        resizeStartWidth.current = drawerWidth;
    };

    // Lock body scroll and selection during drag
    useEffect(() => {
        if (isDragging) {
            document.body.style.overflow = 'hidden';
            document.body.style.userSelect = 'none';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.userSelect = '';
            document.body.style.touchAction = '';
        }
    }, [isDragging]);

    const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        // Only left click or touch
        if ('button' in e && e.button !== 0) return;
        
        dragStarted.current = true;
        startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
        startPosY.current = posY;
    };

    return (
        <>
            {/* Trigger Tab */}
            <button 
                onMouseDown={onDragStart}
                onTouchStart={onDragStart}
                onClick={(e) => {
                    if (isDragging) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                    setIsOpen(true);
                }}
                className={`fixed right-0 z-[100] bg-[#4b33e8] text-xs hover:text-lg  border border-indigo-700 text-white w-4 h-12 hover:w-6 hover:h-14 rounded-l-xl transition-all duration-300 flex flex-col items-center justify-center hover:opacity-90 active:scale-95 ${isOpen ? 'translate-x-full' : ''}`}
                style={{ top: `${posY}%`, transform: isOpen ? 'translateY(-50%) translateX(100%)' : 'translateY(-50%)', transition: isDragging ? 'none' : 'all 0.3s' }}
            >
                <i className="fi flex fi-rr-angle-small-left  font-bold"></i>
            </button>

            {/* Sidebar Drawer */}
            <div className={`fixed inset-0 z-[1000] transition-all duration-500 pointer-events-none ${isOpen ? 'visible' : 'invisible'}`}>
                {/* Minimal Backdrop */}
                <div 
                    onClick={() => setIsOpen(false)}
                    className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-500 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                ></div>

                {/* Compact Content Panel */}
                <div 
                    style={{ width: `${drawerWidth}px` }}
                    className={`absolute right-0 top-0 h-full bg-white shadow-xl transition-transform duration-400 pointer-events-auto border-l border-gray-100 flex ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${isResizing ? 'transition-none' : ''}`}
                >
                    {/* Resize Handle */}
                    <div 
                        onMouseDown={onResizeStart}
                        className="absolute left-0 top-0 w-1.5 h-full cursor-ew-resize hover:bg-indigo-400/30 transition-colors z-[1010]"
                    />
                    
                    {/* Thin App Bar */}
                    <div className="w-[60px] shrink-0 bg-[#4b33e8] border-r border-indigo-700 flex flex-col items-center py-4 gap-4">
                        <div className="mb-2">
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-8 p-2 h-8 rounded-lg text-white/60 hover:text-white transition-colors"
                            >
                                <i className="fi flex fi-rr-cross-small text-lg"></i>
                            </button>
                        </div>
                        
                        {apps.map(app => (
                            <button 
                                key={app.id}
                                onClick={() => setActiveApp(app.id as UtilityApp)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeApp === app.id ? 'bg-white text-[#4b33e8] shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                                title={app.label}
                            >
                                <i className={`fi flex ${app.icon} text-base flex`}></i>
                            </button>
                        ))}
                    </div>

                    {/* App Content */}
                    <div className="flex-1 flex flex-col h-full bg-white relative">
                        {/* Elegant Header */}
                        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-700 tracking-tight uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {activeApp === 'age' ? 'Age Calc' : activeApp === 'todo' ? 'Tasks' : activeApp}
                            </h2>
                            <span className="text-[10px] font-bold text-[#4b33e8] bg-indigo-50 px-2 py-0.5 rounded-full uppercase">Utility</span>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-4 scroll-smooth custom-scrollbar">
                            
                            {/* NOTES APP - Vertical List / Column View */}
                            {activeApp === 'notes' && (
                                <div className="h-full flex flex-col">
                                    {!activeNoteId ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                                                    <button 
                                                        onClick={() => setNoteCreationType('text')}
                                                        className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${noteCreationType === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        Text
                                                    </button>
                                                    <button 
                                                        onClick={() => setNoteCreationType('audio')}
                                                        className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${noteCreationType === 'audio' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        Audio
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={addNote}
                                                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:shadow-md active:scale-95 ${noteCreationType === 'audio' ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                                                >
                                                    <i className="fi flex fi-rr-plus text-[10px]"></i>
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {notesList.length === 0 && (
                                                    <div className="py-10 text-center border-2 border-dashed border-gray-50 rounded-xl">
                                                        <p className="text-[10px] font-bold text-gray-300 uppercase">No notes found</p>
                                                    </div>
                                                )}
                                                {notesList.map(note => (
                                                    <div 
                                                        key={note.id}
                                                        onClick={() => setActiveNoteId(note.id)}
                                                        className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all bg-white"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${note.type === 'audio' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                                                                <i className={`fi flex ${note.type === 'audio' ? 'fi-rr-microphone' : 'fi-rr-document'} text-xs`}></i>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-[#263238] truncate">{note.title}</p>
                                                                <p className="text-[9px] text-gray-400 truncate mt-0.5">{note.content || (note.type === 'audio' ? 'Voice recording...' : 'No content yet...')}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => deleteNote(note.id, e)}
                                                            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                                                        >
                                                            <i className="fi flex fi-rr-trash text-[10px]"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col gap-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <button 
                                                    onClick={() => setActiveNoteId(null)}
                                                    className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all"
                                                >
                                                    <i className="fi flex fi-rr-angle-small-left"></i>
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={notesList.find(n => n.id === activeNoteId)?.title || ''}
                                                    onChange={(e) => updateNoteTitle(e.target.value)}
                                                    className="flex-1 bg-transparent border-none text-xs font-bold text-[#263238] focus:ring-0 p-0 outline-none"
                                                    placeholder="Untitled Note"
                                                />
                                            </div>
                                            {notesList.find(n => n.id === activeNoteId)?.type === 'audio' ? (
                                                <div className="flex-1 flex flex-col items-center justify-center bg-rose-50/30 rounded-2xl border border-rose-100/50 p-6 space-y-5">
                                                    {notesList.find(n => n.id === activeNoteId)?.audioUrl ? (
                                                        <div className="w-full space-y-4">
                                                            <div className="flex items-center justify-center">
                                                                <button 
                                                                    onClick={() => togglePlayback(notesList.find(n => n.id === activeNoteId)!.audioUrl!)}
                                                                    className="w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all active:scale-95"
                                                                >
                                                                    <i className={`fi flex ${isPlaying ? 'fi-rr-pause' : 'fi-rr-play'} text-xl ${!isPlaying ? 'ml-1' : ''}`}></i>
                                                                </button>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <input 
                                                                    type="range"
                                                                    min="0"
                                                                    max={audioDuration || 0}
                                                                    step="0.1"
                                                                    value={audioProgress || 0}
                                                                    onChange={(e) => seekAudio(Number(e.target.value))}
                                                                    className="w-full h-1 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                                                />
                                                                <div className="flex justify-between text-[8px] font-bold text-rose-400 uppercase tracking-widest">
                                                                    <span>{formatTime(audioProgress)}</span>
                                                                    <span>{formatTime(audioDuration)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 animate-pulse text-white' : 'bg-rose-100 text-rose-500'}`}>
                                                                <i className="fi flex fi-rr-microphone text-2xl"></i>
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-xs font-bold text-rose-600">
                                                                    {isRecording ? 'Recording...' : 'Ready to Record'}
                                                                </p>
                                                                <p className="text-[10px] text-rose-400 uppercase tracking-widest mt-1">
                                                                    {isRecording ? formatTime(recordDuration) : 'Tap to start voice memo'}
                                                                </p>
                                                            </div>
                                                            <button 
                                                                onClick={isRecording ? stopRecording : startRecording}
                                                                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isRecording ? 'bg-slate-900 text-white' : 'bg-rose-500 text-white shadow-lg  hover:bg-rose-600'}`}
                                                            >
                                                                {isRecording ? 'Stop & Save' : 'Start Recording'}
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    <textarea 
                                                        value={notesList.find(n => n.id === activeNoteId)?.content || ''}
                                                        onChange={(e) => updateNoteContent(e.target.value)}
                                                        className="w-full bg-white/50 border border-rose-100 rounded-xl p-3 text-xs font-medium text-rose-700 focus:ring-rose-200 outline-none resize-none h-32"
                                                        placeholder="Add transcript or notes here..."
                                                    />
                                                </div>
                                            ) : (
                                                <textarea 
                                                    autoFocus
                                                    value={notesList.find(n => n.id === activeNoteId)?.content || ''}
                                                    onChange={(e) => updateNoteContent(e.target.value)}
                                                    className="flex-1 w-full border-none focus:ring-0 outline-none text-sm text-[#263238] p-0 rounded-none leading-relaxed resize-none bg-transparent"
                                                    style={{ fontFamily: "'Roboto', sans-serif" }}
                                                    placeholder="Write your note here..."
                                                ></textarea>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TODO APP - Multi-list support */}
                            {activeApp === 'todo' && (
                                <div className="h-full flex flex-col">
                                    {!activeProjectId ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-[10px] font-bold  text-gray-400 uppercase tracking-widest">Task Lists</h3>
                                                <button 
                                                    onClick={addTodoProject}
                                                    className="w-7 h-7 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all  "
                                                >
                                                    <i className="fi flex fi-rr-plus text-[10px]"></i>
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {todoProjects.map(proj => (
                                                    <div 
                                                        key={proj.id}
                                                        onClick={() => setActiveProjectId(proj.id)}
                                                        className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all   bg-white"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-[#263238] truncate">{proj.title}</p>
                                                            <p className="text-[9px] text-gray-400 mt-0.5">
                                                                {proj.tasks.filter(t => !t.completed).length} items pending
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                                {Math.round((proj.tasks.filter(t => t.completed).length / (proj.tasks.length || 1)) * 100)}%
                                                            </span>
                                                            <button 
                                                                onClick={(e) => deleteTodoProject(proj.id, e)}
                                                                className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                                                            >
                                                                <i className="fi flex fi-rr-trash text-[10px]"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 h-full flex flex-col">
                                            {/* List Header */}
                                            <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                                                <button 
                                                    onClick={() => setActiveProjectId(null)}
                                                    className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold"
                                                >
                                                    <i className="fi flex  fi-rr-angle-small-left text-lg"></i>
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={todoProjects.find(p => p.id === activeProjectId)?.title || ''}
                                                    onChange={(e) => updateProjectTitle(e.target.value)}
                                                    className="flex-1 bg-transparent border-none text-xs font-bold text-[#263238] focus:ring-0 p-0 outline-none"
                                                    placeholder="List Name"
                                                />
                                            </div>

                                            {/* Add Task Input */}
                                            <div className="flex gap-2 border-b border-gray-100 pb-3">
                                                <input 
                                                    type="text" 
                                                    value={newTask}
                                                    onChange={(e) => setNewTask(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                                    placeholder="Add task..."
                                                    className="flex-1 bg-transparent border-none text-sm focus:ring-0 outline-none text-[#263238] p-0"
                                                />
                                                <button onClick={addTask} className="text-[#4b33e8] hover:scale-110 transition-transform"><i className="fi flex fi-rr-plus-small text-xl flex"></i></button>
                                            </div>

                                            {/* Tasks List */}
                                            <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
                                                {todoProjects.find(p => p.id === activeProjectId)?.tasks.map((t) => (
                                                    <div key={t.id} className="group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-all">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={t.completed}
                                                            onChange={() => toggleTask(t.id)}
                                                            className="w-3.5 h-3.5 rounded border-gray-300 text-[#4b33e8] focus:ring-0 cursor-pointer"
                                                        />
                                                        <span className={`flex-1 text-xs truncate ${t.completed ? 'text-gray-300 line-through' : 'text-[#263238]'}`}>{t.text}</span>
                                                        <button onClick={() => deleteTask(t.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400"><i className="fi flex fi-rr-cross-small text-base"></i></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* CALENDAR - Interactive Grid with Events */}
                            {activeApp === 'calendar' && (
                                <div className="h-full flex flex-col gap-4">
                                    <div className="flex items-center justify-between px-2">
                                        <button 
                                            onClick={() => changeMonth(-1)}
                                            className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold"
                                        >
                                            <i className="fi flex  fi-rr-angle-small-left text-lg"></i>
                                        </button>
                                        <p className="text-xs font-bold text-[#263238] uppercase tracking-wider">
                                            {calDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </p>
                                        <button 
                                            onClick={() => changeMonth(1)}
                                            className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold"
                                        >
                                            <i className="fi flex  fi-rr-angle-small-right text-lg"></i>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-300 uppercase">
                                        {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: getFirstDayOfMonth(calDate.getFullYear(), calDate.getMonth()) }).map((_, i) => (
                                            <div key={`empty-${i}`} className="aspect-square"></div>
                                        ))}
                                        {Array.from({ length: getDaysInMonth(calDate.getFullYear(), calDate.getMonth()) }).map((_, i) => {
                                            const day = i + 1;
                                            const dateStr = `${calDate.getFullYear()}-${String(calDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                            const isSelected = selectedDay === day;
                                            const isToday = day === new Date().getDate() && calDate.getMonth() === new Date().getMonth() && calDate.getFullYear() === new Date().getFullYear();
                                            const hasLocalEvents = calEvents.some(e => e.date === dateStr);
                                            const dayFestivals = currentMonthFestivals[dateStr] || [];
                                            const hasGoogleFestivals = dayFestivals.some(f => f.isFestival);
                                            const hasPersonalEvents = dayFestivals.some(f => f.isPersonal);
                                            
                                            return (
                                                <div 
                                                    key={day} 
                                                    onClick={() => setSelectedDay(day)}
                                                    className={`relative aspect-square flex flex-col items-center justify-center text-[10px] rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 text-[#4b33e8] border border-indigo-200' : isToday ? 'bg-[#4b33e8] text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'}`}
                                                >
                                                    <span className="font-bold">{day}</span>
                                                    {hasGoogleFestivals && <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-400"></div>}
                                                    {hasPersonalEvents && <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-emerald-400"></div>}
                                                    {hasLocalEvents && !isToday && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400"></div>}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Event Creation */}
                                    <div className="mt-2 space-y-2">
                                        <div className="flex gap-2 bg-gray-50 p-2 rounded-xl">
                                            <input 
                                                type="text" 
                                                value={newEventTitle}
                                                onChange={(e) => setNewEventTitle(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addEvent()}
                                                placeholder={`Event for day ${selectedDay || '...'}`}
                                                className="flex-1 bg-transparent border-none text-xs focus:ring-0 outline-none text-[#263238] p-0"
                                            />
                                            <button onClick={addEvent} className="text-[#4b33e8] w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-all"><i className="fi flex fi-rr-plus-small text-xl flex"></i></button>
                                        </div>

                                        <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                                            {/* Connect Prompt if Not Connected */}
                                            {(!user?.googleCalendarConnected) && (
                                                <div 
                                                    onClick={() => router.push('/settings')}
                                                    className="bg-indigo-50 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-all group border border-indigo-100 mb-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-indigo-600  ">
                                                            <i className="fi flex fi-brands-google text-[10px] flex"></i>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-indigo-700">Connect Google Calendar</span>
                                                    </div>
                                                    <i className="fi flex fi-rr-angle-small-right text-indigo-400 group-hover:text-indigo-600 flex"></i>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-2">
                                                <h3 className="text-[9px] font-bold  text-gray-400 uppercase tracking-widest">Google Calendar Holidays</h3>
                                                <button 
                                                    onClick={handleSync}
                                                    disabled={isSyncing}
                                                    className={`text-[8px] font-bold flex items-center gap-1 transition-all ${isSyncing ? 'text-indigo-400' : 'text-green-500 hover:text-green-600'}`}
                                                >
                                                    <i className={`flex fi flex fi-rr-refresh text-[10px] ${isSyncing ? 'animate-spin' : ''}`}></i> 
                                                    {isSyncing ? 'Syncing...' : 'Live Sync'}
                                                </button>
                                            </div>
                                            
                                            {/* Combined Festivals and User Events */}
                                            {(() => {
                                                const userEvents = calEvents.filter(e => {
                                                    const [y, m] = e.date.split('-');
                                                    return Number(y) === calDate.getFullYear() && Number(m) === calDate.getMonth() + 1;
                                                });
                                                
                                                // Explode holidays into a flat list for the current month
                                                const googleEventsList: any[] = [];
                                                Object.entries(googleHolidays).forEach(([date, list]) => {
                                                    list.forEach(h => {
                                                        googleEventsList.push({
                                                            ...h,
                                                            date,
                                                            title: h.summary,
                                                            isGoogle: true
                                                        });
                                                    });
                                                });

                                                const combined = [
                                                    ...googleEventsList,
                                                    ...userEvents
                                                ].sort((a, b) => a.date.localeCompare(b.date));

                                                if (combined.length === 0) {
                                                    return <p className="text-[10px] text-gray-300 italic py-2">No events or festivals</p>;
                                                }

                                                return combined.map((item: any) => (
                                                    <div key={item.id} className="group flex flex-col p-2 rounded-lg border border-gray-50 hover:bg-gray-50 transition-all cursor-default">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md ${item.isFestival ? 'bg-amber-400' : item.isPersonal ? 'bg-emerald-400' : 'bg-indigo-400'}`}>
                                                                    {item.date.split('-')[2]}
                                                                </span>
                                                                <span className={`text-xs font-medium truncate max-w-[160px] ${item.isFestival ? 'text-amber-600' : item.isPersonal ? 'text-emerald-600' : 'text-[#263238]'}`}>
                                                                    {item.title}
                                                                    {item.isFestival && <span className="ml-1 text-[8px] opacity-70">(Holidays)</span>}
                                                                    {item.isPersonal && <span className="ml-1 text-[8px] opacity-70">(Google Event)</span>}
                                                                </span>
                                                            </div>
                                                            {!item.isGoogle && (
                                                                <button onClick={() => deleteEvent(item.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                                                                    <i className="fi flex fi-rr-cross-small text-base"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                        {(item.isGoogle && (item.description || item.location)) && (
                                                            <div className="mt-1 pl-7 space-y-0.5">
                                                                {item.location && <p className="text-[9px] text-gray-400 flex items-center gap-1"><i className="fi flex fi-rr-marker"></i> {item.location}</p>}
                                                                {item.description && <p className="text-[9px] text-gray-400 italic line-clamp-2 leading-tight">{item.description}</p>}
                                                            </div>
                                                        )}
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CALCULATOR - Sleek Slate */}
                            {activeApp === 'calculator' && (
                                <div className="space-y-3 h-full flex flex-col">
                                    {/* Display Screen */}
                                    <div className="bg-gray-50 rounded-xl p-4 text-right mb-2 relative shrink-0">
                                        <div className="text-[10px] text-gray-400 font-mono h-4">{calcPrev} {calcOp}</div>
                                        <div className="text-2xl text-[#263238] font-mono font-bold truncate">{calcDisplay}</div>
                                    </div>
                                    
                                    {/* Keypad */}
                                    <div className="grid grid-cols-4 gap-1.5 shrink-0">
                                        {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
                                            <button 
                                                key={btn}
                                                onClick={() => handleCalcInput(btn)}
                                                className={`h-11 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                                                    btn === '=' ? 'bg-[#4b33e8] text-white  ' : 
                                                    ['/','*','-','+','C'].includes(btn) ? 'bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {btn}
                                            </button>
                                        ))}
                                    </div>

                                    {/* History Section (Below Keypad) */}
                                    <div className="flex-1 overflow-hidden flex flex-col mt-2 pt-2 border-t border-gray-50">
                                        <div className="flex items-center justify-between mb-2 shrink-0">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">History</span>
                                            {calcHistory.length > 0 && (
                                                <button onClick={() => setCalcHistory([])} className="text-[10px] text-red-400 hover:text-red-500 font-medium">Clear</button>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                            {calcHistory.length === 0 ? (
                                                <p className="text-[10px] text-gray-300 text-center py-2 italic">No recent calculations</p>
                                            ) : (
                                                calcHistory.map((entry, i) => (
                                                    <div key={i} className="text-[11px] font-mono text-right text-gray-500 py-1 border-b border-gray-50 last:border-0 hover:text-[#263238] transition-colors">
                                                        {entry}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AGE CALCULATOR - Compact View */}
                            {activeApp === 'age' && (
                                <div className="space-y-4">
                                    {/* AGE CALCULATOR - Combined View */}
                                    {!activeCardId ? (
                                        <div className="flex flex-col h-full space-y-6">
                                            {/* Single Calculator Section - Sticky Header */}
                                            <div className="sticky top-0 bg-white z-20 space-y-4 -mt-5 -mx-5 px-5 pt-5 pb-4 border-b border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                                                <CustomDatePicker date={dob} setDate={setDob} label="Date of Birth" />

                                                {ageResult && (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div className="bg-gray-50 rounded-xl py-3 text-center border border-gray-100">
                                                            <div className="text-lg font-bold text-[#4b33e8]">{ageResult.y}</div>
                                                            <div className="text-[8px] font-bold text-gray-400 uppercase">Years</div>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-xl py-3 text-center border border-gray-100">
                                                            <div className="text-lg font-bold text-[#4b33e8]">{ageResult.m}</div>
                                                            <div className="text-[8px] font-bold text-gray-400 uppercase">Months</div>
                                                        </div>
                                                        <div className="bg-gray-50 rounded-xl py-3 text-center border border-gray-100">
                                                            <div className="text-lg font-bold text-[#4b33e8]">{ageResult.d}</div>
                                                            <div className="text-[8px] font-bold text-gray-400 uppercase">Days</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Family List Section */}
                                            <div className="flex flex-col flex-1 min-h-0">
                                                 <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-[10px] font-bold  text-gray-400 uppercase tracking-widest">My Families</h3>
                                                    <button 
                                                        onClick={addFamilyCard}
                                                        className="w-6 h-6 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all  "
                                                    >
                                                        <i className="fi flex fi-rr-plus text-[10px]"></i>
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                                    {familyCards.length === 0 && (
                                                        <div className="py-6 text-center border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/50">
                                                            <p className="text-[9px] font-bold text-gray-300 uppercase">Create family card</p>
                                                        </div>
                                                    )}
                                                    {familyCards.map(card => (
                                                        <div 
                                                            key={card.id}
                                                            onClick={() => setActiveCardId(card.id)}
                                                            className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all   bg-white"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-[#263238] truncate">{card.name}</p>
                                                                <p className="text-[9px] text-gray-400 mt-0.5">
                                                                    {card.members.length} member{card.members.length !== 1 ? 's' : ''}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <i className="fi flex fi-rr-angle-small-right text-gray-300 group-hover:text-indigo-400 transition-colors"></i>
                                                                <button 
                                                                    onClick={(e) => deleteFamilyCard(card.id, e)}
                                                                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                                                                >
                                                                    <i className="fi flex fi-rr-trash text-[10px]"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                                                    {/* Card Header & Title Edit */}
                                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
                                                        <button 
                                                            onClick={() => setActiveCardId(null)}
                                                            className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold"
                                                        >
                                                            <i className="fi flex  fi-rr-angle-small-left text-lg"></i>
                                                        </button>
                                                        <input 
                                                            type="text" 
                                                            value={familyCards.find(c => c.id === activeCardId)?.name || ''}
                                                            onChange={(e) => updateCardName(e.target.value)}
                                                            className="flex-1 bg-transparent border-none text-xs font-bold text-[#263238] focus:ring-0 p-0 outline-none"
                                                            placeholder="Family Name"
                                                        />
                                                    </div>

                                                    {/* Summary Header */}
                                                    <div className="flex items-center gap-2 mb-4 bg-indigo-50 p-2 rounded-xl text-center justify-center border border-indigo-100">
                                                        <div className="text-center px-2">
                                                            <span className="block text-xl font-bold text-[#4b33e8]">
                                                                {familyCards.find(c => c.id === activeCardId)?.members.filter(m => m.type === 'Adult').length || 0}
                                                            </span>
                                                            <span className="text-[8px] font-bold  text-indigo-300 uppercase">Adults</span>
                                                        </div>
                                                        <div className="h-6 w-[1px] bg-indigo-200"></div>
                                                        <div className="text-center px-2">
                                                            <span className="block text-xl font-bold text-[#4b33e8]">
                                                                {familyCards.find(c => c.id === activeCardId)?.members.filter(m => m.type === 'Child').length || 0}
                                                            </span>
                                                            <span className="text-[8px] font-bold  text-indigo-300 uppercase">Children</span>
                                                        </div>
                                                    </div>

                                                    {/* Members List */}
                                                    <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar mb-4">
                                                        {familyCards.find(c => c.id === activeCardId)?.members.length === 0 && (
                                                            <div className="border-2 border-dashed border-gray-100 rounded-xl p-6 text-center">
                                                                <i className="fi flex fi-rr-users text-2xl text-gray-200 mb-2 flex justify-center"></i>
                                                                <p className="text-[10px] text-gray-400 font-bold">Add family members</p>
                                                            </div>
                                                        )}
                                                        {familyCards.find(c => c.id === activeCardId)?.members.map((member, index) => {
                                                            const age = calculateAge(member.dob);
                                                            return (
                                                                <div key={member.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100 animate-in slide-in-from-right-2 duration-300">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className={`text-[10px] font-bold  uppercase tracking-widest px-2 py-0.5 rounded-md ${member.type === 'Adult' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                                            {member.type}
                                                                        </span>
                                                                        <button onClick={() => deleteFamilyMember(member.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                                            <i className="fi flex fi-rr-trash text-xs"></i>
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex items-end gap-3">
                                                                        <div className="flex-1">
                                                                            <CustomDatePicker 
                                                                                date={member.dob} 
                                                                                setDate={(d) => updateMemberDob(member.id, d)} 
                                                                                placeholder="Birth Date"
                                                                            />
                                                                        </div>
                                                                        <div className="text-right w-16 mb-2">
                                                                            <span className="block text-lg font-bold text-[#263238] leading-none">
                                                                                {age ? age.y : '--'}
                                                                            </span>
                                                                            <span className="text-[8px] font-bold text-gray-400 uppercase">Years</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* Add Buttons */}
                                                    <div className="grid grid-cols-2 gap-2 mt-auto">
                                                        <button 
                                                            onClick={() => addFamilyMember('Adult')}
                                                            className="py-2.5 rounded-xl bg-[#4b33e8] text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2   shadow-indigo-100 active:scale-95"
                                                        >
                                                            <i className="fi flex fi-rr-user-add text-sm"></i> Add Adult
                                                        </button>
                                                        <button 
                                                            onClick={() => addFamilyMember('Child')}
                                                            className="py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                        >
                                                            <i className="fi flex fi-rr-child text-sm"></i> Add Child
                                                        </button>
                                                    </div>
                                                    </div>
                                            )}
                                        </div>
                            )}

                             {/* BMI CALCULATOR */}
                             {activeApp === 'bmi' && (
                                <div className="flex flex-col h-full">
                                    {!activeCardId ? (
                                        <div className="flex flex-col h-full space-y-6">
                                            {/* Single BMI Sticky Header */}
                                            <div className="sticky top-0 bg-white z-20 space-y-4 -mt-5 -mx-5 px-5 pt-5 pb-4 border-b border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
                                                <div className="flex gap-3">
                                                    <div className="flex-1 space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Height (cm)</label>
                                                        <input 
                                                            type="number" 
                                                            value={bmiHeight}
                                                            onChange={(e) => setBmiHeight(e.target.value)}
                                                            className="w-full bg-gray-50 border-gray-100 rounded-xl px-3 py-2.5 text-sm font-bold text-[#263238] focus:ring-indigo-100 focus:border-indigo-100 transition-all placeholder:text-gray-300"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Weight (kg)</label>
                                                        <input 
                                                            type="number" 
                                                            value={bmiWeight}
                                                            onChange={(e) => setBmiWeight(e.target.value)}
                                                            className="w-full bg-gray-50 border-gray-100 rounded-xl px-3 py-2.5 text-sm font-bold text-[#263238] focus:ring-indigo-100 focus:border-indigo-100 transition-all placeholder:text-gray-300"
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>

                                                {calculateBMI(bmiHeight, bmiWeight) && (
                                                    <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100 flex items-center justify-between">
                                                        <div className="text-left">
                                                            <div className="text-[8px] font-bold text-gray-400 uppercase">Your BMI</div>
                                                            <div className="text-2xl font-bold  text-[#4b33e8]">{calculateBMI(bmiHeight, bmiWeight)}</div>
                                                        </div>
                                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                                                            Number(calculateBMI(bmiHeight, bmiWeight)) < 18.5 ? 'bg-amber-100 text-amber-600' :
                                                            Number(calculateBMI(bmiHeight, bmiWeight)) < 25 ? 'bg-emerald-100 text-emerald-600' :
                                                            Number(calculateBMI(bmiHeight, bmiWeight)) < 30 ? 'bg-orange-100 text-orange-600' :
                                                            'bg-red-100 text-red-600'
                                                        }`}>
                                                            {Number(calculateBMI(bmiHeight, bmiWeight)) < 18.5 ? 'Underweight' :
                                                             Number(calculateBMI(bmiHeight, bmiWeight)) < 25 ? 'Normal' :
                                                             Number(calculateBMI(bmiHeight, bmiWeight)) < 30 ? 'Overweight' : 'Obese'}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Family List Section */}
                                            <div className="flex flex-col flex-1 min-h-0">
                                                 <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-[10px] font-bold  text-gray-400 uppercase tracking-widest">My Families</h3>
                                                    <button 
                                                        onClick={addFamilyCard}
                                                        className="w-6 h-6 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all  "
                                                    >
                                                        <i className="fi flex fi-rr-plus text-[10px]"></i>
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                                    {familyCards.length === 0 && (
                                                        <div className="py-6 text-center border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/50">
                                                            <p className="text-[9px] font-bold text-gray-300 uppercase">Create family card</p>
                                                        </div>
                                                    )}
                                                    {familyCards.map(card => (
                                                        <div 
                                                            key={card.id}
                                                            onClick={() => setActiveCardId(card.id)}
                                                            className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all   bg-white"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-[#263238] truncate">{card.name}</p>
                                                                <p className="text-[9px] text-gray-400 mt-0.5">
                                                                    {card.members.length} member{card.members.length !== 1 ? 's' : ''}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <i className="fi flex fi-rr-angle-small-right text-gray-300 group-hover:text-indigo-400 transition-colors"></i>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                                            {/* Card Header & Title Edit */}
                                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-50">
                                                <button 
                                                    onClick={() => setActiveCardId(null)}
                                                    className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold"
                                                >
                                                    <i className="fi flex  fi-rr-angle-small-left text-lg"></i>
                                                </button>
                                                <input 
                                                    type="text" 
                                                    value={familyCards.find(c => c.id === activeCardId)?.name || ''}
                                                    onChange={(e) => updateCardName(e.target.value)}
                                                    className="flex-1 bg-transparent border-none text-xs font-bold text-[#263238] focus:ring-0 p-0 outline-none"
                                                    placeholder="Family Name"
                                                />
                                            </div>

                                            {/* Members List for BMI */}
                                            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar mb-4">
                                                {familyCards.find(c => c.id === activeCardId)?.members.length === 0 && (
                                                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-6 text-center">
                                                        <i className="fi flex fi-rr-users text-2xl text-gray-200 mb-2 flex justify-center"></i>
                                                        <p className="text-[10px] text-gray-400 font-bold">Add family members</p>
                                                    </div>
                                                )}
                                                {familyCards.find(c => c.id === activeCardId)?.members.map((member, index) => {
                                                    const bmi = calculateBMI(member.height || '', member.weight || '');
                                                    return (
                                                        <div key={member.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100 animate-in slide-in-from-right-2 duration-300">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className={`text-[10px] font-bold  uppercase tracking-widest px-2 py-0.5 rounded-md ${member.type === 'Adult' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                                    {member.type}
                                                                </span>
                                                                <button onClick={() => deleteFamilyMember(member.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                                    <i className="fi flex fi-rr-trash text-xs"></i>
                                                                </button>
                                                            </div>
                                                            <div className="flex items-end gap-3 mb-2">
                                                                <div className="flex-1 space-y-1">
                                                                    <input 
                                                                        type="number"
                                                                        placeholder="Height (cm)"
                                                                        value={member.height || ''}
                                                                        onChange={(e) => updateMemberMetrics(member.id, 'height', e.target.value)}
                                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-[#263238] placeholder:text-gray-300 focus:border-indigo-300 focus:ring-0"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <input 
                                                                        type="number"
                                                                        placeholder="Weight (kg)"
                                                                        value={member.weight || ''}
                                                                        onChange={(e) => updateMemberMetrics(member.id, 'weight', e.target.value)}
                                                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-[#263238] placeholder:text-gray-300 focus:border-indigo-300 focus:ring-0"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {bmi && (
                                                                <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                                                                    <span className="text-[9px] font-bold text-gray-400 uppercase">BMI Result</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                                                            Number(bmi) < 18.5 ? 'bg-amber-50 text-amber-600' :
                                                                            Number(bmi) < 25 ? 'bg-emerald-50 text-emerald-600' :
                                                                            Number(bmi) < 30 ? 'bg-orange-50 text-orange-600' :
                                                                            'bg-red-50 text-red-600'
                                                                        }`}>
                                                                            {Number(bmi) < 18.5 ? 'Underweight' : Number(bmi) < 25 ? 'Normal' : Number(bmi) < 30 ? 'Overweight' : 'Obese'}
                                                                        </span>
                                                                        <span className="text-sm font-bold  text-[#263238]">{bmi}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {/* Add Buttons */}
                                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                                <button 
                                                    onClick={() => addFamilyMember('Adult')}
                                                    className="py-2.5 rounded-xl bg-[#4b33e8] text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2   shadow-indigo-100 active:scale-95"
                                                >
                                                    <i className="fi flex fi-rr-user-add text-sm"></i> Add Adult
                                                </button>
                                                <button 
                                                    onClick={() => addFamilyMember('Child')}
                                                    className="py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                >
                                                    <i className="fi flex fi-rr-child text-sm"></i> Add Child
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                             {/* ALARM APP */}
                             {activeApp === 'alarm' && (
                                <div className="flex flex-col h-full">
                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Reminder</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                                            <div className="space-y-1">
                                                <CustomTimePicker 
                                                    time={alarmTime}
                                                    setTime={setAlarmTime}
                                                    label="Time"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Message (Optional)</label>
                                                <input 
                                                    type="text" 
                                                    value={alarmMessage}
                                                    onChange={(e) => setAlarmMessage(e.target.value)}
                                                    placeholder="Wake up, meeting..."
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#263238] placeholder:text-gray-300 focus:ring-indigo-100 focus:border-indigo-300"
                                                />
                                            </div>
                                            <button 
                                                onClick={addAlarm}
                                                className="w-full bg-[#4b33e8] text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                                            >
                                                Set Alarm
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-h-0 flex flex-col">
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Active Alarms</h3>
                                        <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1">
                                            {alarms.length === 0 && (
                                                <div className="py-8 text-center border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/50">
                                                    <i className="flex fi fi-rr-bell-slash text-2xl text-gray-200 mb-2 justify-center"></i>
                                                    <p className="text-[9px] font-bold text-gray-300 uppercase">No alarms set</p>
                                                </div>
                                            )}
                                            {alarms.sort((a,b) => a.time.localeCompare(b.time)).map(alarm => (
                                                <div key={alarm.id} className="group bg-white border border-gray-100 p-3 rounded-xl flex items-center justify-between hover:border-indigo-100 transition-all shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${alarm.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-300'}`}>
                                                            <i className={`flex fi fi-rr-bell ${alarm.enabled ? 'animate-bounce' : ''}`}></i>
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-black ${alarm.enabled ? 'text-[#263238]' : 'text-gray-400'}`}>{alarm.time}</p>
                                                            <p className="text-[9px] text-gray-400 font-bold uppercase truncate max-w-[100px]">{alarm.message || 'Reminder'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => toggleAlarm(alarm.id)}
                                                            className={`w-8 h-5 rounded-full transition-all relative ${alarm.enabled ? 'bg-green-500' : 'bg-gray-200'}`}
                                                        >
                                                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${alarm.enabled ? 'left-4' : 'left-1'}`}></div>
                                                        </button>
                                                        <button 
                                                            onClick={() => deleteAlarm(alarm.id)}
                                                            className="w-7 h-7 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                                                        >
                                                            <i className="flex fi fi-rr-trash text-xs"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                             )}

                              {/* AI SALES BOT */}
                              {activeApp === 'ai' && (
                                <div className="flex flex-col h-full relative slide-in-right">
                                    {/* AI Header - Simplified & Integrated */}
                                    <div className="flex items-center justify-between mb-5 px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                <i className="fi flex fi-rr-brain text-[14px] animate-pulse"></i>
                                            </div>
                                            <div>
                                                <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">Sales Co-Pilot</h3>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Live Co-Pilot</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={clearChat}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-400 hover:bg-rose-50/50 transition-all active:scale-95"
                                                title="Clear History"
                                            >
                                                <i className="fi flex fi-rr-trash text-[13px]"></i>
                                            </button>
                                            <button 
                                                onClick={() => setShowAiSettings(true)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all active:scale-95"
                                                title="AI Settings"
                                            >
                                                <i className="fi flex fi-rr-settings text-[14px]"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Chat Display - Minimalistic Bubbles */}
                                    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-0.5 space-y-4 pb-3 overflow-x-hidden">
                                        {chatMessages.length === 0 && (
                                            <div className="py-10 text-center space-y-4">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto border border-slate-100/50">
                                                    <i className="fi flex fi-rr-comment-active text-2xl"></i>
                                                </div>
                                                <div className="px-6">
                                                    <p className="text-[12px] font-bold text-slate-600 mb-1.5">Ready to assist your sales journey</p>
                                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter leading-relaxed">Ask about call history, scripts, or plan details.</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2 justify-center px-4">
                                                    {["Closing Tips", "Follow-up Script", "Talktime Analysis", "Pitch Ideas"].map(tip => (
                                                        <button 
                                                            key={tip}
                                                            onClick={() => { setUserInput(tip); handleSendMessage(); }}
                                                            className="text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-white hover:border-slate-200 px-3 py-2 rounded-lg border border-transparent transition-all active:scale-95"
                                                        >
                                                            {tip}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {chatMessages.map((msg, idx) => (
                                            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
                                                <div className={`max-w-[88%] rounded-xl px-4 py-2.5 text-[12px] leading-relaxed transition-all break-words whitespace-pre-wrap ${
                                                    msg.role === 'user' 
                                                    ? 'bg-indigo-500 text-white rounded-tr-none shadow-sm font-medium' 
                                                    : 'bg-slate-50 border border-slate-100 text-slate-600 rounded-tl-none font-medium'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {isAiLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-slate-50 border border-slate-100 rounded-xl rounded-tl-none px-3.5 py-2.5 flex gap-1.5 items-center">
                                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                                                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-300"></div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Input Footer - Elegant & Slim */}
                                    <div className="pt-4 border-t border-slate-100 mt-auto bg-white/60 backdrop-blur-sm px-0.5">
                                        <div className="relative flex items-end gap-2 bg-slate-50/80 rounded-xl border border-slate-100 transition-all p-1.5">
                                            <textarea 
                                                value={userInput}
                                                onChange={(e) => setUserInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                                placeholder="Type a message..."
                                                className="flex-1 bg-transparent border-none rounded-lg px-2.5 py-2 text-[12px] font-medium text-slate-600 focus:ring-0 focus:outline-none outline-none resize-none min-h-[42px] max-h-[120px] placeholder:text-slate-300"
                                            />
                                            <button 
                                                onClick={handleSendMessage}
                                                disabled={isAiLoading || !userInput.trim()}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 mb-1 mr-1 ${
                                                    userInput.trim() ? 'bg-indigo-500 text-white shadow-md shadow-indigo-100' : 'bg-slate-100 text-slate-300'
                                                }`}
                                            >
                                                <i className="fi flex fi-rr-paper-plane text-[12px]"></i>
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-[0.2em] py-3">Intelligent Sales Shield</p>
                                    </div>

                                    {/* SETTINGS OVERLAY - Sophisticated Side-Panel */}
                                    {showAiSettings && (
                                        <div className="absolute inset-0 bg-white/98 z-[100] flex flex-col p-5 animate-in fade-in duration-300">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                                        <i className="fi flex fi-rr-shield-check text-indigo-400 text-sm"></i>
                                                    </div>
                                                    <h3 className="text-[12px] font-bold text-slate-700 uppercase tracking-widest">Core Configuration</h3>
                                                </div>
                                                <button onClick={() => setShowAiSettings(false)} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all">
                                                    <i className="fi flex fi-rr-cross-small text-slate-400 text-lg"></i>
                                                </button>
                                            </div>

                                            <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Behavior Instructions</label>
                                                    <textarea 
                                                        value={aiConfig.instructions}
                                                        onChange={(e) => setAiConfig({...aiConfig, instructions: e.target.value})}
                                                        placeholder="Ex: Act as a high-ticket sales coach..."
                                                        className="w-full bg-slate-50/50 border border-slate-100 rounded-lg p-3.5 text-[12px] font-medium text-slate-600 min-h-[120px] focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-200"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Contextual Knowledge</label>
                                                    <textarea 
                                                        value={aiConfig.knowledgeBase}
                                                        onChange={(e) => setAiConfig({...aiConfig, knowledgeBase: e.target.value})}
                                                        placeholder="Paste your PDF text or plan manuals here..."
                                                        className="w-full bg-slate-50/50 border border-slate-100 rounded-lg p-3.5 text-[12px] font-medium text-slate-600 min-h-[120px] focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-200"
                                                    />
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => setShowAiSettings(false)}
                                                className="w-full bg-slate-800 text-white py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest mt-6 hover:bg-slate-900 transition-all active:scale-95"
                                            >
                                                Apply Intelligence
                                            </button>
                                        </div>
                                    )}
                                </div>
                              )}

                        </div>

                        {/* ALARM TOAST / OVERLAY */}
                        {activeToast && typeof document !== 'undefined' && createPortal(
                             <div className="fixed top-8 right-8 z-[99999] animate-in fade-in slide-in-from-top-8 duration-500 pointer-events-auto">
                                 <div className="bg-[#001a3d] rounded-full pl-3 pr-4 py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 min-w-[300px] border border-white/5 backdrop-blur-md">
                                     {/* Left Icon Circle */}
                                     <div className="w-10 h-10 rounded-full bg-[#1e40af] flex items-center justify-center text-white shrink-0 shadow-inner">
                                         <i className="flex fi fi-rr-bell text-lg animate-pulse"></i>
                                     </div>
                                     
                                     {/* Middle Content */}
                                     <div className="flex-1 min-w-0 pr-2">
                                         <h4 className="text-white text-[11px] font-black leading-tight tracking-wide">Rynxly Alarm Active</h4>
                                         <p className="text-white/70 text-[10px] font-medium truncate">{activeToast.message || 'Time to wake up!'}</p>
                                     </div>

                                     {/* Right Dismiss Button */}
                                     <button 
                                        onClick={stopAlarm}
                                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90 shrink-0"
                                     >
                                         <i className="flex fi fi-rr-cross text-[10px]"></i>
                                     </button>
                                 </div>
                             </div>,
                             document.body
                         )}

                         {/* HIDDEN AUDIO ELEMENT */}
                         <audio 
                            ref={audioRef}
                            src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
                            loop
                         />

                        {/* Minimal Footer */}
                        <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                             <span>Rynxly Tools Suits</span>
                             <div className="w-1 h-1 rounded-full bg-green-400"></div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
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
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .animate-in { animation: fadeIn 0.3s ease-out; }
                .slide-in-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </>
    );
}
