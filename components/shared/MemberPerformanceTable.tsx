import React, { useState, useEffect, useMemo } from 'react';

interface MemberPerformanceTableProps {
    members: any[];
    memberStats: Record<string, any>;
    loading: boolean;
    onRefresh: () => void;
    title?: string;
    lastUpdated?: Date;
}

interface Category {
    id: string;
    name: string;
    userIds: string[];
    isPrimary?: boolean;
}

const LOCAL_STORAGE_KEY = 'agent_performance_categories_v1';

const MemberPerformanceTable: React.FC<MemberPerformanceTableProps> = ({
    members,
    memberStats,
    loading,
    onRefresh,
    title = "Member Performance Breakdown",
    lastUpdated
}) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    // Category Modal Form State
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [categoryNameInput, setCategoryNameInput] = useState<string>('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [userSearchQuery, setUserSearchQuery] = useState<string>('');

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load categories from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                const parsed: Category[] = JSON.parse(saved);
                setCategories(parsed);
                const primary = parsed.find(c => c.isPrimary);
                if (primary) {
                    setSelectedCategoryId(primary.id);
                }
            }
        } catch (e) {
            console.error("Failed to load categories from localStorage", e);
        }
    }, []);

    // Save categories to localStorage
    const saveCategoriesToStorage = (updatedCategories: Category[]) => {
        setCategories(updatedCategories);
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCategories));
        } catch (e) {
            console.error("Failed to save categories to localStorage", e);
        }
    };

    const handleOpenCreateModal = () => {
        setEditingCategoryId(null);
        setCategoryNameInput('');
        setSelectedUserIds([]);
        setUserSearchQuery('');
        setIsModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleOpenEditModal = (cat: Category, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingCategoryId(cat.id);
        setCategoryNameInput(cat.name);
        setSelectedUserIds(cat.userIds || []);
        setUserSearchQuery('');
        setIsModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleToggleUserSelection = (userId: string) => {
        setSelectedUserIds(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSaveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryNameInput.trim()) return;

        let updated: Category[];
        if (editingCategoryId) {
            updated = categories.map(c => 
                c.id === editingCategoryId 
                    ? { ...c, name: categoryNameInput.trim(), userIds: selectedUserIds }
                    : c
            );
        } else {
            const newCategory: Category = {
                id: 'cat_' + Date.now(),
                name: categoryNameInput.trim(),
                userIds: selectedUserIds,
                isPrimary: categories.length === 0 // Make primary if first category
            };
            updated = [...categories, newCategory];
            if (categories.length === 0) {
                setSelectedCategoryId(newCategory.id);
            }
        }

        saveCategoriesToStorage(updated);
        setIsModalOpen(false);
    };

    const handleDeleteCategory = (catId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = categories.filter(c => c.id !== catId);
        if (selectedCategoryId === catId) {
            const remainingPrimary = updated.find(c => c.isPrimary);
            setSelectedCategoryId(remainingPrimary ? remainingPrimary.id : 'all');
        }
        saveCategoriesToStorage(updated);
    };

    const handleSetPrimary = (catId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = categories.map(c => ({
            ...c,
            isPrimary: c.id === catId
        }));
        saveCategoriesToStorage(updated);
        setSelectedCategoryId(catId);
    };

    // Filter members based on selected category
    const filteredMembers = useMemo(() => {
        if (selectedCategoryId === 'all' || categories.length === 0) {
            return members;
        }
        const activeCategory = categories.find(c => c.id === selectedCategoryId);
        if (!activeCategory || !activeCategory.userIds || activeCategory.userIds.length === 0) {
            return members;
        }
        return members.filter(m => activeCategory.userIds.includes(m.user_id));
    }, [members, selectedCategoryId, categories]);

    // Modal user search filter
    const modalFilteredMembers = useMemo(() => {
        if (!userSearchQuery.trim()) return members;
        const q = userSearchQuery.toLowerCase();
        return members.filter(m => 
            (m.user_name || m.name || '').toLowerCase().includes(q) ||
            (m.employee_id || '').toLowerCase().includes(q)
        );
    }, [members, userSearchQuery]);

    const formatTime = (date: string | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatActiveStatus = (isOnline: boolean, lastActive: string | null) => {
        if (isOnline) {
            return {
                text: 'Online',
                badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                dotClass: 'bg-emerald-500 animate-pulse'
            };
        }

        const offlineStyle = {
            badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
            dotClass: 'bg-gray-400'
        };

        if (!lastActive) {
            return {
                text: 'Offline',
                ...offlineStyle
            };
        }

        const now = new Date().getTime();
        const activeTime = new Date(lastActive).getTime();
        if (isNaN(activeTime)) {
            return {
                text: 'Offline',
                ...offlineStyle
            };
        }

        const diffSec = Math.floor((now - activeTime) / 1000);

        if (diffSec < 60 && diffSec >= 0) {
            return {
                text: `Offline ${diffSec}s`,
                ...offlineStyle
            };
        }

        return {
            text: 'Offline',
            ...offlineStyle
        };
    };

    const formatIdleTime = (lastActive: string | null) => {
        if (!lastActive) return 'Idle';
        const now = new Date().getTime();
        const activeTime = new Date(lastActive).getTime();
        if (isNaN(activeTime)) return 'Idle';
        const diffSec = Math.floor((now - activeTime) / 1000);

        if (diffSec < 0) return 'Idle';
        // If more than 4 hours (14400 seconds), show only 'Idle'
        if (diffSec >= 14400) return 'Idle';

        const hours = Math.floor(diffSec / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const seconds = diffSec % 60;

        if (hours > 0) {
            return `Idle ${hours}h:${minutes}m:${seconds}s`;
        } else if (minutes > 0) {
            return `Idle ${minutes}m:${seconds}s`;
        } else {
            return `Idle ${seconds}s`;
        }
    };

    const activeCategoryObj = categories.find(c => c.id === selectedCategoryId);

    const getSelectedLabel = () => {
        if (selectedCategoryId === 'all') return `All Members (${members.length})`;
        if (activeCategoryObj) {
            return `${activeCategoryObj.isPrimary ? '⭐ ' : ''}${activeCategoryObj.name} (${activeCategoryObj.userIds.length})`;
        }
        return 'Categories';
    };

    const handleDownloadExcel = () => {
        if (!filteredMembers || filteredMembers.length === 0) return;
        const BOM = "\uFEFF";
        const headers = ["Agent Name", "Employee ID", "Active Status", "Call Status", "Total Dials", "Dispositions", "Talk Time", "Connected", "Avg Talk", "Streak/Gap", "Utilization", "Last Call"];
        const rows = filteredMembers.map(m => {
            const mId = m.user_id as string;
            const mStats = memberStats[mId] || {};
            const isOnline = mStats.status === 'Online';
            const activeStatus = formatActiveStatus(isOnline, mStats.lastActive).text;
            const callStatus = mStats.onCall 
                ? (mStats.isPersonal ? 'Personal' : 'On Call') 
                : (mStats.lastCallAt ? formatIdleTime(mStats.lastCallAt) : 'Idle');
            const disps = mStats.dispositions || {};
            const dispStr = Object.keys(disps).map(k => `${k}:${disps[k]}`).join(' | ') || '0';
            const lastCallStr = mStats.lastCallAt ? new Date(mStats.lastCallAt).toLocaleString() : 'Never';
            
            return [
                m.user_name || m.name || 'Unknown',
                m.employee_id || '--',
                activeStatus,
                callStatus,
                mStats.totalCalls || 0,
                dispStr,
                mStats.totalTalkTime || '0h 0m 0s',
                mStats.connected || 0,
                mStats.avgDuration || '0m 0s',
                mStats.streakGap || '0/0s',
                mStats.utilization || '0.0%',
                lastCallStr
            ];
        });
        const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
        const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Member_Performance_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left h-full flex flex-col relative">
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
                        className="group w-7 h-7 flex items-center justify-center bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100 rounded-full text-xs font-bold transition-all border border-indigo-100"
                        title="Refresh"
                    >
                        <i className={`fi flex fi-rr-refresh ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}></i>
                    </button>
                    
                    <div className="flex items-center gap-2">
                        {/* Custom Category Selector Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 transition-colors cursor-pointer"
                            >
                                <span>{getSelectedLabel()}</span>
                                <i className={`fi flex fi-rr-angle-small-down text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Custom Popover Menu - SourceId Page Styled */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-xl z-30 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                                    <div className="px-3 py-1.5 border-b border-gray-100 text-xs font-medium text-gray-500 flex justify-between items-center bg-white">
                                        <span>Select Category</span>
                                        <button 
                                            onClick={handleOpenCreateModal}
                                            className="text-[#4b33e8] hover:underline text-xs flex items-center gap-1 font-medium"
                                        >
                                            <i className="fi flex fi-rr-plus text-[10px]"></i> New
                                        </button>
                                    </div>

                                    <div className="max-h-56 overflow-y-auto py-1 scrollbar-thin">
                                        {/* Option: All Members */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategoryId('all');
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                                                selectedCategoryId === 'all' ? 'bg-indigo-50 text-[#4b33e8]' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <i className="fi flex fi-rr-users-alt text-gray-400"></i>
                                                All Members
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-mono">
                                                {members.length}
                                            </span>
                                        </button>

                                        {/* Saved Categories */}
                                        {categories.map(cat => {
                                            const isSelected = selectedCategoryId === cat.id;
                                            return (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => {
                                                        setSelectedCategoryId(cat.id);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-3 py-2 text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                                                        isSelected ? 'bg-indigo-50 text-[#4b33e8]' : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 truncate pr-2">
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => handleSetPrimary(cat.id, e)}
                                                            className={`text-xs transition-transform hover:scale-125 ${
                                                                cat.isPrimary ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400'
                                                            }`}
                                                            title={cat.isPrimary ? 'Primary Category' : 'Set as Primary'}
                                                        >
                                                            ★
                                                        </button>
                                                        <span className="truncate">{cat.name}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 shrink-0">
                                                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#4b33e8] border border-indigo-100 text-[10px] font-mono">
                                                            {cat.userIds.length}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => handleOpenEditModal(cat, e)}
                                                            className="text-gray-400 hover:text-[#4b33e8] p-0.5"
                                                            title="Edit"
                                                        >
                                                            <i className="fi flex fi-rr-edit text-[10px]"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Light Green Excel Download Button */}
                        <button 
                            onClick={handleDownloadExcel}
                            className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center transition-all"
                            title="Download Excel / CSV"
                        >
                            <i className="fi flex fi-rr-file-excel text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
                <table className="w-full text-left border-collapse min-w-[1000px] text-xs">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-500 font-medium uppercase text-[10px] tracking-wider bg-gray-50/80 sticky top-0 z-10 backdrop-blur-sm">
                            <th className="py-2.5 px-4 font-semibold">Agent</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Active Status</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Call Status</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Total Dials</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Dispositions</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Talk Time</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Connected</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Avg Talk</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Streak / Gap</th>
                            <th className="py-2.5 px-3 font-semibold text-center">Utilization</th>
                            <th className="py-2.5 px-4 font-semibold text-right">Last Call</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredMembers.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="px-4 py-8 text-center text-gray-400 text-xs font-medium">
                                    No members found {selectedCategoryId !== 'all' ? 'in this category' : ''}
                                </td>
                            </tr>
                        ) : filteredMembers.map(member => {
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
                                onCall: false,
                                dispositions: {},
                                totalDispositions: 0
                            };
                            
                            const isOnline = mStats.status === 'Online';
                            const disps = mStats.dispositions || {};
                            const dispKeys = Object.keys(disps);
                            
                            return (
                                <tr key={member.user_id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center text-gray-400 font-semibold text-xs shrink-0">
                                                {member.profile_pic_url || member.profilePic ? (
                                                    <img src={member.profile_pic_url || member.profilePic} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <i className="fi flex fi-rr-user text-sm"></i>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-800 leading-none">{member.user_name || member.name || 'Unknown'}</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5 font-medium font-mono">ID: {member.employee_id || '--'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    {/* 1. Active Status Column */}
                                    <td className="py-3 px-3 text-center">
                                         {(() => {
                                             const activeStatus = formatActiveStatus(isOnline, mStats.lastActive);
                                             return (
                                                 <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${activeStatus.badgeClass}`}>
                                                     <span className={`w-1.5 h-1.5 rounded-full ${activeStatus.dotClass}`}></span>
                                                     {activeStatus.text}
                                                 </div>
                                             );
                                         })()}
                                     </td>

                                    {/* 2. Call Status Column */}
                                    <td className="py-3 px-3 text-center">
                                        {mStats.onCall ? (
                                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${mStats.isPersonal ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                                              <i className={`fi flex ${mStats.isPersonal ? 'fi-rr-book-user text-amber-500' : 'fi-rr-headset text-indigo-500'} text-[10px] animate-pulse`}></i>
                                              {mStats.isPersonal ? 'Personal' : 'On Call'}
                                          </div>
                                        ) : mStats.lastCallAt ? (
                                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                              {formatIdleTime(mStats.lastCallAt)}
                                          </div>
                                        ) : (
                                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                              Idle
                                          </div>
                                        )}
                                    </td>

                                    {/* Total Dials */}
                                    <td className="py-3 px-3 text-center">
                                        <span className="text-xs font-bold text-indigo-600 font-mono">
                                            {mStats.totalCalls}
                                        </span>
                                    </td>

                                    {/* 3. Dispositions Breakdown Column */}
                                    <td className="py-3 px-3 text-center">
                                        {dispKeys.length === 0 ? (
                                            <span className="text-xs text-gray-400 font-medium font-mono">0</span>
                                        ) : (
                                            <div className="flex flex-wrap items-center justify-center gap-1 max-w-[160px] mx-auto">
                                                {dispKeys.map(k => (
                                                    <span 
                                                        key={k} 
                                                        className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-700 rounded text-[10px] font-medium whitespace-nowrap"
                                                        title={`${k}: ${disps[k]}`}
                                                    >
                                                        {k}: <strong className="text-indigo-600 font-mono">{disps[k]}</strong>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    
                                    <td className="py-3 px-3 text-center text-xs text-gray-700 font-semibold font-mono">
                                        {mStats.totalTalkTime}
                                    </td>
                                    
                                    <td className="py-3 px-3 text-center">
                                        <span className="text-xs font-bold text-gray-800 font-mono">{mStats.connected}</span>
                                        <span className="text-[10px] text-emerald-600 font-medium ml-1">({mStats.connectedRate}%)</span>
                                    </td>
                                    
                                    <td className="py-3 px-3 text-center text-xs text-gray-600 font-medium font-mono">
                                        {mStats.avgDuration}
                                    </td>
                                    
                                    <td className="py-3 px-3 text-center text-xs text-amber-700 font-semibold font-mono">
                                        {mStats.streakGap}
                                    </td>
                                    
                                    <td className="py-3 px-3 text-center">
                                        <span className="text-xs font-bold text-rose-600 font-mono">
                                            {mStats.utilization}
                                        </span>
                                    </td>
                                    
                                    <td className="py-3 px-4 text-right">
                                        <p className="text-xs font-semibold text-gray-800 font-mono">{formatTime(mStats.lastCallAt)}</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase">
                                            {mStats.lastCallAt ? new Date(mStats.lastCallAt).toLocaleDateString([], { day: '2-digit', month: 'short' }) : 'Never'}
                                        </p>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Categories Management Modal - SourceId Page Styled */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
                        {/* Modal Header */}
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                            <div>
                                <h4 className="font-bold text-gray-800 text-base">
                                    {editingCategoryId ? 'Edit Category' : 'Create New Category'}
                                </h4>
                                <p className="text-xs text-gray-500 font-medium">Group members into custom categories</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <i className="fi flex fi-rr-cross text-xs"></i>
                            </button>
                        </div>

                        {/* Existing Categories Pill Bar */}
                        {categories.length > 0 && (
                            <div className="px-5 py-3 border-b border-gray-200 bg-gray-50/50">
                                <p className="text-xs text-gray-500 font-medium mb-2">Saved Categories</p>
                                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto scrollbar-thin">
                                    {categories.map(cat => (
                                        <div 
                                            key={cat.id} 
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                                                editingCategoryId === cat.id 
                                                    ? 'bg-[#4b33e8] text-white border-[#4b33e8]' 
                                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {/* Primary Star Icon */}
                                            <button 
                                                type="button"
                                                onClick={(e) => handleSetPrimary(cat.id, e)}
                                                className={`text-xs transition-transform hover:scale-125 ${
                                                    cat.isPrimary ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400'
                                                }`}
                                                title={cat.isPrimary ? 'Primary Category' : 'Set as Primary'}
                                            >
                                                ★
                                            </button>
                                            <span onClick={(e) => handleOpenEditModal(cat, e)} className="cursor-pointer font-medium">{cat.name}</span>
                                            <span className="text-[10px] opacity-75 font-mono">({cat.userIds?.length || 0})</span>
                                            
                                            {/* Edit Button */}
                                            <button 
                                                type="button" 
                                                onClick={(e) => handleOpenEditModal(cat, e)}
                                                className="ml-1 text-gray-400 hover:text-indigo-500"
                                                title="Edit Category"
                                            >
                                                <i className="fi flex fi-rr-edit text-[10px]"></i>
                                            </button>
                                            {/* Delete Button */}
                                            <button 
                                                type="button" 
                                                onClick={(e) => handleDeleteCategory(cat.id, e)}
                                                className="text-gray-400 hover:text-rose-500"
                                                title="Delete Category"
                                            >
                                                <i className="fi flex fi-rr-cross-small text-xs"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Modal Body Form */}
                        <form onSubmit={handleSaveCategory} className="flex-1 flex flex-col overflow-hidden p-5 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1">
                                    Category Name
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    value={categoryNameInput}
                                    onChange={(e) => setCategoryNameInput(e.target.value)}
                                    placeholder="e.g. Sales Team Alpha, Renewal Specialists..."
                                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-normal text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] transition-colors"
                                />
                            </div>

                            <div className="flex-1 flex flex-col min-h-0">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-800">
                                        Select Active Members <span className="text-gray-500 font-normal">({selectedUserIds.length} selected)</span>
                                    </label>
                                    <input 
                                        type="text"
                                        value={userSearchQuery}
                                        onChange={(e) => setUserSearchQuery(e.target.value)}
                                        placeholder="Search agents..."
                                        className="px-3 py-1 bg-white border border-gray-300 rounded-lg text-xs font-normal text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8]"
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white scrollbar-thin">
                                    {modalFilteredMembers.length === 0 ? (
                                        <p className="p-4 text-center text-xs text-gray-400 font-medium">No agents found</p>
                                    ) : (
                                        modalFilteredMembers.map(m => {
                                            const isSelected = selectedUserIds.includes(m.user_id);
                                            return (
                                                <div 
                                                    key={m.user_id}
                                                    onClick={() => handleToggleUserSelection(m.user_id)}
                                                    className={`px-3.5 py-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                                                        isSelected ? 'bg-indigo-50/60' : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-xs font-bold text-gray-500">
                                                            {m.profile_pic_url || m.profilePic ? (
                                                                <img src={m.profile_pic_url || m.profilePic} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <i className="fi flex fi-rr-user"></i>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-800">{m.user_name || m.name || 'Unknown'}</p>
                                                            <p className="text-[10px] text-gray-400 font-mono">ID: {m.employee_id || '--'}</p>
                                                        </div>
                                                    </div>
                                                     <div 
                                                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                                            isSelected 
                                                                ? 'bg-[#4b33e8] border border-[#4b33e8] text-white shadow-sm scale-105' 
                                                                : 'bg-white border border-gray-300 text-transparent hover:border-gray-400'
                                                        }`}
                                                     >
                                                         <i className="fi flex fi-rr-check text-[10px]"></i>
                                                     </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Form Action Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-[#4b33e8] hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
                                >
                                    {editingCategoryId ? 'Update Category' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberPerformanceTable;

