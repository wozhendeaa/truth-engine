import { type NextPage } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {  useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "components/layout";
import { api } from "utils/api";
import { isUserVerified } from "helpers/userHelper";
import Sidebar from "components/sidebar/Sidebar";
import appRoutes from 'TE_Routes';
import TESidebar from "components/sidebar/TESidebar";

const RedPillAcademy: NextPage = () => {
  const { t } = useTranslation()

  return (
    <>
        <PageLayout>
        <span className="text-slate-100">小明教授视频</span>
       </PageLayout>
     
    </>
  );
};


export const getServerSideProps = async ({locale}: {locale: string} ) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'footer']),
  },
})

export default RedPillAcademy;

