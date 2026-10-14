	import { useEffect, useState, useMemo } from "react";
	import { useRouter } from "next/router";
	import { useUser } from "@/components/AppLayout";
	import { supabase } from "@/lib/supabase";
	import { logSystemEvent } from "@/lib/monitoring";

	import CampaignCard, { type Campaign } from "@/components/CampaignCard";
	import AddCampaignModal from "@/components/AddCampaignModal";


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
		const { user, mounted } = useUser();

		const [activeNav] = useState("campaign");

		const [campaigns, setCampaigns] = useState<Campaign[]>([]);
		const [loadingCampaigns, setLoadingCampaigns] = useState(true);
		const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
		const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
		const [searchQuery, setSearchQuery] = useState("");
		const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("active");
		const [exitingCardIds, setExitingCardIds] = useState<string[]>([]);
		// Campaign creation state moved to AddCampaignModal component
		const [users, setUsers] = useState<any[]>([]);
		const [loadingUsers, setLoadingUsers] = useState(false);



		const isCeo = useMemo(() => {
			if (!mounted || !user) return false;
			const normalizedDesignation = (user.designation || "").toLowerCase().trim();
			return !user.isClient || normalizedDesignation === 'ceo' || user.role === 'superadmin';
		}, [user, mounted]);

		const permissionFlags = useMemo(() => {
			if (!mounted || !user) return {
				isCreateCampaginButtonVisible: false,
				isCampaginEditButtonVisible: false,
				isCampaginDeleteButtonVisible: false,
				isToggleStatusVisible: false,
			};

			const normalizedDesignation = (user.designation || "").toLowerCase().trim();
			const isUserCeo = !user.isClient || normalizedDesignation === 'ceo' || user.role === 'superadmin';

			// Level 3 & Level 4: CEO has full control including toggle status
			if (isUserCeo) {
				return {
					isCreateCampaginButtonVisible: true,
					isCampaginEditButtonVisible: true,
					isCampaginDeleteButtonVisible: true,
					isToggleStatusVisible: true,
				};
			}

			// Level 3: Developer / Manager (can edit/create, but cannot toggle status)
			if (user.isClient && ['developer', 'manager'].includes(normalizedDesignation)) {
				return {
					isCreateCampaginButtonVisible: true,
					isCampaginEditButtonVisible: true,
					isCampaginDeleteButtonVisible: false,
					isToggleStatusVisible: false,
				};
			}

			// Level 1: Client Agent & Level 2: Team Leader
			return {
				isCreateCampaginButtonVisible: false,
				isCampaginEditButtonVisible: false,
				isCampaginDeleteButtonVisible: false,
				isToggleStatusVisible: false,
			};
		}, [user, mounted]);

		const fetchCampaigns = async (silent = false) => {
			if (!user) return; // Wait for user

			try {
				if (!silent) setLoadingCampaigns(true);
				
				// 1. Base Query
				let query = supabase
					.from("campaigns")
					.select("*, organizations(id, company_name, org_code)")
					.order("created_at", { ascending: false });

				const normalizedDesignation = (user.designation || "").toLowerCase().trim();
				console.log("🔍 [Campaign] Fetching for user:", {
					uid: user.uid,
					email: user.email,
					isClient: user.isClient,
					designation: user.designation,
					normalizedDesignation,
					organization_id: user.organization_id
				});

				// Level 4: Internal Staff (Global Admin) - No filters
				if (!user.isClient) {
					// No filters applied
				} 
				// Client Users (Everyone Else)
				else {
					// 1. Mandatory Organization Filter
					if (user.organization_id) {
						console.log("🏢 [Campaign] Filtering by Organization:", user.organization_id);
						query = query.eq('organization_id', user.organization_id);
					} else {
						// Fail-secure: No organization, no campaigns
						console.warn("⚠️ [Campaign] CRITICAL: No organization_id found for user. Access blocked.");
						query = query.eq('id', '00000000-0000-0000-0000-000000000000'); 
					}

					// 2. Assignment Filters based on Level
					if (normalizedDesignation === 'team_leader' || normalizedDesignation === 'teamleader' || normalizedDesignation.includes('tl')) {
						// Level 2: Team Leader (Self + Team)
						let teamMemberIds: string[] = [user.uid];
						const { data: teamData } = await supabase
							.from('teams')
							.select('members')
							.eq('leader_id', user.uid)
							.eq('is_active', true);

						if (teamData) {
							teamData.forEach(team => {
								if (Array.isArray(team.members)) {
									team.members.forEach((member: any) => {
										if (typeof member === 'string') teamMemberIds.push(member);
									});
								}
							});
						}
						teamMemberIds = [...new Set(teamMemberIds)];

						if (teamMemberIds.length > 0) {
							const orFilter = teamMemberIds.map(id => `users.cs.[{"user_id":"${id}"}]`).join(',');
							console.log("👥 [Campaign] Level 2: TL Filter Applied. Searching for members:", teamMemberIds);
							console.log("🔗 [Campaign] Generated OR Filter:", orFilter);
							query = query.or(orFilter);
						} else {
							console.warn("👥 [Campaign] TL has no active team members. Searching only for self.");
							query = query.filter('users', 'cs', `[{"user_id":"${user.uid}"}]`);
						}
					} 
					else if (['ceo', 'developer', 'manager'].includes(normalizedDesignation)) {
						// Level 3: Client Admin (Sees all in organization - no extra filter)
					} 
					else {
						// Level 1: Client Agent (Strictest)
						console.log("👤 [Campaign] Level 1: Agent Filter. Status: active, UserID:", user.uid);
						query = query.eq('status', 'active');
						if (user.uid) { 
							const agentFilter = `[{"user_id":"${user.uid}"}]`;
							console.log("🔍 [Campaign] Agent JSON Filter Value:", agentFilter);
							query = query.filter('users', 'cs', agentFilter);
						}
					}
				}

				// Strict enforcement: Non-CEO users can ONLY see active campaigns!
				if (!isCeo) {
					console.log("🔒 [Campaign] Restricting query to ACTIVE campaigns only for non-CEO user.");
					query = query.eq('status', 'active');
				}

				const { data: campaignData, error: campaignError } = await query;
				
				if (campaignError) {
					console.error("❌ [Campaign] Supabase Query Error:", campaignError);
					throw campaignError;
				}
				
				let finalBaseCampaigns = (campaignData || []) as Campaign[];
				console.log(`✅ [Campaign] Query returned ${finalBaseCampaigns.length} campaigns.`);
				
				if (finalBaseCampaigns.length === 0 && user.organization_id) {
					console.info("🔍 [Campaign] Starting Diagnostics & Fallback...");
					
					// Diagnostic Fetch: See ALL campaigns in org
					const { data: allOrgCamps } = await supabase
						.from('campaigns')
						.select('*, organizations(id, company_name, org_code)')
						.eq('organization_id', user.organization_id);
						
					if (allOrgCamps && allOrgCamps.length > 0) {
						// 🕵️ Manual Match as Fallback
						const manualMatches = allOrgCamps.filter(camp => {
							if (!isCeo && camp.status !== 'active') return false;
							const userList = Array.isArray(camp.users) ? camp.users : [];
							return userList.some((u: any) => (u.user_id || u.id) === user.uid);
						});

						if (manualMatches.length > 0) {
							console.log(`💡 [Campaign] Fallback: Found ${manualMatches.length} campaigns via Local Matching.`);
							finalBaseCampaigns = manualMatches as Campaign[];
						} else {
							console.warn("🕵️ Diagnostic: Found 0 local matches in", allOrgCamps.length, "org campaigns.");
						}
					}
				}
				
				const baseCampaigns = finalBaseCampaigns;
				
				// Set base campaigns immediately with undefined stats to trigger loading skeletons!
				setCampaigns(baseCampaigns.map(camp => ({
					...camp,
					pending_calls: undefined,
					upcoming_followups: undefined,
					overdue_followups: undefined,
					total_dials: undefined,
					talktime: undefined
				})));
				
				// Hide main spinner immediately so the UI is fully interactive!
				setLoadingCampaigns(false);

				// Now, fetch campaign stats asynchronously in the background!
				supabase.rpc('get_campaign_stats').then(({ data: statsData, error: statsError }) => {
					if (statsError) {
						console.error("Error fetching campaign stats:", statsError);
						// Fall back to 0 stats
						setCampaigns(prevCampaigns => 
							prevCampaigns.map(camp => ({
								...camp,
								pending_calls: camp.pending_calls ?? 0,
								upcoming_followups: camp.upcoming_followups ?? 0,
								overdue_followups: camp.overdue_followups ?? 0,
								total_dials: camp.total_dials ?? 0,
								talktime: camp.talktime ?? '0h 0m'
							}))
						);
						return;
					}

					setCampaigns(prevCampaigns => {
						return prevCampaigns.map(camp => {
							const stats = statsData?.find((s: any) => s.campaign_id === camp.id);
							
							const totalSeconds = stats?.total_duration || 0;
							const hours = Math.floor(totalSeconds / 3600);
							const minutes = Math.floor((totalSeconds % 3600) / 60);
							const talktimeFormatted = `${hours}h ${minutes}m`;

							return {
								...camp,
								pending_calls: stats?.fresh_count ?? 0,
								upcoming_followups: stats?.upcoming_count ?? 0,
								overdue_followups: stats?.overdue_count ?? 0,
								total_dials: stats?.total_dials ?? 0,
								talktime: talktimeFormatted
							};
						});
					});
				});
			} catch (e) {
				console.error("Error fetching campaigns:", e);
				setCampaigns([]);
				setLoadingCampaigns(false);
			}
		};


		const fetchUsers = async () => {
			try {
				setLoadingUsers(true);
				console.log("👥 [Campaign] Fetching all user profiles...");
				const { data, error } = await supabase
					.from("user_profiles")
					.select("id, user_id, email, user_name, profile_pic_url, employee_id, organization_id")
					.order("created_at", { ascending: false });
					
				if (error) {
					console.error("❌ [Campaign] Error fetching users:", error);
					setUsers([]);
					return;
				}

				if (data) {
					console.log(`✅ [Campaign] Fetched ${data.length} user profiles.`);
					const mapped = data.map((u: any) => ({
						...u,
						user_name: u.user_name || u.name || null,
						profile_pic_url: u.profile_pic_url || u.profile_image || null,
					}));
					setUsers(mapped);
				}
			} catch (e) {
				console.error("❌ [Campaign] Exception in fetchUsers:", e);
				setUsers([]);
			} finally {
				setLoadingUsers(false);
			}
		};

		useEffect(() => {
			if (mounted && user) {
				fetchCampaigns(false);
			}
			const handleFocus = () => {
				if (mounted && user) fetchCampaigns(true);
			};
			window.addEventListener("focus", handleFocus);
			return () => window.removeEventListener("focus", handleFocus);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [router, user?.uid, mounted]);


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

						logSystemEvent({
							event_type: 'WRITE',
							description: `Delete Campaign: ${id}`,
							metadata: { campaign_id: id },
							user_name: user?.displayName || 'Admin',
							organization_id: user?.organization_id || undefined
						});
					}
				} catch (e) {
					console.error("Error deleting campaign:", e);
					alert("Error deleting campaign");
				}
			}
		};

		const handleToggleCampaignStatus = async (id: string, newStatus: string) => {
			const originalCampaign = campaigns.find(c => c.id === id);
			const originalStatus = originalCampaign?.status || null;

			// If the campaign will leave the currently filtered list (e.g. Active -> Inactive)
			const willLeaveFilter = 
				(statusFilter === "active" && newStatus !== "active") ||
				(statusFilter === "inactive" && newStatus !== "inactive");

			if (willLeaveFilter) {
				// Mark as exiting so CampaignCard triggers the pixel disintegration animation
				setExitingCardIds(prev => prev.includes(id) ? prev : [...prev, id]);

				// Background database update
				const updatePromise = supabase
					.from("campaigns")
					.update({ status: newStatus })
					.eq("id", id);

				// Wait 700ms for pixel disintegration animation to complete before removing from state
				setTimeout(async () => {
					try {
						const { error } = await updatePromise;
						if (error) {
							// Revert on error
							setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: originalStatus } : c));
							setExitingCardIds(prev => prev.filter(cardId => cardId !== id));
							throw error;
						}

						// Finalize status update in campaigns and clean up exiting state
						setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
						setExitingCardIds(prev => prev.filter(cardId => cardId !== id));

						logSystemEvent({
							event_type: 'WRITE',
							description: `Toggled Campaign status to ${newStatus}: ${originalCampaign?.name || id}`,
							metadata: { campaign_id: id, status: newStatus },
							user_name: user?.displayName || 'Admin',
							organization_id: user?.organization_id || undefined
						});
					} catch (e: any) {
						console.error("Error toggling campaign status:", e);
						alert("Error updating campaign status: " + (e.message || "Unknown error"));
					}
				}, 700);
			} else {
				// Normal in-place toggle if viewing "all"
				setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));

				try {
					const { error } = await supabase
						.from("campaigns")
						.update({ status: newStatus })
						.eq("id", id);

					if (error) {
						setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: originalStatus } : c));
						throw error;
					}

					logSystemEvent({
						event_type: 'WRITE',
						description: `Toggled Campaign status to ${newStatus}: ${originalCampaign?.name || id}`,
						metadata: { campaign_id: id, status: newStatus },
						user_name: user?.displayName || 'Admin',
						organization_id: user?.organization_id || undefined
					});
				} catch (e: any) {
					console.error("Error toggling campaign status:", e);
					alert("Error updating campaign status: " + (e.message || "Unknown error"));
				}
			}
		};

		const activeCount = useMemo(() => 
			campaigns.filter(c => c.status === 'active' && !exitingCardIds.includes(c.id)).length, 
			[campaigns, exitingCardIds]
		);
		const inactiveCount = useMemo(() => 
			!isCeo ? 0 : campaigns.filter(c => c.status === 'inactive' || exitingCardIds.includes(c.id)).length, 
			[campaigns, exitingCardIds, isCeo]
		);

		const filtered = useMemo(() => {
			return campaigns.filter(c => {
				// Non-CEO users can ONLY see active campaigns
				if (!isCeo && c.status !== 'active') return false;

				// Keep cards that are actively playing their pixel disintegration animation
				if (exitingCardIds.includes(c.id)) return true;

				// Status Filter (for CEO)
				if (statusFilter === "active" && c.status !== "active") return false;
				if (statusFilter === "inactive" && c.status !== "inactive") return false;

				// Search Query Filter
				if (!searchQuery.trim()) return true;
				const q = searchQuery.toLowerCase().trim();
				return (
					(c.name && c.name.toLowerCase().includes(q)) ||
					(c.status && c.status.toLowerCase().includes(q)) ||
					(c.organizations?.company_name && c.organizations.company_name.toLowerCase().includes(q))
				);
			});
		}, [campaigns, statusFilter, searchQuery, exitingCardIds, isCeo]);


		return (
			<>
				<div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
							<div className="space-y-6 sm:space-y-8">
								<div className="mb-6 flex items-start justify-between">
									<div>
										<h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>Campaigns</h1>
										<p className="text-sm sm:text-base" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>Create, schedule and monitor marketing campaigns</p>
									</div>


								</div>

								<div className={`grid grid-cols-2 sm:grid-cols-2 ${isCeo ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 sm:gap-5`}>
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
												<p className="text-xs sm:text-sm mt-1" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>{isCeo ? "All campaigns" : "Active campaigns"}</p>
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

									{isCeo && (
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
									)}

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
									<div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
										{/* Search Input */}
										<div className="relative w-full sm:w-64">
											<input
												placeholder="Search campaigns..."
												className="pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm focus:outline-none w-full placeholder:text-gray-400"
												type="text"
												value={searchQuery}
												onChange={(e) => setSearchQuery(e.target.value)}
												style={{ fontFamily: "'Roboto', sans-serif" }}
											/>
											<i className="fi flex fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm"></i>
											{searchQuery && (
												<button
													type="button"
													onClick={() => setSearchQuery("")}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
												>
													<i className="fi flex fi-rr-cross-small text-sm"></i>
												</button>
											)}
										</div>

										{/* 3 Rounded Filter Buttons: All, Active, Inactive (Visible ONLY to CEO) */}
										{isCeo && (
											<div className="flex items-center gap-2 shrink-0 select-none">
												{/* All Button */}
												<button
													type="button"
													onClick={() => setStatusFilter("all")}
													className={`h-[34px] px-5 rounded-full text-xs font-semibold transition-all duration-300 ease-in-out flex items-center gap-2 border active:scale-95 cursor-pointer shadow-none ${
														statusFilter === "all"
															? "bg-[#4b33e8] text-white border-[#4b33e8] opacity-100 scale-100"
															: "bg-white text-gray-600 border-gray-300 opacity-40 hover:opacity-80 hover:bg-gray-50/80 hover:border-gray-400 scale-[0.98]"
													}`}
												>
													<span>All</span>
													<span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors duration-300 ${
														statusFilter === "all"
															? "bg-white/20 text-white"
															: "bg-gray-100 text-gray-500"
													}`}>
														{campaigns.length}
													</span>
												</button>

												{/* Active Button */}
												<button
													type="button"
													onClick={() => setStatusFilter("active")}
													className={`h-[34px] px-5 rounded-full text-xs font-semibold transition-all duration-300 ease-in-out flex items-center gap-2 border active:scale-95 cursor-pointer shadow-none ${
														statusFilter === "active"
															? "bg-[#4b33e8] text-white border-[#4b33e8] opacity-100 scale-100"
															: "bg-white text-gray-600 border-gray-300 opacity-40 hover:opacity-80 hover:bg-gray-50/80 hover:border-gray-400 scale-[0.98]"
													}`}
												>
													<span>Active</span>
													<span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors duration-300 ${
														statusFilter === "active"
															? "bg-white/20 text-white"
															: "bg-gray-100 text-gray-500"
													}`}>
														{activeCount}
													</span>
												</button>

												{/* Inactive Button */}
												<button
													type="button"
													onClick={() => setStatusFilter("inactive")}
													className={`h-[34px] px-5 rounded-full text-xs font-semibold transition-all duration-300 ease-in-out flex items-center gap-2 border active:scale-95 cursor-pointer shadow-none ${
														statusFilter === "inactive"
															? "bg-[#4b33e8] text-white border-[#4b33e8] opacity-100 scale-100"
															: "bg-white text-gray-600 border-gray-300 opacity-40 hover:opacity-80 hover:bg-gray-50/80 hover:border-gray-400 scale-[0.98]"
													}`}
												>
													<span>Inactive</span>
													<span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full transition-colors duration-300 ${
														statusFilter === "inactive"
															? "bg-white/20 text-white"
															: "bg-gray-100 text-gray-500"
													}`}>
														{inactiveCount}
													</span>
												</button>
											</div>
										)}
									</div>

									<div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 justify-start sm:justify-end w-full lg:w-auto">
										<button
											type="button"
											className="inline-flex items-center justify-center gap-2 px-3 h-[42px] w-[42px] sm:w-auto rounded-xl border border-gray-300 bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
											style={{ fontFamily: "'Poppins', sans-serif" }}
										>
											<i className="fi flex fi-rr-filter text-xs sm:text-sm"></i>
											<span className="hidden xs:inline">Filters</span>
										</button>
										{permissionFlags.isCreateCampaginButtonVisible && (
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
										)}
									</div>
								</div>

								<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{loadingCampaigns ? (
										<div className="col-span-full text-center py-8">Loading campaigns...</div>
									) : filtered.length === 0 ? (
										<div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
											<i className="fi flex fi-rr-box-open text-3xl text-gray-300 mx-auto mb-2"></i>
											<p className="text-gray-600 font-medium text-sm">
												{statusFilter !== "all" 
													? `No ${statusFilter} campaigns found.`
													: searchQuery 
														? `No campaigns matching "${searchQuery}"`
														: "No campaigns found."}
											</p>
											{(statusFilter !== "all" || searchQuery) && (
												<div className="flex items-center justify-center gap-2 mt-3">
													{searchQuery && (
														<button
															type="button"
															onClick={() => setSearchQuery("")}
															className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
														>
															Clear search
														</button>
													)}
													<button
														type="button"
														onClick={() => { setStatusFilter("all"); setSearchQuery(""); }}
														className="px-3 py-1 bg-indigo-50 text-[#4b33e8] rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
													>
														Show all campaigns
													</button>
												</div>
											)}
										</div>
									) : (
										filtered.map((c) => (
											<CampaignCard
												key={c.id}
												campaign={c}
												isExiting={exitingCardIds.includes(c.id)}
												onEdit={handleEditCampaign}
												onDelete={handleDeleteCampaign}
												onStatusChange={handleToggleCampaignStatus}
												isEditVisible={permissionFlags.isCampaginEditButtonVisible}
												isDeleteVisible={permissionFlags.isCampaginDeleteButtonVisible}
												isToggleVisible={isCeo}
											/>
										)))}
								</div>
							</div>
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
						campaign={editingCampaign}
					/>
				)}

			</>
		);
	}
