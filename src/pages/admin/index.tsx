import { type NextPage } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {  useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "components/layout";
import { api } from "utils/api";
import Sidebar from "../../components/sidebar/Sidebar"
import logo from "assets/img/reactlogo.png"
import appRoutes from "routes"

const Admin: NextPage = () => {
  const {data,  isLoading} = api.posts.getAllWithReactionsDataForUser.useQuery();
  let isVerified = api.user.isCurrentUserVerifiedEngine.useQuery().data;
  
  const { t, i18n } = useTranslation(['common', 'footer'], { bindI18n: 'languageChanged loaded' })
  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  useEffect(() => {
     void i18n.reloadResources(i18n.resolvedLanguage, ['common', 'footer'])
  }, [])


  return (
    <>
        {/* <PageLayout> */}

        {/* <Sidebar routes={appRoutes} logoText={"DASHBOARD"} variant="opaque"  /> */}

       {/* </PageLayout> */}
     
    </>
  );
};

export function getServerSnapshot() {
  // Fetch data from an API or database

  // Return the data
  return null;
}


export const getServerSideProps = async ({locale}: {locale: string} ) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'footer']),
  },
})



export default Admin;

