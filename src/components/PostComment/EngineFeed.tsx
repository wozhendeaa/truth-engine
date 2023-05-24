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
  Image,
  Text,
  Icon,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { api } from "utils/api";
import { Post, User } from "@prisma/client";
import ImageModal from "./ImageModal";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CommentThread from "./CommentFeed";
import { useUser } from "@clerk/nextjs";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import TransparentFeedThreadMenu from "components/menu/TransparentFeedThreadMenu";
import { HSeparator } from "components/separator/Separator";
import TE_Routes from "TE_Routes";
import TruthEngineEditor, {
  gettHtmlFromJson,
  renderAsHTML,
} from "components/TipTap/TruthEngineEditor";
import FeedActionMenu from "./FeedActionMenu";
import { GetTime } from "helpers/UIHelper";
import { LoadingSpinner } from "components/loading";
import { XMarkIcon } from '@heroicons/react/20/solid'
import { intersectionObserver, useViewTracker } from "helpers/intersectionObserver";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

//@ts-ignore
const i18n = require("next-i18next.config");

type PostsWithUserData = Post & {
  reactions: {
    userId: string;
  }[];
  author: User;
};

interface SingleFeedProps {
  postWithUser: PostsWithUserData;
  onPostPage: boolean;
  trackViewsCallback?:(id:string) => void;
  loadingCompleteCallBack?: () => void;
}

export interface FeedProps {
  posts: PostsWithUserData[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewFeed: () => Promise<unknown>;
}

export function RenderImage(props: {
  type: string;
  url: string;
  index: any;
  onPostPage: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { type, url, index } = props;

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  if (type === "image") {
    return (
      <li key={crypto.randomUUID()} className="relative">
        <div
          className="block w-full flex-grow  rounded-lg 
   bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 
      focus-within:ring-offset-2 focus-within:ring-offset-gray-100
       hover:shadow-whiteGlow"
        >
          <Image
            src={url}
            alt=""
            objectFit={"contain"}
            className="pointer-events-none max-h-[100%] shrink 
          "
          />
          <button
            name="image"
            type="button"
            className="absolute inset-0 focus:outline-none"
            onClick={showModal}
          >
            <span className="sr-only">open image</span>
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
interface MousePosition {
  x: number;
  y: number;
}

export function SingleFeed(singlePostData: SingleFeedProps) {
  const postWithUser = singlePostData.postWithUser;
  const onPostPage = singlePostData.onPostPage;
  const mediaFilesString = singlePostData.postWithUser.media;
  const loadingCompleteCallBack = singlePostData.loadingCompleteCallBack;
  const trackViewsCallBack = singlePostData.trackViewsCallback;
  const { isSignedIn, user } = useUser();
  const hasReaction = postWithUser.reactions.length > 0;
  const [liked, setLiked] = useState(hasReaction);
  const [likeNumber, setNumber] = useState(postWithUser.likes);
  const [showComments, setShowComments] = useState(onPostPage);
  const { t, i18n } = useTranslation(["common", "footer"], {
    bindI18n: "languageChanged loaded",
  });

  const intl = useIntl();
  const formatter = Intl.NumberFormat(intl.locale,{notation: 'compact'})
  const [mouseDownPos, setMouseDownPos] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  const observerRef = intersectionObserver(() => {
    if (trackViewsCallBack) {
        trackViewsCallBack(postWithUser.id)
    }
  });


  // bindI18n: loaded is needed because of the reloadResources call
  // if all pages use the reloadResources mechanism, the bindI18n option can also be defined in next-i18next.config.js
  useEffect(() => {
    void i18n.reloadResources(i18n.resolvedLanguage, ["common", "footer"]);
    setTimeout(() => {
      if (loadingCompleteCallBack) {
        loadingCompleteCallBack();
      }
    }, 2000);
  }, []);

  const likePostMutation = api.posts.likePost.useMutation({
    onSuccess: () => {},
    onError: (error: any) => {
      toast.error("点赞失败");
      if (liked) {
        setNumber(likeNumber - 1);
      } else {
        setNumber(likeNumber + 1);
      }
      setLiked(!liked);
    },
  });

  let mediaFiles = mediaFilesString
    ? Array.from(JSON.parse(mediaFilesString))
    : [];

  function handleLikeClick() {
    if (!isSignedIn) {
      toast.error("login_before_like");
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
    if (onPostPage) return;
    setShowComments(!showComments);
  }

  const handleLike = (post: PostsWithUserData) => {
    likePostMutation.mutate({ postId: post.id });
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setMouseDownPos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    event.stopPropagation();

    const dx = event.clientX - mouseDownPos.x;
    const dy = event.clientY - mouseDownPos.y;

    // Only trigger the onClick event if the mouse has not moved significantly
    const isClick = Math.sqrt(dx * dx + dy * dy) < 5;
    if (!isClick) return;

    //检查他妈的点中的到底是什么东西
    const element = event.target as HTMLSelectElement;
    const name = element.getAttribute("name");
    if (name) {
      const clickableNames = [
        "image",
        "name",
        "username",
        "feedMenu",
        "avatar",
        "close",
      ];
      if (clickableNames.some((n2) => n2 === name)) {
        if (name === "image") element.click();
        return;
      }
    }

    if (!onPostPage) {
      window.open("/post/" + postWithUser.id, "_blank");
    }
  };

  const copyPostLink = async () => {
    let link = window.location.href;
    const hashIndex = link.indexOf("#");
    if (hashIndex !== -1) {
      link = link.slice(0, hashIndex);
    }
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      toast(t("link_copied"));
    }
    toast(t("link_copied"));
  };

  return (
    <>
      <Card
        size={"md"}
        className="my-1 flex-grow font-chinese"
        boxShadow={"lg"}
        bgColor={"te_dark_ui_bg"}
        textColor={"white"}
        shadow="lg"
        height={"auto"}
        pb="0"
      >
        <div className="group ">
          <CardHeader
            as="div"
            className="-pt-[30px] cursor-pointer group-hover:bg-te_dark_ui "
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
              <Flex flex="1" gap="4" alignItems="center" flexWrap="nowrap">
                <div>
                  {
                    <Link
                    //@ts-ignore
                      name="avatar"
                      href={
                        TE_Routes.userById.path + postWithUser.author.username
                      }
                      className="hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Avatar
                        className="transition-all duration-200 ease-in-out hover:border-4 hover:border-purple-500 rounded-full"
                        src={
                          postWithUser.author.profileImageUrl ??
                          "/images/default_profile.png"
                        }
                      />
                    </Link>
                  }
                </div>
                <Flex className="flex flex-row overflow-hidden overflow-ellipsis whitespace-nowrap">
                  <div className="ml-2 text-slate-50">
                    <Heading size="md">
                      {
                        <Link
                        //@ts-ignore
                        name="name"
                          href={
                            TE_Routes.userById.path +
                            postWithUser.author.username
                          }
                          className="hover:underline"
                        >
                          {postWithUser.author.displayname}
                        </Link>
                      }
                    </Heading>
                  </div>
                  {
                    <Link
                    //@ts-ignore
                      name="username"
                      href={
                        TE_Routes.userById.path + postWithUser.author.username
                      }
                      className="border-b-2 border-transparent hover:border-gray-400"
                    >
                      <div className="ml-2 text-slate-300">
                        {"@" + postWithUser.author.username}
                      </div>
                    </Link>
                  }{" "}
                  <div className=" ml-3 min-w-full truncate overflow-ellipsis whitespace-nowrap text-slate-300 sm:w-auto">
                    {GetTime({ date: postWithUser.createdAt })}
                  </div>
                </Flex>
              <div
                className="group/action ml-auto"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {user && (
                  <FeedActionMenu
                    postId={postWithUser.id}
                    canDeleteOrEdit={user.id === postWithUser.author.id}
                  />
                )}
              </div>
            </Flex>
          </CardHeader>
          <CardBody
            ref={observerRef} 
            as="div"
            pb={"0px"}
            pt={2}
            className="cursor-pointer overflow-hidden group-hover:bg-te_dark_ui"
            maxH={onPostPage ? "full" : "250px"}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <span className="font-chinese text-xl font-bold text-slate-100 shadow-none ">
              {renderAsHTML(postWithUser.content)}
            </span>
            <div
              className="grid 
             place-content-end justify-center text-accent-content "
            >
              {/* image display section */}
              <div className="mt-2 items-end">
                <ul
                  role="list"
                  className="grid auto-cols-auto grid-flow-col 
                  gap-x-1 gap-y-2 xl:gap-x-1"
                >
                  {mediaFiles.map((file, index) => {
                    //@ts-ignore
                    return (
                      <RenderImage
                        key={crypto.randomUUID()}
                    //@ts-ignore
                        type={file.type}
                    //@ts-ignore
                        url={file.url}
                        index={index}
                        onPostPage={onPostPage}
                      />
                    );
                  })}
                </ul>
              </div>
            </div>
          </CardBody>
          <CardFooter
            p="0"
            justify="space-between"
            flexWrap="nowrap"
            maxHeight={70}
            pt={3}
            className="cursor-pointer group-hover:bg-te_dark_ui"
            sx={{
              "& > button": {
                minW: "36px",
                pb: "0.3rem",
              },
            }}
          >
            <Button
              flex="1"
              className="group/feedbuton shrink p-0"
              variant="ghost"
              _hover={{ bg: "none", rounded: "none" }}
              onClick={handleLikeClick}
            >
              <div className="flex items-center justify-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35"
                strokeWidth={1}
                fill={liked ? "currentColor " : "none"}
                stroke={liked ? "none" : "white"}
                className={
                  "w-full pt-0.6 hover:stroke-indigo-500 " +
                  (liked
                    ? "fill-te_dark_liked"
                    : "group-hover/feedbuton:stroke-indigo-500")
                }
              >
                <path d="M12.0001 4.83594L5.79297 11.043L7.20718 12.4573L12.0001 7.66436L16.793 12.4573L18.2072 11.043L12.0001 4.83594ZM12.0001 10.4858L5.79297 16.6929L7.20718 18.1072L12.0001 13.3143L16.793 18.1072L18.2072 16.6929L12.0001 10.4858Z">
                </path></svg>
                <span className="group-hover/feedbuton:text-indigo-500">
                {likeNumber > 0 ? formatter.format(likeNumber) : ""}
                </span>
              </div>
            </Button>
            <Button
              flex="1"
              className="group/feedbuton shrink"
              variant="ghost"
              _hover={{ bg: "none", rounded: "none" }}
              onClick={() => showCommentClick()}
            >
              <div className="flex items-center justify-center space-x-3 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 group-hover/feedbuton:stroke-indigo-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 
                    0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
                <span className="-mt-1 group-hover/feedbuton:text-indigo-500">
                  {" "}
                  {postWithUser.commentCount > 0
                    ? formatter.format(postWithUser.commentCount) 
                    : ""}
                </span>
              </div>
            </Button>

            <Button
              flex="1"
              className="group/feedbuton shrink"
              variant="ghost"
              _hover={{ bg: "none", rounded: "none" }}
              onClick={() => copyPostLink()}
            >
              <div className="flex items-center justify-center space-x-3 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 group-hover/feedbuton:stroke-indigo-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                  />
                </svg>
              </div>
            </Button>

            <Button
              flex="1 "
              className="shrink"
              variant="ghost"
              textColor={"white"}
              gridGap={2}
              disabled={true}
              _hover={{}}
              pointerEvents={"none"}
            >
              <div className="flex flex-row fill-slate-400" >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="" width="30" height="30" 
              ><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg>
              <div className="pt-2 pl-1 text-slate-200">
              {formatter.format(postWithUser.ViewCount) }
              </div>
              </div>

            </Button>
          </CardFooter>
        </div>
        {showComments && (
          <Flex direction="column" p={6}>
            <HSeparator mb="20px" mt="-20px" />
            <Box>
              <CommentThread
                postId={postWithUser.id}
                topCommentsOnly={true}
                onPostPage={onPostPage}
              />
            </Box>

            {!onPostPage && (
              <Flex
                justify={"center"}
                mt="10px"
                mb="-15px"
                className="animate-bounce"
              >
                <div
                  onClick={() => setShowComments(!showComments)}
                  className="flex cursor-pointer gap-x-2 hover:text-te_dark_action"
                >
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
                  {t("fold")}
                </div>
              </Flex>
            )}
          </Flex>
        )}
      </Card>
    </>
  );
}

 function EndingMessage(message:string) {
  return (
    <div className="rounded-md bg-te_dark_ui p-4 z-40">
      <div className="flex">
      
        <div className="ml-3">
          <p className="text-sm font-medium text-slate-50">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
         
          </div>
        </div>
      </div>
    </div>
  )
}

export const EngineFeed = ({
  posts,
  isError,
  isLoading,
  fetchNewFeed,
  hasMore = false,
}: FeedProps) => {
  const { t } = useTranslation();
  const { addViewedId } = useViewTracker();

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full text-center text-slate-200">
        {t("no_data_found")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full text-center text-slate-200">
        {t("error_on_page")}
      </div>
    );
  }

  return (
    <div >
      <InfiniteScroll
      className="hide-scrollbar"
        dataLength={posts.length}
        next={fetchNewFeed}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
        endMessage={
          EndingMessage(t('end_of_scroll'))
         }
      >
       {posts.map((p) => {
        return <SingleFeed key={p.id} postWithUser={p} onPostPage={false} trackViewsCallback={addViewedId} />;
      })}
      </InfiniteScroll>
    

    </div>
  );
};

export default EngineFeed;

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "footer"], i18n)),
  },
});
