import { Box, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React, { useState } from "react";

import { RouterOutputs, api } from "utils/api";
import { Reaction, User } from "@prisma/client";
import relativetTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativetTime);

import { useTranslation } from "react-i18next";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import routes from "routes";
import TEComment from "components/dataDisplay/TE_Comment";

type CommentsWithUserData = RouterOutputs["comment"]["getCommentsForPost"];

export const CommentThread = (props: {
  postId: string;
  topCommentsOnly: boolean;
  onPostPage: boolean;
  
}) => {
  const { t } = useTranslation();
  let limit = props.topCommentsOnly ? 3 : 50;

  const { data, isLoading } = api.comment.getCommentsForPost.useQuery({
    postId: props.postId,
    limit: limit,
  });
  const comments = data?.props.comments;

  if (isLoading) {
    return (
      <div className="mb flex justify-center p-6">
        <Box
          padding="1"
          boxShadow="lg"
          bg=""
          maxW={"full"}
          width={700}
          flexGrow={1}
          resize={"horizontal"}
        >
          <SkeletonCircle size="10" mt={-10} />
          <SkeletonText mt="3" noOfLines={3} spacing="4" skeletonHeight="2" />
        </Box>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center text-slate-200">{t("no_comments_found")}</div>
    );
  }

  return (
    <div>
      {comments.map((c) => (
        <TEComment
          avatar={c.author.profileImageUrl ?? "images/default_avatar.png"}
          key={c.id}
          commentId={c.id}
          username={c.author.username!}
          name={c.author.displayname!}
          text={c.content}
          time={dayjs(c.createdAt).fromNow()}
          likes={c.likes}
          commentNum={c.commentCount}
          likedByUser={c.reactions}
          isFirstLevel={true}      
			  	onPostPage={props.onPostPage}
        />
      ))}
      {
        !props.onPostPage &&
        <Flex justify={"center"} mt={-10} className=" ">
          <div className="flex gap-x-2 text-lg cursor-pointer hover:text-te_dark_action">
            <Link target="_blank" href={routes.postbyid.path + props.postId} > 
              {t("see_all_comments")}
           </Link>
          </div>
        </Flex>
      }
    </div>
  );
};

export default CommentThread;

const i18n = require('next-i18next.config');
export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'], i18n)),
  },
});
