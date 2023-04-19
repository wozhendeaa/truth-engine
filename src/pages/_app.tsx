import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { IntlProvider } from "react-intl";
import { useRouter } from "next/router";
import { TRPCClientError } from "@trpc/client";
import { appWithTranslation } from 'next-i18next'
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  const {locale} = useRouter();
  if (!locale) {
    throw new TRPCClientError("local undefined");
  }

  return (    
      <ClerkProvider {...pageProps}>
        <Toaster position="bottom-center" />
        <Component {...pageProps} />
      </ClerkProvider>
  );
};

export default api.withTRPC(appWithTranslation(MyApp));
