import React, { useState } from "react";

interface InviteModalProps {
  show: boolean;
  onClose: () => void;
}

export function InviteModal({ show, onClose }: InviteModalProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleClose = () => {
    onClose();
    setInviteEmail("");
    setInviteName("");
    setInviteError("");
    setInviteSuccess(false);
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
        className="rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden min-h-[500px]"
        style={{
          background:
            "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF8C42 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between">
            <h2
              className="text-xl font-semibold text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Invite POSP Agent
            </h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
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

          {/* Image at Top */}
          <div className="px-6 pb-4 flex items-center justify-center">
            {/* Note: Ensure this image exists in public folder or replace with a placeholder/icon if not available contextually, 
                but based on refactor rules I should keep it. If it fails to load it will be blank. 
                I will assume it exists since I am just moving code. */}
            <img
              src="/Invite-cuate.png"
              alt="Invite Illustration"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
            />
          </div>

          {/* Content */}
          <div className="px-6 pb-6 flex flex-col flex-1">
            <div className="flex-1">
              {inviteError && (
                <div className="mb-4 p-3 bg-red-100/90 border border-red-300 rounded-lg text-red-800 text-sm backdrop-blur-sm">
                  {inviteError}
                </div>
              )}
              {inviteSuccess && (
                <div className="mb-4 p-3 bg-green-100/90 border border-green-300 rounded-lg text-green-800 text-sm backdrop-blur-sm">
                  Invitation email sent successfully!
                </div>
              )}
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2 text-white"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-4 py-2.5 bg-white/95 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-700 backdrop-blur-sm"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                  disabled={inviteLoading}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2 text-white"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2.5 bg-white/95 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-700 backdrop-blur-sm"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                  disabled={inviteLoading}
                  onKeyPress={(e) => {
                    if (
                      e.key === "Enter" &&
                      !inviteLoading &&
                      inviteEmail &&
                      inviteName
                    ) {
                      // Trigger send on Enter
                      const button =
                        e.currentTarget.parentElement?.parentElement?.parentElement?.querySelector(
                          "button:last-child"
                        ) as HTMLButtonElement;
                      if (button) button.click();
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-auto pt-4">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium hover:bg-white/30 transition-colors"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                disabled={inviteLoading}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!inviteName || inviteName.trim() === "") {
                    setInviteError("Please enter a name");
                    return;
                  }
                  if (!inviteEmail || !inviteEmail.includes("@")) {
                    setInviteError("Please enter a valid email address");
                    return;
                  }

                  setInviteLoading(true);
                  setInviteError("");
                  setInviteSuccess(false);

                  try {
                    const response = await fetch("/api/auth/send-invite", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email: inviteEmail,
                        name: inviteName,
                      }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(
                        data.error || "Failed to send invitation"
                      );
                    }

                    setInviteSuccess(true);
                    setInviteEmail("");
                    setInviteName("");
                    setTimeout(() => {
                      handleClose();
                    }, 2000);
                  } catch (err: any) {
                    setInviteError(
                      err.message || "Failed to send invitation email"
                    );
                  } finally {
                    setInviteLoading(false);
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
                disabled={inviteLoading}
              >
                {inviteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <i className="fi flex fi-rr-envelope text-sm"></i>
                    <span>Send Invite</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
