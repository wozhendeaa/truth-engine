import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  type NextPage,
} from "next";
import { generateSSGHelper } from "server/helpers/ssgHelper";
import { api } from "utils/api";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { PageLayout } from "components/layout";
import { Box, Flex, Link } from "@chakra-ui/react";
import { GetSekleton } from "helpers/UIHelper";
import React from "react";
import { SingleFeed } from "components/PostComment/EngineFeed";
import { ArrowBackIcon } from "@chakra-ui/icons";
const i18n = require('next-i18next.config');

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const ssg = generateSSGHelper();
  const locale = "zh-CN";
  const id = context.params?.id as string;
  if (typeof id !== "string") throw new Error("id not found");
  await ssg.posts.getPostById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
      ...(await serverSideTranslations(locale, ["common", "footer"], i18n)),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

function toElement(){
  if (typeof window !== 'undefined') {
      // Get the fragment identifier from the URL
      const fragment: string = window.location.hash;
      if (fragment) {
        // Find the element with the matching id
        const element: HTMLElement | null = document.querySelector(fragment);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
        }
      }
}
}

const SinglePostPage: NextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {

  const { data, isLoading, isError } = api.posts.getPostById.useQuery({
    id: props.id,
  });

  if (!data) return <GetSekleton number={1} />
  
  return (
    <>
      <PageLayout>
        <Flex className="col-span-4 w-full justify-center">
          <Box alignSelf={"flex-start"} >
            {/* <Link> */}
              {/* <ArrowBackIcon color={"whatsapp.200"} onClick={()=>toElement()} /> */}
            {/* </Link> */}
          </Box>
          <Flex className="w-2/4">
            {isLoading ? (
             <GetSekleton number={1} />
            ) : (
              <SingleFeed key={data.id} postWithUser={data} onPostPage={true} 
              loadingCompleteCallBack={toElement} />
            )}
          </Flex>
        </Flex>
      </PageLayout>
    </>
  );
};

export default SinglePostPage;
