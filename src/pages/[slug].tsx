import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from"next/image"
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs"
import relativetTime from "dayjs/plugin/relativeTime"
import { LoadingPage, LoadingSpinner } from "src/components/loading";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { RouterOutputs, api } from "~/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import toast, { Toaster } from 'react-hot-toast';
import { ZodError } from "zod";


const ProfilePage: NextPage = () => {
  const {isLoaded: userLoaded, isSignedIn} = useUser();
  const {locale} = useRouter();
  api.posts.getAll.useQuery();
  
  if (!userLoaded ) return <div></div>;

  return (
    <>
      <Head>
        <title>home_title</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen" >
       <div>
       profile view
       </div>
      </main>
    </>
  );
};


export default ProfilePage;

