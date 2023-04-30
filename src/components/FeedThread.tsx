import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Text, Image, useColorMode } from '@chakra-ui/react';
import React, { useReducer, useState } from 'react';
import { BsThreeDotsVertical, BsHandThumbsUp, BsChat, BsViewList, BsCircleFill } from 'react-icons/bs';

import { appRouter } from '../server/api/root';
import { RouterOutputs, api } from 'utils/api';
import Comment from 'components/dataDisplay/Comment';
import { Post, User } from '@prisma/client';
import relativetTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs"

dayjs.extend(relativetTime);

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ImageModal from './ImageModal';
import { useTranslation } from 'react-i18next';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
  };

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % images.length);
  };

  return (
    <div className="relative">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt=""
          className={`absolute w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-md text-gray-800 hover:bg-opacity-75 focus:outline-none"
        onClick={prevImage}
      >
        <FiChevronLeft />
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-md text-gray-800 hover:bg-opacity-75 focus:outline-none"
        onClick={nextImage}
      >
        <FiChevronRight />
      </button>
      <div className="absolute top-2 right-2 bg-white bg-opacity-50 p-2 rounded-md text-gray-800">
        {currentImage + 1}/{images.length}
      </div>
    </div>
  );
};





const handleRepost = (post: PostsWithUserData) => {

};

// const handleBookmark = (id: String) => {
//   setTweets(tweets.map(tweet => tweet.tweetId === tweetId ? { ...tweet, bookmarks: tweet.bookmarks + 1 } : tweet));
// };

const handleComment = (post: PostsWithUserData) => {
  // Implement commenting functionality here
};

const handleShare = (post: PostsWithUserData) => {
  // Implement share functionality here
};


type PostsWithUserData = RouterOutputs["posts"]["getAll"][number]
interface SingleFeedProps {
  postWithUser: PostsWithUserData;
}

interface FeedProps {
  posts: PostsWithUserData[];
}


interface SetImageState {
  state: boolean;
}




function renderImages(type: string, url: string, index: any) {
  const [open, setOpen] = useState(false);
  
  const showModal = () => {
    setOpen(true);
  };
  
  const closeModal = () => {
    setOpen(false);
  };

  if (type === 'image') {
    return (<li key={index} className="relative">
    <div className="group flex-grow block w-full  rounded-lg
     bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2
      focus-within:ring-offset-gray-100">
         <Image
          objectFit='cover'
          src={url}
          alt=''
          className='pointer-events-none object-cover max-h-full group-hover:opacity-75'
        />
        <button type="button" className="absolute inset-0 focus:outline-none" 
                   onClick={() => {showModal()}}>
              <span className="sr-only"> </span>
        </button>
        
        {open && 
        //@ts-ignore
        <ImageModal url={url} open={open} close={closeModal}/>}
    </div>
  </li>)

  } else {
    return null;
  }
}


const SingleFeed = (singlePostData: SingleFeedProps) => {
  
  const postWithUser = singlePostData.postWithUser;
  const mediaStr = singlePostData.postWithUser.media;
  let media = mediaStr ? Array.from(JSON.parse(mediaStr)) : [];

  const hasReaction = postWithUser.reactions.length ?? false;
  const [liked, setLiked] = useState(hasReaction);
  const [likeNumber, setNumber] = useState(postWithUser.likes);
  const likePostMutation = api.posts.likePost.useMutation({
    onSuccess: () => {
      if (liked) {
        setNumber(likeNumber - 1);
      } else {
        setNumber(likeNumber + 1);      
      }
      
      setLiked(!liked);
    },
  });

  function handleLikeClick() {
    handleLike(postWithUser);
  }


  const handleLike = (post: PostsWithUserData) => {
    // setTweets(tweets.map(tweet => tweet.tweetId === tweetId ? { ...tweet, likes: tweet.likes + 1 } : tweet));
    likePostMutation.mutate({postId: post.id})
  }
 
  return (
    <>
<Card size={'md'} className='mx-5 my-1 font-chinese flex-grow '
  cursor="pointer"
  _hover={{
    bgGradient: 'linear(to-tr, gray.700, violet.800)',
  }}
  _active={{
    bgGradient: 'linear(to-bl, gray.700, violet.800)',
  }}

bgColor={'te_dark_bg.7'} textColor={'te_dark_text.1'} rounded={'2xl'}  shadow='lg' pb='0' > 
  <CardHeader>
    <Flex alignItems={'top'}>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar src={postWithUser.author.profileImageUrl ?? "/images/default_profile.png"} />
        <Box>
          <Heading size='md'>{postWithUser.author.displayname}</Heading>
          <Text textColor={'gray.400'} >{'@'+ postWithUser.author.username}</Text>
        </Box>
        <Text mt={{ base: 0, md: '-33px'}}>
          {dayjs(postWithUser.createdAt).fromNow()}
        </Text>
      </Flex>
      <IconButton
        variant='ghost'
        colorScheme='gray'
        aria-label='See menu'
        _hover={{ bg: 'gray.600' }}
        icon={<BsThreeDotsVertical />}
      />
    </Flex>
  </CardHeader>
  <CardBody  pb={{base: '6', sm:'6', md: '0'}} pt='0'  >
    <span className='font-chinese text-xl font-bold text-slate-100 shadow-none ' >
    {postWithUser.content}     
    </span>

  <div className="grid justify-center  rounded bg-accent text-accent-content place-content-end ">
          {/* image display section */}
          <div className="sm:p-6 mt-auto items-end ">
            <ul role="list" className="grid grid-flow-col auto-cols-auto gap-x-1 gap-y-2 xl:gap-x-1">
              {media.map((file, index) => {
                //@ts-ignore
                return renderImages(file.type, file.url, index)
              })}
            </ul>
          </div>
      </div>    
  </CardBody>

  <CardFooter
    p='0'
    justify='space-between'
    flexWrap='nowrap'
    mt='-5'
    maxHeight={70}
    sx={{
      '& > button': {
        minW: '36px',
        pb:'0.3rem'
      },
    }}
  >
    <Button flex='1' className='shrink' 
     variant='ghost'  _hover={{ bg: 'gray.600' }} 
     onClick={() =>handleLikeClick()}> 
      <div className='flex items-center justify-center space-x-3'>
      <svg xmlns="http://www.w3.org/2000/svg" fill={liked? 'currentColor ' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} 
        stroke={liked ? 'grey' : 'white' } className={"w-full h-6 hover:animate-ping " + (liked ? ' text-lime-300' : '')}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
        </svg>
      <span>{likeNumber > 0 ? likeNumber : ""}</span>
      </div>
    </Button>
    <Button flex='1' className='shrink' variant='ghost'_hover={{ bg: 'gray.600' }}
     onClick={() =>handleComment(postWithUser)}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
</svg>
      {/* {postWithUser.commentCount > 0 ? postWithUser.commentCount : ""} */}
    </Button>
    

    <Button flex='1 'className='shrink' variant='ghost' textColor={'gray.300'}  gridGap={2} 
    disabled={true} _hover={{}} pointerEvents={'none'}>
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
</svg>

     </div>
       <div>{postWithUser.ViewCount > 0 ? postWithUser.ViewCount : "17"}</div>
    </Button>
  </CardFooter>
</Card>
    </>
  );
};



export const FeedThread = (postData: FeedProps) => {
  const {t} = useTranslation();

  if (!postData.posts || postData.posts.length === 0) {
    return (
      <div className='text-center text-slate-200'>{t('no_data_found')}</div>
    )
  }

  return (

    <div>
      {postData.posts?.map((p) => (
        <SingleFeed key={p.id} postWithUser={p}/>
      ))}
    </div>
  );
};

export default FeedThread;
