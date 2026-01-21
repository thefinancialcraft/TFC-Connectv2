import React, { useState } from "react";
import SignupForm from "../../SignupForm";

interface AddUserModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isAuthorised?: boolean;
  organizationId?: string | null;
}

export function AddUserModal({ 
  show, 
  onClose, 
  onSuccess,
  isAuthorised = true,
  organizationId = null
}: AddUserModalProps) {
  const [signupError, setSignupError] = useState("");

  const handleClose = () => {
    onClose();
    setSignupError("");
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2
            className="text-xl font-semibold"
            style={{
              color: "#263238",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Add New User
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          {signupError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {signupError}
            </div>
          )}
          <SignupForm
            fromAdminPanel={true}
            isAuthorised={isAuthorised}
            organizationId={organizationId}
            onError={(error: string) => setSignupError(error)}
            onSuccess={() => {
              handleClose();
              onSuccess();
            }}
          />
        </div>
      </div>
    </div>
  );
}
