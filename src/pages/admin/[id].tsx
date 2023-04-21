import { GetServerSideProps, GetStaticPaths, GetStaticProps, InferGetStaticPropsType, type NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import { useRouter } from "next/router";
import { LoadingPage } from "src/components/loading";
import Postview from "~/components/PostView";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";


const SinglePostPage: NextPage<{postId: string}> = ({postId}) => {
  const {route} = useRouter().query;
  
  console.log("sdf",route);
  const {data} = api.posts.getPostById.useQuery({id: postId})
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

