import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useUser } from "@/context/UserContext";
import { getUserDashboardLevel, DashboardLevel } from "@/lib/dashboardUtils";

export default function WorkflowPage() {
  const router = useRouter();
  const { user, mounted, loading: authLoading } = useUser();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Determine Level 1 or Level 2 user
  const levelInfo = useMemo(() => {
    if (!user) return { isLevel1: false, isLevel2: false };

    const designation = (user.designation || "").toLowerCase().trim();
    const role = (user.role || "").toLowerCase().trim();
    const level = getUserDashboardLevel(user);

    const isLevel1 =
      level === DashboardLevel.LEVEL_1_ADMIN ||
      (!user.isClient && (role === "superadmin" || role === "super_admin" || designation === "ceo"));

    const isLevel2 =
      level === DashboardLevel.LEVEL_2_CLIENT_CEO ||
      (user.isClient === true && designation === "ceo");

    return { isLevel1, isLevel2 };
  }, [user]);

  // Authorization Guard: Strictly Level 1 and Level 2
  useEffect(() => {
    if (mounted && !authLoading) {
      if (!user) {
        router.replace("/portal/login");
        return;
      }

      if (!levelInfo.isLevel1 && !levelInfo.isLevel2) {
        console.warn("🚫 [Workflow] Access Denied: User is neither Level 1 nor Level 2.");
        router.replace("/portal/dashboard");
        return;
      }

      setIsAuthorized(true);
    }
  }, [mounted, authLoading, user, levelInfo, router]);

  if (!mounted || authLoading || isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Workflow | TFC Connect</title>
      </Head>

      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 sm:space-y-8 max-w-[1400px]">
        {/* Simple Dashboard Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
          <div className="flex-1">
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#263238]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Workflow
            </h1>
            <p className="text-sm text-[#787E9D] mt-1 line-clamp-1 sm:line-clamp-none">
              Welcome back,{" "}
              <span className="font-semibold text-[#4b33e8]">
                {user?.displayName || "User"}
              </span>
              . Here&apos;s your workflow space.
            </p>
          </div>
        </div>

        {/* Workflow Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* LeadPilot Card */}
          <div className="bg-white rounded-xl border border-gray-200 hover:border-[#4b33e8] p-5 transition-colors flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#4b33e8]/10 text-[#4b33e8] flex items-center justify-center text-base">
                  <i className="fi flex fi-rr-rocket-lunch"></i>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>

              <h2 className="text-base font-bold text-gray-900 group-hover:text-[#4b33e8] transition-colors">
                LeadPilot
              </h2>
              <p className="text-[11px] text-[#4b33e8] font-semibold uppercase tracking-wider">
                Scheduled Bulk Upload
              </p>

              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Ingest lead files and automatically release them into active campaigns in scheduled micro-batches with fair agent distribution.
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200 text-[10px] font-medium">
                  1–20 Batches/Day
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200 text-[10px] font-medium">
                  Fair Agent Quotas
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200 text-[10px] font-medium">
                  Autonomous Engine
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => router.push("/workflow/pilotlead")}
                className="w-full py-2 px-3 rounded-lg bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Manage Bulk Uploads</span>
                <i className="fi flex fi-rr-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* Placeholder for Future Workflow: Call Cadence */}
          <div className="bg-gray-50/50 rounded-xl border border-dashed border-gray-200 p-5 flex flex-col justify-between opacity-70">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="w-9 h-9 rounded-lg bg-gray-200 text-gray-500 flex items-center justify-center text-base">
                  <i className="fi flex fi-rr-phone-call"></i>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-200/60 text-gray-600">
                  Coming Soon
                </span>
              </div>
              <h2 className="text-base font-bold text-gray-700">
                Call Cadence
              </h2>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                Automated Multi-Touch
              </p>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Multi-day automated dial cadences and follow-up triggers across campaigns.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-200/60">
              <button
                disabled
                className="w-full py-2 px-3 rounded-lg bg-gray-200 text-gray-400 text-xs font-medium cursor-not-allowed"
              >
                In Pipeline
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
