import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import PixelDisintegrate from './PixelDisintegrate';

export interface Campaign {
    id: string;
    name: string | null;
    description: string | null;
    status: string | null;
    created_at: string | null;

    // optional stats used in UI
    pending_calls?: number | null;
    upcoming_followups?: number | null;
    overdue_followups?: number | null;
    talktime?: string | null;
    total_dials?: number | null;
    created_by?: string | null;
    employee_id?: string | null;
    users?: { id: string, name: string, email: string }[] | null;
    organization_id?: string | null;
    organizations?: { id: string, company_name: string, org_code: string } | null;
}

interface CampaignCardProps {
    campaign: Campaign;
    onEdit?: (campaign: Campaign) => void;
    onDelete?: (id: string) => void;
    onStatusChange?: (id: string, newStatus: string) => Promise<void> | void;
    isEditVisible?: boolean;
    isDeleteVisible?: boolean;
    isToggleVisible?: boolean;
    isExiting?: boolean;
    onExitComplete?: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
    campaign, 
    onEdit, 
    onDelete, 
    onStatusChange,
    isEditVisible = true, 
    isDeleteVisible = true,
    isToggleVisible = true,
    isExiting = false,
    onExitComplete
}) => {
    const router = useRouter();
    const [isToggling, setIsToggling] = useState(false);
    const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);

    // Sync optimisticStatus when campaign.status updates
    React.useEffect(() => {
        setOptimisticStatus(null);
    }, [campaign.status]);

    const currentStatus = optimisticStatus ?? campaign.status;
    const isActive = currentStatus?.toLowerCase() === 'active';
    const isDisintegrating = isExiting;

    const handleCardClick = () => {
        router.push(`/campaign/${campaign.id}`);
    };

    const handleToggleStatus = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isEditVisible || isToggling || isDisintegrating) return;

        const newStatus = isActive ? 'inactive' : 'active';
        // Immediately flip the button state so the toggle animation is visible
        setOptimisticStatus(newStatus);
        setIsToggling(true);

        try {
            if (onStatusChange) {
                await onStatusChange(campaign.id, newStatus);
            } else {
                const { error } = await supabase
                    .from('campaigns')
                    .update({ status: newStatus })
                    .eq('id', campaign.id);
                if (error) throw error;
            }
        } catch (err: any) {
            console.error("Error toggling campaign status:", err);
            // Revert state on error
            setOptimisticStatus(null);
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <div
            onClick={isDisintegrating ? undefined : handleCardClick}
            className={`group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 overflow-hidden cursor-pointer ${
                isDisintegrating 
                    ? "pointer-events-none" 
                    : "transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            }`}
            style={isDisintegrating ? {
                opacity: 0,
                transform: 'scale(0.92) translateY(-6px)',
                filter: 'blur(3px) brightness(1.15)',
                transition: 'opacity 650ms ease-out 100ms, transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1) 100ms, filter 650ms ease-out 100ms'
            } : undefined}
        >
            {/* Pixel Disintegration Canvas Overlay */}
            <PixelDisintegrate
                active={isDisintegrating}
                duration={700}
                onComplete={() => {
                    if (onExitComplete) onExitComplete(campaign.id);
                }}
            />

            {/* Decorative background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="mb-0">
                    <div className="flex items-start justify-between mb-2 gap-2">
                        <h3
                            className="text-lg font-bold text-gray-800 truncate pr-2 flex-1"
                            title={campaign.name || 'Untitled Campaign'}
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            {campaign.name || 'Untitled Campaign'}
                        </h3>
                        {isToggleVisible && (
                            <div 
                                onClick={(e) => e.stopPropagation()} 
                                className="flex items-center shrink-0 z-20"
                            >
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isActive}
                                    disabled={!isEditVisible || isToggling || isDisintegrating}
                                    onClick={handleToggleStatus}
                                    title={!isEditVisible ? "Permission required to change status" : (isActive ? "Active (Click to set Inactive)" : "Inactive (Click to set Active)")}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center focus:outline-none ${
                                        (!isEditVisible || isToggling || isDisintegrating) ? "opacity-80 cursor-not-allowed" : "hover:opacity-95"
                                    }`}
                                >
                                    {/* Slim Background Track */}
                                    <span 
                                        aria-hidden="true"
                                        className={`w-[32px] h-1.5 rounded-full transition-colors duration-300 ease-in-out ${
                                            isActive ? "bg-emerald-500" : "bg-gray-300"
                                        }`}
                                    />
                                    
                                    {/* Untouched Toggle Switch Knob */}
                                    <span 
                                        aria-hidden="true"
                                        className={`pointer-events-none absolute left-0 inline-block h-4 w-4 transform rounded-full bg-white border border-gray-200/90 transition-transform duration-300 ease-in-out ${
                                            isActive ? "translate-x-5 border-emerald-500/20" : "translate-x-0"
                                        }`} 
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                    <p
                        className="text-xs text-gray-400 line-clamp-2 min-h-[2.5em]"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                        {campaign.description || 'No description provided for this campaign.'}
                    </p>

                    {/* Organization Banner */}
                    <div className="flex items-center gap-2 mb-4 bg-blue-50/50 p-2 rounded-lg border border-blue-100 group-hover:bg-blue-50 transition-colors">
                        <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                            <i className="fi flex fi-rr-building text-[10px]"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-black text-blue-400 tracking-widest leading-none mb-0.5">Assigned Asset</p>
                            <p className="text-xs font-bold text-blue-900 truncate">
                                {campaign.organizations?.company_name || 'Individual Managed'} 
                                {campaign.organizations?.org_code && <span className="ml-1 text-[10px] text-blue-400 font-mono">#{campaign.organizations.org_code}</span>}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 transition-colors border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 text-blue-600">
                            <i className="fi flex  fi-rr-clock text-base"></i>
                        </div>
                        {campaign.pending_calls === undefined ? (
                            <span className="text-sm font-semibold text-blue-400/80 animate-pulse">—</span>
                        ) : (
                            <span className="text-lg font-bold text-gray-700">{campaign.pending_calls ?? 0}</span>
                        )}
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Fresh</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 transition-colors border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1 text-purple-600">
                            <i className="fi flex  fi-rr-calendar-clock text-base"></i>
                        </div>
                        {campaign.upcoming_followups === undefined ? (
                            <span className="text-sm font-semibold text-purple-400/80 animate-pulse">—</span>
                        ) : (
                            <span className="text-lg font-bold text-gray-700">{campaign.upcoming_followups ?? 0}</span>
                        )}
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Upcoming</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 transition-colors border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-1 text-red-600">
                            <i className="fi flex  fi-rr-time-watch-calendar text-base"></i>
                        </div>
                        {campaign.overdue_followups === undefined ? (
                            <span className="text-sm font-semibold text-red-400/80 animate-pulse">—</span>
                        ) : (
                            <span className="text-lg font-bold text-gray-700">{campaign.overdue_followups ?? 0}</span>
                        )}
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Overdue</span>
                    </div>
                </div>

                {/* Second Row: Extra Stats (Talktime & Dials) */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-center justify-center gap-2 h-[35px] rounded-xl bg-gray-50/80 group-hover:bg-purple-50/50 transition-colors border border-gray-100" title="Talktime">
                        <i className="fi flex fi-rr-microphone-alt text-blue-500 text-[10px]"></i>
                        {campaign.talktime === undefined ? (
                            <span className="text-xs font-semibold text-blue-400/80 animate-pulse">—</span>
                        ) : (
                            <span className="text-xs font-bold text-gray-700">{campaign.talktime ?? '0h 0m'}</span>
                        )}
                    </div>
                    <div className="flex items-center justify-center gap-2 h-[35px] rounded-xl bg-gray-50/80 group-hover:bg-purple-50/50 transition-colors border border-gray-100" title="Total Dials">
                        <i className="fi flex fi-rr-phone-call text-purple-500 text-[10px]"></i>
                        {campaign.total_dials === undefined ? (
                            <span className="text-xs font-semibold text-purple-400/80 animate-pulse">—</span>
                        ) : (
                            <span className="text-xs font-bold text-gray-700">{campaign.total_dials ?? 0}</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 group-hover:text-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                            <i className="fi flex fi-rr-users-alt text-sm"></i>
                            <span className="font-medium text-gray-600 group-hover:text-purple-600 transition-colors">
                                {Array.isArray(campaign.users) ? campaign.users.length : 0} Members
                            </span>
                        </span>
                        {(campaign.created_by || campaign.employee_id) && (
                            <span className="text-xs mt-1 text-gray-400 group-hover:text-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer">
                                <i className="fi flex fi-rr-user text-sm"></i>
                                <span className="font-medium text-gray-600 group-hover:text-purple-600 transition-colors">
                                    {campaign.created_by || 'Unknown'} {campaign.employee_id ? `(#${campaign.employee_id})` : ''}
                                </span>
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all focus:outline-none"
                            title="Call"
                        >
                            <i className="fi flex  fi-rr-phone text-base"></i>
                        </button>

                        {isEditVisible && (
                            <button
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all focus:outline-none"
                                title="Edit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit?.(campaign);
                                }}
                            >
                                <i className="fi flex  fi-rr-edit text-base"></i>
                            </button>
                        )}
                        {isDeleteVisible && (
                            <button
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all focus:outline-none"
                                title="Delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.(campaign.id);
                                }}
                            >
                                <i className="fi flex  fi-rr-trash text-base"></i>
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <a className="text-xs font-semibold text-gray-400 group-hover:text-purple-600 flex items-center gap-1 transition-colors cursor-pointer">
                        View Details <i className="fi flex  fi-rr-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CampaignCard;
