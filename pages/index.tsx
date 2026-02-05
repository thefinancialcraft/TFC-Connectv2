import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from 'next/head';

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
    <>
      <Head>
        <title>Rynxly • The Advanced SIM-Based Calling CRM</title>
        <meta name="description" content="Transform your mobile workforce with Rynxly. The only CRM that syncs SIM-based calls with real-time web analytics, automated call routing, and performance tracking." />
        <meta name="keywords" content="SIM based CRM, mobile CRM, call tracking software, sales tracking, telecalling CRM, Rynxly, lead management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4b33e8" />
        <link rel="canonical" href="https://rynxly.in" />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://rynxly.in" />
        <meta property="og:title" content="Rynxly • Sync Mobile Calls with Web Power" />
        <meta property="og:description" content="Stop losing lead data. Automatically track every SIM call, record conversations, and visualize team performance in real-time." />
        <meta property="og:image" content="https://rynxly.in/home-page.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Rynxly" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://rynxly.in" />
        <meta property="twitter:title" content="Rynxly • Advanced Calling CRM" />
        <meta property="twitter:description" content="The ultimate tool for high-performance sales teams. Sync mobile calls, automate routing, and close more deals." />
        <meta property="twitter:image" content="https://rynxly.in/home-page.png" />
      </Head>

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
    </>
  );
}
