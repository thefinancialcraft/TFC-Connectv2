import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DialogProvider } from "../lib/dialogService";
import SessionRedirect from "../components/SessionRedirect";

import { UserProvider } from "../components/UserProvider";

import { globalLogger } from "../lib/logger";
import { initNetworkInterceptors } from "../lib/networkInterceptors";
import LogPip from "../components/LogPip";
import "../lib/flutterBridge"; // Initialize bridge listeners

import OfflineOverlay from "../components/OfflineOverlay";
import GlobalCallHandler from "../components/GlobalCallHandler";

if (typeof window !== 'undefined') {
  globalLogger.init();
  initNetworkInterceptors();
}


export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <DialogProvider>
        <OfflineOverlay />
        <SessionRedirect />
        <GlobalCallHandler />
        <LogPip />
        <Component {...pageProps} />
      </DialogProvider>
    </UserProvider>
  );
}


