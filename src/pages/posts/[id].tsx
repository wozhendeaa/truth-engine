import { GetServerSideProps, GetStaticPaths, GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { LoadingPage } from "src/components/loading";
import Postview from "~/components/PostView";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";


const SinglePostPage: NextPage<{postId: string}> = ({postId}) => {
  const {data} = api.posts.getPostById.useQuery({id: postId})
  console.log(postId);
  if (!data) return <div>404...</div>

  return (
    <>
      <Head>
        <title>{data.author.username}&apos;s post</title>
      </Head>
      <PageLayout>
        <Postview {...data} />
       </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg =  generateSSGHelper();

  const id = context.params?.id as string;
  console.log("context:", context);
  if (typeof id !== 'string') throw new Error('没有id')
  await ssg.posts.getPostById.prefetch({id: id});

  return {
    props:{
      trpcState: ssg.dehydrate(),
      id
    }
  }
}    


export const getStaticPaths: GetStaticPaths  = () => {
  return {
      paths:[], 
      fallback:false
  }
}



export default SinglePostPage;

