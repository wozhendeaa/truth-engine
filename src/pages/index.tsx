import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from"next/image"
import { LoadingPage, LoadingSpinner } from "src/components/loading";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { RouterOutputs, api } from "~/utils/api";
import { SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, } from "react-hook-form";
import { z } from "zod";
import { PageLayout } from "~/components/layout";
import Postview from "~/components/PostView";
import { PostCreator } from "~/components/posting/PostCreator";

const Feed = () => {
  const {data, isLoading: postsLoding} = api.posts.getAll.useQuery();

  if (postsLoding) return <LoadingPage />
  if (!data) return <div>没有找到任何消息</div>

  return (
    <div className="flex flex-col">
    {data?.map((fullPost) => (
      <Postview {...fullPost} key={fullPost.post?.id} />  
      ))}

   </div>
  );
}

const Home: NextPage = () => {
  const {isLoaded: userLoaded, isSignedIn} = useUser();

  api.posts.getAll.useQuery();
  
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
         <div className="flex border-b border-slate-400 p-4">
              {!!isSignedIn &&<PostCreator />}
         <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
         </div>

         <Feed />
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

