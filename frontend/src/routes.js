import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavBar from './components/utilities/NavBar';
import Home from './components/publicStatic/home/Home';
import SignUpPage from './components/publicStatic/signup/SignUpPage';
import ConfirmEmail from './components/user/maintenance/ConfirmEmail';
import About from './components/publicStatic/about/About';
import Login from './components/publicStatic/login/Login';
import StudentProfile from './components/user/individual/StudentProfile';
import LabMatch from './components/labSearch/LabMatch';
import ProfPage from './components/user/group/ProfPage';
import Apply from './components/user/Apply';
import CreatePosition from './components/user/group/CreatePosition';
import ViewApplicants from './components/user/group/ViewApplicants';
import ScheduleInterview from './components/user/ScheduleInterview';
import PickInterview from './components/user/PickInterview';
import Settings from './components/user/maintenance/Settings';
import Feedback from './components/utilities/Feedback';
import ForgotPassword from './components/user/maintenance/ForgotPassword';
import UpdateContact from './components/user/maintenance/UpdateContact';
import EnterContact from './components/user/individual/EnterContact';
import Footer from './components/utilities/Footer';
import PrivacyPolicy from './components/publicStatic/info/PrivacyPolicy';
import TermsOfService from './components/publicStatic/info/TermsOfService';
import GroupPage from './components/user/group/GroupPage';
import LabDashboard from './components/labSearch/LabDashboard';
import StudentOnboarding from './components/user/individual/StudentOnboarding';
import FacultyOnboarding from './components/user/individual/FacultyOnboarding';
import Help from './components/publicStatic/help/Help';
import Join from './components/publicStatic/join/Join';
import CreateLab from './components/user/CreateLab';
import Challenge from './components/publicStatic/join/Challenge';
import './components/utilities/TapTarget.css';
import './components/utilities/general.css';


import UserTest from './components/utilities/tests/UserTest';

class Router extends Component {
	render() {
		return(
			<BrowserRouter>
				<div>
					<NavBar />
					<div>
						<Switch>
							<Route path='/home' component={ Home } />
							<Route path='/about' component={ About } />
							<Route path='/about/:tab' component={ About } />
							<Route path='/login' component={ Login } />
							<Route path='/sign-up' component={ SignUpPage } />
							<Route path='/confirm-email' component={ ConfirmEmail } />
							<Route path='/student-profile' component={ StudentProfile } />
							<Route path='/student-profile/:studentSlug' component={ StudentProfile } />
							<Route path='/lab-match' component={ LabMatch }/>
							<Route path='/prof-page' component={ GroupPage }/>
							<Route path='/prof/:profSlug' component={ ProfPage }/>
							<Route path='/apply/:labId' component={ Apply } />
							<Route path='/create-position' component={ CreatePosition } />
							<Route path='/view-applicants' component={ ViewApplicants } />
							<Route path='/view-applicants/:posId' component={ ViewApplicants } />
							<Route path='/schedule-interview' component={ ScheduleInterview } />
							<Route path='/schedule-interview/:studentSlug' component={ ScheduleInterview } />
							<Route path='/pick-interview' component={ PickInterview } />
							<Route path='/settings' component={ Settings } />
							<Route path='/feedback' component={ Feedback }/>
							<Route path='/forgot-password' component={ ForgotPassword } />
							<Route path='/forgot-password/:token' component={ ForgotPassword } />
							<Route path='/privacy-policy' component={ PrivacyPolicy } />
							<Route path='/terms-of-service' component={ TermsOfService } />
							<Route path='/dashboard' component={ LabDashboard } />
							<Route path='/student-onboarding' component={ StudentOnboarding } />
							<Route path='/faculty-onboarding' component={ FacultyOnboarding } />
							<Route path='/help' component={ Help } />
							<Route path='/join' component= { Join } />
							<Route path='/test' component={ UserTest } />
							<Route path='/challenge' component={ Challenge } />
							<Route path='/create-lab' component={ CreateLab } />
							<Route path='/' component={ Home } />
						</Switch>
					</div>
					<Footer />
				</div>
			</BrowserRouter>
		);
	}
}

export default Router;
