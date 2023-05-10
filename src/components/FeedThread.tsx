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
  Input,
  Icon,
  InputGroup,
  InputRightElement,
  Textarea,
} from "@chakra-ui/react";
import React, { ChangeEvent, useReducer, useRef, useState } from "react";
import {
  BsThreeDotsVertical,
} from "react-icons/bs";

import { RouterOutputs, api } from "utils/api";
import { Post, Reaction, User } from "@prisma/client";
import relativetTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
//@ts-ignore
import {i18n} from 'next-i18next.config'

require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')
dayjs.extend(relativetTime);

import ImageModal from "./ImageModal";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  MdSend,
} from "react-icons/md";
import { HSeparator } from "./separator/Separator";
import TEComment from "./dataDisplay/TE_Comment";
import { parseErrorMsg } from "server/helpers/serverErrorMessage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CommentThread from "./CommentFeed";
import { useUser } from "@clerk/nextjs";

type PostsWithUserData = RouterOutputs["posts"]["getAll"][number];
interface SingleFeedProps {
  currentUser: User;
  postWithUser: PostsWithUserData;
  likedByUser: Reaction[];
}

interface FeedProps {
  posts: {
    posts: PostsWithUserData[];
    likedByUser: Reaction[];
  };
}

function renderImages(type: string, url: string, index: any) {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  if (type === "image") {
    return (
      <li key={index} className="relative">
        <div
          className="group block w-full flex-grow  rounded-lg
     bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2
      focus-within:ring-offset-gray-100"
        >
          <Image
            objectFit="cover"
            src={url}
            alt=""
            className="pointer-events-none max-h-full object-cover group-hover:opacity-75"
          />
          <button
            type="button"
            className="absolute inset-0 focus:outline-none"
            onClick={() => {
              showModal();
            }}
          >
            <span className="sr-only"> </span>
          </button>

          {open && (
            //@ts-ignore
            <ImageModal url={url} open={open} close={closeModal} />
          )}
        </div>
      </li>
    );
  } else {
    return null;
  }
}

const SingleFeed = (singlePostData: SingleFeedProps) => {
  const postWithUser = singlePostData.postWithUser;
  const likedByUser = singlePostData.likedByUser;
  const mediaStr = singlePostData.postWithUser.media;
  let media = mediaStr ? Array.from(JSON.parse(mediaStr)) : [];

  const hasReaction = likedByUser.some(
    (reaction) => reaction.postId === postWithUser.id
  );
  const [liked, setLiked] = useState(hasReaction);
  const [likeNumber, setNumber] = useState(postWithUser.likes);
  const [showComments, setShowComments] = useState(false);
  const ctx = api.useContext();  
  const {isSignedIn} = useUser();

  const commentMutation = api.comment.createPostComment.useMutation({
    onSuccess: (data) => {
      void ctx.posts.getCommentsForPost.invalidate();
    },
    onError: (e: any)=> {
        const err = parseErrorMsg(e);
        toast.error(t(err));
    }
  });

  const [comment, SetComment] = useState("");
  const {t} = useTranslation();

  const likePostMutation = api.posts.likePost.useMutation({
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
    if (!isSignedIn) {
      toast('login_before_like');
      return;
    }
    handleLike(postWithUser);
    if (liked) {
      setNumber(likeNumber - 1);
    } else {
      setNumber(likeNumber + 1);
    }
    setLiked(!liked);
  }

  function showCommentClick() {
    setShowComments(!showComments);
  }

  function handleChangeEvent(e:ChangeEvent<HTMLInputElement>) {
    SetComment(e.target.value);
  }

  function makeComment() {
    if (!isSignedIn) {
      toast('login_before_comment');
      return;
    }

    commentMutation.mutate({
      content: comment,
      replyToPostId: postWithUser.id,
    });
  }
  
  

  const handleLike = (post: PostsWithUserData) => {
    
    likePostMutation.mutate({ postId: post.id });
    SetComment("");
    
  };

  return (
    <>
      <Card
        size={"md"}
        className="mx-5 my-1 flex-grow font-chinese "
        cursor="pointer"
        _hover={{
          bgColor: "te_dark_darker",
        }}
        boxShadow={"lg"}
        bgColor={"te_dark_ui_bg"}
        textColor={"white"}
        rounded={"2xl"}
        shadow="lg"
        pb="0"
      >
        <CardHeader>
          <Flex alignItems={"top"}>
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar
                src={
                  postWithUser.author.profileImageUrl ??
                  "/images/default_profile.png"
                }
              />
              <Flex>
                <Heading size="md">{postWithUser.author.displayname}</Heading>
                <Text textColor={"gray.400"} ml={2}>
                  {"@" + postWithUser.author.username}
                </Text>
              </Flex>
              <Text textColor={"gray.400"} mt={.5}>
                {dayjs(postWithUser.createdAt).fromNow()}
              </Text>
            </Flex>
            <IconButton
              variant="ghost"
              colorScheme="gray"
              aria-label="See menu"
              _hover={{ bg: "gray.600" }}
              icon={<BsThreeDotsVertical />}
            />
          </Flex>
        </CardHeader>
        <CardBody pb={{ base: "6", sm: "6", md: "0" }} pt="0">
          <span className="font-chinese text-xl font-bold text-slate-100 shadow-none ">
            {postWithUser.content}
          </span>

          <div className="bg-accent text-accent-content  grid place-content-end justify-center rounded ">
            {/* image display section */}
            <div className="mt-auto items-end sm:p-6 ">
              <ul
                role="list"
                className="grid auto-cols-auto grid-flow-col gap-x-1 gap-y-2 xl:gap-x-1"
              >
                {media.map((file, index) => {
                  //@ts-ignore
                  return renderImages(file.type, file.url, index);
                })}
              </ul>
            </div>
          </div>
        </CardBody>

        <CardFooter
          p="0"
          justify="space-between"
          flexWrap="nowrap"
          mt="-5"
          maxHeight={70}
          sx={{
            "& > button": {
              minW: "36px",
              pb: "0.3rem",
            },
          }}
        >
          <Button
            flex="1"
            className="shrink"
            variant="ghost"
            _hover={{ bg: "gray.600" }}
            onClick={() => handleLikeClick()}
          >
            <div className="flex items-center justify-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={liked ? "currentColor " : "none"}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke={liked ? "grey" : "white"}
                className={
                  "h-6 w-full hover:animate-ping " +
                  (liked ? " text-lime-300" : "")
                }
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                />
              </svg>
              <span>{likeNumber > 0 ? likeNumber : ""}</span>
            </div>
          </Button>
          <Button
            flex="1"
            className="shrink"
            variant="ghost"
            _hover={{ bg: "gray.600" }}
            onClick={() => showCommentClick()}
          >
            <div className="flex items-center justify-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
           <span className="-mt-1"> {postWithUser.commentCount > 0 ?
             postWithUser.commentCount : ""}</span>
             </div>
          </Button>

          <Button
            flex="1 "
            className="shrink"
            variant="ghost"
            textColor={"gray.300"}
            gridGap={2}
            disabled={true}
            _hover={{}}
            pointerEvents={"none"}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
            </div>
            <div>
              {postWithUser.ViewCount > 0 ? postWithUser.ViewCount : "17"}
            </div>
          </Button>
        </CardFooter>
        {showComments && (
          <Flex direction="column" p={6}>
            <HSeparator mb="20px" mt="-20px" />
            <Box>
              <CommentThread
                postId={postWithUser.id}
                topCommentsOnly={true}
              />
            </Box>

            
            {singlePostData.currentUser &&
           ( <Flex align="center" position="relative" p={0}>
              <Avatar
                display={{ base: "none", md: "unset" }}
                w="50px"
                h="50px"
                me="15px"
                src={postWithUser.author.profileImageUrl!}
              />
              <InputGroup>
                <Input 
                  variant="social"
                  className="resize-none overflow-hidden"
                  placeholder={t('make_simple_comment') ?? ""}
                  size='md'
                  onChange={handleChangeEvent} 
                  _focus={{ borderColor: "blue.500" }}
                />
              <InputRightElement width='4.5rem'>
                  <IconButton
                    aria-label="image"
                    me="2px"
                    pl="20px"
                    variant="no-hover"
                    bg="transparent"
                  >
                    <Icon
                   onClick={makeComment}
                      as={MdSend}
                    _hover={{ color:"te_dark_green" }}
                      h="20px"
                      w="20px"
                      color="secondaryGray.700"
                    />
                  </IconButton>
              </InputRightElement>
              </InputGroup>
            </Flex>)}
            <Flex justify={'center'} mt='10px' mb='-15px' className="animate-bounce" >
             <div onClick={() => setShowComments(!showComments)} className="flex gap-x-2 hover:text-te_dark_action">
              <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
                    />
                  </svg>
                  {t('fold')}
             </div>
            </Flex>
          </Flex>
        )}
      </Card>
    </>
  );
};

export const FeedThread = (postData: FeedProps) => {
  const { t } = useTranslation();
  const { posts, likedByUser } = postData.posts;
  const { data: currentUser } = api.user.getCurrentLoggedInUser.useQuery();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-slate-200">{t("no_data_found")}</div>
    );
  }

  return (
    <div>
      {posts.map((p) => (
        <SingleFeed
          key={p.id}
          postWithUser={p}
          likedByUser={likedByUser}
          currentUser={currentUser!}
        />
      ))}
    </div>
  );
};

export default FeedThread;

export const getServerSideProps = async ({locale}: {locale: string} ) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'footer'], i18n),
  },
})

