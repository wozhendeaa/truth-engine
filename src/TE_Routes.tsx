// Admin Imports
import { BellIcon, FireIcon, PencilIcon, HomeIcon, ArrowTrendingUpIcon, UserCircleIcon } from '@heroicons/react/24/outline';

// Auth Imports

const TE_Routes = {
	//---posts -----
	postbyid: {
		name:"post_by_id",
		path: '/post/',
		// icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		collapse: true,
	},
	uploadPicture: {
		name:'',
		path: '/api/upload/processMediaUpload?fileType=',
		// icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
	},

	trackViews: {
		name:'',
		path: '/api/PostComment/trackViews',
		// icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
	},

	//---users -----
	myProfile: {
		name:"profile_page",
		path:'/myprofile/',
		// icon: <Icon as={ProfileIcon}  width={{base:12, md: 10, lg:7}} height={{base:12,md: 10, lg:7}}  color='inherit' />,
		icon: <UserCircleIcon className='md:w-10 md:h-10 lg:h-7 lg:w-7' color='inherit' />,

	},	
	userById: {
		name:"user_by_id",
		path:'/user/',
		// icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		
	},	
	NewAccountSetup: {
		name:"new_account_setup",
		path:'/NewAccountSetup/',
		// icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,

	},
	PrepareNewUser: {
		name:"prep_new_user",
		path:'/api/prepareNewUser/',
		// icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,

	},
	Register: {
		name:"register",
		path:'/api/prepareNewUser/register/',

	},
	getLoggedInUser: {
		name:"getLoggedInUser",
		path:'/api/user/getLoggedInUser',
		icon: <></>,
	},

	//---public page navigation -----
	Index: {
		name:'index',
		path:'/',
		icon: <HomeIcon className='md:w-10 md:h-10 lg:h-7 lg:w-7'  />,
	},
	ProfessorVideos: {
		name:'professor_videos',
		path:'/professor-videos/',

	},
	NaturalHealing: {
		name:'natural_healing',
		path:'/natural-healing/',

	},
	RedPillAcademy: {
		name:'redpill_academy',
		path:'/red-pill-academy/',

	},
	FAQ: {
		name:'faq',
		path:'/faq/',

	},

     //--- index sidebar menu  -----
	Trending: {
		name:"trending",
		path:'/trending/',
		icon: <ArrowTrendingUpIcon className='md:w-10 md:h-10 lg:h-7 lg:w-7' color='inherit' />,

	},

	IndexNotification: {
		name:'notification',
		path:'/notification/',
		icon: <BellIcon className='md:w-10 md:h-10 lg:h-7 lg:w-7' color='inherit' />,
		hasBadge:true,
	},

	WriteLongPost: {
		name:'write_long_post',
		path:'/write-long-post/',
		icon: <PencilIcon className='md:w-10 md:h-10 lg:h-7 lg:w-7' color='inherit' />,

	},


};


export default TE_Routes;
