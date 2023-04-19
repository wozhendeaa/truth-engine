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

dayjs.extend(relativetTime);



const CreatePost = () => {
  const [newPost, setPost] = useState("");
  const {user} = useUser();
  const ctx = api.useContext();
  const {t} = useTranslation();

  const {mutate, isLoading: isPosting} = api.posts.createPost.useMutation({
    onSuccess: () => {
      setPost("");
      ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
       const errorMessage = e.data?.code;
       if (errorMessage) {
        toast.error(t(errorMessage));       
       } else {
        toast.error(t("something_went_wrong"));
       
       }
    }     
  });
  
  if(!user) return null;

  if(!user) return null;


  return <div className="flex gap-3 w-full ">
    <img src={user.profileImageUrl} alt="profile image" className="w-14 h-14 rounded-full"/>
    <input placeholder="type"
     className="grow bg-transparent outline-none"
     value={newPost}
     onChange={(e) => setPost(e.target.value)} 
     onKeyDown={(e) => {
         if(e.key === "Enter") {
          e.preventDefault();
          if (newPost !== "") {
            mutate({content: newPost});
          }
       }
     
     }}
     disabled={isPosting}/>

   {!isPosting && newPost !== "" && <button onClick={() => mutate({content: newPost})}
     disabled={isPosting}
     className="bg-slate-400 text-white px-4 py-2 rounded-md"> {t("post")}</button>}
     {isPosting && <div className="flex items-center justify-center"><LoadingSpinner size={20}/></div>}
  </div>
}



type PostWithUser = RouterOutputs["posts"]["getAll"][number]
const Postview = (props: PostWithUser) => {
    const {post, author} = props;

    return(
        <div key={post.id} className="flex gap-3 border-b border-slate-400 p-8 ">
          <Image 
          src={author.profileImageUrl}
          className="w-12 h-12 rounded-full" alt="头像"
          width="56"
          height="56" />          
          
          <div className="flex flex-col">
            <div className="flex text-slate-300">              
              <span>{`@${author.username}`}</span> 
              <span className="mx-1">·</span>
              <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
            </div>
          <span>{post.content} </span>          
          </div>
        </div>      
    );
}

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
  const {locale} = useRouter();

  api.posts.getAll.useQuery();
  
  const { t, i18n } = useTranslation(['common', 'footer'], { bindI18n: 'languageChanged loaded' })
  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  useEffect(() => {
    i18n.reloadResources(i18n.resolvedLanguage, ['common', 'footer'])
  }, [])

  //return empty div if nothing is loaded
  if (!userLoaded ) return <div></div>;

  return (
    <>
      <Head>
        <title>{t('home_title')}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen" >
      <div className="w-full h-full border-x md:max-w-2xl border-slate-400 ">
          <div className="flex border-b border-slate-400 p-4">
              {!isSignedIn && <SignInButton />}
              {!!isSignedIn && <SignOutButton /> && <CreatePost />}
          </div>
         <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />

      <Feed />
      </div>
      </main>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'footer']),
  },
})

export default Home;

