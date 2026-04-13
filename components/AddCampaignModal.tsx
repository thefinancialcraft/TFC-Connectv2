import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../context/UserContext';
import { logSystemEvent, estimateSize } from '../lib/monitoring';

interface User {
    id: string;
    user_id: string;
    user_name: string | null;
    email: string;
    profile_pic_url: string | null;
    employee_id?: string | null;
    organization_id?: string | null;
}

interface AddCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    users: User[];
    loadingUsers: boolean;
    campaign?: any; // Optional campaign for editing mode
}

export default function AddCampaignModal({
    isOpen,
    onClose,
    onSuccess,
    users,
    loadingUsers,
    campaign
}: AddCampaignModalProps) {
    const { user: currentUser } = useUser();
    const [campaignName, setCampaignName] = useState("");
    const [campaignDescription, setCampaignDescription] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [campaignId, setCampaignId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [campaignStatus, setCampaignStatus] = useState("active");
    const [activeTab, setActiveTab] = useState("info"); // info, org, team
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState("");
    const [loadingOrgs, setLoadingOrgs] = useState(false);

    // Fetch organizations
    const fetchOrganizations = async () => {
        try {
            setLoadingOrgs(true);
            const { data, error } = await supabase
                .from('organizations')
                .select('id, company_name, org_code')
                .eq('is_active', true);
            
            if (error) throw error;
            setOrganizations(data || []);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        } finally {
            setLoadingOrgs(false);
        }
    };

    // Initialize form when modal opens or campaign changes
    useEffect(() => {
        if (isOpen) {
            fetchOrganizations();
            if (campaign) {
                // Editing mode
                setCampaignId(campaign.id);
                setCampaignName(campaign.name || "");
                setCampaignDescription(campaign.description || "");
                setCampaignStatus(campaign.status || "active");
                setSelectedOrgId(campaign.organization_id || "");
                // Pre-select users if they exist in the 'users' column
                if (Array.isArray(campaign.users)) {
                    setSelectedUsers(campaign.users.map((u: any) => u.user_id || u.id).filter(Boolean));
                } else {
                    setSelectedUsers([]);
                }
            } else {
                // Creation mode - Sequential ID generation
                const getNextId = async () => {
                    try {
                        const { data, error } = await supabase
                            .from('campaigns')
                            .select('id')
                            .order('id', { ascending: false })
                            .limit(1);

                        if (error) throw error;

                        if (data && data.length > 0) {
                            const lastId = data[0].id;
                            const match = lastId.match(/CAM-(\d+)/i);
                            if (match) {
                                const nextNum = parseInt(match[1]) + 1;
                                setCampaignId(`CAM-${String(nextNum).padStart(4, '0')}`);
                            } else {
                                setCampaignId("CAM-0001");
                            }
                        } else {
                            setCampaignId("CAM-0001");
                        }
                    } catch (err) {
                        console.error("Error fetching last campaign ID:", err);
                        // Fallback to random if fetch fails, to not block the user
                        setCampaignId(`CAM-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`);
                    }
                };

                getNextId();
                setCampaignName("");
                setCampaignDescription("");
                setCampaignStatus("active");
                setSelectedUsers([]);
                // Auto-set organization for client users
                if (currentUser?.isClient && currentUser.organization_id) {
                    setSelectedOrgId(currentUser.organization_id || "");
                } else {
                    setSelectedOrgId("");
                }
            }
            setSearchTerm("");
            setActiveTab("info");
        }
    }, [isOpen, campaign]);
    
    // Clear selected users that don't belong to the new organization
    useEffect(() => {
        if (selectedOrgId && users.length > 0) {
            setSelectedUsers(prev => {
                // Find IDs of users that are selected but don't belong to the selected org
                const invalidIds = prev.filter(uid => {
                    const user = users.find(u => u.user_id === uid || u.id === uid);
                    // If user not found (maybe loading) or org doesn't match, it's invalid
                    // Note: If user data doesn't have organization_id yet (legacy), we might skip this check 
                    // or assume it's valid? adhering strictly: if org_id mismatches, remove.
                    return user && user.organization_id && user.organization_id !== selectedOrgId;
                });
                
                if (invalidIds.length > 0) {
                    return prev.filter(uid => !invalidIds.includes(uid));
                }
                return prev;
            });
        }
    }, [selectedOrgId, users]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.user_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filter by organization if selected
        const matchesOrg = selectedOrgId && user.organization_id === selectedOrgId;

        return matchesSearch && matchesOrg;
    });

    const handleSaveCampaign = async () => {
        if (!campaignName.trim()) {
            alert("Please enter campaign name");
            setActiveTab("info");
            return;
        }

        if (!selectedOrgId) {
            alert("Please select an organization");
            setActiveTab("org");
            return;
        }

        setIsSubmitting(true);
        try {
            // Map selected IDs to detailed objects {id, name, email}
            const selectedUserObjects = selectedUsers.map(uid => {
                const found = users.find(u => u.user_id === uid || u.id === uid);
                return {
                    id: found?.id,
                    user_id: found?.user_id,
                    name: found?.user_name,
                    email: found?.email,
                    employee_id: (found as any)?.employee_id
                };
            }).filter(u => u.user_id); // Filter out any that might not have been found

            const campaignData: any = {
                id: campaignId,
                name: campaignName,
                description: campaignDescription,
                status: campaignStatus,
                users: selectedUserObjects,
                organization_id: selectedOrgId,
                [campaign ? 'updated_at' : 'created_at']: new Date().toISOString(),
            };

            // If it's a new campaign, add creator info
            if (!campaign) {
                campaignData.created_by = currentUser?.displayName || currentUser?.email || "Unknown";
                campaignData.employee_id = currentUser?.employeeId || null;
            }

            const { error } = await supabase
                .from("campaigns")
                .upsert([campaignData]);

            if (error) {
                alert("Error saving campaign: " + error.message);
            } else {
                onSuccess();
                onClose();

                logSystemEvent({
                    event_type: 'WRITE',
                    description: campaign ? `Update Campaign: ${campaignName}` : `Create Campaign: ${campaignName}`,
                    metadata: { 
                        campaign_id: campaignId, 
                        campaign_name: campaignName,
                        organization_id: selectedOrgId,
                        user_count: selectedUsers.length
                    },
                    payload_size: estimateSize(campaignData),
                    user_name: currentUser?.displayName || 'Admin',
                    organization_id: currentUser?.organization_id || undefined
                });
            }
        } catch (e) {
            console.error("Error saving campaign:", e);
            alert("Error saving campaign");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 text-xs font-sans">
            {/* Modal */}
            <div className="relative w-full max-w-4xl transform rounded-lg bg-white  flex flex-col border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200 h-[85vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div>
                            <h2 className="font-bold text-gray-800">
                                {campaign ? 'Modify Campaign' : 'Initiate Campaign'}
                            </h2>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest border border-indigo-100 mt-1 inline-block">
                                {campaign ? 'Configuration Update' : 'Strategic Onboarding Sequence'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <i className="fi fi-rr-cross-small text-xl leading-none"></i>
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-100 bg-white shrink-0">
                    <button 
                        onClick={() => setActiveTab("info")}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'info' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <i className={`fi flex ${activeTab === 'info' ? 'fi-sr-info' : 'fi-rr-info'} text-sm`}></i>
                        Basic Information
                        {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
                    </button>
                    {!currentUser?.isClient && (
                        <button 
                            onClick={() => setActiveTab("org")}
                            className={`flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'org' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <i className={`fi flex ${activeTab === 'org' ? 'fi-sr-building' : 'fi-rr-building'} text-sm`}></i>
                            Organization
                            {activeTab === 'org' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
                        </button>
                    )}
                    <button 
                        onClick={() => setActiveTab("team")}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'team' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <i className={`fi flex ${activeTab === 'team' ? 'fi-sr-users' : 'fi-rr-users'} text-sm`}></i>
                        Team Personnel
                         <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold ${selectedUsers.length > 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                            {selectedUsers.length}
                        </span>
                        {activeTab === 'team' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>}
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    
                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="bg-white p-5 rounded-lg border border-gray-100  space-y-4">
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Protocol Metadata</h3>
                                        
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Campaign ID</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={campaignId}
                                                    readOnly
                                                    className="w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded text-[11px] font-mono font-bold text-gray-500 outline-none"
                                                />
                                                <i className="fi fi-rr-lock absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Functional Status</label>
                                            <div 
                                                onClick={() => setCampaignStatus(prev => prev === 'active' ? 'inactive' : 'active')}
                                                className={`w-full h-9 rounded border cursor-pointer transition-all flex items-center justify-between px-3 ${campaignStatus === 'active' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${campaignStatus === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${campaignStatus === 'active' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                        {campaignStatus}
                                                    </span>
                                                </div>
                                                <div className={`w-8 h-4 rounded-full relative transition-all ${campaignStatus === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${campaignStatus === 'active' ? 'right-0.5' : 'left-0.5'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white p-5 rounded-lg border border-gray-100  space-y-4">
                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Identity Details</h3>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Campaign Name *</label>
                                            <input
                                                type="text"
                                                value={campaignName}
                                                onChange={(e) => setCampaignName(e.target.value)}
                                                placeholder="e.g. Operation Q4 Growth"
                                                className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Strategic Description</label>
                                            <textarea
                                                value={campaignDescription}
                                                onChange={(e) => setCampaignDescription(e.target.value)}
                                                placeholder="Mission parameters and objectives..."
                                                rows={4}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ORGANIZATION TAB */}
                    {activeTab === 'org' && !currentUser?.isClient && (
                        <div className="p-6 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Select Organization Binding</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {loadingOrgs ? (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scanning Registry...</span>
                                    </div>
                                ) : organizations.length === 0 ? (
                                    <div className="col-span-full py-10 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 text-center">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No organizations found</p>
                                    </div>
                                ) : (
                                    organizations
                                    .filter(org => !currentUser?.isClient || org.id === currentUser.organization_id)
                                    .map((org) => (
                                        <div 
                                            key={org.id}
                                            onClick={() => {
                                                if (!currentUser?.isClient) {
                                                    setSelectedOrgId(org.id);
                                                }
                                            }}
                                            className={`relative p-4 rounded-lg border transition-all ${currentUser?.isClient ? 'cursor-default' : 'cursor-pointer'} ${selectedOrgId === org.id 
                                                ? 'bg-indigo-50 border-indigo-500 ' 
                                                : 'bg-white border-gray-100 hover:border-indigo-200'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="w-8 h-8 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400">
                                                    <i className="fi fi-rr-building text-sm"></i>
                                                </div>
                                                {selectedOrgId === org.id && (
                                                    <i className="fi fi-sr-check-circle text-indigo-600 text-sm"></i>
                                                )}
                                            </div>
                                            <h4 className="text-[11px] font-bold text-gray-800 truncate uppercase tracking-tight">{org.company_name}</h4>
                                            <p className="text-[9px] font-mono text-gray-400 mt-0.5">#{org.org_code || 'N/A'}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* TEAM TAB */}
                    {activeTab === 'team' && (
                        <div className="h-full flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Personnel Pool Panel */}
                            <div className="w-full md:w-[320px] p-5 bg-white border-r border-gray-100 flex flex-col shrink-0">
                                <div className="mb-4">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-0.5">Personnel Pool Search</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="ID or Name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full h-8 pl-8 pr-3 bg-white border border-gray-200 rounded text-[10px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <i className="fi fi-rr-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                    {loadingUsers ? (
                                        <div className="py-10 text-center">
                                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
                                        </div>
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="py-10 text-center bg-gray-50/50 rounded-lg">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">No agents found</p>
                                        </div>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <div 
                                                key={user.id}
                                                onClick={() => {
                                                    if (selectedUsers.includes(user.user_id)) {
                                                        setSelectedUsers(selectedUsers.filter(id => id !== user.user_id));
                                                    } else {
                                                        setSelectedUsers([...selectedUsers, user.user_id]);
                                                    }
                                                }}
                                                className={`flex items-center gap-3 p-2 rounded border transition-all cursor-pointer ${selectedUsers.includes(user.user_id) 
                                                    ? 'bg-indigo-50 border-indigo-300' 
                                                    : 'bg-white border-gray-50 hover:border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${selectedUsers.includes(user.user_id) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`}>
                                                    {selectedUsers.includes(user.user_id) && <i className="fi fi-rr-check text-[8px] text-white"></i>}
                                                </div>
                                                <div className="w-7 h-7 rounded overflow-hidden shrink-0 border border-gray-100">
                                                    {user.profile_pic_url ? (
                                                        <img src={user.profile_pic_url} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                                                            {user.user_name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[10px] font-bold text-gray-800 truncate uppercase mt-0.5">{user.user_name || 'N/A'}</h4>
                                                    <p className="text-[8px] font-mono text-gray-400">ID: {user.employee_id || '--'}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Selected Members Panel */}
                            <div className="flex-1 p-5 bg-gray-50/30 overflow-y-auto custom-scrollbar">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Assigned Sequence Personnel</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {selectedUsers.length === 0 ? (
                                        <div className="col-span-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-white/50">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No members assigned</p>
                                        </div>
                                    ) : (
                                        selectedUsers.map(uid => {
                                            const u = users.find(usr => usr.user_id === uid || usr.id === uid);
                                            return (
                                                <div key={uid} className="flex items-center gap-3 bg-white border border-gray-100 p-2 rounded-lg  group">
                                                    <div className="w-8 h-8 rounded border border-gray-100 shrink-0 bg-indigo-50 flex items-center justify-center text-indigo-400 font-bold text-[10px]">
                                                        {u?.user_name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-[10px] font-bold text-gray-800 truncate uppercase">{u?.user_name || 'Anonymous'}</h4>
                                                        <p className="text-[8px] font-mono text-gray-400">EMP: {u?.employee_id || '---'}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedUsers(prev => prev.filter(id => id !== uid))}
                                                        className="p-1 px-1.5 text-gray-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <i className="fi fi-rr-cross-small text-lg leading-none"></i>
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Execution */}
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white shrink-0 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all"
                    >
                        Abort Sequence
                    </button>
                    <button
                        onClick={handleSaveCampaign}
                        disabled={isSubmitting}
                        className="px-6 py-1.5 bg-[#4b33e8] text-white rounded font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all   disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? "Processing..." : campaign ? 'Commit Changes' : 'Execute Creation'}
                    </button>
                </div>
            </div>
        </div>


    );
}
