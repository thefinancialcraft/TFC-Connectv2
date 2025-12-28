import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    currentUser: any;
    campaign?: any; // Optional campaign for editing mode
}

export default function AddCampaignModal({
    isOpen,
    onClose,
    onSuccess,
    users,
    loadingUsers,
    currentUser,
    campaign
}: AddCampaignModalProps) {
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
                setSelectedOrgId("");
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
        const matchesOrg = selectedOrgId ? user.organization_id === selectedOrgId : true;

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
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden backdrop-blur-sm flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-gray-900/60 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl transform rounded-2xl bg-white shadow-2xl transition-all scale-100 opacity-100 border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                             <i className="fi flex fi-rr-bullhorn text-lg"></i>
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-900" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                {campaign ? 'Modify Campaign' : 'Initiate Campaign'}
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                {campaign ? 'Configuration Update' : 'Strategic Onboarding Sequence'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                        <i className="fi flex fi-rr-cross text-sm"></i>
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-100 bg-white sticky top-0 z-10">
                    <button 
                        onClick={() => setActiveTab("info")}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest transition-all relative ${activeTab === 'info' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <i className={`fi flex ${activeTab === 'info' ? 'fi-sr-info' : 'fi-rr-info'} text-sm`}></i>
                        Basic Info
                        {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab("org")}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest transition-all relative ${activeTab === 'org' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <i className={`fi flex ${activeTab === 'org' ? 'fi-sr-building' : 'fi-rr-building'} text-sm`}></i>
                        Organization
                        {activeTab === 'org' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab("team")}
                        className={`flex-1 py-4 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest transition-all relative ${activeTab === 'team' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <i className={`fi flex ${activeTab === 'team' ? 'fi-sr-users' : 'fi-rr-users'} text-sm`}></i>
                        Team Members
                         <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-semibold ${selectedUsers.length > 0 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                            {selectedUsers.length}
                        </span>
                        {activeTab === 'team' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"></div>}
                    </button>
                </div>

                {/* Body Content */}
                <div className="h-[55vh] overflow-y-auto custom-scrollbar bg-gray-50/30">
                    
                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                <i className="fi fi-rr-fingerprint"></i>
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-widest">Protocol Metadata</h3>
                                        </div>
                                        
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block px-1">Campaign Identifier</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={campaignId}
                                                    readOnly
                                                    className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono font-bold text-gray-500 outline-none"
                                                />
                                                <i className="fi fi-rr-lock absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block px-1">Functional Status</label>
                                            <div 
                                                onClick={() => setCampaignStatus(prev => prev === 'active' ? 'inactive' : 'active')}
                                                className={`w-full h-12 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between px-4 ${campaignStatus === 'active' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${campaignStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
                                                    <span className={`text-xs font-semibold uppercase tracking-widest ${campaignStatus === 'active' ? 'text-green-700' : 'text-orange-700'}`}>
                                                        {campaignStatus.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className={`w-10 h-6 rounded-full relative transition-all duration-300 ${campaignStatus === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${campaignStatus === 'active' ? 'right-1' : 'left-1'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                                                <i className="fi fi-rr-edit-alt"></i>
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-widest">Brand Narrative</h3>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block px-1">Campaign Title <span className="text-red-500">*</span></label>
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={campaignName}
                                                    onChange={(e) => setCampaignName(e.target.value)}
                                                    placeholder="e.g. Operation Q4 Growth"
                                                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-700 focus:bg-white focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/5 transition-all outline-none"
                                                />
                                                <i className="fi fi-rr-badge absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors"></i>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block px-1">Strategic Description</label>
                                            <div className="relative group">
                                                <textarea
                                                    value={campaignDescription}
                                                    onChange={(e) => setCampaignDescription(e.target.value)}
                                                    placeholder="Operational objectives and mission parameters..."
                                                    rows={4}
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-700 focus:bg-white focus:border-purple-500 transition-all outline-none resize-none"
                                                />
                                                <i className="fi fi-rr-align-left absolute left-4 top-5 text-gray-400 group-focus-within:text-purple-500 transition-colors"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ORGANIZATION TAB */}
                    {activeTab === 'org' && (
                        <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>Available Organizations</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bind this campaign to a business entity</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm cursor-help" title="Campaign must be linked to one organization">
                                    <i className="fi fi-rr-info"></i>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {loadingOrgs ? (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
                                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Scanning Registry...</span>
                                    </div>
                                ) : organizations.length === 0 ? (
                                    <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                                        <i className="fi fi-rr-building text-3xl text-gray-300 mb-4"></i>
                                        <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-widest mb-1">No Active Organizations</h4>
                                        <p className="text-[10px] font-bold text-gray-400">Register an organization first to proceed</p>
                                    </div>
                                ) : (
                                    organizations.map((org) => (
                                        <div 
                                            key={org.id}
                                            onClick={() => setSelectedOrgId(org.id)}
                                            className={`relative overflow-hidden p-5 rounded-2xl border-2 transition-all cursor-pointer group ${selectedOrgId === org.id 
                                                ? 'bg-purple-50 border-purple-500 shadow-xl shadow-purple-500/10' 
                                                : 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-lg'}`}
                                        >
                                            {selectedOrgId === org.id && (
                                                <div className="absolute top-0 right-0 p-3 text-purple-600">
                                                    <i className="fi fi-sr-check-circle text-lg"></i>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedOrgId === org.id ? 'bg-purple-600 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-400'}`}>
                                                    <i className="fi fi-rr-building"></i>
                                                </div>
                                                <div>
                                                    <h4 className={`text-xs font-semibold uppercase tracking-tight truncate max-w-[120px] ${selectedOrgId === org.id ? 'text-purple-900' : 'text-gray-700'}`}>
                                                        {org.company_name}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-[9px] font-mono text-gray-400 group-hover:text-purple-400 transition-colors">#{org.org_code || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-700 ${selectedOrgId === org.id ? 'w-full bg-purple-500' : 'w-0 bg-gray-300'}`}></div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* TEAM TAB */}
                    {activeTab === 'team' && (
                        <div className="h-full flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* Selected Members Panel */}
                            <div className="flex-1 p-8 border-r border-gray-100 bg-white/50">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-widest">Operational Team</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigned Personnel</p>
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-purple-100 text-purple-600 text-[10px] font-semibold">
                                        {selectedUsers.length} MEMBERS
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[200px] content-start">
                                    {selectedUsers.length === 0 ? (
                                        <div className="col-span-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-3">
                                                <i className="fi fi-rr-users text-xl"></i>
                                            </div>
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">No team members assigned</p>
                                            <p className="text-[9px] font-bold text-gray-300 mt-1 uppercase">Select from available pool ➜</p>
                                        </div>
                                    ) : (
                                        selectedUsers.map(uid => {
                                            const user = users.find(u => u.user_id === uid || u.id === uid);
                                            return (
                                                <div key={uid} className="flex items-center gap-3 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm group animate-in zoom-in-95 duration-200">
                                                    {user?.profile_pic_url ? (
                                                        <img src={user.profile_pic_url} className="w-8 h-8 rounded-lg object-cover ring-2 ring-gray-50" alt="" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] font-semibold text-white shadow-md">
                                                            {user?.user_name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-[11px] font-bold text-gray-800 truncate">{user?.user_name || 'Anonymous'}</h4>
                                                        <p className="text-[9px] font-medium text-gray-400 truncate">ID: {user?.employee_id || '---'}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedUsers(prev => prev.filter(id => id !== uid))}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <i className="fi fi-rr-cross-small text-lg"></i>
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Personnel Pool Panel */}
                            <div className="w-full md:w-[360px] p-6 bg-white space-y-4 flex flex-col h-full">
                                <div>
                                    <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.2em] mb-4">Personnel Pool</h3>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            placeholder="Search by ID or Name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-transparent rounded-xl text-xs font-bold text-gray-700 focus:bg-white focus:border-purple-500 transition-all outline-none"
                                        />
                                        <i className="fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-500 transition-colors"></i>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                                    {loadingUsers ? (
                                        <div className="py-10 flex flex-col items-center justify-center gap-3">
                                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Fetching Pool...</span>
                                        </div>
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="py-10 text-center space-y-2 bg-gray-50 rounded-2xl">
                                            <i className="fi fi-rr-search-alt text-lg text-gray-300"></i>
                                            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">No matching agents</p>
                                        </div>
                                    ) : (
                                        filteredUsers.map((user, index) => (
                                            <div 
                                                key={user.id}
                                                onClick={() => {
                                                    if (selectedUsers.includes(user.user_id)) {
                                                        setSelectedUsers(selectedUsers.filter(id => id !== user.user_id));
                                                    } else {
                                                        setSelectedUsers([...selectedUsers, user.user_id]);
                                                    }
                                                }}
                                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${selectedUsers.includes(user.user_id) 
                                                    ? 'bg-purple-100/50 border-purple-200' 
                                                    : 'bg-white border-gray-50 hover:border-gray-200 hover:bg-gray-50/50'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedUsers.includes(user.user_id) ? 'bg-purple-600 border-purple-600 shadow-md' : 'bg-white border-gray-200'}`}>
                                                    {selectedUsers.includes(user.user_id) && <i className="fi fi-rr-check text-[8px] text-white"></i>}
                                                </div>
                                                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                                                    {user.profile_pic_url ? (
                                                        <img src={user.profile_pic_url} className="w-full h-full object-cover" alt="" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                                            {user.user_name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-[11px] font-semibold text-gray-800 truncate">{user.user_name || 'Incomplete Profile'}</h4>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase">{user.employee_id || 'ID-TBD'}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Execution */}
                <div className="p-6 bg-white border-t border-gray-100 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 h-14 rounded-2xl border border-gray-200 text-gray-500 font-semibold uppercase tracking-widest text-[10px] hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
                    >
                        Abort Sequence
                    </button>
                    <button
                        onClick={handleSaveCampaign}
                        disabled={isSubmitting}
                        className="group relative flex-[2] h-14 rounded-2xl bg-[#1e1b4b] text-white overflow-hidden shadow-2xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-[10px] font-semibold uppercase tracking-widest">Processing Injection...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fi fi-rr-disk text-lg group-hover:-translate-y-1 transition-transform"></i>
                                    <span className="text-[10px] font-semibold uppercase tracking-widest">{campaign ? 'Commit Changes' : 'Execute Creation'}</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>

    );
}
