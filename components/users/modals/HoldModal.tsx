import React from "react";
import { AllUser } from "../types";

interface HoldModalProps {
  show: boolean;
  userData: AllUser | null;
  formData: {
    duration: string;
    customDate: string;
    customTime: string;
    reason: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      duration: string;
      customDate: string;
      customTime: string;
      reason: string;
    }>
  >;
  onClose: () => void;
  onConfirm: () => void;
}

export function HoldModal({
  show,
  userData,
  formData,
  setFormData,
  onClose,
  onConfirm,
}: HoldModalProps) {
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
            className="text-xl font-semibold"
            style={{
              color: "#263238",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Hold User - {userData.user_name || "N/A"}
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
          {/* Hold Duration */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-3"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Hold Duration
            </label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, duration: "1" }))}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  formData.duration === "1"
                    ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                1 Day
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, duration: "2" }))}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  formData.duration === "2"
                    ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                2 Days
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, duration: "3" }))}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  formData.duration === "3"
                    ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                3 Days
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    duration: "custom",
                  }))
                }
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  formData.duration === "custom"
                    ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                Custom
              </button>
            </div>

            {/* Custom Date & Time */}
            {formData.duration === "custom" && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.customDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-gray-600">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.customTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customTime: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700  text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reason of Hold */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Reason of Hold <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
              placeholder="Enter the reason for putting this user on hold..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700  focus:outline-none focus:ring-2 focus:ring-[#4b33e8] resize-none"
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
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Put on Hold
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
