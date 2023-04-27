import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from"next/image"
import { LoadingPage, LoadingSpinner } from "src/components/loading";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { RouterOutputs, api } from "~/utils/api";
import { SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "~/components/layout";
import { PostCreator as PostBox } from "~/components/posting/PostBox";
import { Flex, useColorModeValue } from "@chakra-ui/react";

import TruthEngineSideBar from "~/components/QTruthEngineSidebar";
import FeedThread from "~/components/FeedThread"

const Home: NextPage = () => {
  const {isLoaded: userLoaded, isSignedIn} = useUser();
	// Chakra color mode
	const textColor = useColorModeValue('gray.700', 'white');
	const paleGray = useColorModeValue('secondaryGray.400', 'whiteAlpha.100');

  const {data} = api.posts.getAll.useQuery();

  
  const { t, i18n } = useTranslation(['common', 'footer'], { bindI18n: 'languageChanged loaded' })
  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  useEffect(() => {
     void i18n.reloadResources(i18n.resolvedLanguage, ['common', 'footer'])
  }, [])

  //return empty div if nothing is loaded
  if (!userLoaded ) return <div></div>;

  return (
    <>
        <PageLayout>
          <div className="col-span-1 h-full hidden md:inline" >    
          
          </div>
          <TruthEngineSideBar />

          {/* {!!isSignedIn && <PostCreator />} */}
     
         <div className="col-span-4 lg:col-span-2"> 
             <PostBox />
            
             {
              //@ts-ignore
             <FeedThread posts={data} />}
             
         </div>

          <div className="col-span-1 hidden lg:inline ">

          </div>
       </PageLayout>
     
    </>
  );
};

export const getStaticProps = async ({locale}: {locale: string} ) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'footer']),
  },
})

export default Home;

