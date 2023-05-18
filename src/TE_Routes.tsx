import { Icon } from '@chakra-ui/react';
import { MdDashboard, MdHome, MdLock, MdOutlineShoppingCart } from 'react-icons/md';

// Admin Imports
import DashboardsDefault from 'views/admin/dashboards/default';


// Main Imports
import AccountBilling from 'views/admin/main/account/billing';
import AccountApplications from 'views/admin/main/account/application';
import AccountInvoice from 'views/admin/main/account/invoice';
import AccountSettings from 'views/admin/main/account/settings';
import AccountAllCourses from 'views/admin/main/account/courses';
import AccountCoursePage from 'views/admin/main/account/coursePage';

import UserNew from 'views/admin/main/users/newUser';
import UsersOverview from 'views/admin/main/users/overview';
import UsersReports from 'views/admin/main/users/reports';

import ProfileSettings from 'views/admin/main/profile/settings';
import ProfileOverview from 'views/admin/main/profile/overview';
import ProfileNewsfeed from 'views/admin/main/profile/newsfeed';

import ApplicationsDataTables from 'views/admin/main/applications/dataTables';
import ApplicationsCalendar from 'views/admin/main/applications/calendar';
// Others
import OthersNotifications from 'views/admin/main/others/notifications';
import OthersPricing from 'views/admin/main/others/pricing';
import OthersError from 'views/admin/main/others/404';
import Messages from 'views/admin/main/others/messages';
import Trending from 'views/admin/main/profile/newsfeed/components/Trending';
import { BellIcon, FireIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ProfileIcon } from 'components/icons/Icons';

// Auth Imports

const TE_Routes = {
	//---posts -----
	postbyid: {
		name:"post_by_id",
		path: '/post/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		collapse: true,
	},

	//---users -----
	myProfile: {
		name:"profile_page",
		path:'/myprofile/',
		icon: <Icon as={ProfileIcon}  width={{base:12, md: 10, lg:7}} height={{base:12,md: 10, lg:7}}  color='inherit' />,

	},	
	userById: {
		name:"user_by_id",
		path:'/user/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		
	},	
	NewAccountSetup: {
		name:"new_account_setup",
		path:'/NewAccountSetup/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,

	},
	PrepareNewUser: {
		name:"prep_new_user",
		path:'/api/prepareNewUser/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,

	},
	Register: {
		name:"register",
		path:'/api/prepareNewUser/register/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,

	},

	//---public page navigation -----
	Index: {
		name:'index',
		path:'/',
		icon: <Icon as={MdHome}  width={{base:12,md: 10, lg:7}} height={{base:12,md: 10, lg:7}} color='inherit' />,

	},
	ProfessorVideos: {
		name:'professor_videos',
		path:'/professor-videos/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,

	},
	NaturalHealing: {
		name:'natural_healing',
		path:'/natural-healing/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,

	},
	RedPillAcademy: {
		name:'redpill_academy',
		path:'/red-pill-academy/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,

	},
	FAQ: {
		name:'faq',
		path:'/faq/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,

	},

     //--- index sidebar menu  -----
	Trending: {
		name:"trending",
		path:'/trending/',
		icon: <Icon as={FireIcon} width={{base:12,md: 10, lg:7}} height={{base:12,md: 10, lg:7}} color='inherit' />,

	},

	IndexNotification: {
		name:'notification',
		path:'/notification/',
		icon: <Icon as={BellIcon} width={{base:12,md: 10, lg:7}} height={{base:12,md: 10, lg:7}} color='inherit' />,

	},

	WriteLongPost: {
		name:'write_long_post',
		path:'/write-long-post/',
		icon: <Icon as={PencilIcon} width={{md: 0, lg:7}} height={{md: 10, lg:7}}  color='inherit' />,

	},


};

export default TE_Routes;
