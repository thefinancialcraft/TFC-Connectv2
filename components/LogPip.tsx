
import React, { useState, useEffect, useRef } from 'react';
import { globalLogger, LogEntry } from '../lib/logger';

export default function LogPip() {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [catFilter, setCatFilter] = useState('all');
    const [position, setPosition] = useState({ x: 20, y: 70 }); // Bottom right initial
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedState = localStorage.getItem('tfc_log_pip_open');
        if (savedState === 'true') setIsOpen(true);

        const savedPos = localStorage.getItem('tfc_log_pip_pos');
        if (savedPos) setPosition(JSON.parse(savedPos));

        setLogs(globalLogger.getLogs().slice(0, 100)); // Show more in PIP

        const handleNewLog = () => {
            setLogs(globalLogger.getLogs().slice(0, 100));
        };

        const handleToggle = (e: any) => {
            const newState = e.detail;
            setIsOpen(newState);
            localStorage.setItem('tfc_log_pip_open', String(newState));
        };

        window.addEventListener('tfc-new-log' as any, handleNewLog);
        window.addEventListener('tfc-toggle-log-pip' as any, handleToggle);

        return () => {
            window.removeEventListener('tfc-new-log' as any, handleNewLog);
            window.removeEventListener('tfc-toggle-log-pip' as any, handleToggle);
        };
    }, []);

    // Get unique categories for filtering
    const categories = Array.from(new Set(logs.map(l => l.category || 'Global')));

    const filteredLogs = logs.filter(l => catFilter === 'all' || (l.category || 'Global') === catFilter);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPosX: position.x,
            startPosY: position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dragRef.current) return;
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;
            
            // Screen boundaries
            const newX = Math.max(0, Math.min(window.innerWidth - 320, dragRef.current.startPosX + deltaX));
            const newY = Math.max(0, Math.min(window.innerHeight - 400, dragRef.current.startPosY + deltaY));
            
            const newPos = { x: newX, y: newY };
            setPosition(newPos);
        };

        const handleMouseUp = () => {
            if (isDragging) {
                localStorage.setItem('tfc_log_pip_pos', JSON.stringify(position));
            }
            setIsDragging(false);
            dragRef.current = null;
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, position]);

    if (!isOpen) return null;

    return (
        <div 
            ref={containerRef}
            style={{ 
                position: 'fixed', 
                left: `${position.x}px`, 
                top: `${position.y}px`,
                width: '320px',
                height: '400px',
                zIndex: 9999,
                cursor: isDragging ? 'grabbing' : 'auto'
            }}
            className="bg-[#0d1117] border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
            {/* Drag Handle Header */}
            <div 
                onMouseDown={handleMouseDown}
                className="bg-gray-800 p-2 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-gray-700"
            >
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Logs</span>
                </div>
                <button 
                    onClick={() => {
                        setIsOpen(false);
                        localStorage.setItem('tfc_log_pip_open', 'false');
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-gray-400"
                >
                    <i className="fi fi-rr-cross-small" />
                </button>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-y-auto p-2 font-mono text-[9px] space-y-1 bg-black/50">
                {filteredLogs.map((log) => (
                    <div key={log.id} className="flex gap-2">
                        <span className={`shrink-0 font-bold ${
                            log.level === 'error' ? 'text-red-500' :
                            log.level === 'warn' ? 'text-amber-500' :
                            log.level === 'info' ? 'text-blue-500' :
                            'text-gray-500'
                        }`}>
                            [{log.level[0].toUpperCase()}]
                        </span>
                        <span className="text-[8px] text-gray-600 font-bold shrink-0">
                            {(!log.category || log.category === '/') ? 'HOME' : (log.category.split('/').pop()?.toUpperCase() || 'GLOBAL')}
                        </span>
                        <span className="text-gray-400 break-all">{log.message.substring(0, 150)}{log.message.length > 150 ? '...' : ''}</span>
                    </div>
                ))}
            </div>

            {/* PIP Footer */}
            <div className="p-1 px-2 border-t border-gray-800 bg-gray-900 flex justify-between items-center gap-2">
                <select 
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    className="flex-1 bg-transparent border-none text-[8px] text-gray-400 font-bold outline-none uppercase cursor-pointer"
                >
                    <option value="all" className="bg-gray-900">ALL PAGES</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-gray-900">
                            {(cat === '/' ? 'HOME' : cat.split('/').pop()?.toUpperCase()) || 'GLOBAL'}
                        </option>
                    ))}
                </select>
                <div className="flex gap-2 items-center">
                    <button 
                        onClick={() => globalLogger.clearLogs()}
                        className="text-[8px] text-red-500 font-bold hover:underline"
                    >
                        CLEAR
                    </button>
                </div>
            </div>
        </div>
    );
}
