import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface DeviceMeta {
  id: string;
  device_id: string;
  device_model: string;
  android_id: string;
  last_seen: string;
  is_primary: boolean;
  type: string;
  value: string;
  status: string;
  user_name: string;
  email: string;
  on_call: boolean;
}

export default function DevicesTab({ employeeId }: { employeeId?: string }) {
  const [devices, setDevices] = useState<DeviceMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [localDeviceInfo, setLocalDeviceInfo] = useState<any>(null);

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

  const acceptConnection = async (targetId: string) => {
    try {
      const { error } = await supabase
        .from('sync_meta')
        .update({ status: 'connected' })
        .eq('id', targetId);

      if (error) throw error;
      fetchDevices();
    } catch (err) {
      console.error('Error accepting connection:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden" style={{ borderColor: "#E0E0E0" }}>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <i className="fi fi-rr-devices text-lg" />
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
              <i className="fi fi-rr-refresh flex" />
              Refresh
            </button>
          </div>

          {/* Local Device Info Banner if available */}
          {localDeviceInfo && (
            <div className="mb-8 p-4 bg-[#4b33e8]/5 border border-[#4b33e8]/10 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#4b33e8] flex items-center justify-center text-white shrink-0">
                <i className="fi fi-rr-smartphone" />
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
                <i className="fi fi-rr-search-alt text-3xl" />
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
                    {/* Accept Connection for this specific device if it's yours and pending */}
                    {device.is_primary && device.status === 'pending' && 
                     localDeviceInfo && (device.android_id === `${employeeId}_${localDeviceInfo.android_id || localDeviceInfo.androidId}`) && (
                      <button 
                        onClick={() => acceptConnection(device.id)}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
                      >
                        Accept Connection
                      </button>
                    )}

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
                      className={`py-2 px-4 border border-rose-100 text-rose-500 rounded-lg text-[11px] font-bold hover:bg-rose-50 transition-all ${
                        (device.is_primary && device.status === 'pending' && localDeviceInfo && device.android_id === `${employeeId}_${localDeviceInfo.android_id || localDeviceInfo.androidId}`) || !device.is_primary ? '' : 'flex-1'
                      }`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
