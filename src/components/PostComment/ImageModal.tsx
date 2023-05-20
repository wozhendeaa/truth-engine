import Image from 'next/image'
import {  Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react';


export default function ImageModal(props:  {url: string, open: boolean, close: () => void}) {
  const { url, open, close } = props;
  return (
    <>
      <Modal  isOpen={open} onClose={close} isCentered={true} size={'5xl'}>
        <ModalOverlay 
            bg='none'
            pointerEvents="auto"
            backdropFilter='auto'
            backdropBlur='12px'
        />
        <ModalContent padding={0}  bg={'none'} 
           pointerEvents="auto"
    containerProps={{ pointerEvents: "auto" }} >
          <ModalCloseButton 
         
          rounded={'full'}          
          bg={'white'}
            >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
           </ModalCloseButton>
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
