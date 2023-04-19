import { type NextPage } from "next";
import Head from "next/head";
import { RouterOutputs, api } from "~/utils/api";
import { useRouter } from "next/router";


const ProfilePage: NextPage = () => {

  return (
    <>
      <Head>
        <title>home_title</title>
        <meta name="description" content="" />
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

