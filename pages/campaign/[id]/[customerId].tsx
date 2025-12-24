import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../../../lib/authService";
import { supabase } from "../../../lib/supabase";
import BottomNav from "../../../components/BottomNav";

export default function CallingPage() {
    const router = useRouter();
    const { id: campaignId, customerId } = router.query;
    
    const [user, setUser] = useState<UserProfile | null>(null);
    const [customer, setCustomer] = useState<any>(null);
    const [campaign, setCampaign] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    
    // Call States
    const [isCalling, setIsCalling] = useState(false);
    const [postCall, setPostCall] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [disposition, setDisposition] = useState("");
    const [notes, setNotes] = useState("");

    const dispositions = [
        "Interested", "Not Interested", "Call Back", "Wrong Number", 
        "Disconnected", "Busy", "Language Barrier", "DNC (Do Not Call)"
    ];

    useEffect(() => {
        let interval: any;
        if (isCalling) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isCalling]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const renderCleanedDetails = (details: any) => {
        if (!details) return <p className="text-gray-400 italic">No information available</p>;
        
        let data = details;
        if (typeof details === 'string') {
            try {
                data = JSON.parse(details);
            } catch (e) {
                return <p className="italic">"{details}"</p>;
            }
        }

        if (typeof data !== 'object' || data === null) {
            return <p className="italic">"{String(data)}"</p>;
        }

        return (
            <div className="grid grid-cols-1 gap-3">
                {Object.entries(data).map(([key, value]) => {
                    const cleanKey = key.replace(/_(un)?checked/gi, '').replace(/_/g, ' ');
                    return (
                        <div key={key} className="flex flex-col border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                            <span className="text-[8px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>{cleanKey}</span>
                            <span className="text-[11px] font-bold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{String(value)}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const fetchAuth = async () => {
        const result = await checkAuthAndFetchProfile();
        if (result.shouldRedirect) {
            router.push("/login");
            return;
        }
        if (result.user) setUser(result.user);
    };

    const fetchData = async () => {
        if (!campaignId || !customerId) return;
        
        try {
            setLoading(true);
            
            // 1. Fetch Customer
            const { data: customerData, error: customerError } = await supabase
                .from('customers')
                .select('*')
                .eq('id', customerId)
                .single();
            
            if (customerError) throw customerError;
            setCustomer(customerData);

            // 2. Fetch Campaign
            const { data: campaignData, error: campaignError } = await supabase
                .from('campaigns')
                .select('*')
                .eq('id', campaignId)
                .single();
            
            if (campaignError) throw campaignError;
            setCampaign(campaignData);

            // 3. Fetch History
            const { data: historyData, error: historyError } = await supabase
                .from('call_logs')
                .select('*')
                .eq('customer_id', customerId)
                .order('created_at', { ascending: false });
            
            if (historyError) throw historyError;
            setHistory(historyData || []);

        } catch (err: any) {
            console.error("Error fetching calling data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuth();
    }, []);

    useEffect(() => {
        if (router.isReady) fetchData();
    }, [router.isReady, campaignId, customerId]);

    const handleStartCall = () => {
        if (customer?.phone_no) {
            window.location.href = `tel:${customer.phone_no}`;
        }
        setIsCalling(true);
        setPostCall(false);
        setCallDuration(0);
        setDisposition("");
        setNotes("");
    };

    const handleEndCall = () => {
        setIsCalling(false);
        setPostCall(true);
    };

    const handleSaveDisposition = async () => {
        if (!disposition) {
            alert("Please select a disposition");
            return;
        }

        try {
            setSaving(true);
            
            // 1. Save Call Log
            const { error: logError } = await supabase
                .from('call_logs')
                .insert({
                    customer_id: customerId,
                    campaign_id: campaignId,
                    agent_id: user?.uid,
                    disposition: disposition,
                    notes: notes,
                    duration: callDuration
                });

            if (logError) throw logError;

            // 2. Update Customer Disposition
            const { error: customerUpdateError } = await supabase
                .from('customers')
                .update({ 
                    disposition: disposition,
                    status: (disposition === 'Call Back' || disposition === 'Interested') ? 'followup' : 'active',
                    updated_at: new Date().toISOString()
                })
                .eq('id', customerId);

            if (customerUpdateError) throw customerUpdateError;

            // Refresh data
            fetchData();
            setPostCall(false);
            setDisposition("");
            setNotes("");
            setCallDuration(0);
            alert("Disposition saved successfully!");
            
        } catch (err: any) {
            console.error("Error saving disposition:", err);
            alert("Failed to save disposition: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8faff]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-[#4b33e8]"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}>
            <Sidebar activeNav="campaign" />
            
            <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
                <Header 
                    user={user ? {
                        displayName: user.displayName,
                        email: user.email,
                        employeeId: user.employeeId,
                        profilePicUrl: user.profilePicUrl
                    } : undefined} 
                    onLogout={() => handleLogout(router)} 
                />
                
                <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#f6f5f7" }}>
                    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
                        {/* Navigation Breadcrumb */}
                        <div className="flex items-center gap-2 mb-6 text-xs text-gray-400">
                            <button onClick={() => router.push('/campaign')} className="hover:text-[#4b33e8] transition-colors flex items-center gap-1">
                                Campaigns
                            </button>
                            <i className="fi fi-rr-angle-small-right"></i>
                            <button onClick={() => router.push(`/campaign/${campaignId}`)} className="hover:text-[#4b33e8] transition-colors">
                                {campaign?.name || 'Campaign'}
                            </button>
                            <i className="fi fi-rr-angle-small-right"></i>
                            <span className="text-[#4b33e8] flex items-center gap-1">
                                {customer?.lead_id}
                            </span>
                        </div>

                        {/* TOP SECTION: Customer Profile & Details Summary Bar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative mb-4">
                            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at top right, rgba(75, 51, 232, 0.05), transparent 60%)" }} />
                            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-50/50 blur-3xl opacity-50" />
                            
                            <div className="relative z-10 p-6">
                                {/* Row 1: Primary Identity & High-level Stats */}
                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-50 mb-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4b33e8] to-[#7b66ff] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                            {customer?.customer_name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold leading-tight" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                                                {customer?.customer_name || 'Anonymous Customer'}
                                            </h2>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500">
                                                    ID: {customer?.lead_id || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-8">
                                        <div className="flex flex-col items-center px-4 border-l border-gray-100 first:border-0">
                                            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Status</p>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg ${customer?.status === 'followup' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
                                                {customer?.status || 'Active'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center px-4 border-l border-gray-100">
                                            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Last Call</p>
                                            <p className="text-sm font-bold capitalize" style={{ color: "#4b33e8", fontFamily: "'Poppins', sans-serif" }}>{customer?.disposition || 'Fresh'}</p>
                                        </div>
                                        <div className="flex flex-col items-center px-4 border-l border-gray-100">
                                            <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Expiry Date</p>
                                            <p className="text-sm font-bold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                                                {customer?.expiry_date ? new Date(customer.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Parameters Integration */}
                                <div className="grid grid-cols-1 gap-8">
                                    {/* Specific Utility Parameters */}
                                    {customer?.utilities && Object.keys(customer.utilities).length > 0 && (
                                        <div className="space-y-4">
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                                <i className="fi fi-rr-settings-sliders text-indigo-400"></i> Detailed Parameters
                                            </p>
                                            <div className="bg-indigo-50/30 rounded-2xl p-4 border border-indigo-100/30">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                                                    {(() => {
                                                        const data = typeof customer.utilities === 'string' ? JSON.parse(customer.utilities) : customer.utilities;
                                                        return Object.entries(data).map(([key, value]) => {
                                                            const cleanKey = key.replace(/_(un)?checked/gi, '').replace(/_/g, ' ');
                                                            return (
                                                                <div key={key} className="flex flex-col border-b border-indigo-100/20 pb-2 last:border-0 last:pb-0">
                                                                    <span className="text-[8px] font-bold uppercase tracking-wider mb-0.5 text-[#787E9D]" style={{ fontFamily: "'Roboto', sans-serif" }}>{cleanKey}</span>
                                                                    <span className="text-xs font-bold text-[#263238]" style={{ fontFamily: "'Poppins', sans-serif" }}>{String(value)}</span>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            
                            {/* LEFT AREA: Calling & Interface */}
                            <div className="lg:col-span-8 space-y-4">
                                
                                {/* ACTIVE CALL BAR */}
                                {!postCall && (
                                    <div className={`rounded-2xl p-8 transition-all duration-500 overflow-hidden relative ${isCalling ? 'bg-indigo-600 shadow-2xl shadow-indigo-200' : 'bg-white shadow-sm border border-gray-100'}`}>
                                        {isCalling && (
                                            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full animate-pulse blur-[100px]"></div>
                                            </div>
                                        )}
                                        {!isCalling && (
                                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #4b33e8 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                                        )}
                                        
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl transition-all duration-500 shadow-lg ${isCalling ? 'bg-white text-indigo-600 animate-bounce' : 'bg-indigo-50 text-[#4b33e8]'}`}>
                                                    <i className={`fi fi-rr-${isCalling ? 'volume-up' : 'phone-call'}`}></i>
                                                </div>
                                                <div className="text-center md:text-left">
                                                    <h4 className={`text-xl font-bold mb-1 ${isCalling ? 'text-white' : ''}`} style={{ color: isCalling ? 'white' : "#263238", fontFamily: "'Poppins', sans-serif" }}>
                                                        {isCalling ? 'Live Conversation' : 'Ready to Call'}
                                                    </h4>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isCalling ? 'text-indigo-100' : ''}`} style={{ color: isCalling ? '' : "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                                        {isCalling ? 'Call Duration' : 'Standard Dialing Protocol'}
                                                    </p>
                                                </div>
                                            </div>

                                            {isCalling ? (
                                                <div className="flex items-center gap-8">
                                                    <div className="text-center">
                                                        <p className="text-4xl font-bold text-white lining-nums tabular-nums" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                            {formatTime(callDuration)}
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={handleEndCall}
                                                        className="h-16 px-8 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm uppercase tracking-widest transition-all border border-white/30 backdrop-blur-md"
                                                        style={{ fontFamily: "'Poppins', sans-serif" }}
                                                    >
                                                        End Session
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={handleStartCall}
                                                    className="h-16 px-12 rounded-2xl bg-[#4b33e8] hover:bg-[#3a25c1] text-white font-bold text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                                >
                                                    <i className="fi fi-rr-phone-call"></i>
                                                    Start Dialing
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* FLEX ROW: CORE PROFILE & OUTCOME */}
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                                    {/* Core Information Card */}
                                    <div className={`${postCall ? 'xl:col-span-12 xl:xl:col-span-5' : 'xl:col-span-12'} bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden relative transition-all duration-500`}>
                                        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at top right, rgba(75, 51, 232, 0.02), transparent 50%)" }} />
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100/50">
                                                    <i className="fi fi-rr-info text-xs"></i>
                                                </div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Core Profile Information</p>
                                            </div>
                                            <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100/50 flex-1">
                                                {renderCleanedDetails(customer?.customer_details)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* DISPOSITION & NOTES CARD */}
                                    {postCall && (
                                        <div className="xl:col-span-7 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-50/50 rounded-br-[4rem] -ml-8 -mt-8 -z-0"></div>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-8">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                                        <i className="fi fi-rr-edit text-sm"></i>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg leading-none mb-1" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>Update Outcome</h3>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Call Disposition & Notes</p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-8">
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase tracking-widest block mb-4" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Select Disposition</label>
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                            {dispositions.map((item) => (
                                                                <button
                                                                    key={item}
                                                                    onClick={() => setDisposition(item)}
                                                                    className={`p-3 rounded-2xl text-[10px] font-bold uppercase tracking-tight transition-all text-center border ${
                                                                        disposition === item 
                                                                        ? 'bg-[#4b33e8] text-white border-[#4b33e8] shadow-lg shadow-indigo-100 scale-105' 
                                                                        : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30'
                                                                    }`}
                                                                    style={{ fontFamily: "'Poppins', sans-serif" }}
                                                                >
                                                                    {item}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest block mb-4" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Internal Notes</label>
                                                        <textarea 
                                                            value={notes}
                                                            onChange={(e) => setNotes(e.target.value)}
                                                            placeholder="Type summary of conversation here..."
                                                            className="w-full bg-gray-50/50 rounded-[1.5rem] p-5 text-sm font-medium border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/10 focus:bg-white transition-all min-h-[140px] resize-none"
                                                            style={{ color: "#263238", fontFamily: "'Roboto', sans-serif" }}
                                                        />
                                                        <div className="flex justify-end mt-4">
                                                            <button 
                                                                disabled={saving}
                                                                onClick={handleSaveDisposition}
                                                                className="h-14 w-full md:w-64 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-xs uppercase tracking-[0.2em] shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                style={{ fontFamily: "'Poppins', sans-serif" }}
                                                            >
                                                                {saving ? 'Saving...' : 'Finalize Outcome'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT AREA: Activity History */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden h-full">
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-50/50 rounded-tl-[4rem] -mr-8 -mb-8 -z-0"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                                    <i className="fi fi-rr-time-past text-sm"></i>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg leading-none mb-1" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>Activity Logs</h3>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Full History</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1.5 rounded-xl bg-gray-50 text-[10px] font-bold uppercase tracking-widest border border-gray-100" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                                {history.length}
                                            </div>
                                        </div>

                                        {history.length === 0 ? (
                                            <div className="py-20 flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 opacity-50">
                                                    <i className="fi fi-rr-diary text-2xl text-gray-300"></i>
                                                </div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-center" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>No records found</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {history.map((log) => (
                                                    <div key={log.id} className="group p-4 rounded-2xl border border-gray-50 hover:bg-gray-50/30 hover:border-gray-100 transition-all">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[11px] font-bold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{log.disposition}</span>
                                                                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-[7px] font-bold text-indigo-500 uppercase tracking-widest">{formatTime(log.duration || 0)}</span>
                                                            </div>
                                                            <span className="text-[9px] font-bold" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                                                {new Date(log.created_at).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] font-medium leading-relaxed italic line-clamp-2" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
                                                            "{log.notes || 'No notes.'}"
                                                        </p>
                                                        <div className="mt-2 text-[8px] font-bold text-gray-300 uppercase tracking-widest uppercase">
                                                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </main>
        </div>
        <BottomNav activeNav="campaign" userRole={user?.role || null} />
    </div>
);
}
