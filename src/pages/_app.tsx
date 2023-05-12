import { type AppType } from "next/app";
import { api } from "utils/api";
import "styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { TRPCClientError } from "@trpc/client";
import { appWithTranslation, useTranslation } from 'next-i18next'
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { ChakraProvider } from '@chakra-ui/react'
import theme from "theme/theme";
import React, { createContext, useState } from "react";
import { Provider, useDispatch} from "react-redux";
import { store } from "Redux/ReduxStore";
import { IntlProvider } from 'react-intl';
import { setUser } from "Redux/userSlice";
import { getMyUser, setMyUser } from "pages/helpers/userHelper";
import UserContext from "./helpers/userContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  const {locale} = useRouter() ?? "ch-ZH";
  const {t} = useTranslation();
  const { data } = api.user.getCurrentLoggedInUser.useQuery();
  
  if (!locale) {
    throw new TRPCClientError("local undefined");
  }

  return (    
    <ChakraProvider  theme={theme }>
      <ClerkProvider {...pageProps}>
        <Toaster position="bottom-center" />
           <Head>
            <title>{t('home_title')}</title>
            <meta name="Q真相引擎" content="Q真相引擎" />
            <link rel="icon" href="/favicon.ico" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@500&display=swap" rel="stylesheet" />
          </Head>
          <div className="dark">
          <IntlProvider locale={locale} >
              <React.StrictMode>
              <UserContext.Provider value={data}>
                    <Component {...pageProps} />
              </UserContext.Provider>
            </React.StrictMode>
          </IntlProvider>
        </div>
      </ClerkProvider>
      </ChakraProvider>

  );
};

export default api.withTRPC(appWithTranslation(MyApp));
