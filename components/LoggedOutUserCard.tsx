import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getStoredAccounts, removeAccount, StoredUser, saveAccount } from "../lib/sessionManager";
import { supabase } from "../lib/supabase";
import { showError, showSuccess } from "../lib/dialogUtils";
import SocialLoginButtons from "./SocialLoginButtons";

interface LoggedOutUserCardProps {
  onShowLoginForm: () => void;
  onLoginAnotherAccount?: () => void;
  formType?: "userId" | "email";
  onToggleForm?: () => void;
}

export default function LoggedOutUserCard({ onShowLoginForm, onLoginAnotherAccount, formType = "userId", onToggleForm }: LoggedOutUserCardProps) {
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<StoredUser[]>([]);
  const [activeTokens, setActiveTokens] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const accounts = getStoredAccounts();
      if (accounts.length > 0) {
        setAllUsers(accounts);
        
        // Batch check which tokens are still active in Supabase
        try {
          const response = await fetch('/api/auth/batch-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tokens: accounts.map(a => a.token_id) })
          });
          const data = await response.json();
          if (data.active_tokens) {
            setActiveTokens(data.active_tokens);
          }
        } catch (e) {
          console.error("Failed to check token statuses:", e);
        }
      } else {
        onShowLoginForm();
      }
    };
    
    loadUserData();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allUsers.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < allUsers.length - 1 ? prev + 1 : 0));
  };

  const handleRemoveAccount = async () => {
    const userData = allUsers[currentIndex];
    if (!userData) return;
    
    // --- NEW: Also remove from DB ---
    try {
      console.log(`🗑️ [UserCard] Removing session ${userData.token_id} from DB...`);
      await fetch("/api/auth/delete-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_id: userData.token_id }),
      });
    } catch (e) {
      console.error("❌ [UserCard] Failed to remove session from DB:", e);
    }

    removeAccount(userData.token_id);
    const updatedUsers = allUsers.filter((u) => u.token_id !== userData.token_id);
    setAllUsers(updatedUsers);
    
    if (updatedUsers.length > 0) {
      setCurrentIndex(0);
    } else {
      onShowLoginForm();
    }
  };


  const handleLogin = async () => {
    const userData = allUsers[currentIndex];
    if (!userData) return;

    setIsLoading(true);
    
    try {
      // Restore session in Supabase client
      const { data: { session }, error: sessionError } = await supabase.auth.setSession({
        access_token: userData.access_token,
        refresh_token: userData.refresh_token,
      });

      if (sessionError || !session) {
        // Token might be expired, remove card and show login
        console.warn("Session restoration failed:", sessionError);
        removeAccount(userData.token_id);
        const updated = allUsers.filter(u => u.token_id !== userData.token_id);
        setAllUsers(updated);
        
        if (updated.length === 0) onShowLoginForm();
        else setCurrentIndex(0);
        
        showError("Session expired. Please login again.", "Token Error");
        setIsLoading(false);
        return;
      }

      // 2. Activate in DB (Strictly await confirmation)
      console.log("📡 [UserCard] Activating session in DB...");
      const activateRes = await fetch("/api/auth/activate-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_id: userData.token_id }),
      });

      if (activateRes.ok) {
        console.log("✅ [UserCard] DB Activation confirmed.");
      } else {
        console.warn("⚠️ [UserCard] DB Activation failed on server.");
      }


      // 3. Compatibility: Update Active Session Metadata
      const { storeUserData } = await import("../lib/localStorageUtils");
      storeUserData({
        user_id: userData.user_id,
        email: userData.email,
        user_name: userData.user_name,
        employee_id: userData.employee_id,
        role: userData.role,
        profile_pic_url: userData.profile_pic_url,
        session_token: userData.access_token,
        refresh_token: userData.refresh_token,
        token_id: userData.token_id,
      });

      // 4. Update Multi-Account Storage last_login_at
      saveAccount({
        ...userData,
        last_login_at: new Date().toISOString()
      });



      // Notify Bridge
      const { notifyLoginToFlutter, syncUserInfoToFlutter } = await import("../lib/flutterBridge");
      notifyLoginToFlutter(userData);
      syncUserInfoToFlutter(userData);

      showSuccess('Welcome back!', 'Login Success');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      showError('Failed to restore session.', 'Login Error');
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(' ');
    return parts.length >= 2 
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.trim().charAt(0).toUpperCase();
  };

  const currentUser = allUsers[currentIndex];
  if (!currentUser) return null;

  const isActive = activeTokens.includes(currentUser.token_id);

  return (
    <div className="w-full flex flex-col items-center relative">
      <div className="relative mb-4">
        {currentUser.profile_pic_url ? (
          <img
            src={currentUser.profile_pic_url}
            alt={currentUser.user_name}
            className="w-24 h-24 rounded-full object-cover border-4"
            style={{ borderColor: isActive ? '#4caf50' : '#DCDEE3' }}
          />
        ) : (
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4"
            style={{ 
              backgroundColor: '#4b33e8',
              borderColor: isActive ? '#4caf50' : '#DCDEE3',
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {getInitials(currentUser.user_name)}
          </div>
        )}

        {/* Active Badge */}
        {isActive && (
          <div 
            className="absolute bottom-0 right-0 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold border-2 border-white"
            style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            ACTIVE
          </div>
        )}
        
        {/* Remove Button */}
        <button
          type="button"
          onClick={handleRemoveAccount}
          className="absolute -top-1 -right-1 p-1.5 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          style={{ color: '#4b33e8' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <h3 className="text-2xl font-bold mb-1 text-center" style={{ color: '#263238' }}>
        {currentUser.user_name}
      </h3>

      <p className="text-sm mb-4 text-center opacity-70" style={{ color: '#263238' }}>
        {currentUser.employee_id} • {currentUser.role}
      </p>

      {/* Account Navigation */}
      {allUsers.length > 1 && (
        <div className="flex gap-4 mb-6">
          <button type="button" onClick={handlePrevious} className="p-2 rounded-full border text-[#4b33e8] hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-center gap-1">
            {allUsers.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-4 bg-[#4b33e8]' : 'w-1.5 bg-gray-300'}`} />
            ))}
          </div>
          <button type="button" onClick={handleNext} className="p-2 rounded-full border text-[#4b33e8] hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full rounded-full px-6 py-3 font-semibold text-white transition-all hover:opacity-90 shadow-md flex items-center justify-center gap-2"
        style={{ backgroundColor: '#4b33e8' }}
      >
        {isLoading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Log In Now'}
      </button>

      <div className="my-4 flex items-center w-full">
        <div className="flex-1 border-t" style={{ borderColor: '#DCDEE3' }}></div>
        <span className="px-4 text-sm text-gray-400">or</span>
        <div className="flex-1 border-t" style={{ borderColor: '#DCDEE3' }}></div>
      </div>

      <div className="w-full">
        <SocialLoginButtons formType={formType} onToggleForm={() => { onToggleForm?.(); onShowLoginForm(); }} />
      </div>
    </div>
  );
}


