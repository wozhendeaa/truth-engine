import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { LoadingPage } from "src/components/loading";
import Postview from "~/components/PostView";
import { PageLayout } from "~/components/layout";
import { api } from "~/utils/api";


const ProfileFeed = (props: {userId: string}) => {
  const {data, isLoading} = api.posts.getPostsByUserId.useQuery({userId: props.userId});
  if (isLoading) <LoadingPage />

  if (!data) return <div>你没有发任何文章</div>
  return<div className="flex flex-col">
          {data.map((fullPost) => {
            return <Postview key={fullPost.post.id} {...fullPost} />
          })}
        </div>

}

const ProfilePage: NextPage<{username: string}> = ({username}) => {
  const {data} = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404...</div>
  if (!data.profileImageUrl) data.profileImageUrl = "https://images.clerk.dev/oauth_google/img_2OPYWwzL5YW33Nv2LCZaH7tz7JM.jpeg"
  return (
    <>
      <Head>
        <title>{data.username}&apos;s profile</title>
      </Head>
      <PageLayout>
        <div className="-slate-400 h-36 bg-slate-600 relative">
          <Image src={data.profileImageUrl}
           width={100} 
           height={100} 
           alt="profile image" 
           className="-mb-[50px] bottom-0 left-0 ml-4 absolute rounded-full border-4 border-black"/>
           <div className="h-[240px]"></div>
          <div className="p-4 text-2xl font-bold">@{data.username ?? ""}</div>
          <div className="w-full border-b border-slate-500"></div>

       </div>
       <ProfileFeed userId={data.id} />
       </PageLayout>
    </>
  );
};

import { generateSSGHelper } from "~/server/helpers/ssgHelper";


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg =  generateSSGHelper();
  const slug = context.params?.slug as string;
  if (typeof slug !== 'string') throw new Error('slug is not a string')
  const username = slug.replace("@", "");
  await ssg.profile.getUserByUsername.prefetch({username: username});

  return {
    props:{
      trpcState: ssg.dehydrate(),
      username
    }
  }
}    


export const getStaticPaths: GetStaticPaths  = () => {
  return {
      paths:[], 
      fallback:false
  }
}



export default ProfilePage;

