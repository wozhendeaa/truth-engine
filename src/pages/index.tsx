import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {  useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "components/layout";
import { PostCreator as PostBox } from "components/posting/PostBox";
import { Box,  SkeletonCircle, SkeletonText } from "@chakra-ui/react";

import FeedThread from "components/PostComment/FeedThread"
import { api } from "utils/api";
import UserContext from "../helpers/userContext";
import { GetSekleton } from "../helpers/UIHelper";
import {isUserVerified} from 'helpers/userHelper';


const Home: NextPage = () => {
  const {data,  isLoading} = api.posts.getAllWithReactionsDataForUser.useQuery();
  const user = useContext(UserContext);
  const isVerified = isUserVerified(user);


  const { t, i18n } = useTranslation(['common', 'footer'], { bindI18n: 'languageChanged loaded' })
  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  useEffect(() => {
     void i18n.reloadResources(i18n.resolvedLanguage, ['common', 'footer'])
  }, [])


  return (
    <>
        <PageLayout>
          <div className="col-span-1 h-full hidden md:inline" >    
          
          </div>
          
         <div className="col-span-4 lg:col-span-2"> 

        { isVerified &&<PostBox />}
        { 
        isLoading ?
          <GetSekleton number={5} />
          :
           //@ts-ignore 
          <FeedThread postData={data}/>}
         </div>

          <div className="col-span-1 hidden lg:inline ">
          </div>

       </PageLayout>
     
    </>
  );
};


export const getServerSideProps = async ({locale}: {locale: string} ) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'footer']),
  },
})



export default Home;

