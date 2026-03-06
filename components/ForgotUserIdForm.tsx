import { useState, useRef } from "react";

interface ForgotUserIdFormProps {
  onBack: () => void;
  onError?: (error: string) => void;
}

export default function ForgotUserIdForm({ onBack, onError }: ForgotUserIdFormProps) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [uniqueId, setUniqueId] = useState<string>("");
  const [showOtp, setShowOtp] = useState(false);
  const [showUserId, setShowUserId] = useState(false);
  const [foundUserId, setFoundUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const requestOtp = async () => {
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
          purpose: "forgot_user_id",
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestOtp();
  };

  const handleRequestAgain = async () => {
    // Reset OTP fields
    setOtp(Array(6).fill(""));
    setUniqueId("");
    // Request OTP again
    await requestOtp();
  };

  const handleFindUserId = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
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

      // OTP verified, show user ID
      if (data.employee_id) {
        setFoundUserId(data.employee_id);
        setShowUserId(true);
      } else {
        onError?.("User ID not found for this email");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to verify OTP";
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
    
    // Prevent form submission on Enter key
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      // If all OTP fields are filled, trigger Find User ID
      const otpCode = otp.join("");
      if (otpCode.length === 6) {
        handleFindUserId();
      }
    }
  };

  // Show User ID Display
  if (showUserId) {
    return (
      <div className="mt-0">
        <h2 
          className="text-xl md:text-lg mb-4"
          style={{ 
            fontWeight: '700',
            fontFamily: 'poppins',
            color: '#263238',
            textAlign: 'center',
          }}>
          Here is your Employee ID
        </h2>
        
        <div className="text-center mb-6">
          <div 
            className="inline-block px-6 py-4 rounded-full border-2"
            style={{
              borderColor: '#4A32E7',
              backgroundColor: '#f6f5ff'
            }}
          >
            <p 
              className="text-2xl font-bold"
              style={{
                color: '#4A32E7',
                fontFamily: "'Roboto', sans-serif"
              }}
            >
              {foundUserId}
            </p>
          </div>
        </div>

        <p 
          className="text-sm text-center"
          style={{ 
            color: 'rgb(38, 50, 56)',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          Hurray! We've found your Employee ID! Keep it safe for your next adventure with us!
        </p>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-semibold hover:underline"
            style={{ color: '#4A32E7' }}
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
        Forgot Employee ID
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
              e.currentTarget.style.borderColor = '#4A32E7';
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
            background: 'linear-gradient(to right, #4A32E7)',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          {isLoading ? "Sending OTP..." : "Request OTP"}
        </button>
      )}

      {/* Request Again Text Link - shown when OTP is visible */}
      {showOtp && (
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={handleRequestAgain}
            disabled={isLoading}
            className="text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontSize: '12px',
              color: '#4A32E7',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            {isLoading ? "Sending OTP..." : "Request Again?"}
          </button>
        </div>
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
                  e.currentTarget.style.borderColor = '#4A32E7';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#DCDEE3';
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Find User ID Button */}
      {showOtp && (
        <button
          type="button"
          onClick={(e) => handleFindUserId(e)}
          className="w-full rounded-full mt-4 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg"
          style={{ 
            background: 'linear-gradient(to right, #4A32E7)',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Find Employee ID
        </button>
      )}

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-semibold hover:underline"
          style={{ color: '#4A32E7' }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

