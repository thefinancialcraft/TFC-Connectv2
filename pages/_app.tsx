import type { AppProps } from "next/app";
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
  );
}


