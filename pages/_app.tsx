import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DialogProvider } from "../lib/dialogService";
import SessionRedirect from "../components/SessionRedirect";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DialogProvider>
      <SessionRedirect />
      <Component {...pageProps} />
    </DialogProvider>
  );
}

