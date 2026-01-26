
import React from 'react';

interface Campaign {
    id: string;
    name: string | null;
    description: string | null;
    status: string | null;
    created_at: string | null;
    created_by?: string | null;
    employee_id?: string | null;
    organization_id?: string | null;
    organizations?: { id: string, company_name: string, org_code: string } | null;
}

interface CampaignHeaderProps {
    id: string | string[] | undefined;
    campaign: Campaign | null;
    campaignStats: { talkTime: string; totalDials: number };
    calling: boolean;
    onStartCalling: () => void;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({ 
    id, 
    campaign, 
    campaignStats, 
    calling, 
    onStartCalling 
}) => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 mb-8 group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform group-hover:scale-110 transition-transform duration-700">
                <i className="fi flex fi-rr-megaphone text-9xl"></i>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] shadow-sm">
                            <i className="fi flex fi-rr-megaphone text-xl"></i>
                        </div>
                        <div>
                            <h1 className="text-xl  md:text-xl   font-black text-gray-800" style={{color: "#263238", fontFamily: "'Poppins', sans-serif"  }}>
                                {campaign?.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${campaign?.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                                    }`}>
                                    {campaign?.status}
                                </span>
                                <div className="w-1 h-1 rounded-full bg-gray-300 mx-1"></div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Campaign ID: <span className="text-gray-600">{id}</span></span>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                        {campaign?.description || 'No description provided for this campaign.'}
                    </p>
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                            <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                <i className="fi flex fi-rr-calendar"></i>
                            </div>
                            <span>Created: {campaign?.created_at ? new Date(campaign.created_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                            <div className="w-6 h-6 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                <i className="fi flex fi-rr-user"></i>
                            </div>
                            <span>Creator: {campaign?.created_by || 'System'} {campaign?.employee_id ? `(#${campaign.employee_id})` : ''}</span>
                        </div>
                        {campaign?.organizations && (
                            <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                    <i className="fi flex fi-rr-building"></i>
                                </div>
                                <span className="text-blue-600">Org: {campaign.organizations.company_name} {campaign.organizations.org_code ? `(${campaign.organizations.org_code})` : ''}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center self-start lg:self-center">
                    {/* Talk Time Tile */}
                    <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm transition-transform hover:scale-110">
                            <i className="fi flex fi-rr-microphone-alt text-base"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1.5">Talk Time</span>
                            <span className="text-base font-black text-gray-800 leading-none">{campaignStats.talkTime}</span>
                        </div>
                    </div>

                    {/* Dials Tile */}
                    <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm transition-transform hover:scale-110">
                            <i className="fi flex fi-rr-phone-call text-base"></i>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1.5">Total Dials</span>
                            <span className="text-base font-black text-gray-800 leading-none">{campaignStats.totalDials}</span>
                        </div>
                    </div>

                    {/* Start Calling Button */}
                    <button
                        onClick={onStartCalling}
                        disabled={calling}
                        className={`flex items-center gap-4 px-7 py-4 rounded-2xl border border-white/10 shadow-xl shadow-indigo-200/50 transition-all hover:scale-[1.03] active:scale-95 group/btn relative overflow-hidden h-18 ${calling ? 'opacity-80' : ''}`}
                        style={{
                            background: 'linear-gradient(135deg, #4b33e8 0%, #8b5cf6 100%)'
                        }}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        
                        <div className="relative z-10 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover/btn:bg-white/30 transition-colors shadow-sm ring-1 ring-white/30">
                            {calling ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <i className="fi flex fi-rr-play text-sm ml-0.5"></i>
                            )}
                        </div>
                        <div className="relative z-10 flex flex-col items-start translate-y-[1px]">
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mb-1.5">{calling ? 'Assigning...' : 'Mission'}</span>
                            <span className="text-base font-black text-white leading-none">{calling ? 'Finding Lead' : 'Start Calling'}</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CampaignHeader;
