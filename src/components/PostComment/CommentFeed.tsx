import { Box, Flex, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React, { useContext, useState } from "react";

import { RouterOutputs, api } from "utils/api";
import { setErrors } from "Redux/truthEditorSlice";



import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import TE_Routes from "TE_Routes";
import TEComment from "components/dataDisplay/TE_Comment";
import { FileContent } from "use-file-picker";
import { useAppDispatch } from "Redux/hooks";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import UserContext from "helpers/userContext";
import Image from 'next/image'
import TruthEngineEditor from "components/TipTap/TruthEngineEditor";
import { GetTime } from "helpers/UIHelper";

type CommentsWithUserData = RouterOutputs["comment"]["getCommentsForPost"];

export const CommentThread = (props: {
  postId: string;
  topCommentsOnly: boolean;
  onPostPage: boolean;
  
}) => {
  
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const {mutate, isLoading:isPosting} = api.comment.createPostComment.useMutation();
  const dispatch = useAppDispatch();
  const ctx = api.useContext();
  const user = useContext(UserContext);
  let limit = props.topCommentsOnly ? 3 : 50;

  const { data, isLoading } = api.comment.getCommentsForPost.useQuery({
    postId: props.postId,
    limit: limit,
  });
  const comments = data?.props.comments;

  function setError(err: string) {
    dispatch(setErrors(err));
}

const CommentBox = ()=> {
    return  (
      <>
      {user && (
        <Flex className="pt-3">
        <Box flex="none">
        <Image
          src={user.profileImageUrl ?? "/images/default_profile.png"}
          alt=""
          width="50"
          height="50"
          className="flex-none shrink-0 rounded-full p-2"
        />
        </Box>
        <Box className="float-left w-full" style={{ maxWidth: `calc(100% - 50px)` }}>
          <TruthEngineEditor editorType={"COMMENT"} onSend={OnSend}  />
        </Box>
        </Flex>
      )}
      </>
    ) 
}

  //being called by the editor when uploading content
  async function OnSend(
    editor: any,
    mediaFiles:FileContent[],
    setDisableSend: React.Dispatch<React.SetStateAction<boolean>>
    ) {
      if (!isSignedIn) {
        toast("login_before_comment");
        return false;
      }

      try {
          let result = false
          const promise = new Promise<void>((resolve) => {
          mutate(
            {
              content: JSON.stringify(editor.getJSON()),
              replyToPostId: props.postId
            },
            {
              onSuccess: () => {
                void ctx.comment.getCommentsForPost.invalidate();
                editor.commands.setContent(null);
                editor.setEditable(true);
                result = true;
                resolve();
                toast(t('post_good'));
              },
              onError: (e) => {
                const errorMessage = e.data?.code;
                console.log(errorMessage);
                if (errorMessage) {
                  setErrors(t(errorMessage));
                }     
                resolve();         
              },
            }
          );
        });
  
        await promise;
        setDisableSend(false)
        return result;
      } catch (cause) {
        console.log(cause);
        setError("发表信息失败，可能是网络问题");
        return false;
      } 
      
    }
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
      <>
      <div className="text-center text-slate-200">{t("no_comments_found")}</div>
      <CommentBox />
      </>
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
          time={c.createdAt}
          likes={c.likes}
          commentNum={c.commentCount}
          likedByUser={c.reactions}
          isFirstLevel={true}     
          authorId={c.authorId} 
          replyToPostId={c.replyToPostId ?? ""}
			  	onPostPage={props.onPostPage}
        />
      ))}
      {
        !props.onPostPage && comments.length > 3 && 
        <Flex justify={"center"} mt={-10} className=" ">
          <div className="flex gap-x-2 text-lg cursor-pointer hover:text-te_dark_action">
            <Link target="_blank" href={TE_Routes.postbyid.path + props.postId} > 
              {t("see_all_comments")}
           </Link>
          </div>
        </Flex>
      }
      <CommentBox />
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
