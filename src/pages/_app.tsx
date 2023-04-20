import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { IntlProvider } from "react-intl";
import { useRouter } from "next/router";
import { TRPCClientError } from "@trpc/client";
import { appWithTranslation, useTranslation } from 'next-i18next'
import { Toaster } from "react-hot-toast";
import { Head } from "next/document";

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
          </Head>
        <Component {...pageProps} />
      </ClerkProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
