import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";

type UtilityApp = 'notes' | 'todo' | 'calendar' | 'calculator' | 'age';

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

export default function UtilitySidebar() {
    const router = useRouter();
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [activeApp, setActiveApp] = useState<UtilityApp>('notes');
    
    // --- APP STATES ---
    const [notesList, setNotesList] = useState<{id: number, title: string, content: string}[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
    const [todoProjects, setTodoProjects] = useState<{id: number, title: string, tasks: {id: number, text: string, completed: boolean}[]}[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
    const [newTask, setNewTask] = useState('');
    const [calcDisplay, setCalcDisplay] = useState('0');
    const [calcPrev, setCalcPrev] = useState<string | null>(null);
    const [calcOp, setCalcOp] = useState<string | null>(null);
    const [dob, setDob] = useState('');
    const [ageResult, setAgeResult] = useState<{y: number, m: number, d: number} | null>(null);
    const [calDate, setCalDate] = useState(new Date());
    const [calEvents, setCalEvents] = useState<{id: number, date: string, title: string}[]>([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
    const [isSyncing, setIsSyncing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [googleHolidays, setGoogleHolidays] = useState<Record<string, any[]>>({});

    // --- DRAG STATE ---
    const [posY, setPosY] = useState(50); // percentage from top
    const [isDragging, setIsDragging] = useState(false);
    const dragStarted = useRef(false);
    const startY = useRef(0);
    const startPosY = useRef(50);

    // Load states from localStorage
    useEffect(() => {
        // ... Notes loading logic ...
        const savedNotes = localStorage.getItem('tfc_util_notes_v2');
        const lastActiveNoteId = localStorage.getItem('tfc_util_active_note');
        if (savedNotes) {
            const parsed = JSON.parse(savedNotes);
            setNotesList(parsed);
            if (lastActiveNoteId) setActiveNoteId(Number(lastActiveNoteId));
            else if (parsed.length > 0) setActiveNoteId(parsed[0].id);
        } else {
            const firstNote = { id: Date.now(), title: 'Draft Note', content: '' };
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
    }, []);

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

    // --- NOTES HANDLERS ---
    const addNote = () => {
        const newNote = { id: Date.now(), title: `Note ${notesList.length + 1}`, content: '' };
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
        if (val === '=') {
            if (!calcPrev || !calcOp) return;
            const prev = parseFloat(calcPrev);
            const curr = parseFloat(calcDisplay);
            let res = 0;
            if (calcOp === '+') res = prev + curr;
            if (calcOp === '-') res = prev - curr;
            if (calcOp === '*') res = prev * curr;
            if (calcOp === '/') res = prev / curr;
            setCalcDisplay(String(res));
            setCalcPrev(null);
            setCalcOp(null);
            return;
        }
        if (val === 'C') {
            setCalcDisplay('0');
            setCalcPrev(null);
            setCalcOp(null);
            return;
        }
        setCalcDisplay(calcDisplay === '0' ? val : calcDisplay + val);
    };

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
        if (!dob) return;
        const birth = new Date(dob);
        const now = new Date();
        let y = now.getFullYear() - birth.getFullYear();
        let m = now.getMonth() - birth.getMonth();
        let d = now.getDate() - birth.getDate();
        if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (m < 0) { y--; m += 12; }
        setAgeResult({ y, m, d });
    }, [dob]);

    const apps = [
        { id: 'notes', icon: 'fi-rr-note', label: 'Notes' },
        { id: 'todo', icon: 'fi-rr-list-check', label: 'Tasks' },
        { id: 'calendar', icon: 'fi-rr-calendar', label: 'Calendar' },
        { id: 'calculator', icon: 'fi-rr-calculator', label: 'Calc' },
        { id: 'age', icon: 'fi-rr-user-time', label: 'Age' },
    ];

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
                className={`fixed right-0 z-[100] bg-white border border-gray-200 text-[#4b33e8] w-6 h-12 rounded-l-xl shadow-sm transition-all duration-300 flex flex-col items-center justify-center hover:bg-indigo-50 active:scale-95 ${isOpen ? 'translate-x-full' : ''}`}
                style={{ top: `${posY}%`, transform: posY !== 50 || isOpen ? 'translateY(-50%)' : 'translateY(-50%)', transition: isDragging ? 'none' : 'all 0.3s' }}
            >
                <i className="fi fi-rr-angle-small-left text-xs"></i>
            </button>

            {/* Sidebar Drawer */}
            <div className={`fixed inset-0 z-[1000] transition-all duration-500 pointer-events-none ${isOpen ? 'visible' : 'invisible'}`}>
                {/* Minimal Backdrop */}
                <div 
                    onClick={() => setIsOpen(false)}
                    className={`absolute inset-0 bg-black/10 transition-opacity duration-500 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                ></div>

                {/* Compact Content Panel */}
                <div className={`absolute right-0 top-0 h-full w-[320px] bg-white shadow-xl transition-transform duration-400 pointer-events-auto border-l border-gray-100 flex ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    
                    {/* Thin App Bar */}
                    <div className="w-[60px] bg-gray-50 border-r border-gray-100 flex flex-col items-center py-4 gap-4">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 transition-colors mb-2"
                        >
                            <i className="fi fi-rr-cross-small text-lg"></i>
                        </button>
                        
                        {apps.map(app => (
                            <button 
                                key={app.id}
                                onClick={() => setActiveApp(app.id as UtilityApp)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeApp === app.id ? 'bg-[#4b33e8] text-white shadow-md shadow-indigo-100' : 'text-gray-400 hover:text-[#4b33e8] hover:bg-white'}`}
                                title={app.label}
                            >
                                <i className={`fi ${app.icon} text-base flex`}></i>
                            </button>
                        ))}
                    </div>

                    {/* App Content */}
                    <div className="flex-1 flex flex-col h-full bg-white relative">
                        {/* Elegant Header */}
                        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-[#263238] tracking-tight uppercase" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">My Drafts</h3>
                                                <button 
                                                    onClick={addNote}
                                                    className="w-7 h-7 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm"
                                                >
                                                    <i className="fi fi-rr-plus text-[10px]"></i>
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
                                                        className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all shadow-sm bg-white"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-bold text-[#263238] truncate">{note.title}</p>
                                                            <p className="text-[9px] text-gray-400 truncate mt-0.5">{note.content || 'No content yet...'}</p>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => deleteNote(note.id, e)}
                                                            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                                                        >
                                                            <i className="fi fi-rr-trash text-[10px]"></i>
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
                                            <textarea 
                                                autoFocus
                                                value={notesList.find(n => n.id === activeNoteId)?.content || ''}
                                                onChange={(e) => updateNoteContent(e.target.value)}
                                                className="flex-1 w-full border-none focus:ring-0 outline-none text-sm text-[#263238] p-0 rounded-none leading-relaxed resize-none bg-transparent"
                                                style={{ fontFamily: "'Roboto', sans-serif" }}
                                                placeholder="Write your note here..."
                                            ></textarea>
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
                                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Lists</h3>
                                                <button 
                                                    onClick={addTodoProject}
                                                    className="w-7 h-7 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm"
                                                >
                                                    <i className="fi fi-rr-plus text-[10px]"></i>
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {todoProjects.map(proj => (
                                                    <div 
                                                        key={proj.id}
                                                        onClick={() => setActiveProjectId(proj.id)}
                                                        className="group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all shadow-sm bg-white"
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
                                                                <i className="fi fi-rr-trash text-[10px]"></i>
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
                                                    <i className="fi flex fi-rr-angle-small-left text-lg"></i>
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
                                                <button onClick={addTask} className="text-[#4b33e8] hover:scale-110 transition-transform"><i className="fi fi-rr-plus-small text-xl flex"></i></button>
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
                                                        <button onClick={() => deleteTask(t.id)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400"><i className="fi fi-rr-cross-small text-base"></i></button>
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
                                            <i className="fi flex fi-rr-angle-small-left text-lg"></i>
                                        </button>
                                        <p className="text-xs font-bold text-[#263238] uppercase tracking-wider">
                                            {calDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </p>
                                        <button 
                                            onClick={() => changeMonth(1)}
                                            className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold"
                                        >
                                            <i className="fi flex fi-rr-angle-small-right text-lg"></i>
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
                                            <button onClick={addEvent} className="text-[#4b33e8] w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-all"><i className="fi fi-rr-plus-small text-xl flex"></i></button>
                                        </div>

                                        <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                                            {/* Connect Prompt if Not Connected */}
                                            {(!user?.googleCalendarConnected) && (
                                                <div 
                                                    onClick={() => router.push('/settings')}
                                                    className="bg-indigo-50 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-all group border border-indigo-100 mb-2"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                                                            <i className="fi fi-brands-google text-[10px] flex"></i>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-indigo-700">Connect Google Calendar</span>
                                                    </div>
                                                    <i className="fi fi-rr-angle-small-right text-indigo-400 group-hover:text-indigo-600 flex"></i>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between mt-2">
                                                <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Google Calendar Holidays</h3>
                                                <button 
                                                    onClick={handleSync}
                                                    disabled={isSyncing}
                                                    className={`text-[8px] font-bold flex items-center gap-1 transition-all ${isSyncing ? 'text-indigo-400' : 'text-green-500 hover:text-green-600'}`}
                                                >
                                                    <i className={`fi fi-rr-refresh text-[10px] ${isSyncing ? 'animate-spin' : ''}`}></i> 
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
                                                                    <i className="fi fi-rr-cross-small text-base"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                        {(item.isGoogle && (item.description || item.location)) && (
                                                            <div className="mt-1 pl-7 space-y-0.5">
                                                                {item.location && <p className="text-[9px] text-gray-400 flex items-center gap-1"><i className="fi fi-rr-marker"></i> {item.location}</p>}
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
                                <div className="space-y-3">
                                    <div className="bg-gray-50 rounded-xl p-4 text-right mb-4">
                                        <div className="text-[10px] text-gray-400 font-mono h-4">{calcPrev} {calcOp}</div>
                                        <div className="text-2xl text-[#263238] font-mono font-bold truncate">{calcDisplay}</div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
                                            <button 
                                                key={btn}
                                                onClick={() => handleCalcInput(btn)}
                                                className={`h-11 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                                                    btn === '=' ? 'bg-[#4b33e8] text-white shadow-sm' : 
                                                    ['/','*','-','+','C'].includes(btn) ? 'bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                            >
                                                {btn}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* AGE CALCULATOR - Compact View */}
                            {activeApp === 'age' && (
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                        <input 
                                            type="date" 
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-[#263238]"
                                        />
                                    </div>
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
                            )}

                        </div>

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
            `}</style>
        </>
    );
}
