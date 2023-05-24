import { type AppType } from "next/app";
import { api } from "utils/api";
import "styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { appWithTranslation, useTranslation } from 'next-i18next'
import { Toaster, toast } from "react-hot-toast";
import Head from "next/head";
import { ChakraProvider } from '@chakra-ui/react'
import theme from "theme/theme";
import React, { useEffect } from "react";
import { IntlProvider } from 'react-intl';
import { Provider } from "react-redux";
import { store } from "Redux/ReduxStore";
import UserContext from "helpers/userContext";
import { User } from "@prisma/client";
import axios from "axios";
import TE_Routes from "TE_Routes";
import { useQuery } from "@tanstack/react-query";
const truthConfig = require("truth-engine-config.js");
const i18n = require('next-i18next.config')
interface UserLocalStorageItem {
  user: User;
  expiry: number;
}

function checkExpiration() {
  if (localStorage.getItem("user")) {
    const item = JSON.parse(
      localStorage.getItem("user")!
    ) as UserLocalStorageItem;
    const exp = truthConfig.system.user.sessionExpirationDuration + item.expiry;
    if (new Date().getTime() > exp) {
      localStorage.removeItem("user");
    }
  }
}

async function getLoggedInUser(): Promise<User | null> {
  let user: User | null = null;
  checkExpiration();
  if (!localStorage.getItem("user")) {
    let data: any = null;
    await axios(TE_Routes.getLoggedInUser.path)
      .then((response) => {
        data = response.data.user;
      })
      .catch((reason) => {
        console.log(reason.message);
        toast("网络出错了： " + reason.message);
      });

    if (!data) {
      return user;
    }

    const item: UserLocalStorageItem = {
      user: data as User,
      expiry:
        new Date().getTime() +
        truthConfig.system.user.sessionExpirationDuration,
    };

    localStorage.setItem("user", JSON.stringify(item));
  }

  const item = JSON.parse(
    localStorage.getItem("user") ?? ""
  ) as UserLocalStorageItem;
  user = item.user;
  return user;
}

const QTruthEngine: AppType  = ({ Component, pageProps }) => {
  const locale = useRouter().locale ?? "ch-ZH";
  const {t} = useTranslation();
  

  //获取用户数据存到本地，存2小时
  //为什么不用nextauth session？
  //这个问题问的好
  //因为用户验证是用clerk处理的，他们会保存session
  // 但是他们的数据跟我的数据是分开的，所以我不能直接拿他们的那边的数据过来
  // 虽然我可以在用户更改他们数据的时候同步到那边，但他们那边只给了一个token字段给我存我的专属信息
  // 我还他妈要转换，要同步，还不能有效率的用数据库查表，每次要从那里获取用户id然后用in来查（。。）滚
  // 所以我自己要来存用户信息，这样简单的多
  //先检测用户有没有登陆
  const user = useQuery({
    queryKey: ["user"],
    queryFn: () => getLoggedInUser(),
  }).data;

  
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
              <Provider store={store}>
               <UserContext.Provider value={user}>

                      <Component {...pageProps} />
      </UserContext.Provider>

              </Provider>
            </React.StrictMode>
          </IntlProvider>
        </div>
      </ClerkProvider>
      </ChakraProvider>

  );
};

export default api.withTRPC(appWithTranslation(QTruthEngine, i18n));
