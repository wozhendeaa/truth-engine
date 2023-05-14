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
import React, { createContext, useEffect, useState } from "react";
import { IntlProvider } from 'react-intl';
import UserContext from "./helpers/userContext";
import { User } from "@prisma/client";
import '/node_modules/react-quill/dist/quill.snow.css';
const i18n = require('next-i18next.config');

var Backend = require('i18next-sync-fs-backend');



const QTruthEngine: AppType  = ({ Component, pageProps }) => {
  const {locale} = useRouter() ?? "ch-ZH";
  const {t} = useTranslation();
  const {data} =  api.user.getCurrentLoggedInUser.useQuery();

  return (    
    <ChakraProvider  theme={theme }>
      <ClerkProvider {...pageProps}>
        <Toaster position="bottom-center" />
           <Head>
            <title>{t('home_title')}</title>
            <meta name="Q真相引擎" content="Q真相引擎" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
          <div className="dark">
          <IntlProvider locale={locale}  >
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

export default api.withTRPC(appWithTranslation(QTruthEngine, i18n));
