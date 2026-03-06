import { useState, useRef } from "react";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onError?: (error: string) => void;
}

export default function ForgotPasswordForm({ onBack, onError }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [uniqueId, setUniqueId] = useState<string>("");
  const [showOtp, setShowOtp] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      const errorMsg = "Please enter your email address";
      onError?.(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      // Call Next.js API route (proxy) - avoids CORS issues
      const response = await fetch("/api/otp/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          purpose: "forgot_password",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send OTP");
      }

      // Store unique_id from response
      if (data.unique_id) {
        setUniqueId(data.unique_id);
      }

      // Show OTP input if OTP sent successfully
      setShowOtp(true);
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while sending OTP";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResetPassword = async () => {
    // Validate OTP and proceed to reset form
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      onError?.("Please enter complete OTP");
      return;
    }

    if (!uniqueId) {
      onError?.("OTP session expired. Please request a new OTP.");
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP with unique_id
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unique_id: uniqueId,
          otp_code: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Invalid OTP");
      }

      // OTP verified, show reset form
      setShowResetForm(true);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to verify OTP";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      onError?.("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      onError?.("Password must be at least 6 characters");
      return;
    }

    if (!uniqueId) {
      onError?.("OTP session expired. Please request a new OTP.");
      return;
    }

    setIsLoading(true);
    try {
      // Reset password using unique_id
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unique_id: uniqueId,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to reset password");
      }

      setShowSuccess(true);
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while resetting password";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show Success Message
  if (showSuccess) {
    return (
      <div className="mt-0">
        <h2 
          className="mb-6 md:mb-0 text-xl md:text-lg mb-4"
          style={{ 
            fontWeight: '700',
            fontFamily: 'poppins',
            color: '#263238',
            textAlign: 'center',
          }}>
          Password Reset Successful!
        </h2>
        
        <div className="text-center mb-6">
          <div 
            className="inline-block px-6 py-4 rounded-full"
            style={{
              backgroundColor: '#f6f5ff'
            }}
          >
            <p 
              className="text-lg"
              style={{
                color: '#4b33e8',
                fontFamily: "'Roboto', sans-serif"
              }}
            >
              ✓ Your password has been reset successfully!
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold hover:underline"
            style={{ color: '#4b33e8' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Show Reset Password Form
  if (showResetForm) {
    return (
      <div className="mt-0">
        <h2 
          className="text-xl md:text-lg"
          style={{ 
            fontWeight: '700',
            fontFamily: 'poppins',
            color: '#263238',
            textAlign: 'center',
          }}>
          Reset Your Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="mt-4">
          {/* New Password Field */}
          <div className="mb-4">
            <label 
              htmlFor="newPassword" 
              className="block text-sm font-medium mb-1"
              style={{ color: 'rgb(38, 50, 56)' }}
            >
              New Password
            </label>
            <div className="relative">
              <i 
                className="fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
                style={{ 
                  color: '#787E9D',
                  pointerEvents: 'none'
                }}
              ></i>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
                style={{ 
                  borderColor: '#DCDEE3',
                  backgroundColor: '#FFFFFF',
                  color: 'rgb(38, 50, 56)',
                  fontFamily: "'Roboto', sans-serif",
                  paddingLeft: '45px',
                  paddingRight: '16px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4b33e8';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#DCDEE3';
                }}
                placeholder="Enter new password"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium mb-1"
              style={{ color: 'rgb(38, 50, 56)' }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <i 
                className="fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
                style={{ 
                  color: '#787E9D',
                  pointerEvents: 'none'
                }}
              ></i>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
                style={{ 
                  borderColor: '#DCDEE3',
                  backgroundColor: '#FFFFFF',
                  color: 'rgb(38, 50, 56)',
                  fontFamily: "'Roboto', sans-serif",
                  paddingLeft: '45px',
                  paddingRight: '16px'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4b33e8';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#DCDEE3';
                }}
                placeholder="Confirm new password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-full mt-2 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg"
            style={{ 
              background: 'linear-gradient(to right, #4b33e8)',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            Reset Password
          </button>
        </form>
        
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold hover:underline"
            style={{ color: '#4b33e8' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-0">
      <h2 
        className="mb-6 md:mb-0 text-xl md:text-lg"
        style={{ 
          fontWeight: '700',
          fontFamily: 'poppins',
          color: '#263238',
          textAlign: 'center',
        }}>
        Forgot Password
      </h2>

      {/* Email Field */}
      <div className="mb-4">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium mb-1"
          style={{ color: 'rgb(38, 50, 56)' }}
        >
          Email
        </label>
        <div className="relative">
          <i 
            className="fi flex fi-rr-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
            style={{ 
              color: '#787E9D',
              pointerEvents: 'none'
            }}
          ></i>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
            style={{ 
              borderColor: '#DCDEE3',
              backgroundColor: '#FFFFFF',
              color: 'rgb(38, 50, 56)',
              fontFamily: "'Roboto', sans-serif",
              paddingLeft: '45px',
              paddingRight: '16px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#4b33e8';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#DCDEE3';
            }}
            placeholder="Enter your Email"
            required
            disabled={showOtp}
          />
        </div>
      </div>

      {/* Request OTP Button */}
      {!showOtp && (
        <button
          type="button"
          onClick={handleEmailSubmit}
          disabled={isLoading}
          className="w-full rounded-full mt-2 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            background: 'linear-gradient(to right, #4b33e8)',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          {isLoading ? "Sending OTP..." : "Request OTP"}
        </button>
      )}

      {/* OTP Input Fields */}
      {showOtp && (
        <div className="mt-4">
          <label 
            className="block text-sm font-medium mb-1"
            style={{ color: 'rgb(38, 50, 56)' }}
          >
            Enter OTP
          </label>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
               <input
                 key={index}
                 ref={(el) => {
                   otpInputRefs.current[index] = el;
                 }}
                 type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-11 h-11 rounded-full border-2 text-center text-lg font-semibold transition-all focus:outline-none"
                style={{ 
                  borderColor: '#DCDEE3',
                  backgroundColor: '#FFFFFF',
                  color: 'rgb(38, 50, 56)',
                  fontFamily: "'Roboto', sans-serif"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4b33e8';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#DCDEE3';
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reset Password Button */}
      {showOtp && (
        <button
          type="button"
          onClick={handleResetPassword}
          className="w-full rounded-full mt-4 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg"
          style={{ 
            background: 'linear-gradient(to right, #4b33e8)',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Reset Password
        </button>
      )}

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold hover:underline"
          style={{ color: '#4b33e8' }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

