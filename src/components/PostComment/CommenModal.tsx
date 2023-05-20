import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  UseDisclosureProps,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { api } from "utils/api";
import { parseErrorMsg } from "helpers/serverErrorMessage";
import TruthEngineEditor from "components/TipTap/TruthEngineEditor";
import { FileContent } from "use-file-picker";


export default function CommentModal(props: {
  replyToCommentId: string;
  postId: string;
  disc: UseDisclosureProps;
  commentCallback: (onPostPage: boolean, postId: string) => Promise<void>;
}) {

  const { replyToCommentId, disc } = props;
  const { isOpen, onOpen, onClose } = disc;
  const { t } = useTranslation();
  const { isSignedIn } = useUser();
  const ctx = api.useContext();
  const {mutate, data} = api.comment.createCommentReply.useMutation({});

  function setError(err: string) {


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
      // const keys = await uploadToS3();
    } catch (cause) {
      setError("图片上传失败，可能是网络问题");
    }
    try {
      let result = false;
      const promise = new Promise<void>((resolve) => {
        mutate(
          {
            content: JSON.stringify(editor.getJSON()),
            replyToCommentId: replyToCommentId,
          },
          {
            onSuccess: () => {
              void ctx.comment.getCommentsForComment.invalidate();
              editor.commands.setContent(null);
              editor.setEditable(true);
              result = true;
              resolve();
              toast(t("post_good"));
            },
            onError: (e) => {
              const err = parseErrorMsg(e);
              console.log(e);
              toast.error(t(err));
              resolve();
            },
          }
        );
      });

      await promise;
      await props.commentCallback(true, props.postId);
      setDisableSend(false);
      if (onClose)
        onClose();
      return result;
    } catch (cause) {
      console.log(cause);
      setError("发表信息失败，可能是网络问题");
      return false;
    }
    
  }

  function OnLoad(editor: any) {
    if (!editor) return;
     editor.chain().focus().run();
    
  }

  return (
    <>
      <Modal isOpen={isOpen!} onClose={onClose!}>
      <ModalOverlay 
            bg='none'
            pointerEvents="auto"
            backdropFilter='auto'
            backdropBlur='12px'
        />
        <ModalContent padding={0}  bg={'none'} 
           pointerEvents="auto"
    containerProps={{ pointerEvents: "auto" }} >
          <ModalBody>
            <TruthEngineEditor editorType={"COMMENT_TALL"} onSend={OnSend} onLoad={OnLoad} />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
