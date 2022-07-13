// import 'styles/globals.css'
import "styles/index.scss";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (router.pathname === "/_error") router.push("/");
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
