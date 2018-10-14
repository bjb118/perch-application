import React, {Component} from 'react';
import EditModal from './modals/EditModal'
import {isLoggedIn, logoutCurrentUser, getCurrentUserId, getUser, getFacultyFromUser, getCurrentLabId, isStudent, isLab, isFaculty, getCurrentFacultyId /*getFacultyLabs*/} from '../../helper.js'
import './NavBar.css'

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			is_student: false,
			lab: {},
			lab_id: 0,
		};
	}

	componentDidMount() {
		if (isStudent()) {
			this.setState({
				is_student: true,
				prof_dest: `/student-profile/${getCurrentUserId()}`,
			});
		} else if (isFaculty()) {
			this.setState({
				is_student: false,
				prof_dest: `/prof/${getCurrentFacultyId()}`,
			});
		}
	}

	render() {

		if (isLoggedIn()) {
			var navItems = <div>
				<li><a className="nav-item" href={this.state.prof_dest}>PROFILE</a></li>
			    {<li><a className="nav-item" href="/lab-match">PROJECTBOOK</a></li>}
			    {isStudent() && <li><a className="nav-item" href="/dashboard">YOUR PROJECTS</a></li>}
			    {isFaculty() && <li><a className="nav-item" href="/dashboard">YOUR LABS</a></li>}
			    <li><a className="nav-item" href="/help">HELP</a></li>
			    <li><a className="nav-item" href="/settings">SETTINGS</a></li>
			    <li><a className="nav-item" onClick={logoutCurrentUser} href="/">LOGOUT</a></li>
			</div>
		}
		else {
			var navItems = <div>
				<li><a className="nav-item" href="/about">ABOUT</a></li>
				{/*<li><a className="nav-item" href="/help">DEMO</a></li>*/}
				<li><a className="nav-item" href="/join">JOIN THE TEAM</a></li>
			  <li><a className="nav-item contact-nav" href="/login">LOGIN</a></li>
			</div>
		}

		return(
			<div className="navbar-fixed">
			    <nav>
			      <div className="nav-wrapper">
			        <a href="#" data-activates="mobile-demo" className="right button-collapse hide-on-large-only"><i id="hamburger" className="material-icons">menu</i></a>
			      <ul id="nav-mobile" className="right hide-on-med-and-down">

			        {navItems}

			      </ul>
			        <ul className="left hide-on-small-only">
			        {!isLoggedIn() &&
			          	<a className='no-hover' href="/home"><img className="nav-logo" alt="logo" src="/assets/branch_logo.png" /><div className='logo-text'>PERCH</div></a>
			        }
			        {isLoggedIn() &&
			          	<a className='no-hover' href={this.state.prof_dest}><img className="nav-logo" alt="logo" src="/assets/branch_logo.png" /><div className='logo-text'>PERCH</div></a>
			        }
			        </ul>

			        <ul className="mobile-logo hide-on-med-and-up">
			          <a className='no-hover' href="/home"><img className="nav-logo" alt="logo" src="/assets/branch_logo.png" /></a>
			        </ul>

			        <ul className="side-nav light-blue lighten-4" id="mobile-demo">
			         	{navItems}
			        </ul>
			      </div>
			      <div className='right'>

			      </div>
			    </nav>

			  </div>
		);
	}
}


export default NavBar;
