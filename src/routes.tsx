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
import ForgotPasswordCentered from 'views/auth/forgotPassword/ForgotPasswordCentered';
import ForgotPasswordDefault from 'views/auth/forgotPassword/ForgotPasswordDefault';
import LockCentered from 'views/auth/lock/LockCentered';
import LockDefault from 'views/auth/lock/LockDefault';
import SignInCentered from 'views/auth/signIn/SignInCentered';
import SignInDefault from 'views/auth/signIn/SignInDefault';
import SignUpCentered from 'views/auth/signUp/SignUpCentered';
import SignUpDefault from 'views/auth/signUp/SignUpDefault';
import VerificationCentered from 'views/auth/verification/VerificationCentered';
import VerificationDefault from 'views/auth/verification/VerificationDefault';

const routes = [
	// --- Dashboards ---
	{
		name: 'Dashboards',
		path: '/dashboards',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		collapse: true,
		items: [
			{
				name: 'Main Dashboard',
				layout: '/admin',
				path: '/dashboards/default',
				component: DashboardsDefault
			},
		
		]
	},
	
	// // --- Main pages ---
	{
		name: 'Main Pages',
		path: '/main',
		icon: <Icon as={MdDashboard} width='20px' height='20px' color='inherit' />,
		collapse: true,
		items: [
			{
				name: 'Account',
				path: '/main/account',
				collapse: true,
				items: [
					{
						name: 'Billing',
						layout: '/admin',
						path: '/main/account/billing',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Application',
						layout: '/admin',
						path: '/main/account/application',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Invoice',
						layout: '/admin',
						path: '/main/account/invoice',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Settings',
						layout: '/admin',
						path: '/main/account/settings',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'All Courses',
						layout: '/admin',
						path: '/main/account/all-courses',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Course Page',
						layout: '/admin',
						path: '/main/account/course-page',
						exact: false,
				component: DashboardsDefault
			}
				]
			},
	
			{
				name: 'Users',
				path: '/main/users',
				collapse: true,
				items: [
					{
						name: 'New User',
						layout: '/admin',
						path: '/main/users/new-user',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Users Overview',
						layout: '/admin',
						path: '/main/users/users-overview',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Users Reports',
						layout: '/admin',
						path: '/main/users/users-reports',
						exact: false,
				component: DashboardsDefault
			}
				]
			},
			{
				name: 'Applications',
				path: '/main/applications',
				collapse: true,
				items: [
				
					{
						name: 'Data Tables',
						layout: '/admin',
						path: '/main/applications/data-tables',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Calendar',
						layout: '/admin',
						path: '/main/applications/calendar',
						exact: false,
				component: DashboardsDefault
			}
				]
			},
			{
				name: 'Profile',
				path: '/main/profile',
				collapse: true,
				items: [
					{
						name: 'Profile Overview',
						layout: '/admin',
						path: '/main/profile/overview',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Profile Settings',
						layout: '/admin',
						path: '/main/profile/settings',
						exact: false,
					},
					{
						name: 'News Feed',
						layout: '/admin',
						path: '/main/profile/newsfeed',
						exact: false,
				component: DashboardsDefault
			}
				]
			},
			{
				name: 'Others',
				path: '/main/others',
				collapse: true,
				items: [
					{
						name: 'Notifications',
						layout: '/admin',
						path: '/main/others/notifications',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Pricing',
						layout: '/auth',
						path: '/main/others/pricing',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: '404',
						layout: '/admin',
						path: '/main/others/404',
						exact: false,
				component: DashboardsDefault
			},
					{
						name: 'Messages',
						layout: '/admin',
						path: '/main/others/messages',
						exact: false,
				component: DashboardsDefault
			}
				]
			}
		]
	},
	// --- Authentication ---
	{
		name: 'Authentication',
		path: '/auth',
		icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
		collapse: true,
		items: [
			// --- Sign In ---
			{
				name: 'Sign In',
				path: '/sign-in',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/sign-in/default',
					},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/sign-in/centered',
					}
				]
			},
			// --- Sign Up ---
			{
				name: 'Sign Up',
				path: '/sign-up',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/sign-up/default',
						componet: SignUpDefault
					},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/sign-up/centered',
				component: DashboardsDefault
			}
				]
			},
			// --- Verification ---
			{
				name: 'Verification',
				path: '/verification',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/verification/default',
				component: DashboardsDefault
			},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/verification/centered',
				component: DashboardsDefault
			}
				]
			},
			// --- Lock ---
			{
				name: 'Lock',
				path: '/lock',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/lock/default',
				component: DashboardsDefault
			},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/lock/centered',
				component: DashboardsDefault
			}
				]
			},
			// --- Forgot Password ---
			{
				name: 'Forgot Password',
				path: '/forgot-password',
				collapse: true,
				items: [
					{
						name: 'Default',
						layout: '/auth',
						path: '/forgot-password/default',
				component: DashboardsDefault
			},
					{
						name: 'Centered',
						layout: '/auth',
						path: '/forgot-password/centered',
				component: DashboardsDefault
			}
				]
			}
		]
	}
];

export default routes;
