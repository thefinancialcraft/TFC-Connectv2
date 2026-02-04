import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/landing");
  }, [router]);

  return (
    <div 
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: '#e7e3ff' }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div 
          className="animate-spin rounded-full border-4 border-t-transparent"
          style={{
            width: '48px',
            height: '48px',
            borderColor: '#4b33e8',
            borderTopColor: 'transparent',
          }}
        ></div>
        <div className="text-lg" style={{ color: '#4b33e8' }}>Redirecting...</div>
      </div>
    </div>
  );
}
