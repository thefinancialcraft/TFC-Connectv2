import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check for Flutter Bridge (InAppWebView)
    const isFlutter = typeof window !== 'undefined' && 
                      !!(window as any).flutter_inappwebview;

    if (isFlutter) {
      console.log("📱 [Index] Flutter environment detected. Redirecting to Login.");
      router.push("/login");
    } else {
      console.log("💻 [Index] Web environment detected. Redirecting to Home.");
      router.push("/home");
    }
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
