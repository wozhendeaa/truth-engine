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

// Auth Imports

const TE_Routes = {
	//---posts -----
	postbyid: {
		path: '/post/',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		collapse: true,
	},

	//---users -----
	myProfile: {
		path:'/myprofile/'
	},	
	userById: {
		path:'/user/'
	},	
	NewAccountSetup: {
		path:'/NewAccountSetup/'
	},
	PrepareNewUser: {
		path:'/api/prepareNewUser/'
	},
	Register: {
		path:'/api/prepareNewUser/register/'
	},

	//---public page navigation -----
	Index: {
		path:'/'
	},
	ProfessorVideos: {
		path:'/professor-videos'
	},
	NaturalHealing: {
		path:'/natural-healing'
	},
	RedPillAcademy: {
		path:'/red-pill-academy'
	},
	FAQ: {
		path:'/faq'
	},
};

export default TE_Routes;
