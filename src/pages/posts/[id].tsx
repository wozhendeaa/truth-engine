import { GetServerSideProps, GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { useRouter } from "next/router";
import Postview from "components/PostView";
import { PageLayout } from "components/layout";
import { prisma } from "server/db";
import { generateSSGHelper } from "server/helpers/ssgHelper";
import { api } from "utils/api";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps : GetStaticProps = async (context: GetStaticPropsContext) => {
  const ssg =  generateSSGHelper();
  const locale = "zh-CN";
  const  id = context.params?.id as string;
  if (typeof id !== 'string') throw new Error('没有id')
  await ssg.posts.getPostById.prefetch({id});
  
  return {
    props:{
      trpcState: ssg.dehydrate(),
      id,
      ...await serverSideTranslations(locale, ['common', 'footer']),
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

