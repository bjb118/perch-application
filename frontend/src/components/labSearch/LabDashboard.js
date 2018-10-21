/* Lab Dashboard ('YOUR PROJECTS') page for both students and faculty
Students:
  -  Display saved projects
	-  Display projects that they've applied to

Faculty: (an idea)
  -  Display the projects that they own / have created
	-  Display applicants to their projects (THIS COULD DEFINITELY GO IN ANOTHER AREA)
*/

import React, {Component} from 'react';
import LabSearchProject from './LabSearchProject'
import {getCurrentUserId, getStudentFromUser, getFacultyFromUser, isStudent, isFaculty} from '../../helper.js'
import './LabDashboard.css';

class LabDashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			position_list: [],
			applied_list: [],
		}
	}

	componentDidMount() {
		// if student, show saved projects & applications
		if (isStudent()) {
			getStudentFromUser(getCurrentUserId()).then((resp) => {
				console.log(resp.data.position_list)
				this.setState({
					position_list: resp.data.position_list,
					applied_list: resp.data.position_list, // TODO: SET TO APPLIED LIST ONCE APPLICABLE
				})
			})
		}
		// if faculty, show existing projects (allow to edit?) and applicants.
		else if (isFaculty()) {
			getFacultyFromUser(getCurrentUserId()).then((resp) => {
				// TODO: set existing projects & applicants.
			})
		}
	}

	render() {
		var facultyOwned = isFaculty();
		const boxOneTitle = isStudent() ? "Saved Projects" : "Your Projects";
		const boxTwoTitle = isStudent() ? "Projects You've Applied To" : "Applicants To Your Projects";

		return (
			<div className='shift-down' style={{minHeight: '70vh'}}>
				<div className='lab-dashboard'>
						<h1 className='lab-dashboard-title'>{boxOneTitle}</h1>
		         	<div className='lab-dashboard-container'>
		         		{
		         			this.state.position_list.map((position, index) => {
		         				console.log(position)
		         				return(
			           			<div key={`position-${index}`} className='lab-dashboard-item'>
			           				{/*<a className='lab-dashboard-lab-name'>{position.lab.name}</a>*/}
			           				<LabSearchProject key={position.id} id={position.lab_id} title={position.title} facultyOwned={facultyOwned} spots='MISSING' saved='true' description={position.description} urop={position.is_urop_project}/>
			           			</div>
		           			)
		         		})}
		      		</div>
	     		</div>

	   </div>
	);
	}
}

export default LabDashboard;
