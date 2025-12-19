import { useState } from "react";

interface ForgotEmailFormProps {
  onBack: () => void;
  onError?: (error: string) => void;
}

export default function ForgotEmailForm({ onBack, onError }: ForgotEmailFormProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [foundEmail, setFoundEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as dd/mm/yyyy
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    
    setDateOfBirth(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId.trim()) {
      onError?.("Please enter your Employee ID");
      return;
    }

    if (!dateOfBirth.trim() || dateOfBirth.length !== 10) {
      onError?.("Please enter your Date of Birth in DD/MM/YYYY format");
      return;
    }

    // Validate date format
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(dateOfBirth)) {
      onError?.("Please enter Date of Birth in DD/MM/YYYY format");
      return;
    }

    setIsLoading(true);

    try {
      // Call API to find email
      const response = await fetch("/api/auth/forgot-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: employeeId.trim(),
          date_of_birth: dateOfBirth,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to find email");
      }

      // Show email if found
      if (data.email) {
        setFoundEmail(data.email);
        setShowEmail(true);
      } else {
        onError?.("Email not found for the provided Employee ID and Date of Birth");
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while finding email";
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show Email Display
  if (showEmail) {
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
          Here is your Email
        </h2>
        
        <div className="text-center mb-6">
          <div 
            className="inline-block px-6 py-4 rounded-full border-2"
            style={{
              borderColor: '#4b33e8',
              backgroundColor: '#f6f5ff'
            }}
          >
            <p 
              className="text-lg font-semibold break-all"
              style={{
                color: '#4b33e8',
                fontFamily: "'Roboto', sans-serif"
              }}
            >
              {foundEmail}
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
          Hurray! We've found your email! Keep it safe for your next adventure with us!
        </p>
      </div>
    );
  }

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
        Forgot Email
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Employee ID Field */}
        <div className="mb-4 mt-4">
          <label 
            htmlFor="employeeId" 
            className="block text-sm font-medium mb-1"
            style={{ color: 'rgb(38, 50, 56)' }}
          >
            Employee ID
          </label>
          <div className="relative">
            <i 
              className="fi flex fi-rr-user absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
              style={{ 
                color: '#787E9D',
                pointerEvents: 'none'
              }}
            ></i>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
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
              placeholder="Enter your Employee ID"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Date of Birth Field */}
        <div className="mb-4">
          <label 
            htmlFor="dateOfBirth" 
            className="block text-sm font-medium mb-1"
            style={{ color: 'rgb(38, 50, 56)' }}
          >
            Date of Birth
          </label>
          <div className="relative">
            <i 
              className="fi flex fi-rr-calendar absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
              style={{ 
                color: '#787E9D',
                pointerEvents: 'none'
              }}
            ></i>
            <input
              type="text"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={handleDateChange}
              maxLength={10}
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
              placeholder="DD/MM/YYYY"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Find Email Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full mt-2 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ 
            background: 'linear-gradient(to right, #4b33e8)',
            fontFamily: "'Poppins', sans-serif"
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'linear-gradient(to right, #4b33e8)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(to right, #4b33e8)';
          }}
        >
          {isLoading ? "Finding Email..." : "Find Email"}
        </button>
      </form>
    </div>
  );
}

