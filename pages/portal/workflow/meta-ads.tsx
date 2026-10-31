import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import { getUserDashboardLevel, DashboardLevel } from '@/lib/dashboardUtils';
import { supabase } from '@/lib/supabase';
import ConnectMetaAdModal, {
  type DiscoverableMetaAd,
} from '@/components/workflow/meta-ads/ConnectMetaAdModal';
import CustomSelect from '@/components/workflow/pilotlead/CustomSelect';

export default function MetaAdsWorkflowPage() {
  const router = useRouter();
  const { user, mounted, loading: authLoading } = useUser();

  const [activeTab, setActiveTab] = useState<'discover' | 'connected' | 'logs' | 'webhook_setup'>('discover');
  const [loading, setLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Level 1 organization selector
  const [organizations, setOrganizations] = useState<Array<{ id: string; company_name: string }>>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');

  // Meta Integration & Discovered Assets
  const [connected, setConnected] = useState(false);
  const [migrationPending, setMigrationPending] = useState(false);
  const [integration, setIntegration] = useState<any | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [discoverableAds, setDiscoverableAds] = useState<DiscoverableMetaAd[]>([]);

  // Connected Ad Configurations & Logs
  const [adConfigs, setAdConfigs] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [agentsMap, setAgentsMap] = useState<Record<string, string>>({});

  // Modals
  const [showConnectAccountModal, setShowConnectAccountModal] = useState(false);
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [connectingAccount, setConnectingAccount] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [oauthNeedsCredentials, setOauthNeedsCredentials] = useState(false);
  const [oauthAppIdInput, setOauthAppIdInput] = useState('');
  const [oauthAppSecretInput, setOauthAppSecretInput] = useState('');
  const [oauthRedirectUri, setOauthRedirectUri] = useState('');

  const [showAdConfigModal, setShowAdConfigModal] = useState(false);
  const [selectedAdForConfig, setSelectedAdForConfig] = useState<DiscoverableMetaAd | null>(null);
  const [editingConfig, setEditingConfig] = useState<any | null>(null);

  // Authorization check (Level 1 and Level 2)
  const isL1 = useMemo(() => {
    if (!user) return false;
    const level = getUserDashboardLevel(user);
    const role = (user.role || '').toLowerCase().trim();
    const designation = (user.designation || '').toLowerCase().trim();
    return (
      level === DashboardLevel.LEVEL_1_ADMIN ||
      (!user.isClient && (role === 'superadmin' || role === 'super_admin' || designation === 'ceo'))
    );
  }, [user]);

  const isL2 = useMemo(() => {
    if (!user) return false;
    const level = getUserDashboardLevel(user);
    const designation = (user.designation || '').toLowerCase().trim();
    return (
      level === DashboardLevel.LEVEL_2_CLIENT_CEO ||
      (user.isClient === true && designation === 'ceo') ||
      user.role === 'admin'
    );
  }, [user]);

  const isAuthorized = isL1 || isL2;

  useEffect(() => {
    if (user?.organization_id && !selectedOrgId) {
      setSelectedOrgId(user.organization_id);
    }
  }, [user, selectedOrgId]);

  useEffect(() => {
    if (isL1) {
      supabase
        .from('organizations')
        .select('id, company_name')
        .order('company_name', { ascending: true })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setOrganizations(data);
            setSelectedOrgId((prev) => prev || user?.organization_id || data[0].id);
          }
        });
    }
  }, [isL1, user]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.connected === '1') {
      setBannerMessage({
        type: 'success',
        text: 'Meta Business Account connected successfully! Select an Ad below to configure CRM routing.',
      });
    } else if (router.query.error) {
      setBannerMessage({
        type: 'error',
        text: String(router.query.error),
      });
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!user) {
        router.replace('/portal/login');
        return;
      }
      if (!isAuthorized) {
        router.replace('/portal/dashboard');
        return;
      }
      const targetOrg = selectedOrgId || user.organization_id;
      if (targetOrg) {
        void loadAllMetaData(targetOrg);
      }
    }
  }, [mounted, authLoading, user, isAuthorized, selectedOrgId]);

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || '';
  };

  const loadAllMetaData = async (orgId: string) => {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      const [assetsRes, configsRes, profilesRes] = await Promise.all([
        fetch(`/api/meta/assets?organizationId=${encodeURIComponent(orgId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/meta/configs?organizationId=${encodeURIComponent(orgId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        supabase
          .from('user_profiles')
          .select('user_id, user_name')
          .eq('organization_id', orgId),
      ]);

      const assetsData = await assetsRes.json();
      const configsData = await configsRes.json();

      if (profilesRes.data) {
        const map: Record<string, string> = {};
        profilesRes.data.forEach((p: any) => {
          if (p.user_id) map[p.user_id] = p.user_name || 'Agent';
        });
        setAgentsMap(map);
      }

      setMigrationPending(Boolean(assetsData.migrationPending || configsData.migrationPending));
      setConnected(Boolean(assetsData.connected));
      setIntegration(assetsData.integration || null);
      setPages(assetsData.pages || []);
      setAdAccounts(assetsData.adAccounts || []);
      setDiscoverableAds(assetsData.discoverableAds || []);
      setAdConfigs(configsData.configs || []);
      setRecentLogs(configsData.recentLogs || []);
    } catch (err: any) {
      console.error('[MetaAdsPage] Failed loading Meta data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setConnectingAccount(true);
    setBannerMessage(null);
    setModalError(null);
    try {
      const token = await getAccessToken();
      const targetOrg = selectedOrgId || user?.organization_id || '';
      const hasCustomCreds = Boolean(oauthAppIdInput.trim());

      console.log('[MetaAdsPage][OAuth] Initiating Facebook OAuth flow...', {
        organizationId: targetOrg,
        hasAccessToken: Boolean(token),
        submittingCustomAppId: hasCustomCreds,
      });

      const res = await fetch(
        `/api/meta/oauth-url?organizationId=${encodeURIComponent(targetOrg)}`,
        hasCustomCreds
          ? {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                organizationId: targetOrg,
                appId: oauthAppIdInput.trim(),
                appSecret: oauthAppSecretInput.trim(),
              }),
            }
          : {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` },
            }
      );

      const data = await res.json();
      console.log('[MetaAdsPage][OAuth] /api/meta/oauth-url response:', {
        status: res.status,
        configured: data?.configured,
        needsAppCredentials: data?.needsAppCredentials,
        redirectUri: data?.redirectUri,
        debug: data?.debug,
        error: data?.error,
        message: data?.message,
      });

      if (!res.ok) {
        const errMsg = data?.error || `OAuth URL request failed with HTTP ${res.status}`;
        console.error('[MetaAdsPage][OAuth] Request error:', errMsg, data);
        setModalError(errMsg);
        setBannerMessage({ type: 'error', text: errMsg });
        return;
      }

      if (data.redirectUri) {
        setOauthRedirectUri(data.redirectUri);
      }

      if (data.configured && data.oauthUrl) {
        console.log('[MetaAdsPage][OAuth] Redirecting browser to Facebook OAuth dialog:', data.oauthUrl);
        window.location.assign(data.oauthUrl);
        return;
      }

      // META_APP_ID is not set in .env.local or DB yet — show inline App ID / Secret setup + clear message
      console.warn('[MetaAdsPage][OAuth] Facebook OAuth cannot redirect yet because META_APP_ID is not configured:', data);
      setShowConnectAccountModal(true);
      setOauthNeedsCredentials(true);
      setModalError(
        data.message ||
          'META_APP_ID is missing. Enter your Facebook App ID & App Secret below (or add META_APP_ID in .env.local) to redirect to Facebook.'
      );
    } catch (err: any) {
      console.error('[MetaAdsPage][OAuth] Unexpected exception during handleStartOAuth:', err);
      const msg = err?.message || 'Unable to initiate Meta connection.';
      setModalError(msg);
      setBannerMessage({ type: 'error', text: msg });
    } finally {
      setConnectingAccount(false);
    }
  };

  const handleConnectWithToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTokenInput.trim()) return;
    setConnectingAccount(true);
    setBannerMessage(null);
    try {
      const token = await getAccessToken();
      const targetOrg = selectedOrgId || user?.organization_id || '';
      const res = await fetch('/api/meta/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'connect_token',
          organizationId: targetOrg,
          accessToken: manualTokenInput.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect Meta token.');

      setShowConnectAccountModal(false);
      setManualTokenInput('');
      setBannerMessage({
        type: 'success',
        text: `Meta Account connected (${data.pagesCount || 0} Pages discovered). Choose an Ad below to configure CRM routing!`,
      });
      await loadAllMetaData(targetOrg);
    } catch (err: any) {
      setBannerMessage({ type: 'error', text: err?.message || 'Failed to verify Meta token.' });
    } finally {
      setConnectingAccount(false);
    }
  };

  const handleConnectSandbox = async () => {
    setConnectingAccount(true);
    setBannerMessage(null);
    try {
      const token = await getAccessToken();
      const targetOrg = selectedOrgId || user?.organization_id || '';
      const res = await fetch('/api/meta/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'connect_sandbox',
          organizationId: targetOrg,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect Sandbox Meta account.');

      setShowConnectAccountModal(false);
      setBannerMessage({
        type: 'success',
        text: 'Meta Ads Account connected! Click "Connect Ad" on any ad below to open the Lead Routing Configuration screen.',
      });
      await loadAllMetaData(targetOrg);
    } catch (err: any) {
      setBannerMessage({ type: 'error', text: err?.message || 'Failed to connect Sandbox account.' });
    } finally {
      setConnectingAccount(false);
    }
  };

  const handleDisconnectAccount = async () => {
    if (!window.confirm('Disconnect Meta Business Account? Existing leads in CRM will remain safe.')) {
      return;
    }
    try {
      const token = await getAccessToken();
      const targetOrg = selectedOrgId || user?.organization_id || '';
      await fetch('/api/meta/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'disconnect',
          organizationId: targetOrg,
        }),
      });
      setActiveTab('discover');
      setBannerMessage({ type: 'success', text: 'Meta Business Account disconnected.' });
      await loadAllMetaData(targetOrg);
    } catch (err: any) {
      setBannerMessage({ type: 'error', text: err?.message || 'Failed to disconnect.' });
    }
  };

  const handleOpenConnectAdModal = (ad: DiscoverableMetaAd | null, existingCfg: any | null = null) => {
    setSelectedAdForConfig(ad);
    setEditingConfig(existingCfg);
    setShowAdConfigModal(true);
  };

  const handleToggleConfigActive = async (cfg: any) => {
    setActionBusy(cfg.id);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/meta/configs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: cfg.id,
          is_active: !cfg.is_active,
        }),
      });
      if (!res.ok) throw new Error('Failed to update status.');
      const targetOrg = selectedOrgId || user?.organization_id || '';
      await loadAllMetaData(targetOrg);
    } catch (err: any) {
      setBannerMessage({ type: 'error', text: err?.message || 'Could not update status.' });
    } finally {
      setActionBusy(null);
    }
  };

  const handleDeleteConfig = async (cfg: any) => {
    if (
      !window.confirm(
        `Remove Meta Ad routing for "${cfg.ad_name}" (Source: ${cfg.source_name})?\nAlready imported leads in CRM will be preserved.`
      )
    ) {
      return;
    }
    setActionBusy(cfg.id);
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/meta/configs?id=${encodeURIComponent(cfg.id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete configuration.');
      const targetOrg = selectedOrgId || user?.organization_id || '';
      await loadAllMetaData(targetOrg);
    } catch (err: any) {
      setBannerMessage({ type: 'error', text: err?.message || 'Could not delete configuration.' });
    } finally {
      setActionBusy(null);
    }
  };

  const handleSendTestLead = async (cfg: any) => {
    setActionBusy(`test_${cfg.id}`);
    setBannerMessage(null);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/meta/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'test_lead',
          configId: cfg.id,
          organizationId: cfg.organization_id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.result?.error || data.error || 'Test lead failed');
      }

      const assignedLabel = data.result?.assignedTo
        ? `Assigned to ${agentsMap[data.result.assignedTo] || 'Agent'}`
        : 'Added to General Pool';

      setBannerMessage({
        type: 'success',
        text: `Test Lead "${data.result.customerName}" imported into campaign "${
          cfg.campaigns?.name || 'Target Campaign'
        }" (${assignedLabel}, Source: ${cfg.source_name})!`,
      });
      const targetOrg = selectedOrgId || user?.organization_id || '';
      await loadAllMetaData(targetOrg);
    } catch (err: any) {
      setBannerMessage({ type: 'error', text: err?.message || 'Failed to send test lead.' });
    } finally {
      setActionBusy(null);
    }
  };

  const activeOrgId = selectedOrgId || user?.organization_id || '';

  if (!mounted || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium text-sm">Loading Meta Ads Integration...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Meta Lead Ads Integration | TFC Connect</title>
      </Head>

      <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 max-w-[1400px]">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/workflow" className="hover:text-[#4b33e8] font-medium transition-colors">
                Workflow
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold">Meta (Facebook) Lead Ads</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center text-lg shadow-xs">
                <i className="fi flex fi-brands-facebook"></i>
              </div>
              <div>
                <h1
                  className="text-xl sm:text-2xl font-bold text-[#263238]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Meta Lead Ads Integration
                </h1>
                <p className="text-xs text-[#787E9D]">
                  Sync Facebook &amp; Instagram Lead Ads directly to your CRM campaigns.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isL1 && organizations.length > 0 && (
              <div className="w-56">
                <CustomSelect
                  value={activeOrgId}
                  onChange={(val) => setSelectedOrgId(val)}
                  options={organizations.map((o) => ({
                    value: o.id,
                    label: o.company_name,
                  }))}
                  placeholder="Select Organization"
                />
              </div>
            )}

            {connected && (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenConnectAdModal(null, null)}
                  className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <i className="fi flex fi-rr-plus text-[11px]"></i>
                  <span>Connect Custom Form ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowConnectAccountModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1877F2] text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <i className="fi flex fi-rr-refresh text-[11px]"></i>
                  <span>Account Settings</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status / Alert Banner */}
        {bannerMessage && (
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium ${
              bannerMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <i
                className={`fi flex text-sm ${
                  bannerMessage.type === 'success' ? 'fi-rr-check-circle' : 'fi-rr-exclamation'
                }`}
              ></i>
              <span>{bannerMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              className="text-gray-400 hover:text-gray-700"
            >
              <i className="fi flex fi-rr-cross text-[10px]"></i>
            </button>
          </div>
        )}

        {migrationPending && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
            <p className="font-bold flex items-center gap-2">
              <i className="fi flex fi-rr-database"></i>
              <span>Database Migration Required</span>
            </p>
            <p>
              Please run the migration file{' '}
              <code className="px-1.5 py-0.5 rounded bg-amber-100 font-mono">
                supabase/migrations/20261031214500_create_meta_ads_integration.sql
              </code>{' '}
              in your Supabase SQL Editor to initialize the Meta Ads tables.
            </p>
          </div>
        )}

        {/* Connected Account Overview Bar */}
        {connected && integration && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-lg">
                <i className="fi flex fi-rr-check-circle"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-900">
                    {integration.meta_user_name || 'Connected Meta Account'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Connected
                  </span>
                  {integration.is_sandbox && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Sandbox / Demo Ads
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {pages.length} Facebook Page(s) • {adAccounts.length} Ad Account(s) •{' '}
                  <strong className="text-[#4b33e8]">{adConfigs.length} Connected Ad Route(s)</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Total Leads Synced</span>
                <span className="text-sm font-bold text-gray-900">
                  {adConfigs.reduce((acc, c) => acc + (Number(c.total_leads_synced) || 0), 0)}
                </span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Duplicates Filtered</span>
                <span className="text-sm font-bold text-gray-900">
                  {adConfigs.reduce((acc, c) => acc + (Number(c.duplicate_leads_skipped) || 0), 0)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleDisconnectAccount}
                className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeleton while checking initial connection */}
        {loading && !connected && (
          <div className="min-h-[65vh] flex items-center justify-center">
            <div className="bg-white rounded-2xl border border-gray-200 p-10 flex flex-col items-center justify-center w-full max-w-md space-y-3 shadow-xs">
              <div className="w-8 h-8 border-3 border-[#1877F2] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-medium">Checking Meta Ads connection...</p>
            </div>
          </div>
        )}

        {/* Not Connected Empty State — Centered in Page */}
        {!loading && !connected && (
          <div className="min-h-[65vh] flex items-center justify-center py-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10 text-center w-full max-w-xl space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center text-3xl mx-auto">
                <i className="fi flex fi-brands-facebook"></i>
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-gray-900">
                  Connect Your Meta (Facebook &amp; Instagram) Ads
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed max-w-lg mx-auto">
                  Once you connect your Meta account, you will see all your active Ads &amp; Lead Forms. Click{' '}
                  <strong>&ldquo;Connect Ad&rdquo;</strong> on any ad to open the Configuration Screen and set its{' '}
                  <strong>Target Campaign</strong>, <strong>Source Name</strong>,{' '}
                  <strong>Agent Assignment / General Pool</strong>, and <strong>Expiry Date</strong>.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectAccountModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#1464cc] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <i className="fi flex fi-brands-facebook text-sm"></i>
                  <span>Connect Meta Ads Account</span>
                </button>
                <button
                  type="button"
                  onClick={handleConnectSandbox}
                  disabled={connectingAccount}
                  className="px-4 py-2.5 rounded-xl border border-[#4b33e8]/30 bg-[#4b33e8]/5 hover:bg-[#4b33e8]/10 text-[#4b33e8] text-xs font-bold transition-all flex items-center gap-2"
                >
                  <i className="fi flex fi-rr-magic-wand text-xs"></i>
                  <span>Try Interactive Demo Ads</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs & Tab Content — Only visible when Meta Account is connected */}
        {connected && (
          <>
            <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'discover'
                    ? 'border-[#4b33e8] text-[#4b33e8]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fi flex fi-rr-bullhorn text-xs"></i>
                <span>Available Meta Ads ({discoverableAds.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('connected')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'connected'
                    ? 'border-[#4b33e8] text-[#4b33e8]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fi flex fi-rr-link-alt text-xs"></i>
                <span>Connected Ad Routes ({adConfigs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('logs')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'logs'
                    ? 'border-[#4b33e8] text-[#4b33e8]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fi flex fi-rr-time-past text-xs"></i>
                <span>Lead Sync Activity ({recentLogs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('webhook_setup')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'webhook_setup'
                    ? 'border-[#4b33e8] text-[#4b33e8]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fi flex fi-rr-settings-sliders text-xs"></i>
                <span>Webhook &amp; Developer Info</span>
              </button>
            </div>

        {/* TAB 1: DISCOVER AVAILABLE ADS & CONNECT AD */}
        {activeTab === 'discover' && (
          <div className="space-y-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : discoverableAds.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-3">
                <p className="text-sm font-bold text-gray-800">No Meta Ads or Lead Forms Found Yet</p>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Connect your Meta Ads account above, or click &ldquo;Connect Custom Form ID&rdquo; to manually configure a Facebook Lead Form ID.
                </p>
                <div className="flex justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenConnectAdModal(null, null)}
                    className="px-4 py-2 rounded-xl bg-[#4b33e8] text-white text-xs font-bold"
                  >
                    + Connect Custom Ad / Form ID
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {discoverableAds.map((ad, idx) => {
                  const existingRoute = adConfigs.find(
                    (c) =>
                      c.form_id === ad.form_id &&
                      ((ad.ad_id && c.ad_id === ad.ad_id) || (!ad.ad_id && !c.ad_id))
                  );

                  return (
                    <div
                      key={`${ad.form_id}_${ad.ad_id || idx}`}
                      className="bg-white rounded-2xl border border-gray-200 hover:border-[#4b33e8] p-5 transition-all flex flex-col justify-between shadow-2xs"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#1877F2] border border-blue-200">
                            {ad.page_name}
                          </span>
                          {existingRoute ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Connected
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-600">
                              {ad.ad_status || 'ACTIVE'}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-gray-900 leading-snug">
                            {ad.ad_name}
                          </h3>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Form: <strong className="text-gray-700">{ad.form_name}</strong>
                          </p>
                        </div>

                        {/* Form Questions Preview */}
                        {ad.questions && ad.questions.length > 0 && (
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                              Lead Form Fields ({ad.questions.length})
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {ad.questions.map((q) => (
                                <span
                                  key={q.key}
                                  className="px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200 text-[10px] font-medium"
                                >
                                  {q.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* If already connected, show summary of Campaign, Source, Agent & Expiry */}
                        {existingRoute && (
                          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-[11px] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Target Campaign:</span>
                              <span className="font-bold text-gray-900">
                                {existingRoute.campaigns?.name || 'Active Campaign'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Source Name:</span>
                              <span className="font-semibold text-[#4b33e8]">
                                {existingRoute.source_name}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Assignment:</span>
                              <span className="font-semibold text-gray-800">
                                {existingRoute.assignment_type === 'unassigned'
                                  ? 'General Pool'
                                  : existingRoute.assignment_type === 'single_agent'
                                  ? `Agent: ${agentsMap[existingRoute.assigned_agent_id] || 'Assigned'}`
                                  : `Round-Robin (${
                                      existingRoute.assigned_agents_config?.agent_ids?.length || 0
                                    } Agents)`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                        {existingRoute ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenConnectAdModal(ad, existingRoute)}
                              className="flex-1 py-2 px-3 rounded-xl border border-gray-200 hover:border-[#4b33e8] text-gray-700 hover:text-[#4b33e8] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                            >
                              <i className="fi flex fi-rr-edit text-[11px]"></i>
                              <span>Edit Config</span>
                            </button>
                            <button
                              type="button"
                              disabled={actionBusy === `test_${existingRoute.id}`}
                              onClick={() => handleSendTestLead(existingRoute)}
                              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                              title="Simulate a Meta Lead submission for this Ad"
                            >
                              <i className="fi flex fi-rr-paper-plane text-[11px]"></i>
                              <span>
                                {actionBusy === `test_${existingRoute.id}` ? 'Sending...' : 'Test Lead'}
                              </span>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenConnectAdModal(ad, null)}
                            className="w-full py-2.5 px-3 rounded-xl bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-2xs"
                          >
                            <i className="fi flex fi-rr-plug-connection text-xs"></i>
                            <span>Connect Ad &amp; Configure</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CONNECTED AD ROUTES TABLE / CARDS */}
        {activeTab === 'connected' && (
          <div className="space-y-4">
            {adConfigs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-3">
                <p className="text-sm font-bold text-gray-800">No Ads Connected Yet</p>
                <p className="text-xs text-gray-500">
                  Go to the <strong>Available Meta Ads</strong> tab and click <strong>Connect Ad</strong> to configure your first lead route.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('discover')}
                  className="px-4 py-2 rounded-xl bg-[#4b33e8] text-white text-xs font-bold"
                >
                  Browse Available Ads
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <th className="py-3 px-4">Connected Ad &amp; Form</th>
                        <th className="py-3 px-4">Target Campaign</th>
                        <th className="py-3 px-4">Source Name &amp; ID</th>
                        <th className="py-3 px-4">Assignment Rule</th>
                        <th className="py-3 px-4">Expiry Date Rule</th>
                        <th className="py-3 px-4">Synced Leads</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {adConfigs.map((cfg) => {
                        const assignmentBadge =
                          cfg.assignment_type === 'unassigned'
                            ? 'General Pool (Unassigned)'
                            : cfg.assignment_type === 'single_agent'
                            ? `Agent: ${agentsMap[cfg.assigned_agent_id] || 'Specific Agent'}`
                            : `Round-Robin (${cfg.assigned_agents_config?.agent_ids?.length || 0} Agents)`;

                        const expiryBadge =
                          cfg.expiry_mode === 'relative_days'
                            ? `+${cfg.expiry_days || 15} Days from Arrival`
                            : cfg.expiry_mode === 'fixed_date' && cfg.expiry_date
                            ? `Fixed: ${new Date(cfg.expiry_date).toLocaleDateString()}`
                            : 'No Expiry';

                        return (
                          <tr key={cfg.id} className="hover:bg-gray-50/70 transition-colors">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-gray-900">{cfg.ad_name}</p>
                              <p className="text-[11px] text-gray-500">
                                {cfg.page_name} • Form: {cfg.form_name}
                              </p>
                            </td>

                            <td className="py-3.5 px-4">
                              <Link
                                href={`/campaign/${cfg.campaign_id}`}
                                className="inline-flex items-center gap-1.5 font-bold text-[#4b33e8] hover:underline"
                              >
                                <span>{cfg.campaigns?.name || cfg.campaign_id}</span>
                                <i className="fi flex fi-rr-arrow-up-right text-[10px]"></i>
                              </Link>
                            </td>

                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-gray-900">{cfg.source_name}</p>
                              <Link
                                href={`/system-logs/${cfg.source_id}`}
                                className="text-[10px] font-mono text-gray-500 hover:text-[#4b33e8] underline"
                              >
                                {cfg.source_id}
                              </Link>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                                  cfg.assignment_type === 'unassigned'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                }`}
                              >
                                {assignmentBadge}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 text-[11px] font-medium">
                                {expiryBadge}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                                  {cfg.total_leads_synced || 0} Imported
                                </span>
                                {(cfg.duplicate_leads_skipped || 0) > 0 && (
                                  <span className="text-[11px] text-gray-500">
                                    ({cfg.duplicate_leads_skipped} dup)
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  disabled={actionBusy === `test_${cfg.id}`}
                                  onClick={() => handleSendTestLead(cfg)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-bold transition-colors"
                                  title="Simulate incoming lead"
                                >
                                  {actionBusy === `test_${cfg.id}` ? '...' : '+ Test Lead'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenConnectAdModal(null, cfg)}
                                  className="px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-[11px] font-semibold transition-colors"
                                >
                                  Configure
                                </button>

                                <button
                                  type="button"
                                  disabled={actionBusy === cfg.id}
                                  onClick={() => handleToggleConfigActive(cfg)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                                    cfg.is_active
                                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  }`}
                                >
                                  {cfg.is_active ? 'Pause' : 'Resume'}
                                </button>

                                <button
                                  type="button"
                                  disabled={actionBusy === cfg.id}
                                  onClick={() => handleDeleteConfig(cfg)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                                  title="Delete configuration"
                                >
                                  <i className="fi flex fi-rr-trash text-xs"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REAL-TIME LEAD SYNC LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {recentLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                No Meta leads have been received yet. Click <strong>&ldquo;Test Lead&rdquo;</strong> on any connected ad to test your pipeline!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Meta Leadgen ID</th>
                      <th className="py-3 px-4">Assigned To</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {recentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-4 text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-900">
                          {log.customer_name || 'Meta Lead'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-gray-600">
                          {log.leadgen_id}
                        </td>
                        <td className="py-3 px-4">
                          {log.assigned_to ? (
                            <span className="font-semibold text-indigo-700">
                              {agentsMap[log.assigned_to] || 'Assigned Agent'}
                            </span>
                          ) : (
                            <span className="text-gray-500">General Pool</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              log.status === 'imported'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : log.status === 'duplicate_merged'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : log.status === 'duplicate_skipped'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {log.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WEBHOOK & META DEVELOPER SETUP GUIDE */}
        {activeTab === 'webhook_setup' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 max-w-3xl">
            <h3 className="text-sm font-bold text-gray-900">
              Meta Developer Webhook Endpoint Configuration
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              To receive live leads from Meta Ads Manager in production, configure the following Webhook Callback URL and Verify Token in your{' '}
              <strong>Meta for Developers App &gt; Webhooks &gt; Page (`leadgen` field)</strong>:
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Callback URL
                </span>
                <code className="text-xs font-mono text-[#4b33e8] font-bold break-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/api/meta/webhook` : '/api/meta/webhook'}
                </code>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Verify Token (Default or from META_WEBHOOK_VERIFY_TOKEN)
                </span>
                <code className="text-xs font-mono text-gray-800 font-bold">
                  tfc_connect_meta_verify_token
                </code>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-gray-700 space-y-1">
                <p className="font-bold text-[#1877F2]">Environment Variables (.env.local):</p>
                <pre className="text-[11px] font-mono bg-white p-2.5 rounded-lg border border-blue-100 overflow-x-auto">
{`META_APP_ID=your_facebook_app_id
META_APP_SECRET=your_facebook_app_secret
META_WEBHOOK_VERIFY_TOKEN=tfc_connect_meta_verify_token`}
                </pre>
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Modal 1: Connect Meta Account (OAuth / Access Token / Sandbox Demo) */}
      {showConnectAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center">
                  <i className="fi flex fi-brands-facebook"></i>
                </div>
                <h3 className="text-sm font-bold text-gray-900">Connect Meta (Facebook) Ads Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConnectAccountModal(false)}
                className="w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center"
              >
                <i className="fi flex fi-rr-cross text-xs"></i>
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto flex-1">
              {modalError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <i className="fi flex fi-rr-exclamation text-amber-600"></i>
                    <span>Facebook OAuth Configuration Needed</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{modalError}</p>
                </div>
              )}

              {/* Option A: Facebook OAuth */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">Option 1: One-Click Facebook OAuth</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1877F2] text-white">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Log in with Facebook Business Manager to automatically grant access to your Pages, Ad Accounts &amp; Lead Forms.
                </p>

                {oauthNeedsCredentials && (
                  <form onSubmit={handleStartOAuth} className="space-y-2.5 pt-1 border-t border-blue-200/70">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Facebook App ID (`META_APP_ID`) *
                      </label>
                      <input
                        type="text"
                        required
                        value={oauthAppIdInput}
                        onChange={(e) => setOauthAppIdInput(e.target.value)}
                        placeholder="e.g. 123456789012345"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-[#1877F2]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        Facebook App Secret (`META_APP_SECRET`) *
                      </label>
                      <input
                        type="password"
                        required
                        value={oauthAppSecretInput}
                        onChange={(e) => setOauthAppSecretInput(e.target.value)}
                        placeholder="Enter Meta App Secret from developers.facebook.com"
                        className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-300 focus:outline-none focus:border-[#1877F2]"
                      />
                    </div>
                    {oauthRedirectUri && (
                      <div className="p-2 rounded-lg bg-white/80 border border-blue-100 text-[10px] text-gray-600">
                        <span className="font-bold text-gray-700 block">Valid OAuth Redirect URI (Add in Meta App):</span>
                        <code className="font-mono text-[#1877F2] break-all">{oauthRedirectUri}</code>
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={connectingAccount || !oauthAppIdInput.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#1464cc] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <i className="fi flex fi-brands-facebook"></i>
                      <span>{connectingAccount ? 'Redirecting to Facebook...' : 'Save App ID & Redirect to Facebook OAuth'}</span>
                    </button>
                  </form>
                )}

                {!oauthNeedsCredentials && (
                  <button
                    type="button"
                    disabled={connectingAccount}
                    onClick={() => void handleStartOAuth()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#1464cc] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fi flex fi-brands-facebook"></i>
                    <span>{connectingAccount ? 'Checking OAuth Config...' : 'Continue with Facebook OAuth'}</span>
                  </button>
                )}
              </div>

              {/* Option B: Direct System User / Page Access Token */}
              <form onSubmit={handleConnectWithToken} className="p-4 rounded-xl border border-gray-200 space-y-2.5">
                <span className="text-xs font-bold text-gray-900 block">
                  Option 2: Connect with Meta Access Token
                </span>
                <p className="text-[11px] text-gray-500">
                  Paste a System User Access Token or Page Access Token from Meta Business Suite / Graph API Explorer (`leads_retrieval`, `pages_show_list`, `ads_read`).
                </p>
                <input
                  type="password"
                  value={manualTokenInput}
                  onChange={(e) => setManualTokenInput(e.target.value)}
                  placeholder="EAA..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-[#4b33e8]"
                />
                <button
                  type="submit"
                  disabled={connectingAccount || !manualTokenInput.trim()}
                  className="w-full py-2 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Verify &amp; Connect Access Token
                </button>
              </form>

              {/* Option C: Sandbox / Demo Mode */}
              <div className="p-4 rounded-xl border border-dashed border-[#4b33e8]/40 bg-[#4b33e8]/5 space-y-2">
                <span className="text-xs font-bold text-[#4b33e8] block">
                  Option 3: Sandbox / Demo Ads Mode (Instant Test)
                </span>
                <p className="text-[11px] text-gray-600">
                  Want to test the Ad Connection, Config Screen (Campaign, Source Name, Agent/General Pool, Expiry Date), and Live Lead Ingestion right now?
                </p>
                <button
                  type="button"
                  disabled={connectingAccount}
                  onClick={handleConnectSandbox}
                  className="w-full py-2 px-4 rounded-xl bg-[#4b33e8] hover:bg-[#3d28d0] text-white text-xs font-bold transition-colors"
                >
                  Enable Demo Meta Ads Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Connect Ad & Configure Lead Routing Modal */}
      <ConnectMetaAdModal
        show={showAdConfigModal}
        onClose={() => {
          setShowAdConfigModal(false);
          setSelectedAdForConfig(null);
          setEditingConfig(null);
        }}
        onSuccess={() => {
          setShowAdConfigModal(false);
          setSelectedAdForConfig(null);
          setEditingConfig(null);
          setActiveTab('connected');
          setBannerMessage({
            type: 'success',
            text: 'Meta Ad connected and routing configuration saved! You can click "+ Test Lead" to verify lead ingestion right away.',
          });
          if (activeOrgId) {
            void loadAllMetaData(activeOrgId);
          }
        }}
        organizationId={activeOrgId}
        selectedAd={selectedAdForConfig}
        editingConfig={editingConfig}
        pages={pages}
      />
    </>
  );
}

