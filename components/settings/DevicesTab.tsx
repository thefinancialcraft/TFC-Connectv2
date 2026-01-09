import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface DeviceMeta {
  id: string;
  device_id: string;
  device_model: string;
  android_id: string;
  entry_id: string;
  last_seen: string;
  is_primary: boolean;
  type: string;
  value: string;
  status: string;
  user_name: string;
  email: string;
  on_call: boolean;
}

export default function DevicesTab({ employeeId }: { employeeId?: string | null }) {
  const [devices, setDevices] = useState<DeviceMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [localDeviceInfo, setLocalDeviceInfo] = useState<any>(null);
  const [isBridgeActive, setIsBridgeActive] = useState(false);
  
  // OTP Verification State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [verifyingDeviceId, setVerifyingDeviceId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  useEffect(() => {
    const checkBridge = () => {
      const active = !!(window as any).flutter_inappwebview?.callHandler;
      if (active !== isBridgeActive) setIsBridgeActive(active);
    };

    checkBridge();
    const interval = setInterval(checkBridge, 1000);
    return () => clearInterval(interval);
  }, [isBridgeActive]);

  useEffect(() => {
    fetchDevices();
    
    // Check localstorage for current device info
    if (typeof window !== 'undefined') {
      const info = localStorage.getItem('flutter_device_info');
      if (info) {
        try {
          setLocalDeviceInfo(JSON.parse(info));
        } catch (e) {
          console.error("Failed to parse local device info", e);
        }
      }
    }
  }, [employeeId]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('sync_meta')
        .select('*');

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query.order('last_seen', { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (err) {
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString([], { 
      day: '2-digit', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const setPrimary = async (targetId: string) => {
    if (!employeeId) return;
    try {
      // 1. Reset all your devices to not primary and status to 'inactive'
      await supabase
        .from('sync_meta')
        .update({ 
          is_primary: false,
          status: 'inactive'
        })
        .eq('employee_id', employeeId);
      
      // 2. Set the target device as primary and status to 'pending'
      // Note: We set to pending to force a re-handshake/verification
      const { error } = await supabase
        .from('sync_meta')
        .update({ 
          is_primary: true,
          status: 'pending'
        })
        .eq('id', targetId);

      if (error) throw error;
      fetchDevices(); // Refresh list
    } catch (err) {
      console.error('Error setting primary device:', err);
    }
  };

  const deleteDevice = async (targetId: string) => {
    if (!window.confirm("Are you sure you want to remove this device? This cannot be undone.")) return;
    try {
      const { error } = await supabase
        .from('sync_meta')
        .delete()
        .eq('id', targetId);

      if (error) throw error;
      setDevices(prev => prev.filter(d => d.id !== targetId));
    } catch (err) {
      console.error('Error deleting device:', err);
    }
  };

  const acceptConnection = async (targetId: string, email: string) => {
    try {
      setIsVerifying(true);
      setOtpError(null);
      
      // 1. Send OTP via Google Apps Script
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APPSCRIPT_WEBAPP_URL;
      if (!scriptUrl) throw new Error("Verification service not configured");

      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors sometimes, or we handle it in doOptions
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          purpose: 'device_activation'
        })
      });

      // Since no-cors won't give us the body, we assume it sent or wait for user to input
      setVerifyingDeviceId(targetId);
      setShowOTPModal(true);
      setIsVerifying(false);
    } catch (err) {
      console.error('Error starting activation:', err);
      setIsVerifying(false);
      alert("Failed to send verification code. Please try again.");
    }
  };

  const verifyOTPAndConnect = async () => {
    if (!verifyingDeviceId || otpValue.length !== 6) return;
    
    try {
      setIsVerifying(true);
      setOtpError(null);

      // Verify OTP in Supabase
      const { data, error } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('otp_code', otpValue)
        .eq('purpose', 'device_activation')
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error || !data || data.length === 0) {
        setOtpError("Invalid or expired code");
        setIsVerifying(false);
        return;
      }

      // Mark OTP as used
      await supabase
        .from('otp_verifications')
        .update({ is_used: true, used_at: new Date().toISOString() })
        .eq('id', data[0].id);

      // Finalize device connection
      const { error: updateError } = await supabase
        .from('sync_meta')
        .update({ status: 'connected' })
        .eq('id', verifyingDeviceId);

      if (updateError) throw updateError;

      setShowOTPModal(false);
      setOtpValue('');
      setVerifyingDeviceId(null);
      fetchDevices();
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setOtpError("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const declineConnection = async (targetId: string) => {
    try {
      const { error } = await supabase
        .from('sync_meta')
        .update({ status: 'inactive' })
        .eq('id', targetId);

      if (error) throw error;
      fetchDevices();
    } catch (err) {
      console.error('Error declining connection:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden" style={{ borderColor: "#E0E0E0" }}>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <i className="fi flex  fi-rr-devices text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#263238]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Connected Devices
                </h3>
                <p className="text-xs text-[#787E9D]">Manage devices synced with your account</p>
              </div>
            </div>
            
            <button 
              onClick={fetchDevices}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all border border-gray-100"
            >
              <i className="fi flex  fi-rr-refresh flex" />
              Refresh
            </button>
          </div>

          {/* Local Device Info Banner if available */}
          {localDeviceInfo && (
            <div className="mb-8 p-4 bg-[#4b33e8]/5 border border-[#4b33e8]/10 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#4b33e8] flex items-center justify-center text-white shrink-0">
                <i className="fi flex  fi-rr-smartphone" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-[#4b33e8] uppercase tracking-wider">Current Session Device</p>
                <h4 className="text-sm font-bold text-[#263238] truncate">{localDeviceInfo.model || localDeviceInfo.device_model || 'Unknown Device'}</h4>
              </div>
              <div className="hidden sm:block text-right">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md text-[10px] font-black uppercase">Active Now</span>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-400 font-medium italic">Scanning for devices...</p>
            </div>
          ) : devices.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 opacity-60">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <i className="fi flex  fi-rr-search-alt text-3xl" />
              </div>
              <p className="text-sm font-medium italic">No devices found for this account</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {devices.map((device) => (
                <div 
                  key={device.id} 
                  className={`p-5 rounded-[20px] border transition-all hover:shadow-md ${
                    device.is_primary ? 'border-[#4b33e8]/20 bg-[#4b33e8]/5' : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        device.is_primary ? 'bg-[#4b33e8] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <i className={`fi ${device.on_call ? 'fi-rr-phone-call animate-pulse' : 'fi-rr-smartphone'} text-lg`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#263238] truncate">
                            {device.device_model || 'Unknown Model'}
                          </h4>
                          {device.is_primary && (
                            <span className="px-1.5 py-0.5 bg-[#4b33e8] text-white rounded text-[8px] font-black uppercase">Primary</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono truncate">{device.android_id || 'No ID'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] font-black uppercase mb-1 ${
                        !device.is_primary 
                          ? 'text-gray-400' 
                          : device.status !== 'connected' 
                            ? 'text-amber-500'
                            : new Date().getTime() - new Date(device.last_seen).getTime() < 300000 
                              ? 'text-emerald-500' : 'text-gray-400'
                      }`}>
                        {!device.is_primary 
                          ? 'Inactive' 
                          : device.status !== 'connected' 
                            ? 'Pending' 
                            : new Date().getTime() - new Date(device.last_seen).getTime() < 300000 ? 'Online' : 'Offline'}
                      </div>
                      <p className="text-[9px] text-gray-400">{formatTime(device.last_seen)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-50">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">User</p>
                      <p className="text-xs font-bold text-gray-700 truncate">{device.user_name || 'Anonymous'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          !device.is_primary ? 'bg-gray-300' :
                          device.status !== 'connected' ? 'bg-amber-400' : 
                          device.on_call ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <p className="text-xs font-bold text-gray-700">
                          {!device.is_primary ? 'Inactive Device' :
                           device.status !== 'connected' ? 'Pending Verification' : 
                           device.on_call ? 'In Call' : 'Available'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    {/* Primary Activation: Accept/Reject for current session's device */}
                    {device.is_primary && device.status === 'pending' && isBridgeActive && localDeviceInfo && 
                     (device.entry_id === `${employeeId}_${localDeviceInfo.android_id || localDeviceInfo.androidId}`) ? (
                      <>
                        <button 
                          onClick={() => acceptConnection(device.id, device.email)}
                          className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                        >
                          <i className="fi flex fi-rr-check flex" />
                          Confirm
                        </button>
                        <button 
                          onClick={() => declineConnection(device.id)}
                          className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                          <i className="fi flex  fi-rr-cross-small flex" />
                          Decline
                        </button>
                      </>
                    ) : (
                      <>
                        {!device.is_primary && (
                          <button 
                            onClick={() => setPrimary(device.id)}
                            className="flex-1 py-2 bg-[#4b33e8] text-white rounded-lg text-[11px] font-bold hover:bg-[#3b27b8] transition-all"
                          >
                            Set Primary
                          </button>
                        )}
                        <button 
                          onClick={() => deleteDevice(device.id)}
                          className={`py-2 px-4 border border-rose-100 text-rose-500 rounded-lg text-[11px] font-bold hover:bg-rose-50 transition-all ${!device.is_primary ? '' : 'flex-1'}`}
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fi fi-rr-shield-check text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Device</h3>
              <p className="text-sm text-gray-500 mb-8">
                Enter the 6-digit code sent to your email to activate this device.
              </p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className={`w-full text-center text-3xl font-black tracking-[12px] py-4 rounded-2xl border-2 transition-all outline-none ${
                    otpError ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-gray-100 bg-gray-50 text-gray-900 focus:border-[#4b33e8]/30'
                  }`}
                />
                
                {otpError && (
                  <p className="text-xs font-bold text-rose-500 animate-bounce">{otpError}</p>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowOTPModal(false);
                      setOtpValue('');
                      setOtpError(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={verifyOTPAndConnect}
                    disabled={otpValue.length !== 6 || isVerifying}
                    className={`flex-[1.5] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      otpValue.length === 6 && !isVerifying
                        ? 'bg-[#4b33e8] text-white shadow-lg shadow-[#4b33e8]/20 hover:scale-[1.02]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isVerifying ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Verify & Connect</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
