import React from "react";
import { AllUser } from "../types";

interface SuspendModalProps {
  show: boolean;
  userData: AllUser | null;
  formData: {
    reason: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      reason: string;
    }>
  >;
  onClose: () => void;
  onConfirm: () => void;
}

export function SuspendModal({
  show,
  userData,
  formData,
  setFormData,
  onClose,
  onConfirm,
}: SuspendModalProps) {
  if (!show || !userData) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2
            className="text-xl font-semibold text-red-600"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Suspend User - {userData.user_name || "N/A"}
          </h2>
          <button
            onClick={onClose}
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
          <div className="mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
            <p className="text-sm text-red-700 flex items-start gap-2">
              <i className="fi flex fi-rr-info mt-0.5"></i>
              Suspending this user will immediately revoke their access to the
              system. They will not be able to log in until their suspension is
              lifted.
            </p>
          </div>

          {/* Reason of Suspension */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Reason of Suspension <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              placeholder="Enter the reason for suspending this user..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700  focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Suspend User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
