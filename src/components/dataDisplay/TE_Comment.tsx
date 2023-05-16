import {
  Avatar,
  Button,
  Flex,
  Icon,
  Link,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import { Reaction } from "@prisma/client";
import dayjs from "dayjs";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { RouterOutputs, api } from "utils/api";
import CommentModal from "components/PostComment/CommenModal";
import { IoEllipsisHorizontal } from "react-icons/io5";
import TransparentCommentMenu from "components/menu/TransparentCommentMenu";
import axios from "axios";
import React from "react";
import { GetSekleton } from "helpers/UIHelper";
import { LoadingSpinner } from "components/loading";
import { HSeparator } from "components/separator/Separator";

// Custom components

export default function TEComment(props: {
  avatar: string;
  name: string;
  username: string;
  commentId: string;
  text: string;
  tags?: string[];
  time: string;
  likes: number;
  commentNum: number;
  likedByUser: Reaction[]; //韭菜点赞了哪些评论
  isFirstLevel: boolean; //是不是最顶级的回复
  onPostPage: boolean; //看是不是在帖子专门的页面显示的回复。如果是浏览页面，回复的时候就显示modal回复框，如果不是就直接在评论区显示回复框
}) {
  const {
    avatar,
    name,
    text,
    tags,
    time,
    likes,
    commentNum,
    commentId,
    likedByUser,
    isFirstLevel,
    onPostPage,
    ...rest
  } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("white", "secondaryGray.900");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const textGray = useColorModeValue("#68769F", "secondaryGray.600");
  const { t } = useTranslation();
  const userId = useAuth().userId;

  const hasReaction = likedByUser.some(
    (reaction) => reaction.commentID === commentId
  );

  const [liked, setLiked] = useState(hasReaction);

  const [likeNumber, setNumber] = useState(likes);
  const [showReplies, setShowReplies] = useState(false);
  type replyType =
    RouterOutputs["comment"]["getCommentsForComment"]["props"]["comments"];
  const [replies, setReplies] = useState<replyType>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  async function getRepliesForComment() {
    setLoadingReplies(true);
    await axios
      .post("/api/PostComment?commentId=" + commentId)
      .then((response) => {
        const data: replyType = response.data.props.comments;
        if (data) {
          setReplies(data);
          setShowReplies(!showReplies);
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      })
      .finally(() => {
        // Request is complete
        setLoadingReplies(false);
      });
  }

  const likeCommentMutation = api.comment.likeComment.useMutation({
    onSuccess: () => {},
    onError: (error: any) => {
      toast("点赞失败");
      if (liked) {
        setNumber(likeNumber - 1);
      } else {
        setNumber(likeNumber + 1);
      }
      setLiked(!liked);
    },
  });

  function handleLikeClick() {
    if (userId == null) {
      toast.error(t("login_before_like"));
      return;
    }

    handleLike(commentId);
    if (liked) {
      setNumber(likeNumber - 1);
    } else {
      setNumber(likeNumber + 1);
    }
    setLiked(!liked);
  }

  const handleLike = (commentId: string) => {
    // setTweets(tweets.map(tweet => tweet.tweetId === tweetId ? { ...tweet, likes: tweet.likes + 1 } : tweet));
    likeCommentMutation.mutate({ commentId: commentId });
  };

  const disc = useDisclosure();
  function showCommentModal() {
    disc.onOpen();
  }

  return (
    <Flex
      id={commentId}
      mb={isFirstLevel ? 0 : 0.5}
      {...rest}
      direction={"column"}
      rounded={"xl"}
      p={2}
      bgColor={isFirstLevel ? "" : "te_dark_ui"}
    >
      <Flex
        mt={isFirstLevel ? 0 : 2}
        className="overflow-hidden overflow-ellipsis"
      >
        <Avatar src={avatar} w="30px" h="30px" me="15px" />
        <Text color={textColor} fontWeight="700" fontSize="md">
          <Link href={"/user/" + props.username}>
            {name}
          </Link>
        </Text>
        <Flex className="overflow-hidden overflow-ellipsis">
          <Flex
            color={textColorSecondary}
            className="ml-2 overflow-hidden overflow-ellipsis"
          >
            {"@" + props.username}
          </Flex>
          <Text
            fontSize="md"
            mt={0.2}
            color={textColorSecondary}
            fontWeight="500"
            className="ml-2 overflow-hidden overflow-ellipsis"
          >
            {time}
          </Text>
        </Flex>
        <Flex ml={"auto"}>
          <TransparentCommentMenu
            icon={
              <Icon
                as={IoEllipsisHorizontal}
                w="24px"
                h="24px"
                color={"te_dark_fonts"}
              />
            }
          />
        </Flex>
      </Flex>
      <Flex direction="column">
        <Flex>
          {tags
            ? tags.map((tag, key) => {
                return (
                  <Link
                    href={`#${tag}`}
                    me="4px"
                    key={key}
                    color="secondaryGray.600"
                    fontSize="md"
                    fontWeight="400"
                  >
                    <>#{tag}</>
                  </Link>
                );
              })
            : null}
        </Flex>

        <Flex align="left" direction={"column"}>
          <Flex mt={2} px={isFirstLevel ? 0 : 3} fontSize={"md"} className={"text-" + textColor}>
            {props.text}
          </Flex>
          {/* 点赞按钮 */}
          <Flex align="left" justifyItems={"left"}>
            <Flex mt={2.5} className="text-red">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={liked ? "grey" : "white"}
                className={
                  "h-6 w-full "+  (liked ? "fill-te_dark_liked " :  "fill-none ") + "hover:animate-ping " 
                  + (liked ? "te_dark_liked" : "") }>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
              <span className={"ml-1 text-" + textColor}>{likeNumber > 0 ? likeNumber : ""}</span>
            </Flex>
          </Flex>
          <Flex
            width={"90%"}
            direction="column"
            ml={10}
            mt={isFirstLevel ? 3 : -1}
          >
            {loadingReplies && (
              <Flex>
                <LoadingSpinner />
              </Flex>
            )}
            {showReplies &&
              replies?.map((c) => (
                <TEComment
                  avatar={
                    c.author.profileImageUrl ?? "images/default_avatar.png"
                  }
                  key={c.id}
                  commentId={c.id}
                  commentNum={commentNum}
                  username={c.author.username!}
                  name={c.author.displayname!}
                  text={c.content}
                  time={dayjs(c.createdAt).fromNow()}
                  likes={c.likes}
                  likedByUser={c.reactions}
                  isFirstLevel={false}
                  onPostPage={onPostPage}
                />
              ))}
          </Flex>
        </Flex>
      </Flex>
      {isFirstLevel && <HSeparator />}
    </Flex>
  );
}

const i18n = require("next-i18next.config");

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"], i18n)),
  },
});
