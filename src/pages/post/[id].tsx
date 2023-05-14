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
import { getSekleton } from "pages/helpers/UIHelper";
import React from "react";
import { SingleFeed } from "components/FeedThread";
import { ArrowBackIcon } from "@chakra-ui/icons";

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
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

const SinglePostPage: NextPage = (
  props: InferGetStaticPropsType<typeof getStaticProps>
) => {
  const { data, isLoading, isError } = api.posts.getPostById.useQuery({
    id: props.id,
  });
  if (!data) return getSekleton(1);

  return (
    <>
      <PageLayout>
        <Flex className="col-span-4 w-full justify-center">
          <Box alignSelf={"flex-start"}>
            <Link href="..">
              <ArrowBackIcon color={"whatsapp.200"} />
            </Link>
          </Box>
          <Flex className="w-3/4">
            {isLoading ? (
              getSekleton(5)
            ) : (
              <SingleFeed key={data.id} postWithUser={data} onPostPage={true} />
            )}
          </Flex>
        </Flex>
      </PageLayout>
    </>
  );
};

export default SinglePostPage;
