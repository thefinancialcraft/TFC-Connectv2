import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabase";

interface SignupFormProps {
  onError?: (error: string) => void;
  onSuccess?: () => void;
  fromAdminPanel?: boolean; // Flag to indicate this is from admin panel
}

export default function SignupForm({ onError, onSuccess, fromAdminPanel = false }: SignupFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'employee' | 'posp_agent'>('employee');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.contactNo.trim()) {
      newErrors.contactNo = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNo)) {
      newErrors.contactNo = "Contact number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Get current session token if from admin panel
      let authToken = null;
      if (fromAdminPanel) {
        const { data: { session } } = await supabase.auth.getSession();
        authToken = session?.access_token || null;
      }

      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          user_name: formData.name,
          contact_no: formData.contactNo,
          user_type: userType,
          from_admin_panel: fromAdminPanel, // Flag to indicate this is from admin panel
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Store user details in localStorage as backup
      localStorage.setItem('signup_name', formData.name);
      localStorage.setItem('signup_email', formData.email);

      // If onSuccess callback is provided (modal mode), call it instead of redirecting
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to success page with user details (normal signup flow)
        router.push({
          pathname: "/signup-success",
          query: {
            name: formData.name,
            email: formData.email,
          },
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during signup";
      setErrors({ submit: errorMessage });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-0">
      <h2
        className="text-xl md:text-lg"
        style={{
          fontWeight: "700",
          fontFamily: "poppins",
          color: "#263238",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Create Account
      </h2>

      {/* User Type Toggle */}
      <div className="mb-4">
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "rgb(38, 50, 56)" }}
        >
          User Type
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 h-[42px]">
          <button
            type="button"
            onClick={() => setUserType('employee')}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 flex-1 ${
              userType === 'employee'
                ? "bg-[#4b33e8] text-white hover:opacity-90"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Employee
          </button>
          <button
            type="button"
            onClick={() => setUserType('posp_agent')}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 flex-1 ${
              userType === 'posp_agent'
                ? "bg-[#4b33e8] text-white hover:opacity-90"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            POSP Agent
          </button>
        </div>
      </div>

      {/* Name Field */}
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-1"
          style={{ color: "rgb(38, 50, 56)" }}
        >
          Full Name
        </label>
        <div className="relative">
          <i
            className="fi flex fi-rr-user absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
            style={{
              color: "#787E9D",
              pointerEvents: "none",
            }}
          ></i>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
            style={{
              borderColor: errors.name ? "#EF4444" : "#DCDEE3",
              backgroundColor: "#FFFFFF",
              color: "rgb(38, 50, 56)",
              fontFamily: "'Roboto', sans-serif",
              paddingLeft: "45px",
              paddingRight: "16px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#4b33e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.name ? "#EF4444" : "#DCDEE3";
            }}
            placeholder="Enter your full name"
            required
          />
        </div>
        {errors.name && (
          <p className="text-xs mt-1 text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-1"
          style={{ color: "rgb(38, 50, 56)" }}
        >
          Email
        </label>
        <div className="relative">
          <i
            className="fi flex fi-rr-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
            style={{
              color: "#787E9D",
              pointerEvents: "none",
            }}
          ></i>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
            style={{
              borderColor: errors.email ? "#EF4444" : "#DCDEE3",
              backgroundColor: "#FFFFFF",
              color: "rgb(38, 50, 56)",
              fontFamily: "'Roboto', sans-serif",
              paddingLeft: "45px",
              paddingRight: "16px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#4b33e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.email ? "#EF4444" : "#DCDEE3";
            }}
            placeholder="Enter your email"
            required
          />
        </div>
        {errors.email && (
          <p className="text-xs mt-1 text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Contact Number Field */}
      <div className="mb-4">
        <label
          htmlFor="contactNo"
          className="block text-sm font-medium mb-1"
          style={{ color: "rgb(38, 50, 56)" }}
        >
          Contact Number
        </label>
        <div className="relative">
          <i
            className="fi flex fi-rr-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
            style={{
              color: "#787E9D",
              pointerEvents: "none",
            }}
          ></i>
          <input
            type="tel"
            id="contactNo"
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
            className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
            style={{
              borderColor: errors.contactNo ? "#EF4444" : "#DCDEE3",
              backgroundColor: "#FFFFFF",
              color: "rgb(38, 50, 56)",
              fontFamily: "'Roboto', sans-serif",
              paddingLeft: "45px",
              paddingRight: "16px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#4b33e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.contactNo ? "#EF4444" : "#DCDEE3";
            }}
            placeholder="Enter your contact number"
            maxLength={10}
            required
          />
        </div>
        {errors.contactNo && (
          <p className="text-xs mt-1 text-red-500">{errors.contactNo}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-1"
          style={{ color: "rgb(38, 50, 56)" }}
        >
          Password
        </label>
        <div className="relative">
          <i
            className="fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
            style={{
              color: "#787E9D",
              pointerEvents: "none",
            }}
          ></i>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
            style={{
              borderColor: errors.password ? "#EF4444" : "#DCDEE3",
              backgroundColor: "#FFFFFF",
              color: "rgb(38, 50, 56)",
              fontFamily: "'Roboto', sans-serif",
              paddingLeft: "45px",
              paddingRight: "16px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#4b33e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.password ? "#EF4444" : "#DCDEE3";
            }}
            placeholder="Enter your password"
            required
          />
        </div>
        {errors.password && (
          <p className="text-xs mt-1 text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium mb-1"
          style={{ color: "rgb(38, 50, 56)" }}
        >
          Confirm Password
        </label>
        <div className="relative">
          <i
            className="fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base"
            style={{
              color: "#787E9D",
              pointerEvents: "none",
            }}
          ></i>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none"
            style={{
              borderColor: errors.confirmPassword ? "#EF4444" : "#DCDEE3",
              backgroundColor: "#FFFFFF",
              color: "rgb(38, 50, 56)",
              fontFamily: "'Roboto', sans-serif",
              paddingLeft: "45px",
              paddingRight: "16px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#4b33e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.confirmPassword ? "#EF4444" : "#DCDEE3";
            }}
            placeholder="Confirm your password"
            required
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs mt-1 text-red-500">{errors.confirmPassword}</p>
        )}
      </div>


      {/* Sign Up Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full mt-1 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(to right, #4b33e8)",
          fontFamily: "'Poppins', sans-serif",
          marginTop: "10px",
          marginBottom: "10px",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = "linear-gradient(to right, #4b33e8)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = "linear-gradient(to right, #4b33e8)";
          }
        }}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
}

