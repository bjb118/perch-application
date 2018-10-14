import React, {Component} from 'react';
import BasicButton from '../../utilities/buttons/BasicButton';
import SignUp from '../signup/SignUp';
import Typed from 'typed.js';
import './AboveTheFold.css';


class AboveTheFold extends Component {

	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		route: '/pick-your-interests?user_type=student'
	// 	};
	// }

	componentDidMount() {
		var options = {
		  strings: ["research", "finding a lab", "finding lab assistants", "learning lab skills", "<b>making an impact</b>"],
		  typeSpeed: 75
		}
		var typed = new Typed("#atf-changer", options);
	}

	// handleUserTypeCheck(event) {
	// 	if (event.target.value === 'faculty') {
	// 		this.setState({route: '/lab-name'});
	// 	}
	// 	else {
	// 		this.setState({route: '/pick-your-interests?user_type=student'});
	// 	}
	// }

	render() {
		return(
			  <div className="atf row">
			  		<div className='col s12 m7 atf-moving-text atf-height valign-wrapper'>
			  			<div className='container center-align'>
				  			<div className='atf-header-big left-align'><span id='atf-perch'></span></div>
				  			<div className='atf-header left-align'>deawkwardizing <br/><span id='atf-changer'></span></div>
				  			<div className='atf-text left-align'>Perch's centralized matching system helps you find the best lab or lab assistant, while Perch Certifications streamlines basic skills training</div>
			  			</div>
			  		</div>

			  		{/*<div className='hide-on-med-and-up center-align' style={{marginBottom: '20px'}}>*/}
			  			{/*<BasicButton dest='sign-up' msg='sign up'/><BasicButton dest='login' msg='log in'/>*/}
			  		{/*</div>*/}

			  		<div className='col s12 m5 atf-height valign-wrapper'>
			  			{<SignUp />}

						<div className='temp-signup'><a href='/join'>We're looking for people <u>to join the team!</u></a></div>
			  		</div>

			  </div>
		);
	}
}

export default AboveTheFold;