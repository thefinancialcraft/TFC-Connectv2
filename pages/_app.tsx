import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DialogProvider } from "../lib/dialogService";
import SessionRedirect from "../components/SessionRedirect";

import { UserProvider } from "../components/UserProvider";

import { globalLogger } from "../lib/logger";

if (typeof window !== 'undefined') {
  globalLogger.init();
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <DialogProvider>
        <SessionRedirect />
        <Component {...pageProps} />
      </DialogProvider>
    </UserProvider>
  );
}

