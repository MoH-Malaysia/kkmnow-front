import "datagovmy-ui/styles";
import { appWithTranslation } from "next-i18next";
import { AppPropsLayout } from "datagovmy-ui/types";
import Layout from "@components/Layout";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import { header, body } from "datagovmy-ui/configs/font";
import { ThemeProvider } from "next-themes";
import Nexti18NextConfig from "../next-i18next.config";
import { clx } from "datagovmy-ui/helpers";
import { Progress, Toast } from "datagovmy-ui/components";

// App instance
function App({ Component, pageProps }: AppPropsLayout) {
  const layout =
    Component.layout ||
    ((page: ReactNode) => <Layout className={clx(body.variable, "font-sans")}>{page}</Layout>);
  const router = useRouter();

  return (
    <div className={clx(body.variable, header.variable, "font-sans dark:bg-black")}>
      <ThemeProvider attribute="class" enableSystem={false} forcedTheme={Component.theme}>
        {layout(<Component {...pageProps} />, pageProps)}
        <Progress />
        <Toast />
      </ThemeProvider>
    </div>
  );
}

export default appWithTranslation(App, Nexti18NextConfig);
