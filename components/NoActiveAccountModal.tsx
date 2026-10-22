import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

interface NoActiveAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

const companyTypes = [
  'Sales',
  'Marketing',
  'Information Technology (IT)',
  'Finance',
  'Real Estate',
  'Insurance',
  'Customer Support / Customer Success',
  'Operations',
  'Healthcare & Pharma',
  'Education & EdTech',
  'Others',
];

export default function NoActiveAccountModal({
  isOpen,
  onClose,
  email = '',
}: NoActiveAccountModalProps) {
  const router = useRouter();
  const [view, setView] = useState<'notice' | 'form' | 'signup' | 'success'>('notice');

  // --- Talk to Team (Custom Demo) State ---
  const [demoName, setDemoName] = useState('');
  const [demoCompany, setDemoCompany] = useState('');
  const [demoPhone, setDemoPhone] = useState('');
  const [demoWorkEmail, setDemoWorkEmail] = useState('');
  const [demoTeamStrength, setDemoTeamStrength] = useState('');
  const [demoCity, setDemoCity] = useState('');
  const [demoPincode, setDemoPincode] = useState('');
  const [demoNotes, setDemoNotes] = useState('');

  // --- Create Organization (10-Day Trial) State ---
  const [orgCompanyName, setOrgCompanyName] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [orgCompanyType, setOrgCompanyType] = useState('Sales');
  const [orgAddress, setOrgAddress] = useState('');
  const [orgGstNo, setOrgGstNo] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerConfirmPassword, setOwnerConfirmPassword] = useState('');

  // Shared UI States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Formatted 10-day expiry string for the banner
  const [expiryString, setExpiryString] = useState('');

  useEffect(() => {
    const d = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    setExpiryString(`${day} ${month} ${year}`);
  }, []);

  // Initialize/reset states on open
  useEffect(() => {
    if (isOpen) {
      setView('notice');
      setDemoWorkEmail(email || '');
      setOwnerEmail(email || '');
      setErrorMessage(null);
      setLoading(false);
    }
  }, [isOpen, email]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        handleModalClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, loading]);

  const handleModalClose = () => {
    onClose();
    setTimeout(() => {
      setView('notice');
      setErrorMessage(null);
    }, 200);
  };

  // Auto-generate org prefix as company name is typed
  const handleCompanyNameChange = (val: string) => {
    setOrgCompanyName(val);
    const clean = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (clean.length > 0) {
      setOrgCode(clean.substring(0, 4));
    }
  };

  // --- SUBMIT 1: Talk to Team (Lead in contact_requests) ---
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const payload = {
      name: demoName.trim(),
      company: demoCompany.trim(),
      phone: demoPhone.trim(),
      email: (demoWorkEmail || email).trim(),
      team_strength: demoTeamStrength,
      city: demoCity.trim(),
      pincode: demoPincode.trim(),
      notes: demoNotes.trim(),
    };

    try {
      const res = await fetch('/api/contact/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok || resData.error) {
        // Fallback to direct supabase insert
        const { error: directError } = await supabase
          .from('contact_requests')
          .insert([payload]);

        if (directError) {
          throw new Error(directError.message || resData.error || 'Failed to submit request');
        }
      }

      setView('success');
    } catch (err: any) {
      console.error('Error submitting contact request:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- SUBMIT 2: Create Organization & 10-Day Trial (Super Admin Level 2) ---
  const handleTrialSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // Validation
    if (ownerPassword !== ownerConfirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      setLoading(false);
      return;
    }

    if (ownerPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (ownerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    const payload = {
      company_name: orgCompanyName.trim(),
      org_code: orgCode.trim().toUpperCase(),
      company_type: orgCompanyType,
      address: orgAddress.trim(),
      gst_no: orgGstNo.trim(),
      owner_name: ownerName.trim(),
      owner_phone_no: ownerPhone.trim(),
      email: (ownerEmail || email).trim().toLowerCase(),
      password: ownerPassword,
    };

    try {
      const res = await fetch('/api/auth/trial-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok || resData.error) {
        throw new Error(resData.error || 'Failed to create trial organization');
      }

      // Auto login user directly with the created credentials
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (!loginError) {
        handleModalClose();
        router.push('/dashboard');
        return;
      }

      // Fallback: If auto-login had an issue, show success view
      setView('success');
    } catch (err: any) {
      console.error('Trial signup error:', err);
      setErrorMessage(err.message || 'Failed to create trial account.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={handleModalClose}
    >
      <div
        className={`relative w-full ${
          view === 'signup'
            ? 'max-w-[500px]'
            : view === 'form'
            ? 'max-w-[460px]'
            : 'max-w-[360px]'
        } bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-200 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between p-4 pb-0">
          {view === 'form' || view === 'signup' ? (
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setView('notice');
              }}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleModalClose}
            aria-label="Close"
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition ml-auto"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: Minimal Notice View */}
        {/* ------------------------------------------------------------- */}
        {view === 'notice' && (
          <div className="p-6 pt-2 text-center">
            {/* Minimal Alert Icon */}
            <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-[#263238] mb-1.5">
              No Active Account
            </h3>

            <p
              className="text-sm text-gray-500 leading-relaxed mb-6"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              You don&apos;t have an active account. Please create a new account or talk to our team.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setView('signup');
                }}
                className="w-full py-2.5 px-4 rounded-xl text-white font-medium text-sm transition hover:opacity-90 active:scale-[0.99] shadow-sm text-center"
                style={{ backgroundColor: '#4b33e8' }}
              >
                Create New Account
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setView('form');
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition active:scale-[0.99] text-center"
              >
                Talk to Team
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: Create Organization (10-Day Free Trial Account) */}
        {/* ------------------------------------------------------------- */}
        {view === 'signup' && (
          <div className="p-6 pt-1 max-h-[85vh] overflow-y-auto">
            <div className="text-left mb-3">
              <h3 className="text-lg font-bold text-[#263238]">Create Account</h3>
              <p
                className="text-xs text-gray-500 mt-0.5"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Set up your organization workspace to get started.
              </p>
            </div>

            {/* Trial Notice Badge */}
            <div className="p-3 mb-4 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-center gap-2.5 text-left">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-amber-900 font-medium leading-relaxed">
                This is a trial/demo account. Expires in 10 days ({expiryString}).
              </p>
            </div>

            <form onSubmit={handleTrialSignupSubmit} className="space-y-4">
              {/* SECTION A: Organization Details */}
              <div className="space-y-2.5">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-100">
                  <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Organization Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">Company Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Nexus Innovations"
                      value={orgCompanyName}
                      onChange={(e) => handleCompanyNameChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">Org Prefix *</label>
                    <input
                      required
                      maxLength={5}
                      type="text"
                      placeholder="NXI"
                      value={orgCode}
                      onChange={(e) => setOrgCode(e.target.value.toUpperCase().substring(0, 5))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 text-center uppercase tracking-widest font-bold placeholder:text-gray-400 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 block">Industry Sector *</label>
                  <select
                    required
                    value={orgCompanyType}
                    onChange={(e) => setOrgCompanyType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs bg-white text-gray-800 cursor-pointer transition"
                  >
                    {companyTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">Registered Address (City)</label>
                    <input
                      type="text"
                      placeholder="City, State"
                      value={orgAddress}
                      onChange={(e) => setOrgAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">GSTIN (Optional)</label>
                    <input
                      type="text"
                      placeholder="22AAAAA0000A1Z5"
                      value={orgGstNo}
                      onChange={(e) => setOrgGstNo(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 uppercase placeholder:text-gray-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Account Details */}
              <div className="space-y-2.5 pt-1">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-100">
                  <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Account Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">Mobile Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="9876543210"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 block">Work Email *</label>
                  <input
                    required
                    type="email"
                    placeholder="admin@company.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">Password *</label>
                    <input
                      required
                      type="password"
                      placeholder="Min 6 characters"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 block">Confirm Password *</label>
                    <input
                      required
                      type="password"
                      placeholder="Re-enter password"
                      value={ownerConfirmPassword}
                      onChange={(e) => setOwnerConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-left">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white font-medium text-xs tracking-wide transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 mt-3"
                style={{ backgroundColor: '#4b33e8' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Setting up Workspace...</span>
                  </>
                ) : (
                  <span>Create Account & Start Trial</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: Talk to Team (Custom Demo Form) */}
        {/* ------------------------------------------------------------- */}
        {view === 'form' && (
          <div className="p-6 pt-1 max-h-[85vh] overflow-y-auto">
            <div className="text-left mb-4">
              <h3 className="text-lg font-bold text-[#263238]">Talk to Team</h3>
              <p
                className="text-xs text-gray-500 mt-0.5"
                style={{ fontFamily: "'Roboto', sans-serif" }}
              >
                Fill in the details below to request a custom demo.
              </p>
            </div>

            <form onSubmit={handleDemoSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 block">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 block">Company Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={demoCompany}
                  onChange={(e) => setDemoCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 block">Mobile Number *</label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={demoPhone}
                    onChange={(e) => setDemoPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 block">Work Email *</label>
                  <input
                    required
                    type="email"
                    placeholder="you@company.com"
                    value={demoWorkEmail}
                    onChange={(e) => setDemoWorkEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 block">Select Agent Strength *</label>
                <select
                  required
                  value={demoTeamStrength}
                  onChange={(e) => setDemoTeamStrength(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs bg-white cursor-pointer transition ${
                    demoTeamStrength === '' ? 'text-gray-400' : 'text-gray-800'
                  }`}
                >
                  <option value="" disabled>Select Agent Strength</option>
                  <option value="1 - 10 Agents">1 - 10 Agents</option>
                  <option value="11 - 25 Agents">11 - 25 Agents</option>
                  <option value="26 - 50 Agents">26 - 50 Agents</option>
                  <option value="51+ Agents">51+ Agents</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 block">City</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={demoCity}
                    onChange={(e) => setDemoCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 block">Pincode</label>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={demoPincode}
                    onChange={(e) => setDemoPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 block">How can we help you?</label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your requirements..."
                  value={demoNotes}
                  onChange={(e) => setDemoNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 resize-none transition"
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white font-medium text-xs tracking-wide transition hover:opacity-95 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 mt-2"
                style={{ backgroundColor: '#4b33e8' }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Request Custom Demo</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: Success Screen */}
        {/* ------------------------------------------------------------- */}
        {view === 'success' && (
          <div className="p-6 pt-2 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-[#263238] mb-1.5">
              Request Received!
            </h3>

            <p
              className="text-xs text-gray-500 leading-relaxed mb-6"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Thank you for reaching out. Our team will review your request and get in touch with you shortly.
            </p>

            <button
              type="button"
              onClick={handleModalClose}
              className="w-full py-2.5 px-4 rounded-xl text-white font-medium text-sm transition hover:opacity-90 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: '#4b33e8' }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
