import "@/styles/globals.css";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: true,
        dedupingInterval: 15 * 60 * 1000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        shouldRetryOnError: true,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
