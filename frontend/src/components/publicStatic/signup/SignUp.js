/* These are Google Login objects that need to be declared */
/* global gapi */
/* global initClient */
/* global updateSigninStatus */
import React, {Component} from 'react';
import GoogleLogin from './GoogleLogin.js';
import GoogleLogout from './GoogleLogout.js';
import {registerUser, createStudent, getCurrentUserId, loginUser, loginUserIdp, createFaculty} from '../../../helper.js';
import './SignUp.css';
class SignUp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			route: '/student-onboarding'
		};
	}

	generalHandler(event) {
		event.preventDefault();
		let email = document.getElementById('email').value;
		let password = document.getElementById('password').value;
		let first_name = document.getElementById('first_name').value;
		let last_name = document.getElementById('last_name').value;

		registerUser(`${first_name} ${last_name}`, email, password, password)
			.catch(e => alert('Register Error'))
			.then(r => loginUser(email, password))
			.catch(e => alert('Login Error'))
			.then(r => this.createAccount(email, first_name, last_name))
	}

	// relies on register and login to create a user and put id info in local storage to then create a student
	createAccount(email, first_name, last_name) {
		let student = document.getElementById('student').checked;
		let id = getCurrentUserId();
		let individual = {
			first_name: first_name,
			last_name: last_name,
			contact_email: email,
		}
		if (student) {
			createStudent(id, individual)
				.then(r => window.location.href = '/student-onboarding')
				.catch(e => alert('ERROR in student creation'))
		}
		else {
			createFaculty(id, individual)
				.then(r => window.location.href = '/faculty-onboarding')
				.catch(e => alert('ERROR in faculty creation'))


			// createFaculty(id, first_name, last_name, null, email).then(fac => {
			// 	createLab(fac.id, `${first_name} ${last_name}'s Lab`, null, null, null, null, null, null, null, null, email).then(lab => {
			// 		addMembersToLab(lab.id,[fac.id],[1]).then(resp => {
			// 			window.location.href = '/faculty-onboarding'
			// 		});
			// 		// TODO TEMPORARILY NOT WORKING FROM API UPDATE
			// 		// addLabToFaculty(fac.id, lab.id).then(resp => {
			// 		// 	window.location.href = this.state.route;
			// 		// });
			// 	});
			// // });
		}
	}

	handleGoogleSuccessResponse = (response) => {
		console.log(response.accessToken);
		loginUserIdp("blah", "google", response.accessToken);
	}

	handleGoogleFailureResponse = (response) => {
		console.log("Google login failed");
	}

	signOut = () => {
		var auth2 = gapi.auth2.getAuthInstance();
    	auth2.signOut().then(function () {
      		console.log('User signed out.');
    	});
	}

	render() {
		return (
				<form className='container left-align new-signup-container' onSubmit={this.generalHandler.bind(this)}>
	  				<div className='new-signup-header'>Sign Up for Free</div>
	  				<a href='login' ><div className='new-signup-sub-header'>or <span className='link-color'>login</span> if you have an account</div></a>
	  				<div className='row'>
	  					<div className="input-field col s6">
		                	<input id="first_name" type="text" required autoFocus="autofocus"/>
		                	<label htmlFor="first_name">First name</label>
		            	</div>
		            	<div className="input-field col s6">
			                <input id="last_name" type="text" required autoFocus="autofocus"/>
			                <label htmlFor="last_name">Last name</label>
			            </div>
	  				</div>
	  				<div className="input-field">
		                <input id="email" type="email" required autoFocus="autofocus"/>
		                <label htmlFor="email">Email</label>
		            </div>
		            <div className="input-field">
		                <input id="password" type="password" required autoFocus="autofocus"/>
		                <label htmlFor="password">Password</label>
		            </div>
		            <div className='center-align'>
		            	<input className="radio" name="user_type" type="radio" id="faculty" value="faculty" required autoFocus="autofocus"/>
		              	<label className='new-signup-radio' htmlFor="faculty">Faculty</label>
		              	<input className="radio" name="user_type" type="radio" id="student" value="student" required autoFocus="autofocus"/>
		              	<label className='new-signup-radio' htmlFor="student">Student</label>
		            </div>
		            <br />
		            <button className="btn waves-effect waves-blue waves-light basic-btn" style={{width: '100%', textTransform: 'lowercase', height: '50px'}} >deawkwardize</button>
	  				<GoogleLogin 
	  					clientId="426880385373-gttrdhuk9b4g3cuhh95g0nhhnkbt38ek.apps.googleusercontent.com"
	  					buttonText="Google Login"
	  					onSuccess={this.handleGoogleSuccessResponse}
	  					onFailure={this.handleGoogleFailureResponse}
	  				/>
	  				<a href='#' onClick={this.signOut}>Sign Out</a>
	  			</form>
		);
	}
}

export default SignUp;
