import Image from 'next/image'
import {  Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react';


export default function ImageModal(props:  {url: string, open: boolean, close: () => void}) {
  const { url, open, close } = props;
  return (
    <>
      <Modal isOpen={open} onClose={close} isCentered={true} size={'5xl'}>
        <ModalOverlay 
            bg='none'
            backdropFilter='auto'
            backdropBlur='2px'
        />
        <ModalContent padding={0}  bg={'none'}>
          <ModalCloseButton 
          rounded={'full'}
          bg={'white'}
           />
          <ModalBody>
            <Image 
            src={url}
            height={1080}
            width={1920}
            alt=''   
            loading='eager'          
          />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
