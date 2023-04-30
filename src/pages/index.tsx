import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from"next/image"
import { LoadingPage, LoadingSpinner } from "src/components/loading";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { RouterOutputs, api } from "utils/api";
import { SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageLayout } from "components/layout";
import { PostCreator as PostBox } from "components/posting/PostBox";
import { Box, Flex, SkeletonCircle, SkeletonText, useColorModeValue } from "@chakra-ui/react";

import TruthEngineSideBar from "components/QTruthEngineSidebar";
import FeedThread from "components/FeedThread"

function getSekleton (number: number) {
  const boxes = [];
  for (let i = 0; i < number; i++) {
    //@ts-ignore
    boxes.push(
        <Box key={i} padding="6" boxShadow="lg" bg="" maxW={500}  width={700}  flexGrow={1} resize={'horizontal'}>
          <SkeletonCircle size="10" />
          <SkeletonText mt="4" noOfLines={5} spacing="4" skeletonHeight="2" />
        </Box>);
  }
  return <div className="flex flex-col items-center w-full">{boxes}</div>;
}

const Home: NextPage = () => {
  const {isLoaded: userLoaded, isSignedIn} = useUser();

  const {data,  isLoading} = api.posts.getAllWithReactionsDataForUser.useQuery();

  

  let isVerified = api.user.isCurrentUserVerifiedEngine.useQuery().data;
  
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

         { isVerified &&<PostBox />}
            
        { 
        isLoading ?
          getSekleton(5)
          :
           //@ts-ignore 
          <FeedThread posts={data?.props} />}


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

