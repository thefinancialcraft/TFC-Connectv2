import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

interface MetaAdsIntegrationCardProps {
  organizationId?: string | null;
}

export default function MetaAdsIntegrationCard({ organizationId }: MetaAdsIntegrationCardProps) {
  const router = useRouter();
  const [connected, setConnected] = useState(false);
  const [activeConfigsCount, setActiveConfigsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const checkMetaStatus = async () => {
      if (!organizationId) {
        setLoading(false);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const [assetsRes, configsRes] = await Promise.all([
          fetch(`/api/meta/assets?organizationId=${encodeURIComponent(organizationId)}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          fetch(`/api/meta/configs?organizationId=${encodeURIComponent(organizationId)}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
        ]);

        const assetsData = await assetsRes.json();
        const configsData = await configsRes.json();

        if (!cancelled) {
          setConnected(Boolean(assetsData?.connected));
          setActiveConfigsCount(
            Array.isArray(configsData?.configs)
              ? configsData.configs.filter((c: any) => c.is_active).length
              : 0
          );
        }
      } catch {
        // ignore status error
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void checkMetaStatus();
    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  return (
    <section
      id="card-meta-ads-connector"
      className="flex h-full min-h-[173px] min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      <div className="flex h-[72px] shrink-0 items-center justify-between gap-3 bg-[#1877F2] px-4 py-3">
        <div>
          <p className="text-sm font-bold text-white">Meta Lead Ads</p>
          <p className="text-[10px] font-medium text-blue-100">Facebook &amp; Instagram CRM Sync</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white text-[#1877F2] text-xl shadow-xs">
          <i className="fi flex fi-brands-facebook"></i>
        </div>
      </div>

      <p className="flex min-h-[56px] flex-1 items-center px-4 py-3 text-xs leading-relaxed text-gray-600">
        Connect Meta Ads &amp; configure Target Campaign, Source Name, Agent / General Pool &amp; Expiry Date.
      </p>

      <div className="flex h-[45px] shrink-0 items-center justify-between border-t border-gray-100 px-4 py-2.5">
        <span
          className={`text-xs font-semibold ${
            loading ? 'text-gray-400' : connected ? 'text-[#1a8f5a]' : 'text-gray-500'
          }`}
        >
          {loading
            ? 'Checking...'
            : connected
            ? `Connected (${activeConfigsCount} Ads)`
            : 'Not connected'}
        </span>

        <button
          type="button"
          onClick={() => router.push('/workflow/meta-ads')}
          aria-label="Open Meta Lead Ads configuration"
          title="Configure Meta Lead Ads"
          className="px-3 py-1 rounded-lg bg-[#1877F2] hover:bg-[#1464cc] text-white text-[11px] font-bold transition-colors"
        >
          {connected ? 'Manage Ads' : 'Connect'}
        </button>
      </div>
    </section>
  );
}

