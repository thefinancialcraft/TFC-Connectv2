// pages/organization/create.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { logSystemEvent, estimateSize } from '@/lib/monitoring';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useUser } from "@/components/AppLayout";
import { getStoredUserData } from "@/lib/localStorageUtils";

const companyTypes = [
  'Sales', 'Marketing', 'Information Technology (IT)', 'Finance', 'Accounts',
  'Human Resources (HR)', 'Operations', 'Customer Support / Customer Success',
  'Administration', 'Legal & Compliance', 'Procurement / Purchase',
  'Supply Chain / Logistics', 'Research & Development (R&D)', 'Quality Assurance (QA)',
  'Product Management', 'Business Development', 'Strategy & Planning',
  'Training & Learning', 'Security', 'Facilities Management', 'Insurance',
  'School', 'Others'
];

const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  // Extract only YYYY-MM-DD part
  const datePart = dateString.split('T')[0];
  if (!datePart.includes('-')) return "—";
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
};

export default function CreateOrganization() {
  const router = useRouter();
  const { user, mounted, loading: authLoading } = useUser();

  const [form, setForm] = useState({
    company_name: '',
    company_type: '',
    description: '',
    owner_name: '',
    owner_phone_no: '',
    gst_no: '',
    address: '',
    email: '',
    renewal_date: new Date().toISOString().split('T')[0],
    expiry_date: (() => {
      const today = new Date();
      // Logic: Set expiry to the last day of the current month
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const year = lastDay.getFullYear();
      const month = String(lastDay.getMonth() + 1).padStart(2, '0');
      const day = String(lastDay.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })(),
    is_active: true,
    company_joined: new Date().toISOString().split('T')[0],
    org_code: '',
  });
  const [unassignedUsers, setUnassignedUsers] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [ownerMode, setOwnerMode] = useState<'new' | 'existing'>('new');
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogoutClick = async () => {
    // router.push already handled by AppLayout logout but we can keep the callback if needed for consistency
  };

  // Page level protection logic (Strict: Hidden by default)
  useEffect(() => {
    if (mounted && user) {
      const isOrgVisible = user.isClient === false || 
                          (user.isClient === true && user.designation?.toLowerCase() === 'ceo');
      
      if (!isOrgVisible) {
        console.warn("Unauthorized access to organization create, redirecting...");
        router.replace('/dashboard');
      }
    }
  }, [mounted, user, router]);

  useEffect(() => {
    fetchUnassignedUsers();
  }, []);

  const fetchUnassignedUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .is('organization_id', null);
      
      if (data) setUnassignedUsers(data);
      if (error) throw error;
    } catch (err: any) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOwnerModeChange = (mode: 'new' | 'existing') => {
    setOwnerMode(mode);
    if (mode === 'new') {
      setForm(prev => ({ ...prev, owner_name: '', owner_phone_no: '', email: '' }));
      setSelectedOwnerId('');
    }
  };

  const handleOwnerSelect = (userId: string) => {
    const selectedUser = unassignedUsers.find(u => u.user_id === userId);
    if (selectedUser) {
      setSelectedOwnerId(userId);
      setForm(prev => ({
        ...prev,
        owner_name: selectedUser.user_name || '',
        owner_phone_no: selectedUser.contact_no || '',
        email: selectedUser.email || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
        // 1. Create the Organization
        const { data: newOrg, error: insertError } = await supabase
            .from('organizations')
            .insert([
                {
                    company_name: form.company_name,
                    company_type: form.company_type || null,
                    description: form.description || null,
                    owner_name: form.owner_name || null,
                    owner_phone_no: form.owner_phone_no || null,
                    email: form.email || null,
                    gst_no: form.gst_no || null,
                    address: form.address || null,
                    renewal_date: form.renewal_date || null,
                    expiry_date: form.expiry_date || null,
                    is_active: form.is_active,
                    company_joined: form.company_joined ? new Date(form.company_joined).toISOString() : new Date().toISOString(),
                    org_code: form.org_code ? form.org_code.toUpperCase() : null,
                    company_code: form.org_code ? `CM${form.org_code.toUpperCase()}1` : null,
                },
            ])
            .select()
            .single();
        
        if (insertError) throw insertError;
        if (!newOrg) throw new Error("Failed to create organization record.");

        // 2. Handle Owner Association/Creation
        let finalOwnerUserId = selectedOwnerId;

        if (ownerMode === 'new') {
          // Create new user via signup API
          const signupRes = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: form.email,
              password: ownerPassword,
              user_name: form.owner_name,
              contact_no: form.owner_phone_no,
              user_type: 'employee',
              organization_id: newOrg.id,
              from_admin_panel: true,
              is_client: true, // Owner represents the client organization
              joined_at: form.company_joined ? new Date(form.company_joined).toISOString() : new Date().toISOString(),
              renewal_at: form.renewal_date ? new Date(form.renewal_date).toISOString() : new Date().toISOString(),
              expire_at: form.expiry_date ? new Date(form.expiry_date).toISOString() : (() => {
                const today = new Date();
                const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                const year = lastDay.getFullYear();
                const month = String(lastDay.getMonth() + 1).padStart(2, '0');
                const day = String(lastDay.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
              })()
            })
          });

          const signupData = await signupRes.json();
          if (!signupRes.ok) throw new Error(signupData.error || 'Failed to create owner profile');
          // No need to update organization_id separately as it's passed to signup
        } else if (ownerMode === 'existing' && selectedOwnerId) {
          // Update existing user's organization_id
          const { error: ownerUpdateError } = await supabase
            .from('user_profiles')
            .update({ organization_id: newOrg.id, role: 'admin' }) // Make owner an admin
            .eq('user_id', selectedOwnerId);
          
          if (ownerUpdateError) throw ownerUpdateError;
        }

        // 3. Handle additional members deployment
        const allUserIdsToAssociate = [
          ...(ownerMode === 'existing' ? [] : []), // Owner already handled above
          ...selectedUserIds.filter(id => id !== selectedOwnerId)
        ];

        if (allUserIdsToAssociate.length > 0) {
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({ organization_id: newOrg.id })
                .in('user_id', allUserIdsToAssociate);
            
            if (updateError) throw updateError;
        }

        logSystemEvent({
          event_type: 'WRITE',
          description: `Onboard Organization: ${form.company_name}`,
          metadata: { 
            organization_id: newOrg.id, 
            organization_name: form.company_name,
            org_code: form.org_code,
            initial_members: allUserIdsToAssociate.length + 1,
            owner_mode: ownerMode
          },
          payload_size: estimateSize(form),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.uid ? undefined : undefined // This is internal staff action usually
        });

        router.push('/organization');
    } catch (err: any) {
        console.error('Submission error:', err);
        setError(err.message || 'Failed to register organization');
    } finally {
        setSubmitting(false);
    }
  };



  if (!mounted || authLoading) return null;

  return (
    <>
      <Head>
        <title>Onboard Asset • TFC Nexus</title>
      </Head>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .glass-panel {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 px-1">
              <span className="cursor-pointer hover:text-[#4b33e8] transition-colors" onClick={() => router.push("/dashboard")}>
                Dashboard
              </span>
              <i className="fi flex fi-rr-angle-small-right text-[10px]"></i>
              <span className="cursor-pointer hover:text-[#4b33e8] transition-colors" onClick={() => router.push("/organization")}>
                Organizations
              </span>
              <i className="fi flex fi-rr-angle-small-right text-[10px]"></i>
              <span className="text-gray-600 font-bold">Onboard New</span>
            </div>

          {/* Dynamic Interactive Header */}
          <div className="relative w-full overflow-hidden rounded-3xl pt-12 pb-32 mb-8 shadow-xl">
             <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] z-0"></div>
             {/* Decorative Elements */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse"></div>
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] -ml-40 -mb-40"></div>
             
             <div className="px-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
                   <div className="text-center md:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-[10px] font-semibold uppercase tracking-[0.2em] mb-6">
                         <i className="fi flex flex fi-rr-sparkles text-amber-300"></i>
                         New Onboarding Sequence
                      </div>
                      <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4 drop-shadow-sm">
                        Asset <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-blue-200">Registration</span>
                      </h1>
                      <p className="text-indigo-100/60 max-w-xl font-medium text-base leading-relaxed">
                        Configure organizational identity, operational compliance, and license life-cycles within our secure infrastructure.
                      </p>
                   </div>
                   
                   {/* Step Indicator (Visual Only) */}
                   <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 ">
                      <div className="flex -space-x-3">
                         {[1, 2, 3].map(i => (
                           <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#1e1b4b] flex items-center justify-center text-xs font-semibold transition-all ${i === 1 ? 'bg-indigo-400 text-white' : 'bg-white/10 text-white/40'}`}>
                             0{i}
                           </div>
                         ))}
                      </div>
                      <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
                      <div>
                        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest leading-none mb-1.5">Current Phase</p>
                        <p className="text-xs font-bold text-white tracking-widest uppercase">Identity Mapping</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="px-0 sm:px-4 -mt-20 relative z-20">
            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto">
              
              {/* Left Column: Input Sections */}
              <div className="flex-1 space-y-8">
                
                {error && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4 animate-shake">
                    <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200">
                      <i className="fi flex flex fi-rr-cross-small text-xl font-bold"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-red-400 uppercase tracking-widest leading-none mb-1">Upload Error</p>
                      <p className="text-sm font-bold text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Section I: Core Identity */}
                <div className="bg-white rounded-2xl p-10  shadow-gray-200/50 border border-gray-50 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl transition-colors group-hover:bg-indigo-100/50"></div>
                   
                   <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                          <i className="fi flex flex fi-rr-building text-2xl"></i>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Identity & Branding</h2>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company Core Details</p>
                        </div>
                      </div>
                      <div className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest">Step 01</div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Legal Company Name</label>
                        <div className="relative">
                          <i className="fi flex flex fi-rr-shop absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                          <input
                            type="text"
                            name="company_name"
                            value={form.company_name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Nexus Global Innovations"
                            className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-500 focus:shadow-xl focus:shadow-indigo-500/5 transition-all outline-none"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-1">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1 text-center">Org Prefix</label>
                        <input
                          type="text"
                          name="org_code"
                          value={form.org_code}
                          onChange={(e) => setForm({...form, org_code: e.target.value.toUpperCase().substring(0, 3)})}
                          required
                          maxLength={3}
                          placeholder="NXI"
                          className="w-full h-14 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 text-center tracking-[0.5em] focus:outline-none focus:bg-white focus:border-indigo-500 focus:shadow-xl focus:shadow-indigo-500/5 transition-all outline-none uppercase"
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Industry Vertical / Sector</label>
                        <div className="relative">
                           <i className="fi flex flex fi-rr-apps absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                           <select
                              name="company_type"
                              value={form.company_type}
                              onChange={handleChange}
                              className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer outline-none"
                           >
                              <option value="">Choose Industry Sector</option>
                              {companyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                           <i className="fi flex flex fi-rr-angle-small-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                        </div>
                      </div>

                      <div className="md:col-span-4">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Vision & Mission</label>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Briefly describe the business model and core values..."
                          className="w-full px-6 py-5 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 resize-none focus:outline-none focus:bg-white focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
                        />
                      </div>
                   </div>
                </div>

                 {/* Section II: Operational Compliance */}
                 <div className="bg-white rounded-2xl p-10 shadow-gray-200/50 border border-gray-50 group">
                    <div className="flex items-center justify-between mb-10">
                       <div className="flex items-center gap-5">
                         <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                           <i className="fi flex flex fi-rr-shield-check text-2xl"></i>
                         </div>
                         <div>
                           <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Compliance & Registry</h2>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Owner & Contact Interface</p>
                         </div>
                       </div>
                       <div className="text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-widest">Step 02</div>
                    </div>

                    <div className="space-y-8">
                       {/* Owner Mode Selection */}
                       <div className="flex items-center gap-4 p-1.5 bg-slate-100/50 rounded-2xl w-fit">
                          <button
                            type="button"
                            onClick={() => handleOwnerModeChange('new')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${ownerMode === 'new' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                          >
                             <i className="fi flex flex fi-rr-user-add mr-2"></i>
                             New Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOwnerModeChange('existing')}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${ownerMode === 'existing' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                          >
                             <i className="fi flex flex fi-rr-user-check mr-2"></i>
                             Existing Citizen
                          </button>
                       </div>

                       {ownerMode === 'existing' && (
                         <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                           <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Select Unassigned Member</label>
                           <div className="relative">
                             <i className="fi flex flex fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                             <select
                               value={selectedOwnerId}
                               onChange={(e) => handleOwnerSelect(e.target.value)}
                               className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all appearance-none cursor-pointer outline-none"
                             >
                                <option value="">Choose User Profile...</option>
                                {unassignedUsers.map(u => (
                                  <option key={u.user_id} value={u.user_id}>
                                    {u.user_name || u.email} ({u.email})
                                  </option>
                                ))}
                             </select>
                             <i className="fi flex flex fi-rr-angle-small-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                           </div>
                         </div>
                       )}

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Principal / Owner Name</label>
                            <div className="relative">
                              <i className="fi flex flex fi-rr-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                              <input
                                type="text"
                                name="owner_name"
                                value={form.owner_name}
                                onChange={handleChange}
                                readOnly={ownerMode === 'existing'}
                                placeholder="Full Name"
                                className={`w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none ${ownerMode === 'existing' ? 'opacity-70 grayscale-[0.5]' : ''}`}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Operational Contact</label>
                            <div className="relative">
                              <i className="fi flex flex fi-rr-phone-call absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                              <input
                                type="tel"
                                name="owner_phone_no"
                                value={form.owner_phone_no}
                                onChange={handleChange}
                                readOnly={ownerMode === 'existing'}
                                placeholder="+91 XXX XXX XXXX"
                                className={`w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none ${ownerMode === 'existing' ? 'opacity-70 grayscale-[0.5]' : ''}`}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Official Support Email</label>
                            <div className="relative">
                              <i className="fi flex flex fi-rr-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                              <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                readOnly={ownerMode === 'existing'}
                                placeholder="admin@organization.com"
                                className={`w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none ${ownerMode === 'existing' ? 'opacity-70 grayscale-[0.5]' : ''}`}
                              />
                            </div>
                          </div>
                          
                          {ownerMode === 'new' && (
                            <div className="animate-in zoom-in-95 duration-300">
                              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1 text-emerald-600">Secure Access Key (Password)</label>
                              <div className="relative">
                                <i className="fi flex flex fi-rr-lock absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400"></i>
                                <input
                                  type="password"
                                  value={ownerPassword}
                                  onChange={(e) => setOwnerPassword(e.target.value)}
                                  required={ownerMode === 'new'}
                                  placeholder="••••••••"
                                  className="w-full h-14 pl-14 pr-6 bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none"
                                />
                              </div>
                            </div>
                          )}

                          <div className={ownerMode === 'existing' ? 'md:col-span-1' : 'md:col-span-2'}>
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">GST Identification (GSTIN)</label>
                            <div className="relative">
                              <i className="fi flex flex fi-rr-document-signed absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                              <input
                                type="text"
                                name="gst_no"
                                value={form.gst_no}
                                onChange={handleChange}
                                placeholder="Compliance Code"
                                className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 uppercase focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none"
                              />
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Registered Business Address</label>
                            <div className="relative">
                              <i className="fi flex flex fi-rr-marker absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                              <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Building, Street, City, State, ZIP"
                                className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none"
                              />
                            </div>
                          </div>
                       </div>
                    </div>
                 </div>

                {/* Section III: Subscription Lifecycle */}
                <div className="bg-white rounded-2xl p-10  shadow-gray-200/50 border border-gray-50 overflow-hidden relative group">
                   <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-50 rounded-full -mr-24 -mb-24 blur-3xl opacity-50"></div>
                   
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-amber-100">
                          <i className="fi flex flex fi-rr-crown text-2xl"></i>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Lifecycle & Licensing</h2>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Validations & Deadlines</p>
                        </div>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => setForm({...form, is_active: !form.is_active})}
                        className={`px-6 py-3 rounded-2xl flex items-center gap-4 transition-all ${
                          form.is_active 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-100 ring-4 ring-green-500/10' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                         <div className={`w-5 h-5 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ${form.is_active ? 'translate-x-0 rotate-0' : 'translate-x-0 opacity-20'}`}>
                           {form.is_active && <i className="fi flex flex fi-rr-check text-[10px] text-green-500"></i>}
                         </div>
                         <span className="text-xs font-semibold uppercase tracking-widest">Active Status</span>
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Engagement Date</label>
                         <div className="relative group/date">
                           <i className="fi flex flex fi-rr-calendar-check absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 z-10"></i>
                           <div className="w-full h-14 pl-14 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 flex items-center group-focus-within/date:bg-white group-focus-within/date:border-amber-500 transition-all">
                             {formatDate(form.company_joined)}
                           </div>
                           <input
                             type="date"
                             name="company_joined"
                             value={form.company_joined}
                             onChange={handleChange}
                             className="absolute inset-0 opacity-0 cursor-pointer z-20"
                           />
                         </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Next Renewal</label>
                         <div className="relative group/date">
                           <i className="fi flex flex fi-rr-refresh absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 animate-spin-slow z-10"></i>
                           <div className="w-full h-14 pl-14 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 flex items-center group-focus-within/date:bg-white group-focus-within/date:border-amber-500 transition-all">
                             {formatDate(form.renewal_date)}
                           </div>
                           <input
                             type="date"
                             name="renewal_date"
                             value={form.renewal_date}
                             onChange={handleChange}
                             className="absolute inset-0 opacity-0 cursor-pointer z-20"
                           />
                         </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1">Expiration Cut-off</label>
                         <div className="relative group/date">
                           <i className="fi flex flex fi-rr-alarm-clock absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 z-10"></i>
                           <div className="w-full h-14 pl-14 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 flex items-center group-focus-within/date:bg-white group-focus-within/date:border-amber-500 transition-all">
                             {formatDate(form.expiry_date)}
                           </div>
                           <input
                             type="date"
                             name="expiry_date"
                             value={form.expiry_date}
                             onChange={handleChange}
                             className="absolute inset-0 opacity-0 cursor-pointer z-20"
                           />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Section IV: Member Deployment */}
                <div className="bg-white rounded-2xl p-10 shadow-gray-200/50 border border-gray-50 overflow-hidden relative group">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-100">
                          <i className="fi flex flex fi-rr-users-alt text-2xl"></i>
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">Member Deployment</h2>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Assign Unassigned Personnel</p>
                        </div>
                      </div>
                      <div className="text-[10px] font-semibold text-blue-500 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest">
                        {unassignedUsers.length} Potential Leads
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {loadingUsers ? (
                         <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Registry Sync in Progress...</p>
                         </div>
                      ) : unassignedUsers.length === 0 ? (
                         <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <i className="fi flex flex fi-rr-search-user text-3xl text-slate-300 mb-4"></i>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Unassigned Assets Found</p>
                         </div>
                      ) : (
                         unassignedUsers.map(u => (
                            <div 
                               key={u.user_id}
                               onClick={() => {
                                  if (selectedUserIds.includes(u.user_id)) {
                                     setSelectedUserIds(prev => prev.filter(id => id !== u.user_id));
                                  } else {
                                     setSelectedUserIds(prev => [...prev, u.user_id]);
                                  }
                               }}
                               className={`group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                  selectedUserIds.includes(u.user_id) 
                                  ? 'bg-indigo-50 border-indigo-200 shadow-lg shadow-indigo-100/50' 
                                  : 'bg-white border-slate-50 hover:border-indigo-100 hover:bg-slate-50/50'
                               }`}
                            >
                               <div className="relative">
                                  {u.profile_pic_url ? (
                                     <img src={u.profile_pic_url} className="w-10 h-10 rounded-xl object-cover shadow-md" alt="" />
                                  ) : (
                                     <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-sm">
                                        {(u.user_name || u.email).charAt(0).toUpperCase()}
                                     </div>
                                  )}
                                  {selectedUserIds.includes(u.user_id) && (
                                     <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                        <i className="fi flex flex fi-rr-check text-[8px] font-bold"></i>
                                     </div>
                                  )}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-slate-700 truncate">{u.user_name || 'Personnel Undefined'}</p>
                                  <p className="text-[9px] font-semibold text-slate-400 truncate uppercase tracking-widest">{u.email}</p>
                               </div>
                            </div>
                         ))
                      )}
                   </div>
                </div>
              </div>

              {/* Right Column: Premium Intelligence Panel */}
              <div className="lg:w-[360px] shrink-0 space-y-8">
                
                {/* Visual Identity Capsule */}
                <div className="sticky top-24 space-y-8">
                   <div className="relative overflow-hidden group rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#1e1b4b] to-[#4338ca]"></div>
                      <div className="absolute top-0 right-0 p-10 text-white/5 opacity-50 transform group-hover:scale-125 transition-transform duration-700">
                         <i className="fi flex flex fi-rr-building text-[10rem]"></i>
                      </div>
                      
                      <div className="relative p-10 z-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white mb-8 ring-4 ring-white/5 animate-float shadow-2xl">
                           {form.org_code ? (
                             <span className="text-4xl font-semibold tracking-tighter">{form.org_code}</span>
                           ) : (
                             <i className="fi flex flex fi-rr-mountains text-4xl text-indigo-200"></i>
                           )}
                        </div>

                        <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {form.company_name || 'Organization Identity'}
                        </h3>
                        <div className="inline-flex py-1 px-4 rounded-full bg-white/10 text-indigo-200 text-[9px] font-semibold uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
                           {form.company_type || 'Uncategorized Asset'}
                        </div>

                        <p className="text-white/40 text-xs font-medium leading-relaxed mb-8 line-clamp-3 italic bg-white/5 p-5 rounded-2xl border border-white/5">
                          "{form.description || 'Provide a vision statement to populate the neural descriptors for this asset...'}"
                        </p>

                        <div className="w-full space-y-4 pt-4 border-t border-white/10 text-left">
                          {/* Status & Code */}
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                                   <i className="fi flex flex fi-rr-shield-check text-[10px]"></i>
                                </div>
                                <span className="text-white/30 text-[9px] font-semibold uppercase tracking-widest">Global Status</span>
                             </div>
                             <span className={`text-[10px] font-semibold uppercase tracking-widest ${form.is_active ? 'text-green-400' : 'text-red-400'}`}>
                               {form.is_active ? 'Authorized' : 'Deactivated'}
                             </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                                   <i className="fi flex flex fi-rr-users text-[10px]"></i>
                                </div>
                                <span className="text-white/30 text-[9px] font-semibold uppercase tracking-widest">Initial Deployment</span>
                             </div>
                             <span className="text-white/70 text-[10px] font-semibold tracking-[0.3em]">{selectedUserIds.length} Members</span>
                          </div>

                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                   <i className="fi flex flex fi-rr-key text-[10px]"></i>
                                </div>
                                <span className="text-white/30 text-[9px] font-semibold uppercase tracking-widest">Asset Code</span>
                             </div>
                             <span className="text-white/70 text-[10px] font-semibold tracking-[0.3em]">{form.org_code || '---'}</span>
                          </div>

                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                                    <i className="fi flex flex fi-rr-fingerprint text-[10px]"></i>
                                 </div>
                                 <span className="text-white/30 text-[9px] font-semibold uppercase tracking-widest">System Identifier</span>
                              </div>
                              <span className="text-white/70 text-[10px] font-semibold tracking-[0.3em]">{form.org_code ? `CM${form.org_code.toUpperCase()}1` : '---'}</span>
                           </div>
                          
                          {/* Lifecycle Matrix */}
                          <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Engagement Date</p>
                                <p className="text-[10px] font-bold text-white/70">{formatDate(form.company_joined)}</p>
                             </div>
                             <div className="space-y-1 text-right">
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Next Renewal</p>
                                <p className="text-[10px] font-bold text-white/70">{formatDate(form.renewal_date)}</p>
                             </div>
                             <div className="col-span-2 pt-2 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                   <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Expiration Cut-off</p>
                                   <p className={`text-[11px] font-bold ${form.is_active ? 'text-indigo-200' : 'text-red-400'}`}>{formatDate(form.expiry_date)}</p>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Master Execution Hub */}
                   <div className="bg-white rounded-2xl p-8 border border-gray-100 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent pointer-events-none"></div>
                      
                      <div className="relative z-10 space-y-4">
                         <button
                           type="submit"
                           disabled={submitting}
                           className="group relative w-full h-16 rounded-2xl bg-[#1e1b4b] text-white overflow-hidden shadow-indigo-200/50 transition-all active:scale-95 disabled:opacity-50"
                         >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                            <div className="relative z-10 flex items-center justify-center gap-4 text-sm font-semibold uppercase tracking-[0.2em]">
                               {submitting ? (
                                  <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                               ) : (
                                  <>
                                    <i className="fi flex flex fi-rr-rocket-lunch text-lg group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"></i>
                                    <span>Sync & Publish</span>
                                  </>
                               )}
                            </div>
                         </button>
                         
                         <button
                           type="button"
                           onClick={() => router.push('/organization')}
                           className="w-full h-12 rounded-xl text-slate-400 hover:text-indigo-600 font-semibold uppercase tracking-widest text-[10px] transition-colors"
                         >
                           Terminate Sequence
                         </button>

                         <div className="pt-6 mt-6 border-t border-slate-50 flex flex-col gap-4">
                            <div className="flex items-center gap-4 group/item">
                               <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                                  <i className="fi flex flex fi-rr-lock text-[10px]"></i>
                                </div>
                                <div className="flex-1">
                                   <p className="text-[9px] font-semibold text-slate-800 uppercase tracking-widest leading-none mb-1">Encrypted Payload</p>
                                   <p className="text-[8px] font-bold text-slate-400">256-bit AES DB Injection</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group/item">
                               <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                                  <i className="fi flex flex fi-rr-database text-[10px]"></i>
                                </div>
                                <div className="flex-1">
                                   <p className="text-[9px] font-semibold text-slate-800 uppercase tracking-widest leading-none mb-1">Neural Indexing</p>
                                   <p className="text-[8px] font-bold text-slate-400">Instant Registry Conflict Check</p>
                                </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </form>
          </div>
      </div>
    </>
  );
}
