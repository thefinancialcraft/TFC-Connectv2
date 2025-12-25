import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../lib/authService";
import { supabase } from "../lib/supabase";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";
import { useCallSessionRedirect } from "../hooks/useCallSessionRedirect";

import CampaignCard, { type Campaign } from "../components/CampaignCard";
import AddCampaignModal from "../components/AddCampaignModal";


// Helper functions for performance calculation
const parseTalktime = (talktime: string | null) => {
	if (!talktime) return 0;
	let minutes = 0;
	const hoursMatch = talktime.match(/(\d+)h/i);
	const minsMatch = talktime.match(/(\d+)m/i);
	if (hoursMatch) minutes += parseInt(hoursMatch[1]) * 60;
	if (minsMatch) minutes += parseInt(minsMatch[1]);
	return minutes;
};

const calculatePerformance = (c: Campaign) => {
	const talktimeMins = parseTalktime(c.talktime || null);
	const dials = c.total_dials || 0;
	const userCount = Array.isArray(c.users) ? c.users.length : 0;

	if (userCount === 0) return 0;

	const talktimeTarget = 90 * userCount;
	const dialsTarget = 200 * userCount;

	const talktimeScore = Math.min(talktimeMins / talktimeTarget, 1);
	const dialsScore = Math.min(dials / dialsTarget, 1);

	return Math.round((talktimeScore + dialsScore) * 50);
};

export default function Campaign() {
	const router = useRouter();
	const [user, setUser] = useState<UserProfile | null>(() => {
		const cached = getStoredUserData();
		if (cached) {
			return {
				uid: cached.user_id || "",
				displayName: cached.user_name || cached.displayName || null,
				email: cached.email || "",
				phone: null,
				providers: [],
				providerType: null,
				createdAt: "",
				lastSignInAt: null,
				employeeId: cached.employee_id || null,
				role: cached.role || null,
				approvalStatus: null,
				accountStatus: null,
				updatedAt: null,
				profilePicUrl: cached.profile_pic_url || null,
			};
		}
		return null;
	});

	useCallSessionRedirect(user?.uid);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [activeNav, setActiveNav] = useState("campaign");

	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [loadingCampaigns, setLoadingCampaigns] = useState(true);
	const [mounted, setMounted] = useState(false);
	const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
	const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
	// Campaign creation state moved to AddCampaignModal component
	const [users, setUsers] = useState<any[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(false);

	const fetchAuth = async () => {
		const result = await checkAuthAndFetchProfile();
		if (result.shouldRedirect) {
			router.push("/login");
			return;
		}
		if (result.error) {
			setError(result.error);
			setTimeout(() => router.push("/login"), 2000);
			return;
		}

		if (result.user) {
			const { data: { session } } = await supabase.auth.getSession();
			let latestUserData = result.user;
			if (session) {
				try {
					const profileResp = await fetch("/api/auth/user-profile", {
						headers: { Authorization: `Bearer ${session.access_token}` },
					});
					const profileData = await profileResp.json();
					if (profileData.success && profileData.user) {
						latestUserData = { ...profileData.user, profilePicUrl: profileData.user.profile_pic_url || null };
					}
				} catch (e) {
					console.error("Error fetching latest profile:", e);
				}
			}

			setUser((prev) => {
				if (!prev) {
					if (latestUserData.uid) {
						const cached = getStoredUserData();
						storeUserData({
							user_id: latestUserData.uid,
							email: latestUserData.email || "",
							user_name: latestUserData.displayName || cached?.user_name || "",
							employee_id: latestUserData.employeeId || cached?.employee_id || "",
							role: latestUserData.role || cached?.role || "user",
							profile_pic_url: latestUserData.profilePicUrl || null,
							session_token: cached?.session_token,
							refresh_token: cached?.refresh_token,
						});
					}
					return latestUserData;
				}

				const hasChanged = prev.displayName !== latestUserData.displayName || prev.employeeId !== latestUserData.employeeId || prev.email !== latestUserData.email || prev.profilePicUrl !== latestUserData.profilePicUrl || prev.role !== latestUserData.role;
				if (hasChanged) return latestUserData;
				return prev;
			});
		}
	};

	const fetchCampaigns = async () => {
		try {
			setLoadingCampaigns(true);
			const { data, error } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
			if (error) {
				console.error("Error fetching campaigns:", error);
				setCampaigns([]);
			} else {
				setCampaigns((data || []) as Campaign[]);
			}
		} catch (e) {
			console.error(e);
			setCampaigns([]);
		} finally {
			setLoadingCampaigns(false);
		}
	};

	const fetchUsers = async () => {
		try {
			setLoadingUsers(true);
			// Use user_profiles table as in the users page to get consistent fields
			const { data, error } = await supabase
				.from("user_profiles")
				.select("id, user_id, email, user_name, profile_pic_url")
				.order("created_at", { ascending: false });
			if (!error && data) {
				// map fields to expected shape
				const mapped = (data || []).map((u: any) => ({
					...u,
					user_name: u.user_name || u.name || null,
					profile_pic_url: u.profile_pic_url || u.profile_image || null,
				}));
				setUsers(mapped);
			} else {
				setUsers([]);
			}
		} catch (e) {
			console.error("Error fetching users:", e);
			setUsers([]);
		} finally {
			setLoadingUsers(false);
		}
	};

	useEffect(() => {
		setMounted(true);
		fetchAuth();
		fetchCampaigns();
		const handleFocus = () => {
			fetchAuth();
			fetchCampaigns();
		};
		window.addEventListener("focus", handleFocus);
		return () => window.removeEventListener("focus", handleFocus);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);

	const handleLogoutClick = async () => {
		await handleLogout(router);
	};

	const handleCampaignSaved = () => {
		alert(editingCampaign ? "Campaign updated successfully!" : "Campaign created successfully!");
		setEditingCampaign(null);
		fetchCampaigns();
	};

	const handleEditCampaign = (campaign: Campaign) => {
		setEditingCampaign(campaign);
		setShowAddCampaignModal(true);
		fetchUsers();
	};

	const handleDeleteCampaign = async (id: string) => {
		if (confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
			try {
				const { error } = await supabase.from("campaigns").delete().eq("id", id);
				if (error) {
					alert("Error deleting campaign: " + error.message);
				} else {
					alert("Campaign deleted successfully!");
					fetchCampaigns();
				}
			} catch (e) {
				console.error("Error deleting campaign:", e);
				alert("Error deleting campaign");
			}
		}
	};

	const filtered = campaigns.filter(c => 
        searchQuery === "" || 
        (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.status && c.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#4b33e8' }}></div>
					<div className="text-lg" style={{ color: "#4b33e8" }}>Loading...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
				<div className="text-center">
					<div className="text-lg mb-4 text-red-500">{error}</div>
					<div className="text-sm" style={{ color: "#4b33e8" }}>Redirecting to login...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}>
			<Sidebar
				user={{
					displayName: user?.displayName || null,
					email: user?.email || '',
					employeeId: user?.employeeId || null,
					lastSignInAt: user?.lastSignInAt || null,
					profilePicUrl: user?.profilePicUrl || null,
				}}
				activeNav={activeNav}
				onNavChange={setActiveNav}
				userRole={user?.role || null}
			/>

			<div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
				<Header user={{ displayName: user?.displayName || null, email: user?.email || '', employeeId: user?.employeeId || null, profilePicUrl: user?.profilePicUrl || null }} onLogout={handleLogoutClick} />

				<main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px] lg:ml-0">
					<div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
						<div className="space-y-6 sm:space-y-8">
							<div className="mb-6 flex items-start justify-between">
								<div>
									<h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>Campaigns</h1>
									<p className="text-sm sm:text-base" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Create, schedule and monitor marketing campaigns</p>
								</div>


							</div>

							<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
								<div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38" style={{ backgroundColor: "white" }}>
									<div className="absolute inset-0" style={{ backgroundColor: "radial-gradient(circle at top right, rgba(75, 51, 232, 0.12), transparent 60%)" }} />
									<div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-purple-200/20 blur-2xl" />
									<div className="absolute -right-2 -bottom-2">
										<i className="fi flex fi-rr-briefcase text-5xl" style={{ color: "#4b33e8", opacity: 0.15 }}></i>
									</div>
									<div className="relative flex flex-col h-full z-10">
										<div className="flex items-start justify-between mb-auto">
											<p className="text-xs sm:text-sm font-medium" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Total Campaigns</p>
										</div>
										<div className="mt-auto">
											<p className="text-3xl sm:text-4xl font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{campaigns.length}</p>
											<p className="text-xs sm:text-sm mt-1" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>All campaigns</p>
										</div>
									</div>
								</div>

								<div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38" style={{ backgroundColor: "white" }}>
									<div className="absolute inset-0" style={{ background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 60%)" }} />
									<div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-green-200/20 blur-2xl" />
									<div className="absolute -right-2 -bottom-2">
										<i className="fi flex fi-rr-play text-5xl" style={{ color: "#10b981", opacity: 0.15 }}></i>
									</div>
									<div className="relative flex flex-col h-full z-10">
										<div className="flex items-start justify-between mb-auto">
											<p className="text-xs sm:text-sm font-medium" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Active</p>
										</div>
										<div className="mt-auto">
											<p className="text-3xl sm:text-4xl font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{campaigns.filter(c => c.status === 'active').length}</p>
											<p className="text-xs sm:text-sm mt-1" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Running campaigns</p>
										</div>
									</div>
								</div>

								<div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38" style={{ backgroundColor: "white" }}>
									<div className="absolute inset-0" style={{ background: "radial-gradient(circle at top right, rgba(249, 115, 22, 0.12), transparent 60%)" }} />
									<div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-orange-200/20 blur-2xl" />
									<div className="absolute -right-2 -bottom-2">
										<i className="fi flex fi-rr-pause text-5xl" style={{ color: "#f97316", opacity: 0.15 }}></i>
									</div>
									<div className="relative flex flex-col h-full z-10">
										<div className="flex items-start justify-between mb-auto">
											<p className="text-xs sm:text-sm font-medium" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Inactive</p>
										</div>
										<div className="mt-auto">
											<p className="text-3xl sm:text-4xl font-semibold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>{campaigns.filter(c => c.status === 'inactive').length}</p>
											<p className="text-xs sm:text-sm mt-1" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Inactive campaigns</p>
										</div>
									</div>
								</div>

								<div className="relative overflow-hidden rounded-2xl pt-4 sm:pt-5 px-4 sm:px-5 pb-0 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38" style={{ backgroundColor: "#4b33e8", color: 'white' }}>
									<div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #4b33e8 0%, #6366f1 100%)" }} />
									<div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

									<div className="relative flex flex-col h-full z-10">
										<div className="flex items-start justify-between mb-4">
											<div className="flex flex-col">
												<p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/80" style={{ fontFamily: "'Poppins', sans-serif" }}>Live Performance</p>
												<div className="flex items-center gap-1.5 mt-1 bg-white/10 px-2 py-0.5 rounded-full w-fit">
													<div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
													<span className="text-[8px] font-black uppercase tracking-tighter">Real-time</span>
												</div>
											</div>
											<div className="text-right flex flex-col items-end">
												<span className="text-[9px] text-white/60 leading-none uppercase font-bold tracking-wider mb-0.5">Avg Yield</span>
												<span className="text-2xl font-black leading-none">
													{campaigns.filter(c => c.status === 'active').length > 0
														? Math.round(campaigns.filter(c => c.status === 'active').reduce((acc, c) => acc + calculatePerformance(c), 0) / campaigns.filter(c => c.status === 'active').length)
														: 0}%
												</span>
											</div>
										</div>

										<div className="flex-1 flex items-end gap-2 min-h-0">
											{campaigns.filter(c => c.status === 'active').length === 0 ? (
												<div className="flex flex-col items-center justify-center w-full h-full opacity-40">
													<i className="fi flex fi-rr-chart-line-up text-xl mb-1"></i>
													<span className="text-[8px] uppercase font-bold">No Active Data</span>
												</div>
											) : (
												campaigns.filter(c => c.status === 'active').map((c, i) => {
													const perf = calculatePerformance(c);
													return (
														<div key={c.id} className="flex-1 flex flex-col items-center group/bar relative h-full justify-end">
															{/* Permanent Value on Top */}
															<span className="text-[8px] font-black text-white/90 mb-1 opacity-60 group-hover/bar:opacity-100 transition-opacity">
																{perf}%
															</span>

															<div
																className="w-full bg-white/30 rounded-t-[4px] transition-all duration-500 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-help relative"
																style={{ height: `${Math.max(perf, 5)}%` }}
															>
																{/* Tooltip with Name */}
																<div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#4b33e8] px-2 py-1 rounded-md text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20 pointer-events-none border border-purple-100 uppercase tracking-tighter">
																	{c.name || 'CAM'}
																	<div className="absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white"></div>
																</div>
															</div>
														</div>
													)
												})
											)}
										</div>


									</div>
								</div>
							</div>

							<div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
								<div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full lg:w-auto">
									<div className="w-full lg:w-auto">
										<div className="relative w-full min-w-[180px] sm:min-w-[220px]">
											<input
												placeholder="Search campaigns..."
												className="pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm focus:outline-none w-full sm:w-64 placeholder:text-gray-400"
												type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
												style={{ fontFamily: "'Roboto', sans-serif" }}
											/>
											<i className="fi flex fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm"></i>
										</div>
									</div>
									<div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3 justify-start lg:justify-end w-full lg:w-auto">
										<button
											type="button"
											className="inline-flex items-center justify-center gap-2 px-3 h-[42px] w-[42px] sm:w-auto rounded-xl border border-gray-300 bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
											style={{ fontFamily: "'Poppins', sans-serif" }}
										>
											<i className="fi flex fi-rr-filter text-xs sm:text-sm"></i>
											<span className="hidden xs:inline">Filters</span>
										</button>
										<button
											onClick={() => {
												setShowAddCampaignModal(true);
												fetchUsers();
											}}
											className="px-6 h-[42px] text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 hover:opacity-90"
											style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#4b33e8" }}
										>
											<i className="fi flex fi-rr-plus text-base"></i>
											<span className="hidden sm:inline">Add Campaign</span>
										</button>
									</div>
								</div>
							</div>

							<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{loadingCampaigns ? (
									<div className="col-span-full text-center py-8">Loading campaigns...</div>
								) : filtered.length === 0 ? (
									<div className="col-span-full text-center py-8 text-gray-500">No campaigns found.</div>
								) : (
									filtered.map((c) => (
										<CampaignCard
											key={c.id}
											campaign={c}
											onEdit={handleEditCampaign}
											onDelete={handleDeleteCampaign}
										/>
									)))}
							</div>
						</div>
					</div>
				</main>
			</div>

			{showAddCampaignModal && (
				<AddCampaignModal
					isOpen={showAddCampaignModal}
					onClose={() => {
						setShowAddCampaignModal(false);
						setEditingCampaign(null);
					}}
					onSuccess={handleCampaignSaved}
					users={users}
					loadingUsers={loadingUsers}
					currentUser={user}
					campaign={editingCampaign}
				/>
			)}

			<BottomNav activeNav={activeNav} userRole={user?.role || null} isSuperAdmin={user?.role === 'super_admin'} />
		</div>
	);
}
