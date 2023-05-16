import Image from 'next/image'
import {  Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Textarea, UseDisclosureProps, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { api } from 'utils/api';
import { parseErrorMsg } from 'server/helpers/serverErrorMessage';


export default function CommentModal(props:  {replyToCommentId: string,
   disc: UseDisclosureProps}) {
  const { replyToCommentId, disc } = props;
  const { isOpen, onOpen, onClose } = disc
  const {t} = useTranslation();
  const [comment, SetComment] = useState("");
  const {isSignedIn} = useUser();
  const ctx = api.useContext();  


  const commentMutation = api.comment.createCommentReply.useMutation({
    onSuccess: (data) => {
      void ctx.comment.getCommentsForComment.invalidate();
    },
    onError: (e: any)=> {
        const err = parseErrorMsg(e);
        toast.error(t(err));
    }
  });
  
  function handleChangeEvent(e:ChangeEvent<HTMLTextAreaElement>) {
    SetComment(e.target.value);
  }

  function makeComment() {
    if (!isSignedIn) {
      toast('login_before_comment');
      return;
    }

    commentMutation.mutate({
      content: comment,      
      replyToCommentId: replyToCommentId,
    });
  }

  return (
    <>
     <Modal isOpen={isOpen!} onClose={onClose!}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Textarea 
              rows={3}
              onChange={handleChangeEvent}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" onClick={makeComment}>{t('post')}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
