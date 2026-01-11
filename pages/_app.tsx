import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DialogProvider } from "../lib/dialogService";
import SessionRedirect from "../components/SessionRedirect";

import { UserProvider } from "../components/UserProvider";

import { globalLogger } from "../lib/logger";
import LogPip from "../components/LogPip";
import "../lib/flutterBridge"; // Initialize bridge listeners

if (typeof window !== 'undefined') {
  globalLogger.init();
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <DialogProvider>
        <SessionRedirect />
        <LogPip />
        <Component {...pageProps} />
      </DialogProvider>
    </UserProvider>
  );
}

