import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";
import { logSystemEvent, estimateSize } from "../lib/monitoring";

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  team?: any; // If editing
  users: any[];
  organizations: any[];
}

export default function TeamManagementModal({
  isOpen,
  onClose,
  onSave,
  team,
  users,
  organizations,
}: TeamManagementModalProps) {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (team) {
      setName(team.name || "");
      setLeaderId(team.leader_id || "");
      setOrganizationId(team.organization_id || "");
      setSelectedMembers(team.members || []);
      setIsActive(team.is_active ?? true);
    } else {
      setName("");
      setLeaderId("");
      setOrganizationId("");
      setSelectedMembers([]);
      setIsActive(true);
    }
    setError("");
  }, [team, isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !leaderId || !organizationId) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const teamData = {
        name,
        leader_id: leaderId,
        organization_id: organizationId,
        members: selectedMembers,
        is_active: isActive,
      };

      if (team?.id) {
        const { error: updateError } = await supabase
          .from("teams")
          .update(teamData)
          .eq("id", team.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("teams")
          .insert([teamData]);
        if (insertError) throw insertError;
      }

      onSave();
      onClose();

      logSystemEvent({
          event_type: 'WRITE',
          description: team?.id ? `Update Team: ${name}` : `Create Team: ${name}`,
          metadata: { 
              team_id: team?.id || 'new', 
              team_name: name, 
              member_count: selectedMembers.length,
              organization_id: organizationId 
          },
          payload_size: estimateSize(teamData),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });
    } catch (err: any) {
      console.error("Error saving team:", err);
      setError(err.message || "Failed to save team");
    } finally {
      setSaving(false);
    }
  };

  const toggleMember = (userId: string) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {team ? "Edit Team" : "Create New Team"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Define your team structure and members</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <i className="fi flex fi-rr-cross-small text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {(() => {
            const filteredUsers = users.filter((u) => !organizationId || u.organization_id === organizationId);
            
            return (
              <>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
              <i className="fi fi-rr-exclamation"></i>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1">Team Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alpha Sales Force"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-500 focus:border-transparent outline-none transition-all text-sm bg-gray-50/50"
                required
              />
            </div>

            {/* Organization Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1">Organization *</label>
              <select
                value={organizationId}
                onChange={(e) => {
                  setOrganizationId(e.target.value);
                  setLeaderId("");
                  setSelectedMembers([]);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-500 focus:border-transparent outline-none transition-all text-sm bg-gray-50/50"
                required
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>{org.company_name}</option>
                ))}
              </select>
            </div>

            {/* Leader Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider px-1">Team Leader *</label>
              <select
                value={leaderId}
                onChange={(e) => setLeaderId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-500 focus:border-transparent outline-none transition-all text-sm bg-gray-50/50"
                required
              >
                <option value="">Select Leader</option>
                {filteredUsers.map((u) => (
                  <option key={u.uid} value={u.uid}>{u.user_name || u.email}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Members Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Members</label>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {selectedMembers.length} Selected
              </span>
            </div>
            
            <div className="border border-gray-100 rounded-xl overflow-hidden">
               <div className="max-h-60 overflow-y-auto bg-gray-50/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
                    {filteredUsers.length === 0 ? (
                      <div className="col-span-2 text-center py-4 text-xs text-gray-400">
                        {organizationId ? 'No users found in this organization' : 'Select an organization to view members'}
                      </div>
                    ) : filteredUsers.map((member) => (
                      <div 
                        key={member.uid}
                        onClick={() => toggleMember(member.uid)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                          selectedMembers.includes(member.uid) 
                            ? 'bg-indigo-50 border-indigo-100 border' 
                            : 'hover:bg-gray-100 border-transparent border'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                           selectedMembers.includes(member.uid) 
                            ? 'bg-[#4b33e8] border-[#4b33e8]' 
                            : 'bg-white border-gray-300'
                        }`}>
                          {selectedMembers.includes(member.uid) && <i className="fi fi-rr-check text-[10px] text-white"></i>}
                        </div>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {member.user_name?.substring(0,1) || '?'}
                          </div>
                          <div className="truncate">
                             <p className="text-xs font-semibold text-gray-700 truncate">{member.user_name || 'No Name'}</p>
                             <p className="text-[10px] text-gray-400 truncate">{member.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 px-1">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isActive} 
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4b33e8]"></div>
            </label>
            <span className="text-sm font-medium text-gray-700">Team is Active</span>
          </div>

              </>
            );
          })()}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ backgroundColor: "#4b33e8" }}
          >
            {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            {team ? "Update Team" : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
}
