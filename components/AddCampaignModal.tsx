import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
    id: string;
    user_id: string;
    user_name: string | null;
    email: string;
    profile_pic_url: string | null;
    employee_id?: string | null;
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


    // Initialize form when modal opens or campaign changes
    useEffect(() => {
        if (isOpen) {
            if (campaign) {
                // Editing mode
                setCampaignId(campaign.id);
                setCampaignName(campaign.name || "");
                setCampaignDescription(campaign.description || "");
                setCampaignStatus(campaign.status || "active");
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
            }
            setSearchTerm("");
        }
    }, [isOpen, campaign]);

    const filteredUsers = users.filter(user =>
        (user.user_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveCampaign = async () => {
        if (!campaignName.trim()) {
            alert("Please enter campaign name");
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

            const campaignData = {
                id: campaignId,
                name: campaignName,
                description: campaignDescription,
                status: campaignStatus,
                users: selectedUserObjects,
                [campaign ? 'updated_at' : 'created_at']: new Date().toISOString(),
            };

            // If it's a new campaign, add creator info
            if (!campaign) {
                (campaignData as any).created_by = currentUser?.displayName || currentUser?.email || "Unknown";
                (campaignData as any).employee_id = currentUser?.employeeId || null;
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
            <div className="relative w-full max-w-3xl transform rounded-2xl bg-white shadow-2xl transition-all scale-100 opacity-100 border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {campaign ? 'Edit Campaign' : 'New Campaign'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {campaign ? 'Modify campaign details and team' : 'Create a new marketing campaign to track activities'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none"
                    >
                        <i className="fi flex fi-rr-cross text-sm"></i>
                    </button>
                </div>

                {/* Body - Two Column Layout */}
                <div className="flex flex-col md:flex-row h-[65vh] overflow-hidden">

                    {/* Left Column: Details & Assigned Users */}
                    <div className="flex-1 p-6 space-y-5 overflow-y-auto border-r border-gray-100 custom-scrollbar">

                        {/* Campaign ID (Read-only) */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 bg-blue-50/50 rounded-xl p-3 border border-blue-100 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Campaign ID</span>
                                    <span className="text-sm font-mono font-medium text-blue-800">{campaignId}</span>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <i className="fi flex fi-rr-fingerprint text-sm"></i>
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5 px-1">Status</span>
                                <div
                                    onClick={() => setCampaignStatus(prev => prev === 'active' ? 'inactive' : 'active')}
                                    className={`relative w-32 h-10 rounded-full cursor-pointer transition-all duration-300 p-1 flex items-center border-2 ${campaignStatus === 'active'
                                        ? "bg-green-50 border-green-200"
                                        : "bg-orange-50 border-orange-200"
                                        }`}
                                >
                                    <div className={`absolute top-1 bottom-1 w-[54px] rounded-full transition-all duration-300 flex items-center justify-center shadow-md ${campaignStatus === 'active'
                                        ? "left-1 bg-green-500 text-white translate-x-0"
                                        : "left-1 translate-x-[60px] bg-orange-500 text-white"
                                        }`}>
                                        <span className="text-[10px] font-black uppercase tracking-wider">
                                            {campaignStatus === 'active' ? 'ON' : 'OFF'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between w-full px-3 pointer-events-none">
                                        <span className={`text-[9px] font-black transition-opacity duration-300 ${campaignStatus === 'active' ? 'opacity-0' : 'opacity-40 text-orange-800'}`}>ACTIVE</span>
                                        <span className={`text-[9px] font-black transition-opacity duration-300 ${campaignStatus === 'inactive' ? 'opacity-0' : 'opacity-40 text-green-800'}`}>INACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 block">Campaign Name <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    placeholder="e.g. Q4 Sales Drive"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
                                    autoFocus
                                />
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <i className="fi flex fi-rr-badge text-sm"></i>
                                </div>
                            </div>
                        </div>

                        {/* Description Input */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 block">Description</label>
                            <div className="relative">
                                <textarea
                                    value={campaignDescription}
                                    onChange={(e) => setCampaignDescription(e.target.value)}
                                    placeholder="Briefly describe the goals and target audience..."
                                    rows={2}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-sm text-gray-700 placeholder-gray-400 resize-none"
                                />
                                <div className="absolute left-3.5 top-3.5 text-gray-400">
                                    <i className="fi flex fi-rr-align-left text-sm"></i>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Team Display (Previous selection position) */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700 block text-purple-600">Selected Team</label>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedUsers.length} MEMBERS</span>
                            </div>

                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {selectedUsers.length === 0 ? (
                                    <div className="text-xs text-gray-400 italic py-2">No team members assigned yet. Use the panel on the right ➜</div>
                                ) : (
                                    selectedUsers.map(uid => {
                                        const user = users.find(u => u.user_id === uid || u.id === uid);
                                        return (
                                            <div key={uid} className="flex items-center gap-2 bg-purple-50 border border-purple-100 px-2 py-1.5 rounded-lg group animate-in fade-in zoom-in duration-200">
                                                {user?.profile_pic_url ? (
                                                    <img src={user.profile_pic_url} className="w-5 h-5 rounded-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center text-[8px] font-bold text-purple-700">
                                                        {user?.user_name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <span className="text-xs font-medium text-gray-700">{user?.user_name || 'User'}</span>
                                                <button
                                                    onClick={() => setSelectedUsers(prev => prev.filter(id => id !== uid))}
                                                    className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <i className="fi flex fi-rr-cross-small text-xs"></i>
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: User Assignment (Search & List) */}
                    <div className="w-full md:w-[320px] bg-gray-50/50 flex flex-col h-full border-l border-gray-100">
                        <div className="p-5 flex flex-col h-full">
                            <div className="space-y-4 flex flex-col h-full">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-gray-800">Assign Members</h3>
                                    <p className="text-[10px] text-gray-500">Pick team members for this campaign</p>
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-xs text-gray-700 placeholder-gray-400 shadow-sm"
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <i className="fi flex fi-rr-search text-xs"></i>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto mt-2 space-y-1 custom-scrollbar pr-1">
                                    {loadingUsers ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                            <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                                            <span className="text-xs">Loading...</span>
                                        </div>
                                    ) : filteredUsers.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-white/50 rounded-xl border border-dashed border-gray-200 py-10">
                                            <i className="fi flex fi-rr-search-alt text-lg mb-2"></i>
                                            <span className="text-[10px] font-medium">No results found</span>
                                        </div>
                                    ) : (
                                        filteredUsers.map((user, index) => (
                                            <label
                                                key={user.id}
                                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border ${selectedUsers.includes(user.id)
                                                    ? "bg-purple-100/50 border-purple-200 shadow-sm"
                                                    : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <div className="relative flex-shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.user_id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedUsers([...selectedUsers, user.user_id]);
                                                            } else {
                                                                setSelectedUsers(selectedUsers.filter(id => id !== user.user_id));
                                                            }
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedUsers.includes(user.user_id) ? "bg-purple-600 border-purple-600 rotate-0 scale-100" : "bg-white border-gray-300 -rotate-90 scale-95"
                                                        }`}>
                                                        {selectedUsers.includes(user.user_id) && <i className="fi flex fi-rr-check text-[8px] text-white"></i>}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    {user.profile_pic_url ? (
                                                        <img src={user.profile_pic_url} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-white" />
                                                    ) : (
                                                        <div
                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${["#10B981", "#3B82F6", "#8B5CF6"][index % 3]} 0%, ${["#059669", "#2563EB", "#7C3AED"][index % 3]} 100%)`,
                                                            }}
                                                        >
                                                            {user.user_name ? user.user_name.charAt(0).toUpperCase() : "U"}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-[11px] font-semibold text-gray-800 truncate">{user.user_name || "Unknown"}</div>
                                                        <div className="text-[9px] text-gray-500 truncate">{user.email}</div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 pt-2 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveCampaign}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all transform active:scale-95 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                {campaign ? 'Saving...' : 'Creating...'}
                            </>
                        ) : (
                            <>
                                <i className="fi flex fi-rr-disk text-xs"></i>
                                {campaign ? 'Save Changes' : 'Create Campaign'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
