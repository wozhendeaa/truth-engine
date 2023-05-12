import { type NextPage } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {  useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "components/layout";
import { api } from "utils/api";
import { isUserVerified } from "pages/helpers/userHelper";
import Sidebar from "components/sidebar/Sidebar";
import appRoutes from 'routes';
import TESidebar from "components/sidebar/TESidebar";

const NaturalHealing: NextPage = () => {
  const { t, i18n } = useTranslation(['common', 'footer'], { bindI18n: 'languageChanged loaded' })
  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  useEffect(() => {
     void i18n.reloadResources(i18n.resolvedLanguage, ['common', 'footer'])
  }, [])

  return (
    <>
        <PageLayout>
        <span className="text-slate-100">自然他妈疗法啊</span>
       </PageLayout>
     
    </>
  );
};


export const getServerSideProps = async ({locale}: {locale: string} ) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'footer']),
  },
})

export default NaturalHealing;

