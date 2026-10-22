import React, { useEffect } from 'react';
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

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow || 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[360px] bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 text-center"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

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

        {/* Title */}
        <h3 className="text-lg font-bold text-[#263238] mb-1.5">
          No Active Account
        </h3>

        {/* Message */}
        <p
          className="text-sm text-gray-500 leading-relaxed mb-6"
          style={{ fontFamily: "'Roboto', sans-serif" }}
        >
          You don&apos;t have an active account. Please create a new account or talk to our team.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/signup');
            }}
            className="w-full py-2.5 px-4 rounded-xl text-white font-medium text-sm transition hover:opacity-90 active:scale-[0.99] shadow-sm"
            style={{ backgroundColor: '#4b33e8' }}
          >
            Create New Account
          </button>

          <a
            href="mailto:support@rynxly.in?subject=Account%20Activation%20Request"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition active:scale-[0.99] text-center"
          >
            Talk to Team
          </a>
        </div>
      </div>
    </div>
  );
}
