
import React, { useState, useEffect, useRef } from 'react';
import { globalLogger, LogEntry } from '../../lib/logger';

export default function ConsoleLogsTab() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filter, setFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState<'all' | 'error' | 'warn' | 'info'>('all');
    const [catFilter, setCatFilter] = useState('all');

    useEffect(() => {
        setLogs(globalLogger.getLogs());

        const handleNewLog = () => {
            setLogs(globalLogger.getLogs());
        };

        const handleCleared = () => {
            setLogs([]);
        };

        window.addEventListener('tfc-new-log' as any, handleNewLog);
        window.addEventListener('tfc-logs-cleared' as any, handleCleared);

        return () => {
            window.removeEventListener('tfc-new-log' as any, handleNewLog);
            window.removeEventListener('tfc-logs-cleared' as any, handleCleared);
        };
    }, []);

    const categories = Array.from(new Set(logs.map(l => l.category || 'Global')));

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(filter.toLowerCase());
        const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
        const matchesCat = catFilter === 'all' || (log.category || 'Global') === catFilter;
        return matchesSearch && matchesLevel && matchesCat;
    });

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'error': return 'text-red-500 bg-red-50 border-red-100';
            case 'warn': return 'text-amber-500 bg-amber-50 border-amber-100';
            case 'info': return 'text-blue-500 bg-blue-50 border-blue-100';
            default: return 'text-gray-500 bg-gray-50 border-gray-100';
        }
    };

    const copyToClipboard = () => {
        const text = logs.map(l => `[${l.timestamp}] ${l.level.toUpperCase()}: ${l.message}`).join('\n');
        navigator.clipboard.writeText(text);
        alert('Logs copied to clipboard');
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4b33e8]/20 outline-none transition-all"
                        />
                    </div>
                    <select 
                        value={levelFilter}
                        onChange={(e) => setLevelFilter(e.target.value as any)}
                        className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none cursor-pointer"
                    >
                        <option value="all">Levels</option>
                        <option value="error">Errors</option>
                        <option value="warn">Warnings</option>
                        <option value="info">Info</option>
                    </select>
                    <select 
                        value={catFilter}
                        onChange={(e) => setCatFilter(e.target.value)}
                        className="h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none cursor-pointer max-w-[150px]"
                    >
                        <option value="all">All Pages</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {(cat === '/' ? 'Home' : cat.split('/').pop()) || 'Global'}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => {
                            const current = localStorage.getItem('tfc_log_pip_open') === 'true';
                            window.dispatchEvent(new CustomEvent('tfc-toggle-log-pip', { detail: !current }));
                        }}
                        className="p-2.5 bg-white border rounded-lg text-gray-500 hover:text-[#4b33e8] transition-all"
                        title="Floating Logs (PIP)"
                    >
                        <i className="fi fi-rr-expand flex text-xs" />
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className="p-2.5 bg-white border rounded-lg text-gray-500 hover:text-[#4b33e8] transition-all"
                        title="Copy all logs"
                    >
                        <i className="fi fi-rr-copy flex text-xs" />
                    </button>
                    <button 
                        onClick={() => globalLogger.clearLogs()}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-100 hover:bg-red-100 transition-all"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Log Display */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[11px] bg-[#0d1117]">
                {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                        <div key={log.id} className="flex gap-3 group animate-in slide-in-from-left duration-200">
                            <span className="text-gray-500 shrink-0 w-32">
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                <span className="text-[9px] opacity-50 ml-1">.{new Date(log.timestamp).getMilliseconds()}</span>
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 h-fit ${
                                log.level === 'error' ? 'bg-red-500/20 text-red-400' :
                                log.level === 'warn' ? 'bg-amber-500/20 text-amber-400' :
                                log.level === 'info' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-gray-500/20 text-gray-400'
                            }`}>
                                {log.level}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-gray-600/30 text-gray-400 rounded font-bold shrink-0 h-fit uppercase">
                                {(!log.category || log.category === '/') ? 'Home' : (log.category.split('/').pop() || 'Global')}
                            </span>
                            <span className={`break-all whitespace-pre-wrap leading-relaxed ${
                                log.level === 'error' ? 'text-red-300' :
                                log.level === 'warn' ? 'text-amber-200' :
                                log.level === 'info' ? 'text-blue-200' :
                                'text-gray-300'
                            }`}>
                                {log.message}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                        <i className="fi fi-rr-list text-2xl opacity-20" />
                        <p className="italic uppercase tracking-widest text-[10px]">No logs to display</p>
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium">
                    Total: {logs.length} logs | Shown: {filteredLogs.length}
                </span>
                <span className="text-[10px] text-gray-400 italic">
                    Persisting in LocalStorage
                </span>
            </div>
        </div>
    );
}
