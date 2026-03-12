import { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/components/AppLayout';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function SentinelDashboard() {
    const { user, mounted: userLoaded } = useUser();
    const [logs, setLogs] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'error' | 'connecting'>('connecting');

    const isAuthorized = useMemo(() => {
        return userLoaded && user && !user.isClient;
    }, [user, userLoaded]);

    useEffect(() => {
        if (!isAuthorized) return;
        fetchInitialData();
        setupRealtime();
        const interval = setInterval(fetchStats, 30000);
        return () => {
            clearInterval(interval);
            supabase.removeAllChannels();
        };
    }, [isAuthorized]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const { data: logsData } = await supabase
                .from('system_monitoring_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);
            setLogs(logsData || []);
            await fetchStats();
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        const { data, error } = await supabase.rpc('get_monitoring_stats');
        if (!error) setStats(data);
    };

    const setupRealtime = () => {
        supabase.channel('sentinel-logs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_monitoring_logs' }, (payload) => {
                setLogs(prev => [payload.new, ...prev].slice(0, 50));
                fetchStats();
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') setRealtimeStatus('connected');
                else setRealtimeStatus('connecting');
            });
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0 || !bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    if (!userLoaded || (userLoaded && !isAuthorized)) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center p-12 bg-white border border-slate-200 shadow-sm max-w-md font-mono uppercase">
                    <h1 className="text-xl font-bold text-red-600 mb-2">ACCESS_DENIED_SENTINEL_ALPHA</h1>
                    <p className="text-slate-500 text-xs">Unauthorized Access Detected. Restricted to Internal Staff.</p>
                </div>
            </div>
        );
    }

    const health = stats?.health_matrix || {};

    return (
        <div className="min-h-screen bg-[#ffffff] p-1 font-mono text-[11px] leading-tight text-slate-800 uppercase overflow-hidden">
            <Head>
                <title>SENTINEL-ALPHA-01 | SCADA</title>
            </Head>

            {/* Top Status Bar (Dense) */}
            <div className="flex items-center justify-between bg-slate-100 border border-slate-300 p-2 mb-1 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="font-black text-slate-500 tracking-tighter text-xs">SENTINEL-ALPHA-01 SCADA_CORE</span>
                        <button 
                            onClick={fetchInitialData}
                            className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 transition-colors text-[9px] font-black text-indigo-600 shadow-sm"
                        >
                            <span className="text-[10px]">↻</span>
                            <span>REFRESH_STATE</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-4 border-l border-slate-300 pl-4">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            <span className="font-bold">SYSTEM_UP</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-600">
                            <span className={`w-2 h-2 rounded-full ${realtimeStatus === 'connected' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse' : 'bg-amber-500'}`}></span>
                            <span className="font-bold">LIVE_FEED</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-amber-600/10 text-amber-600 px-3 py-1 border border-amber-200 font-bold flex items-center gap-2">
                        <span className="animate-pulse">●</span>
                        <span>TRAFFIC MONITOR ACTIVE</span>
                    </div>
                    <span className="text-slate-400 font-bold tabular-nums">{new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</span>
                </div>
            </div>

            {/* Matrix Grid: 3-Column Technical Layout */}
            <div className="grid grid-cols-3 gap-1 h-[calc(100vh-60px)]">
                
                {/* Column 1: System Health & User Activity */}
                <div className="flex flex-col gap-1">
                    {/* Health Matrix */}
                    <div className="border border-slate-300 flex flex-col h-1/2 bg-white">
                        <div className="bg-slate-50 border-b border-slate-300 px-3 py-1.5 font-black text-slate-500 flex justify-between">
                            <span>SYSTEM HEALTH MATRIX</span>
                            <span className="text-emerald-500">NOMINAL</span>
                        </div>
                        <div className="grid grid-cols-2 grid-rows-3 flex-grow divide-x divide-y divide-slate-100">
                            {[
                                { label: 'DB_STATUS', val: health.db_status === 'NOMINAL' ? '99' : '0', unit: '%', color: 'text-emerald-500' },
                                { label: 'LATENCY', val: health.avg_latency || '45', unit: 'ms', color: 'text-amber-500' },
                                { label: 'WRITE_OPS', val: health.write_ops || '0', unit: 'H', color: 'text-blue-500' },
                                { label: 'READ_OPS', val: health.read_ops || '0', unit: 'H', color: 'text-emerald-500' },
                                { label: 'AUTH_FLOW', val: health.auth_hits || '0', unit: 'H', color: 'text-indigo-500' },
                                { label: 'ERRORS', val: health.error_count || '0', unit: 'LOG', color: health.error_count > 0 ? 'text-red-500' : 'text-slate-300' },
                            ].map((item, i) => (
                                <div key={i} className="p-3 flex flex-col justify-center">
                                    <span className="text-[8px] font-bold text-slate-400 mb-1">{item.label}</span>
                                    <div className="flex items-baseline gap-0.5">
                                        <span className={`text-2xl font-black ${item.color} leading-none tabular-nums`}>{item.val}</span>
                                        <span className={`text-[8px] font-bold ${item.color} opacity-60`}>{item.unit}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* NEW: User Traffic Matrix */}
                    <div className="border border-slate-300 flex flex-col h-1/2 bg-white overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-300 px-3 py-1.5 font-black text-slate-500 flex justify-between">
                            <span>USER TRAFFIC MATRIX</span>
                            <span className="text-slate-400">OPERATORS: {(stats?.user_breakdown || []).length}</span>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                                    <tr className="text-[8px] font-black text-slate-400 uppercase border-b border-slate-200">
                                        <th className="px-3 py-2">OPERATOR_ID</th>
                                        <th className="px-3 py-2 text-center">API_HITS</th>
                                        <th className="px-3 py-2 text-right">THROUGHPUT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(stats?.user_breakdown || []).map((u: any, i: number) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="px-3 py-1.5 font-black text-slate-700 truncate max-w-[120px] lowercase">{u.user_name}</td>
                                            <td className="px-3 py-1.5 text-center">
                                                <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 border border-indigo-100 font-black">{u.hits}</span>
                                            </td>
                                            <td className="px-3 py-1.5 text-right font-bold text-slate-500">{formatBytes(u.total_data)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Column 2: Telemetry Graphs & API Endpoints */}
                <div className="flex flex-col gap-1">
                    {/* Telemetry Graphs */}
                    <div className="border border-slate-300 flex flex-col h-1/2 bg-white">
                        <div className="bg-slate-50 border-b border-slate-300 px-3 py-1.5 font-black text-slate-500">
                            DATA FLOW TELEMETRY
                        </div>
                        <div className="grid grid-cols-1 grid-rows-2 flex-grow divide-y divide-slate-100">
                            {[
                                { label: 'INGRESS_STREAM', dataKey: 'payload_size', color: '#10b981' },
                                { label: 'EGRESS_REPLY', dataKey: 'response_size', color: '#3b82f6' }
                            ].map((chart, i) => (
                                <div key={i} className="p-2 flex flex-col">
                                    <div className="flex justify-between text-[8px] font-bold text-slate-400 mb-1">
                                        <span>{chart.label}</span>
                                        <span className="text-slate-600">LIVE_DATA</span>
                                    </div>
                                    <div className="flex-grow">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={logs.slice(0, 30).reverse()}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="created_at" hide />
                                                <YAxis hide />
                                                <Line type="monotone" dataKey={chart.dataKey} stroke={chart.color} strokeWidth={2} dot={false} isAnimationActive={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* API Endpoint Telemetry */}
                    <div className="border border-slate-300 flex flex-col h-1/2 bg-white overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-300 px-3 py-1.5 font-black text-slate-500 flex justify-between">
                            <span>API ENDPOINT TELEMETRY</span>
                            <span className="text-indigo-500">ACTIVE_ROUTES</span>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                                    <tr className="text-[8px] font-black text-slate-400 uppercase border-b border-slate-200">
                                        <th className="px-3 py-2">ROUTE</th>
                                        <th className="px-3 py-2 text-center">HITS</th>
                                        <th className="px-3 py-2 text-right">LOAD</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(stats?.api_breakdown || []).map((api: any, i: number) => (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-3 py-1.5 font-bold text-slate-600 truncate max-w-[150px] lowercase">{api.api_path}</td>
                                            <td className="px-3 py-1.5 text-center font-black text-slate-800">{api.hits}</td>
                                            <td className="px-3 py-1.5 text-right font-bold text-emerald-500">{formatBytes(api.ingress + api.egress)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Column 3: Live Feed (Full Height Alarm Console) */}
                <div className="border border-slate-300 flex flex-col bg-white overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-300 px-3 py-1.5 font-black text-slate-500 flex justify-between">
                        <span>ALARM CONSOLE / LIVE FEED</span>
                        <div className="flex gap-4 text-[9px]">
                            <span className="text-amber-600 font-black">W: {health.write_ops}</span>
                            <span className="text-indigo-600 font-black">R: {health.read_ops}</span>
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                                <tr className="text-[8px] font-black text-slate-400 uppercase border-b border-slate-200">
                                    <th className="px-3 py-2 w-8">SVR</th>
                                    <th className="px-3 py-2">TIMESTAMP</th>
                                    <th className="px-3 py-2">EVENT_DESCRIPTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${log.event_type === 'WRITE' ? 'bg-amber-50/30' : ''}`}>
                                        <td className="px-3 py-1.5">
                                            <div className={`w-1.5 h-3 rounded-sm ${
                                                log.event_type === 'WRITE' ? 'bg-amber-500' : 
                                                log.event_type === 'AUTH' ? 'bg-purple-500' : 
                                                'bg-slate-300'
                                            }`}></div>
                                        </td>
                                        <td className="px-3 py-1.5 text-slate-400 whitespace-nowrap tabular-nums">{new Date(log.created_at).toLocaleTimeString([], {hour12: false})}</td>
                                        <td className="px-3 py-1.5">
                                            <p className="font-black text-slate-700 truncate max-w-[150px] lowercase">{log.path?.replace('/portal/', '') || 'SYS'}</p>
                                            <p className="text-[9px] text-slate-500 truncate max-w-[200px] lowercase">{log.description}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;850&display=swap');
                * { font-family: 'JetBrains Mono', monospace !important; }
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: #f8fafc; }
                ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
            `}</style>
        </div>
    );
}
