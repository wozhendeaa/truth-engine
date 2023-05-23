import React from "react";

import { RouterOutputs, api } from "utils/api";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TEComment from "components/dataDisplay/TE_Comment";

type commentsData = RouterOutputs["comment"]["getCommentsForUser"];

export const GeneralCommentThread = (props: {
  comments: commentsData  
}) => {
  const { t } = useTranslation();
  const comments = props.comments.comments;

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center text-slate-200" >{t("no_comments_found")}</div>
    );
  }

  function goToCommentPost(postId:string | undefined, commentId:string | undefined) {
    window.open("/post/" + postId + "#" + commentId, "_blank");
  }


  return (
    <div >
      {comments.map((c) => (
        <div className="cursor-pointer hover:bg-te_dark_ui" 
        key={c.id + '1'}
        onClick={()=>{goToCommentPost(c.post?.id, c.id)}}>
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
          authorId={c.authorId}
          isFirstLevel={true}      
			  	onPostPage={false}
        />
        </div>
      ))}
     
    </div>
  );
};

export default GeneralCommentThread;

const i18n = require('next-i18next.config');
export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'footer'], i18n)),
  },
});
