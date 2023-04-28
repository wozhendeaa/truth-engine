import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, IconButton, Text, Image} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsThreeDotsVertical, BsHandThumbsUp, BsChat, BsViewList } from 'react-icons/bs';

import { appRouter } from '../server/api/root';
import { RouterOutputs } from '~/utils/api';
import Comment from '~/components/dataDisplay/Comment';
import { Post, User } from '@prisma/client';
import relativetTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs"

dayjs.extend(relativetTime);

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

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



const handleLike = (user: PostsWithUserData) => {
  // setTweets(tweets.map(tweet => tweet.tweetId === tweetId ? { ...tweet, likes: tweet.likes + 1 } : tweet));

};

const handleRepost = (user: PostsWithUserData) => {

};

// const handleBookmark = (id: String) => {
//   setTweets(tweets.map(tweet => tweet.tweetId === tweetId ? { ...tweet, bookmarks: tweet.bookmarks + 1 } : tweet));
// };

const handleComment = (user: PostsWithUserData) => {
  // Implement commenting functionality here
};

const handleShare = (user: PostsWithUserData) => {
  // Implement share functionality here
};


type PostsWithUserData = RouterOutputs["posts"]["getAll"][number]
interface SingleFeedProps {
  postWithUser: PostsWithUserData;
}

interface FeedProps {
  posts: PostsWithUserData[];
}


function renderImages(type: string, url: string, index: any) {
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
  <CardBody   pb='0' pt='0' >
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
     variant='ghost' leftIcon={<BsHandThumbsUp />} _hover={{ bg: 'gray.600' }}
     onClick={() =>handleLike(postWithUser)}> 
      {postWithUser.likes > 0 ? postWithUser.likes : ""}
    </Button>
    <Button flex='1' className='shrink' variant='ghost' leftIcon={<BsChat />} _hover={{ bg: 'gray.600' }}
     onClick={() =>handleComment(postWithUser)}>
      {postWithUser.commentCount > 0 ? postWithUser.commentCount : ""}
    </Button>

    <Button flex='1 'className='shrink' variant='ghost' textColor={'gray.300'}  gridGap={2} 
    disabled={true} _hover={{}} pointerEvents={'none'}>
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
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

  if (!postData.posts || postData.posts.length === 0) {
    return (
      <div className='text-center text-slate-200'>no data found</div>
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
