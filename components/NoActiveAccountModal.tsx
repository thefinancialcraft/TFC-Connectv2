import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface NoActiveAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export default function NoActiveAccountModal({
  isOpen,
  onClose,
  email,
}: NoActiveAccountModalProps) {
  const router = useRouter();
  const [showTeamDetails, setShowTeamDetails] = useState(false);

  if (!isOpen) return null;

  const handleCreateAccount = () => {
    onClose();
    router.push('/signup');
  };

  const handleContactPage = () => {
    onClose();
    router.push('/contact');
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ fontFamily: "'Poppins', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Gradient */}
        <div className="h-2 w-full bg-gradient-to-r from-[#4b33e8] via-indigo-500 to-purple-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8 text-center">
          {/* Glowing Icon Badge */}
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center shadow-inner">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 text-2xl">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#263238] tracking-tight mb-2">
            No Active Account
          </h3>

          {/* Main Notice Message */}
          <p
            className="text-gray-600 text-sm leading-relaxed mb-1"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            You don&apos;t have an active account with this email.
          </p>

          {email && (
            <p className="text-xs font-semibold text-indigo-600 bg-indigo-50/70 py-1 px-3 rounded-full inline-block mb-3 border border-indigo-100">
              {email}
            </p>
          )}

          <p
            className="text-xs text-gray-500 leading-relaxed mb-6"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            Please create a new account or talk to our team to get your account activated.
          </p>

          {/* Team Details Section (Toggled) */}
          {showTeamDetails ? (
            <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-200/70 text-left animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Contact Support Team
                </span>
                <button
                  type="button"
                  onClick={() => setShowTeamDetails(false)}
                  className="text-xs text-indigo-600 hover:underline font-medium"
                >
                  Hide
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600" style={{ fontFamily: "'Roboto', sans-serif" }}>
                <a
                  href="mailto:support@rynxly.in"
                  className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Us</div>
                    <div className="font-semibold text-gray-800">support@rynxly.in</div>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={handleContactPage}
                  className="w-full flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-200 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-left"
                >
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </span>
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Help Desk</div>
                    <div className="font-semibold text-gray-800">Visit Contact & Support Page</div>
                  </div>
                </button>
              </div>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={handleCreateAccount}
              className="w-full py-3.5 px-5 rounded-full text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/25 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(to right, #4b33e8, #6366f1)',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Create New Account</span>
            </button>

            <button
              type="button"
              onClick={() => setShowTeamDetails(!showTeamDetails)}
              className="w-full py-3 px-5 rounded-full border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-indigo-300 text-gray-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span>Talk to Team</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
