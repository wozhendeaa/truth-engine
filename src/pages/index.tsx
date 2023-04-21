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

//create react hook validation schema for post
const postSchema = z.object({
  content: z.string().min(4, {message: "post_too_short"}),
});

type postFormSchema = z.infer<typeof postSchema>;


const CreatePost = () => {
  const [newPost, setPost] = useState("");
  const {register, handleSubmit, formState: {errors}} = useForm<postFormSchema>({
    resolver: zodResolver(postSchema)
  });
  const {user} = useUser();
  const ctx = api.useContext();
  const {t} = useTranslation();

  if(!user) return null;

  const {mutate, isLoading: isPosting} = api.posts.createPost.useMutation({
    onSuccess: () => {
      setPost("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
       const errorMessage = e.data?.code;
       if (errorMessage) {
        toast.error(t(errorMessage));       
       } 
    }     
  });

  function onPromise<T>(promise: (event: SyntheticEvent) => Promise<T>) {
    return (event: SyntheticEvent) => {
      if (promise) {
        promise(event).catch((error) => {
          console.log("Unexpected error", error);
        });
      }
    };
  }

  const onSubmit= (data : postFormSchema) => {
    if (!errors.content) {
      mutate(data);
    }
  }
  return <> 
  <div className="flex gap-3 w-full ">
    <Image src={user.profileImageUrl} alt="profile image" className="w-14 h-14 rounded-full" width="56"
          height="56"/>
    <form onSubmit={ onPromise(handleSubmit(onSubmit))} className="flex gap-3 w-full ">
    <input placeholder="type"
     className="grow bg-transparent outline-none "
     value={newPost}
     onKeyDown={(e) => {      
         if(e.key === "Enter") {
          e.preventDefault();
          if (errors.content) {
            toast.error(t("post_too_short"));
          } else {
            mutate({content: newPost});
          }            
     }}}
     disabled={isPosting}
     aria-invalid={errors.content ? "true" : "false"} 
     {...register("content", {required:true, onChange: (e: React.FormEvent<HTMLInputElement>) => setPost(e.currentTarget.value)})}  
     />
    {errors.content ? <span className="text-red-500 absolute top-center right-center flex items-center justify-center">{t('post_too_short')}</span>: null}

   {!isPosting && <button disabled={isPosting}  type="submit"
     className="bg-slate-400 text-white px-4 py-2 rounded-md"> {t("post")}</button>}
     {isPosting && <div className="flex items-center justify-center"><LoadingSpinner size={20}/></div>}
    </form>
  </div>
  </>
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
              {!isSignedIn && <SignInButton />}
              {!!isSignedIn && <SignOutButton /> && <CreatePost />}
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

