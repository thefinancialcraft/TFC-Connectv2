
import React from 'react';

interface CampaignStats {
    totalCustomers: number;
    followupCount: number;
    overdueCount: number;
    freshProspects: number;
    upcomingProspects: number;
    recentCount: number;
    managedCount: number;
}

interface CampaignStatsGridProps {
    stats: CampaignStats;
}

const CampaignStatsGrid: React.FC<CampaignStatsGridProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-8">
            {/* Total Leads */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(59, 130, 246, 0.12), transparent 60%)" }}></div>
                <div className="absolute -right-2 -bottom-2">
                    <i className="fi flex fi-rr-users text-5xl" style={{ color: "#3b82f6", opacity: 0.15 }}></i>
                </div>
                <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Total Leads</p>
                    </div>
                    <div className="mt-auto">
                        <p className="text-xl   sm:text-4xl font-semibold" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.totalCustomers}</p>
                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Assigned to campaign</p>
                    </div>
                </div>
            </div>

            {/* Fresh Prospects */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(139, 92, 246, 0.12), transparent 60%)" }}></div>
                <div className="absolute -right-2 -bottom-2">
                    <i className="fi flex fi-rr-bulb text-5xl" style={{ color: "#8b5cf6", opacity: 0.15 }}></i>
                </div>
                <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Fresh</p>
                    </div>
                    <div className="mt-auto">
                        <p className="text-xl   sm:text-4xl font-semibold" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.freshProspects}</p>
                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Not yet assigned</p>
                    </div>
                </div>
            </div>

            {/* Follow-ups */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(249, 115, 22, 0.12), transparent 60%)" }}></div>
                <div className="absolute -right-2 -bottom-2">
                    <i className="fi flex fi-rr-phone-call text-5xl" style={{ color: "#f97316", opacity: 0.15 }}></i>
                </div>
                <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Follow-ups</p>
                    </div>
                    <div className="mt-auto">
                        <p className="text-xl   sm:text-4xl font-semibold" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.followupCount}</p>
                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Pending action</p>
                    </div>
                </div>
            </div>

            {/* Upcoming */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(16, 185, 129, 0.12), transparent 60%)" }}></div>
                <div className="absolute -right-2 -bottom-2">
                    <i className="fi flex fi-rr-calendar-clock text-5xl" style={{ color: "#10b981", opacity: 0.15 }}></i>
                </div>
                <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Upcoming</p>
                    </div>
                    <div className="mt-auto">
                        <p className="text-xl   sm:text-4xl font-semibold" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.upcomingProspects}</p>
                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]">Scheduled leads</p>
                    </div>
                </div>
            </div>

            {/* Overdue */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100">
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at right top, rgba(185, 22, 16, 0.12), transparent 60%)" }}></div>
                <div className="absolute -right-2 -bottom-2">
                    <i className="fi flex fi-rr-time-watch-calendar text-5xl" style={{ color: "#ef4444", opacity: 0.15 }}></i>
                </div>
                <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                        <p className="text-xs sm:text-sm font-medium" style={{color: "#787E9D", fontFamily: "'Roboto', sans-serif"  }}>Overdue</p>
                    </div>
                    <div className="mt-auto">
                        <p className="text-xl   sm:text-4xl font-semibold text-red-600" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>{stats.overdueCount}</p>
                        <p className="text-[10px] sm:text-[11px] mt-1 font-bold text-red-400">Past due date</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignStatsGrid;
