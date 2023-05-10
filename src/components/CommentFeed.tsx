import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Text,
  Image,
  useColorMode,
  Input,
  Icon,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  BsThreeDotsVertical,
} from "react-icons/bs";

import { RouterOutputs, api } from "utils/api";
import { Post, Reaction, User } from "@prisma/client";
import relativetTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

dayjs.extend(relativetTime);

import ImageModal from "./ImageModal";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  MdImage,
  MdOutlineAttachment,
  MdOutlineTagFaces,
} from "react-icons/md";
import { HSeparator } from "./separator/Separator";
import TEComment from "./dataDisplay/TE_Comment";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LoadingSpinner } from "./loading";


type CommentsWithUserData = RouterOutputs["comment"]["getCommentsForPost"];

interface SingleCommentProps {
  currentUser: User;
  commentData: CommentsWithUserData;
}

interface CommentProps {
  comments: CommentsWithUserData[];
  likedByUser: Reaction[];
}

export const CommentThread = (props: {postId: string, topCommentsOnly: boolean}) => {
  const { t } = useTranslation();
  let limit = props.topCommentsOnly ? 3 : 50;

  const { data, isLoading } = api.comment.getCommentsForPost
  .useQuery({postId: props.postId, limit: limit});
  const comments = data?.props.comments;
  const reactions = data?.props.reactions;
  
  if (isLoading) {
    return <div className="flex justify-center mb p-6"> 
     <Box padding="1" boxShadow="lg" bg="" maxW={'full'}  width={700}  flexGrow={1} resize={'horizontal'}>
       <SkeletonCircle size="10" mt={-10} />
        <SkeletonText mt="3" noOfLines={3} spacing="4" skeletonHeight="2" />
  </Box> 
  </div>
  }


  if (!comments || comments.length === 0) {
    return (
      <div className="text-center text-slate-200">{t("no_comments_found")}</div>
    );
  }

  return (
    <div>
      {comments.map((c) => (
        <TEComment avatar={c.author.profileImageUrl ?? "images/default_avatar.png"} 
        key={c.id}
        commentId={c.id}
        username={c.author.username!}
        name={c.author.displayname!}
        text={c.content}
        time={dayjs(c.createdAt).fromNow()}
        likes={c.likes}
        likedByUser={reactions ?? []}          
        />
      ))}
        {<Flex justify={'center'} mt={-10}  className=""  >
      <div className="flex gap-x-2 hover:text-te_dark_action text-lg">
        <a>  {t('see_all_comments')}</a>
      </div>
      </Flex>}
    </div>

  );
};

export default CommentThread;


export const getServerSideProps = async ({locale}: {locale: string} ) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'footer']),
  },
})

