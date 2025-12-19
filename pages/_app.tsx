import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DialogProvider } from "../lib/dialogService";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DialogProvider>
      <Component {...pageProps} />
    </DialogProvider>
  );
}

