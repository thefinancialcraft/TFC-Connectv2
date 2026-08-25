import React from 'react';

export interface AccountIssueModalProps {
  isOpen: boolean;
  type: 'session_expired' | 'account_expired' | 'account_issue';
  title?: string;
  message?: string;
  rootCause?: string;
  onClose?: () => void;
  onRelogin?: () => void;
  onContactAdmin?: () => void;
}

export default function AccountIssueModal({
  isOpen,
  type,
  title,
  message,
  rootCause,
  onClose,
  onRelogin,
  onContactAdmin,
}: AccountIssueModalProps) {
  if (!isOpen) return null;

  const handleRelogin = () => {
    if (onRelogin) {
      onRelogin();
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.removeItem('cached_user_profile');
        window.location.href = '/login';
      }
    }
  };

  const handleContactAdmin = () => {
    if (onContactAdmin) {
      onContactAdmin();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 transform transition-all">
        {/* Header Icon & Background */}
        <div
          className={`p-6 text-center text-white ${
            type === 'session_expired'
              ? 'bg-amber-500'
              : type === 'account_expired'
              ? 'bg-red-600'
              : 'bg-indigo-600'
          }`}
        >
          <div className="mx-auto w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3 backdrop-blur-md">
            {type === 'session_expired' && (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {type === 'account_expired' && (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {type === 'account_issue' && (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {title || (
              type === 'session_expired'
                ? 'Session Expired'
                : type === 'account_expired'
                ? 'Account Expired'
                : 'Account Has Some Issue'
            )}
          </h3>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-gray-700 text-sm">
          <p className="text-gray-600 leading-relaxed text-center">
            {message || (
              type === 'session_expired'
                ? 'Your session has expired or is invalid. Please relogin to continue using the application.'
                : type === 'account_expired'
                ? 'Your account validity period has expired. Please contact your system administrator to extend your account access.'
                : 'Account has some issue. Please contact Admin.'
            )}
          </p>

          {/* Root Cause Display Box */}
          {rootCause && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
              <div className="font-semibold mb-1 flex items-center gap-1.5 text-red-700">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Root Cause Details:</span>
              </div>
              <p className="font-mono break-words whitespace-pre-wrap bg-white/70 p-2 rounded border border-red-100 mt-1 select-all text-[11px]">
                {rootCause}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          {type === 'session_expired' ? (
            <button
              onClick={handleRelogin}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Relogin Now</span>
            </button>
          ) : (
            <>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
                >
                  Close
                </button>
              )}
              <button
                onClick={handleContactAdmin}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#4b33e8] hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all"
              >
                Contact Admin
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
