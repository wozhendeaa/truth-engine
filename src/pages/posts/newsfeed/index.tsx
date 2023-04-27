
// Chakra imports
import { Flex, Text, useColorModeValue, Box } from '@chakra-ui/react';

// Assets
import postImage from '~/assets/img/profile/postImage.png';
import avatar10 from '~/assets/img/avatars/avatar10.png';
import avatar2 from '~/assets/img/avatars/avatar2.png';
import avatar4 from '~/assets/img/avatars/avatar4.png';
// Custom components
import { VSeparator } from '~/components/separator/Separator';
import Stories from './components/Stories';
import Post from './components/Post';
import Comment from '~/components/dataDisplay/Comment';
import Filter from './components/Filter';
import { api } from '~/utils/api';
import { LoadingSpinner } from '~/components/loading';

export default function Newsfeed() {
	// Chakra color mode
	const textColor = useColorModeValue('gray.700', 'white');
	const paleGray = useColorModeValue('secondaryGray.400', 'whiteAlpha.100');
	const {data, isLoading: postsLoding} = api.posts.getAll.useQuery();
	
	if (postsLoding) return <LoadingSpinner />
	if (!data) return <div>没有找到任何消息</div>
	
	return (
		<></>
	)

	
	
}
