import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

interface NoActiveAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export default function NoActiveAccountModal({
  isOpen,
  onClose,
  email = '',
}: NoActiveAccountModalProps) {
  const router = useRouter();
  const [view, setView] = useState<'notice' | 'form' | 'success'>('notice');

  // Form fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [teamStrength, setTeamStrength] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize/reset state on open
  useEffect(() => {
    if (isOpen) {
      setView('notice');
      setWorkEmail(email || '');
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const payload = {
      name: name.trim(),
      company: company.trim(),
      phone: phone.trim(),
      email: (workEmail || email).trim(),
      team_strength: teamStrength,
      city: city.trim(),
      pincode: pincode.trim(),
      notes: notes.trim(),
    };

    try {
      // 1. Try our dedicated server endpoint
      const res = await fetch('/api/contact/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok || resData.error) {
        // Fallback: try inserting directly via supabase client
        const { error: directError } = await supabase
          .from('contact_requests')
          .insert([payload]);

        if (directError) {
          throw new Error(directError.message || resData.error || 'Failed to submit request');
        }
      }

      setView('success');
    } catch (err: any) {
      console.error('Error submitting contact request lead:', err);
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={handleModalClose}
    >
      <div
        className={`relative w-full ${
          view === 'form' ? 'max-w-[460px]' : 'max-w-[360px]'
        } bg-white rounded-2xl shadow-2xl border border-gray-100 transition-all duration-200 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between p-4 pb-0">
          {view === 'form' ? (
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

        {/* VIEW 1: Simple Notice */}
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
                  handleModalClose();
                  router.push('/signup');
                }}
                className="w-full py-2.5 px-4 rounded-xl text-white font-medium text-sm transition hover:opacity-90 active:scale-[0.99] shadow-sm"
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

        {/* VIEW 2: Lead Generation Form (Talk to Team) */}
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

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 block">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 block">Company Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 block">Work Email *</label>
                  <input
                    required
                    type="email"
                    placeholder="you@company.com"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 block">Select Agent Strength *</label>
                <select
                  required
                  value={teamStrength}
                  onChange={(e) => setTeamStrength(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs bg-white cursor-pointer transition ${
                    teamStrength === '' ? 'text-gray-400' : 'text-gray-800'
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
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 block">Pincode</label>
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#4b33e8] focus:ring-1 focus:ring-[#4b33e8] outline-none text-xs text-gray-800 placeholder:text-gray-400 transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 block">How can we help you?</label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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

        {/* VIEW 3: Success Screen */}
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
