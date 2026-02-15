import type { AppProps } from "next/app";
import Script from "next/script";
import "../styles/globals.css"; // HMR Global Trigger
import { DialogProvider } from "../lib/dialogService";

import { globalLogger } from "../lib/logger";
import { initNetworkInterceptors } from "../lib/networkInterceptors";
import "../lib/flutterBridge"; // Initialize bridge listeners

import OfflineOverlay from "../components/OfflineOverlay";

if (typeof window !== 'undefined') {
  globalLogger.init();
  initNetworkInterceptors();
  console.log("[App] Logger and Interceptors initialized.");
}


import { useRouter } from "next/router";
import PortalContainer from "../components/PortalContainer";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Decide if this is a portal page or a marketing page
  // Since we moved app files to /portal directory, their actual pathname will start with /portal
  const isPortalPage = router.pathname.startsWith('/portal');

  return (
    <>
      {/* Apollo.io Website Tracker */}
      <Script
        id="apollo-tracker"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function initApollo(){
              var n=Math.random().toString(36).substring(7),o=document.createElement("script");
              o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,
              o.onload=function(){window.trackingFunctions.onLoad({appId:"69918f831f332b0021a93049"})},
              document.head.appendChild(o)
            }
            initApollo();
          `,
        }}
      />
      <DialogProvider>
      <OfflineOverlay />
      {isPortalPage ? (
        <PortalContainer>
          <Component {...pageProps} />
        </PortalContainer>
      ) : (
        <Component {...pageProps} />
      )}
      </DialogProvider>
    </>
  );
}
