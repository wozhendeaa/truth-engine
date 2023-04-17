import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from"next/image"
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs"
import relativetTime from "dayjs/plugin/relativeTime"
import { LoadingPage } from "src/components/loading";

dayjs.extend(relativetTime);

const CreatePost = () => {
  const {user} = useUser();
  if(!user) return null;

  return <div className="flex gap-3 w-full ">
    <img src={user.profileImageUrl} alt="profile image" className="w-14 h-14 rounded-full"/>
    <input placeholder="type" className="grow bg-transparent outline-none"/>
  </div>
}
import { RouterOutputs, api } from "~/utils/api";

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
  if (!data) return <div>something is wrong</div>

  return (
    <div className="flex flex-col">
    {[...data,...data]?.map((fullPost) => (
      <Postview {...fullPost} key={fullPost.author?.id} />  
      ))}

   </div>
  );
}
const Home: NextPage = () => {
  const {isLoaded: userLoaded, isSignedIn} = useUser();
  api.posts.getAll.useQuery();

  //return empty div if nothing is loaded
  if (!userLoaded ) return <div></div>;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
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

export default Home;
