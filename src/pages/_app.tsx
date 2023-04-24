import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { TRPCClientError } from "@trpc/client";
import { appWithTranslation, useTranslation } from 'next-i18next'
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { Link } from "react-router-dom";

const MyApp: AppType = ({ Component, pageProps }) => {
  const {locale} = useRouter();
  const {t} = useTranslation();

  if (!locale) {
    throw new TRPCClientError("local undefined");
  }

  return (    

      <ClerkProvider {...pageProps}>
        <Toaster position="bottom-center" />
           <Head>
            <title>{t('home_title')}</title>
            <meta name="Q真相引擎" content="Q真相引擎" />
            <link rel="icon" href="/favicon.ico" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@500&display=swap" rel="stylesheet" />
          </Head>
        <Component {...pageProps} />
      </ClerkProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
