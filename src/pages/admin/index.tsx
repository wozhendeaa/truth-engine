import { type NextPage } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {  useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "components/layout";
import { api } from "utils/api";
import Sidebar from "components/sidebar/Sidebar";
import appRoutes from 'TE_Routes';
import TESidebar from "components/sidebar/TESidebar";

const AdminPage: NextPage = () => {
  const {data,  isLoading} = api.posts.getAllWithReactionsDataForUser.useQuery();

  // let isVerified = isUserVerified(null);
  
  return (
    <>
        <PageLayout>
          {/* <TESidebar routes={appRoutes} logoText={"DASHBOARD"} variant="opaque"  /> */}
       </PageLayout>
     
    </>
  );
};


export const getServerSideProps = async ({locale}: {locale: string} ) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'footer']),
  },
})



export default AdminPage;

