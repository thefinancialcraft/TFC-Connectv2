import React from 'react';

interface MemberPerformanceTableProps {
    members: any[];
    memberStats: Record<string, any>;
    loading: boolean;
    onRefresh: () => void;
    title?: string;
    lastUpdated?: Date;
}

const MemberPerformanceTable: React.FC<MemberPerformanceTableProps> = ({
    members,
    memberStats,
    loading,
    onRefresh,
    title = "Member Performance Breakdown",
    lastUpdated
}) => {
    const formatTime = (date: string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h3 className="font-bold text-[#263238] text-lg">{title}</h3>
                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                        Granular metrics for individual agent activity (Sync enabled)
                        {lastUpdated && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">
                                    Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                    <button 
                        onClick={onRefresh}
                        disabled={loading}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all border border-indigo-100"
                    >
                        <i className={`fi flex fi-rr-refresh ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}></i>
                        <span>Refresh</span>
                    </button>
                    <div className="flex gap-2 text-[10px] font-bold uppercase tracking-tight">
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> 
                            Online
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-600 text-white rounded-xl border border-slate-700 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span> 
                            Idle
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest sticky top-0 z-10 bg-gray-50/50 backdrop-blur-sm">
                            <th className="px-6 py-4 font-bold">Agent</th>
                            <th className="px-2 py-4 font-bold text-center">Status</th>
                            <th className="px-2 py-4 font-bold text-center bg-indigo-50/30 text-indigo-600">Total Dials</th>
                            <th className="px-2 py-4 font-bold text-center">Talk Time</th>
                            <th className="px-2 py-4 font-bold text-center">Connected</th>
                            <th className="px-2 py-4 font-bold text-center">Avg Talk</th>
                            <th className="px-2 py-4 font-bold text-center">Streak/Gap</th>
                            <th className="px-2 py-4 font-bold text-center text-rose-600">Utilization</th>
                            <th className="px-6 py-4 font-bold text-right">Last Call</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {members.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="px-6 py-12 text-center text-gray-400 text-sm">No members found</td>
                            </tr>
                        ) : members.map(member => {
                            const mId = member.user_id as string;
                            const mStats = memberStats[mId] || { 
                                totalCalls: 0, 
                                connected: 0, 
                                connectedRate: "0.0", 
                                avgDuration: '0m 0s', 
                                totalTalkTime: '0h 0m 0s',
                                streakGap: '0/0s',
                                utilization: '0.0%',
                                utilizationRaw: 0,
                                lastActive: null, 
                                idleTime: 'N/A', 
                                status: 'Idle',
                                onCall: false
                            };
                            
                            const isOnline = mStats.status === 'Online';
                            
                            return (
                                <tr key={member.user_id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center text-gray-400 font-bold text-xs ring-2 ring-white group-hover:ring-indigo-50 transition-all">
                                                {member.profile_pic_url || member.profilePic ? (
                                                    <img src={member.profile_pic_url || member.profilePic} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <i className="fi flex fi-rr-user text-lg"></i>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 leading-none">{member.user_name || member.name || 'Unknown'}</p>
                                                <p className="text-[10px] text-gray-400 mt-1 font-medium">ID: {member.employee_id || '--'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center">
                                        {mStats.onCall ? (
                                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border ${mStats.isPersonal ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                              <i className={`fi flex ${mStats.isPersonal ? 'fi-rr-book-user text-amber-500' : 'fi-rr-headset text-indigo-500'} text-[10px] animate-pulse`}></i>
                                              {mStats.isPersonal ? 'Personal' : 'On Call'}
                                          </div>
                                        ) : (
                                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-600 text-white border-slate-700 shadow-sm'}`}>
                                              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                              {isOnline ? 'Active' : `Idle ${mStats.idleTime !== 'N/A' ? mStats.idleTime : ''}`}
                                          </div>
                                        )}
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center">
                                        <div className="inline-flex flex-col">
                                            <span className="text-sm font-black text-indigo-600">
                                                {mStats.totalCalls}
                                            </span>
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">attempts</span>
                                        </div>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center text-xs text-gray-600 font-extrabold">
                                        {mStats.totalTalkTime}
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center">
                                        <p className="text-xs font-black text-gray-800">{mStats.connected}</p>
                                        <p className="text-[9px] text-emerald-500 font-bold">{mStats.connectedRate}%</p>
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center text-xs text-gray-500 font-bold">
                                        {mStats.avgDuration}
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center text-xs text-amber-600 font-black">
                                        {mStats.streakGap}
                                    </td>
                                    
                                    <td className="px-2 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-black text-rose-600">
                                                {mStats.utilization}
                                            </span>
                                            <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                <div 
                                                    className="h-full bg-rose-500" 
                                                    style={{ width: `${Math.min(100, parseFloat(mStats.utilization))}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="px-6 py-4 text-right">
                                        <p className="text-xs font-black text-gray-800">{formatTime(mStats.lastActive)}</p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                            {mStats.lastActive ? new Date(mStats.lastActive).toLocaleDateString([], { day: '2-digit', month: 'short' }) : 'Never'}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MemberPerformanceTable;
