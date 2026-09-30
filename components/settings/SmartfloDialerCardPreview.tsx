import Image from 'next/image';

interface SmartfloDialerCardPreviewProps {
  onOpenConfiguration: () => void;
}

export default function SmartfloDialerCardPreview({ onOpenConfiguration }: SmartfloDialerCardPreviewProps) {
  return (
    <section id="card-smartflo-dialer" className="flex h-full min-h-[173px] min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex h-[72px] shrink-0 items-center justify-between gap-3 bg-[#888888] px-4 py-3">
        <p className="text-sm font-bold text-white">Smartflo Dialer</p>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white">
          <Image src="/Smartflowp.png" alt="Smartflo" width={48} height={48} className="h-full w-full rounded-full object-contain" />
        </div>
      </div>

      <p className="flex min-h-[56px] flex-1 items-center px-4 py-3 text-xs leading-relaxed text-gray-600">
        Smartflo agent and extension details
      </p>
      <div className="flex h-[45px] shrink-0 items-center justify-between border-t border-gray-100 px-4 py-2.5">
        <span id="status-smartflo-dialer" className="text-xs font-semibold text-gray-500">Not configured</span>
        <button
          type="button"
          id="btn-open-smartflo-dialer"
          aria-label="Open Smartflo Dialer configuration"
          title="Open Smartflo Dialer configuration"
          onClick={onOpenConfiguration}
          className="flex h-6 w-11 shrink-0 items-center justify-start rounded-full border border-gray-300 bg-gray-200 p-0.5 transition-colors hover:border-gray-400"
        >
          <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
        </button>
      </div>
    </section>
  );
}
