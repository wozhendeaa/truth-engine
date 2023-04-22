import { GetServerSideProps, GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { useRouter } from "next/router";
import { LoadingPage } from "src/components/loading";
import Postview from "~/components/PostView";
import { PageLayout } from "~/components/layout";
import { prisma } from "~/server/db";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

export const getStaticProps : GetStaticProps = async (context: GetStaticPropsContext) => {
  const ssg =  generateSSGHelper();

  const id = context.params?.id as string;
  console.log("context:", context);
  if (typeof id !== 'string') throw new Error('没有id')
  await ssg.posts.getPostById.prefetch({id});
  
  return {
    props:{
      trpcState: ssg.dehydrate(),
      id
    }
  }
}    


export const getStaticPaths: GetStaticPaths  = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
    },
  });
  return {
    paths: posts.map((post) => ({
      params: {
        id: post.id,
      },
    })),
    // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-blocking
    fallback: 'blocking',
  };
}


const SinglePostPage: NextPage = ( props: InferGetStaticPropsType<typeof getStaticProps>) => {

  const {data} = api.posts.getPostById.useQuery({id: props.id})
  
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




export default SinglePostPage;

