
import React, { useState, useEffect, useRef } from 'react';
import { globalLogger, LogEntry } from '../lib/logger';
import { globalBridgeLogger, BridgeLogEntry } from '../lib/bridgeLogger';

export default function LogPip() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'system' | 'bridge'>('system');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [bridgeLogs, setBridgeLogs] = useState<BridgeLogEntry[]>([]);
    const [catFilter, setCatFilter] = useState('all');
    const [position, setPosition] = useState({ x: 20, y: 70 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedState = localStorage.getItem('tfc_log_pip_open');
        if (savedState === 'true') setIsOpen(true);

        const savedPos = localStorage.getItem('tfc_log_pip_pos');
        if (savedPos) setPosition(JSON.parse(savedPos));

        const savedTab = localStorage.getItem('tfc_log_pip_tab');
        if (savedTab === 'bridge' || savedTab === 'system') setActiveTab(savedTab as any);

        setLogs(globalLogger.getLogs().slice(0, 100));
        setBridgeLogs(globalBridgeLogger.getLogs().slice(0, 100));

        const handleNewLog = () => {
          requestAnimationFrame(() => {
            setLogs(globalLogger.getLogs().slice(0, 100));
          });
        };

        const handleNewBridgeLog = () => {
          requestAnimationFrame(() => {
            setBridgeLogs(globalBridgeLogger.getLogs().slice(0, 100));
          });
        };

        const handleCleared = () => {
          requestAnimationFrame(() => {
            setLogs([]);
          });
        };

        const handleBridgeCleared = () => {
          requestAnimationFrame(() => {
            setBridgeLogs([]);
          });
        };


        const handleToggle = (e: any) => {
            const newState = e.detail;
            setIsOpen(newState);
            localStorage.setItem('tfc_log_pip_open', String(newState));
        };

        window.addEventListener('tfc-new-log' as any, handleNewLog);
        window.addEventListener('tfc-new-bridge-log' as any, handleNewBridgeLog);
        window.addEventListener('tfc-logs-cleared' as any, handleCleared);
        window.addEventListener('tfc-bridge-logs-cleared' as any, handleBridgeCleared);
        window.addEventListener('tfc-toggle-log-pip' as any, handleToggle);

        return () => {
            window.removeEventListener('tfc-new-log' as any, handleNewLog);
            window.removeEventListener('tfc-new-bridge-log' as any, handleNewBridgeLog);
            window.removeEventListener('tfc-logs-cleared' as any, handleCleared);
            window.removeEventListener('tfc-bridge-logs-cleared' as any, handleBridgeCleared);
            window.removeEventListener('tfc-toggle-log-pip' as any, handleToggle);
        };
    }, []);

    // Save tab preference
    useEffect(() => {
        localStorage.setItem('tfc_log_pip_tab', activeTab);
    }, [activeTab]);

    // Get unique categories for system logs filtering
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
            const newX = Math.max(0, Math.min(window.innerWidth - 320, dragRef.current.startPosX + deltaX));
            const newY = Math.max(0, Math.min(window.innerHeight - 400, dragRef.current.startPosY + deltaY));
            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            if (isDragging) localStorage.setItem('tfc_log_pip_pos', JSON.stringify(position));
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
                position: 'fixed', left: `${position.x}px`, top: `${position.y}px`,
                width: '320px', height: '400px', zIndex: 9999,
                cursor: isDragging ? 'grabbing' : 'auto'
            }}
            className="bg-[#0d1117] border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
            {/* Header with Tabs */}
            <div className="bg-gray-800 border-b border-gray-700 flex flex-col">
                <div className="p-2 flex items-center justify-between cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown}>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Debug Console</span>
                    </div>
                    <button 
                        onClick={() => { setIsOpen(false); localStorage.setItem('tfc_log_pip_open', 'false'); }}
                        className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-gray-400"
                    >
                        <i className="fi fi-rr-cross-small" />
                    </button>
                </div>
                
                <div className="flex border-t border-gray-700/50">
                    <button 
                        onClick={() => setActiveTab('system')}
                        className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'system' ? 'text-[#4b33e8] bg-white/5 border-b-2 border-[#4b33e8]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        System Logs
                    </button>
                    <button 
                        onClick={() => setActiveTab('bridge')}
                        className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'bridge' ? 'text-[#4b33e8] bg-white/5 border-b-2 border-[#4b33e8]' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Bridge Logs
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-2 bg-black/50">
                <div className="min-w-full inline-block font-mono text-[9px] space-y-1">
                    {activeTab === 'system' ? (
                        filteredLogs.map((log) => (
                            <div key={log.id} className="flex gap-2 hover:bg-white/5 p-0.5 rounded group">
                                <span className={`shrink-0 font-bold ${
                                    log.level === 'error' ? 'text-red-500' :
                                    log.level === 'warn' ? 'text-amber-500' :
                                    log.level === 'info' ? 'text-blue-500' : 'text-gray-500'
                                }`}>
                                    [{log.level[0].toUpperCase()}]
                                </span>
                                <span className="text-[8px] text-gray-600 font-bold shrink-0">
                                    {(!log.category || log.category === '/') ? 'HOME' : (log.category.split('/').pop()?.toUpperCase() || 'GLOBAL')}
                                </span>
                                <span className="text-gray-400 whitespace-pre-wrap">{log.message}</span>
                            </div>
                        ))
                    ) : (
                        bridgeLogs.map((msg) => (
                            <div key={msg.id} className="flex flex-col gap-1 border-b border-white/5 pb-1 mb-1 last:border-0">
                                <div className="flex items-center gap-2">
                                    <span className={`px-1 rounded-[2px] text-[7px] font-black uppercase ${msg.direction === 'out' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {msg.direction === 'out' ? 'OUT' : 'IN'}
                                    </span>
                                    <span className="text-white font-black uppercase text-[8px] truncate">{msg.type}</span>
                                    <span className="text-[7px] text-gray-600 ml-auto">{new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                </div>
                                <div className="text-[8px] text-gray-400 bg-white/5 p-1 rounded overflow-x-auto whitespace-pre font-mono">
                                    {typeof msg.payload === 'object' ? JSON.stringify(msg.payload) : String(msg.payload)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-1 px-2 border-t border-gray-800 bg-gray-900 flex justify-between items-center gap-2">
                {activeTab === 'system' ? (
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
                ) : (
                    <div className="flex-1 text-[8px] text-gray-600 font-bold uppercase">
                        {bridgeLogs.length} MESSAGES
                    </div>
                )}
                
                <div className="flex gap-2 items-center">
                    <button 
                        onClick={() => {
                            const data = activeTab === 'system' ? logs : bridgeLogs;
                            const text = data.map(l => 
                                activeTab === 'system' 
                                ? `[${new Date((l as LogEntry).timestamp).toLocaleString()}] [${(l as LogEntry).level.toUpperCase()}] [${(l as LogEntry).category}] ${(l as LogEntry).message}`
                                : `[${new Date((l as BridgeLogEntry).timestamp).toLocaleString()}] [${(l as BridgeLogEntry).direction.toUpperCase()}] [${(l as BridgeLogEntry).type}] ${JSON.stringify((l as BridgeLogEntry).payload)}`
                            ).join('\n');
                            const blob = new Blob([text], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `tfc_pip_${activeTab}_logs_${new Date().getTime()}.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="text-[8px] text-blue-500 font-black hover:underline uppercase"
                    >
                        DL
                    </button>
                    <button 
                        onClick={() => activeTab === 'system' ? globalLogger.clearLogs() : globalBridgeLogger.clearLogs()}
                        className="text-[8px] text-red-500 font-black hover:underline uppercase"
                    >
                        CLEAR
                    </button>
                </div>
            </div>
        </div>
    );
}
