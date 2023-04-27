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

const handleLike = (user: PostsWithUserData) => {
  // setTweets(tweets.map(tweet => tweet.tweetId === tweetId ? { ...tweet, likes: tweet.likes + 1 } : tweet));
  alert('!!')
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


const SingleFeed = (singlePostData: SingleFeedProps) => {
  const postWithUser = singlePostData.postWithUser;
  const filesContent = [1,1,1,1,1,1];
  return (
    <>
<Card size={'md'} className='mx-20 my-5 font-chinese'
  cursor="pointer"
  _hover={{
    bgGradient: 'linear(to-tr, gray.700, purple.800)',
  }}
  _active={{
    bgGradient: 'linear(to-bl, gray.700, purple.800)',
  }}

bgColor={'gray.700'} textColor={'white'} rounded={'2xl'}  shadow='lg' pb='0' > 
  <CardHeader>
    <Flex spacing='4' alignItems={'top'}>
      <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
        <Avatar name='Segun Adebayo' src={postWithUser.author.profileImageUrl} />
        <Box>
          <Heading size='md'>{postWithUser.author.displayname}</Heading>
          <Text textColor={'gray.400'} >{'@'+ postWithUser.author.username}</Text>
        </Box>
        <Text mt='-23px'>
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
  <CardBody   pb='0' pt='0'>
    <Text>
    {postWithUser.content}     
    </Text>
  <div className='flex '>

  <div className="grid justify-center w-full h-auto rounded bg-accent text-accent-content place-content-end items-end">
          {/* image display section */}
          <div className="sm:p-6 mt-auto items-end">
            <ul role="list" className="grid grid-cols-2 gap-x-1 gap-y-1 sm:grid-cols-3 sm:gap-x-1 lg:grid-cols-4 xl:gap-x-1 items-end">
              {filesContent.map((file, index) => (
                <li key={index} className="relative">
                  <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                    <Image
                        objectFit='cover'
                        minH={30}
                        minW={30}
                        maxWidth={'auto'}
                        maxHeight={'auto'}
                        src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                        alt='Chakra UI'
                      />
                    <button type="button" className="absolute inset-0 focus:outline-none">
                      <span className="sr-only">View details for </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
      </div>    
  </div>


  </CardBody>

  
  <CardFooter
    p='0'
    justify='space-between'
    flexWrap='nowrap'
    mt='0'
    maxHeight={70}
    sx={{
      '& > button': {
        minW: '36px',
        pb:'0.3rem'
      },
    }}
  >
    <Button flex='1' className='shrink' variant='ghost' leftIcon={<BsHandThumbsUp />} _hover={{ bg: 'gray.600' }}
     onClick={() =>handleLike(postWithUser)}> 
      {postWithUser.likes > 0 ? postWithUser.likes : ""}
    </Button>
    <Button flex='1' className='shrink' variant='ghost' leftIcon={<BsChat />} _hover={{ bg: 'gray.600' }}
     onClick={() =>handleComment(postWithUser)}>
      {postWithUser.commentCount > 0 ? postWithUser.commentCount : ""}
    </Button>

    <Button flex='1 'className='shrink' variant='ghost' textColor={'gray.300'}  gridGap={2} 
    disabled={true} _hover={{}} pointerEvents={'none'}>
        <div><svg xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg></div>
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
