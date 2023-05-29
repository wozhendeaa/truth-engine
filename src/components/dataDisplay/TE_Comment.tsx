import {
  Avatar,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import { Reaction } from "@prisma/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { RouterOutputs, api } from "utils/api";
import CommentModal from "components/PostComment/CommenModal";
import axios from "axios";
import React from "react";
import { LoadingSpinner } from "components/loading";
import { HSeparator } from "components/separator/Separator";
import TE_Routes from "TE_Routes";
import { renderAsHTML } from "components/TipTap/TruthEngineEditor";
import CommentActionMenu from "components/PostComment/CommentActionMenu";
import { GetTime } from "helpers/UIHelper";
import avatar from "assets/img/avatars/avatar4.png";
import Link from "next/link";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

type replyType =
  RouterOutputs["comment"]["getCommentsForComment"]["props"]["comments"];
// Custom components
export default function TEComment(props: {
  avatar: string;
  name: string;
  username: string;
  authorId: string;
  commentId: string;
  text: string;
  tags?: string[];
  time: Date;
  likes: number;
  commentNum: number;
  replyToPostId: string; // 一般不需要传这个参数，这是在为了获取用户刚刚发表的评论的时候加的。需要知道回复的是哪个帖子，然后获取发评论的用户的最新回复然后展示出来
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
    authorId,
    username,
    commentNum,
    commentId,
    likedByUser,
    isFirstLevel,
    onPostPage,
    replyToPostId,
    ...rest
  } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const textGray = useColorModeValue("#68769F", "secondaryGray.600");
  const { t } = useTranslation();
  const { userId, isSignedIn } = useAuth();
  const intl = useIntl();
  const formatter = Intl.NumberFormat(intl.locale, { notation: "compact" });
  const hasReaction = likedByUser.some(
    (reaction) => reaction.commentID === commentId
  );

  const [liked, setLiked] = useState(hasReaction);

  const [likeNumber, setNumber] = useState(likes);
  const [showReplies, setShowReplies] = useState(false);

  const [replies, setReplies] = useState<replyType>();
  const [loadingReplies, setLoadingReplies] = useState(false);

  async function getRepliesForComment(onPostPage: boolean, postId: string) {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    if (!onPostPage) {
      window.open(TE_Routes.postbyid.path + postId + "#" + commentId, "_blank");
      return;
    }

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
        toast(error);
      })
      .finally(() => {
        // Request is complete
        setLoadingReplies(false);
      });
  }

  async function getUserNewlyMadeComment(onPostPage: boolean, postId: string) {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    if (!onPostPage) {
      window.open(TE_Routes.postbyid.path + postId + "#" + commentId, "_blank");
      return;
    }

    await axios
      .post("/api/userNewComment?commentId=" + commentId)
      .then((response) => {
        type newReplayType =
          RouterOutputs["comment"]["getUserNewCommentForComment"]["props"]["comment"];
        const data: newReplayType = response.data.props.comment;
        if (data) {
          setReplies(data);
          setShowReplies(true);
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
        toast(error);
      })
      .finally(() => {
        // Request is complete
        setLoadingReplies(false);
      });
  }

  const likeCommentMutation = api.comment.likeComment.useMutation({
    onSuccess: () => {},
    onError: (error: any) => {
      toast.error("驱动失败");
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
      width={"full"}
      rounded={"xl"}
      p={2}
      bgColor={isFirstLevel ? "" : "te_dark_ui"}
    >
      <Flex mt={isFirstLevel ? 0 : 2} flexWrap="nowrap" className="-mb-[20px]">
        <div>
          {
            <Link
              //@ts-ignore
              name="avatar"
              href={TE_Routes.userById.path + props.username}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar
                width={"30px"}
                height={"30px"}
                className="rounded-full transition-all duration-200 ease-in-out hover:border-2 hover:border-purple-500"
                src={avatar ?? "/images/default_profile.png"}
              />
            </Link>
          }
        </div>
        <Flex
          className="flex flex-row overflow-hidden 
        overflow-ellipsis whitespace-nowrap"
        >
          <div className="ml-2 text-slate-50">
            <Heading size="sm mt-4">
              {
                <Link
                  //@ts-ignore
                  name="name"
                  href={TE_Routes.userById.path + username}
                  className="hover:underline"
                >
                  {name}
                </Link>
              }
            </Heading>
          </div>
          {
            <Link
              //@ts-ignore
              name="username"
              href={TE_Routes.userById.path + username}
              className="hover:underline"
            >
              <div className="ml-2 text-slate-300 hover:underline ">
                {"@" + username}
              </div>
            </Link>
          }
          <div className=" ml-3 min-w-full truncate overflow-ellipsis whitespace-nowrap text-slate-300 sm:w-auto">
            {GetTime({ date: time })}
          </div>
        </Flex>

        <Flex ml={"auto"}>
          {
            <CommentActionMenu
              commentId={commentId}
              canDeleteOrEdit={userId === authorId}
            />
          }
        </Flex>
      </Flex>
      <Flex direction={"column"} flexWrap={"wrap"}>
        <Flex
          mt={2}
          px={isFirstLevel ? 0 : 3}
          width={"100%"}
          fontSize={"lg"}
          className={"text-" + textColor}
        >
          {renderAsHTML(props.text)}
        </Flex>

        <Flex align="left" justifyItems={"left"}>
          <Flex mt={2.5} className="cursor-pointer" onClick={handleLikeClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={liked ? "grey" : "white"}
              className={
                "h-6 w-full hover:animate-ping " +
                (liked ? "fill-te_dark_liked " : "fill-none ") +
                "hover:animate-ping " +
                (liked ? "te_dark_liked" : "")
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
              />
            </svg>
            <span className={"text- ml-1" + textColor}>
              {likeNumber > 0 ? formatter.format(likeNumber) : ""}
            </span>
          </Flex>
          <Flex mt={2.5}>
            {isFirstLevel && commentNum > 0 && (
              <Button
                color={textGray}
                variant="no-hover"
                mt={-2}
                fontWeight="500"
                boxShadow="none"
                w="max-content"
                _hover={{ color: "white" }}
                _active={{ color: "gray.300" }}
                onClick={async () =>
                  await getRepliesForComment(onPostPage, replyToPostId!)
                }
              >
                {t(showReplies ? "hide_replies" : "show_replies") +
                  "(" +
                  commentNum +
                  ")"}
              </Button>
            )}

            {disc.isOpen && (
              <CommentModal
                disc={disc}
                replyToCommentId={commentId}
                postId={replyToPostId!}
                commentCallback={getUserNewlyMadeComment}
              />
            )}

            <Button
              color={textGray}
              variant="no-hover"
              mt={-2}
              fontWeight="500"
              boxShadow="none"
              w="max-content"
              _hover={{ color: "white" }}
              _active={{ color: "gray.300" }}
              onClick={showCommentModal}
            >
              {t("reply_comment")}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {loadingReplies && (
        <Flex>
          <LoadingSpinner />
        </Flex>
      )}

      <div className="w-full pl-5">
        {showReplies &&
          replies?.map((c) => (
            <TEComment
              avatar={c.author.profileImageUrl ?? "images/default_avatar.png"}
              key={c.id}
              commentId={c.id}
              commentNum={commentNum}
              username={c.author.username!}
              name={c.author.displayname!}
              text={c.content}
              time={c.createdAt}
              likes={c.likes}
              likedByUser={c.reactions}
              isFirstLevel={false}
              authorId={c.authorId}
              replyToPostId={c.replyToPostId}
              onPostPage={onPostPage}
            />
          ))}
      </div>
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
