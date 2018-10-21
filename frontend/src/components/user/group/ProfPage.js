import React, {Component} from 'react';
import {updateFaculty, permissionCheck, getLab, createLab, isLoggedIn, getCurrentFacultyId, getCurrentUserId, getUserLabs, getUser, getFaculty, getFacultyFromUser, getAllLabPositions, getLabPositions, isStudent, isLab, isFaculty} from '../../../helper.js'
import ErrorPage from '../../utilities/ErrorPage'
import ExtLinkBox from '../ExtLinkBox'
import ExpanderIcons from '../../utilities/ExpanderIcons'
import Editor from '../../utilities/Editor'
import EditModal from '../../utilities/modals/EditModal'
import DotLoader from '../../utilities/animations/DotLoader'
import CreateLab, {modalCreateLab, modalUpdateLab, modalDeleteLab} from '../CreateLab'
import {EditContact, EditExperience, EditQuickview, EditLinks} from '../individual/StudentEditors'
import { TwitterTimelineEmbed} from 'react-twitter-embed';
import BasicButton from '../../utilities/buttons/BasicButton'
import './ProfPage.css'

class ProfPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lab_name: "",
			yes: ['spots open', 'undergrads', 'credit'],
			no: ['paid', 'seniors', 'freshmen'],
			img_src: 'https://homewoodfamilyaz.org/wp-content/uploads/2017/04/square_profile_pic_male.png',
			labels: [],
			skills: [],
			positions: [],
			contact_info: [],
			labs: [],
			user_id: null,
			lab: {},
			selected_lab: {},
			no_lab: false,
			loading_labs: true,
			dest: '/edit-external-links',
			updated_user: {},
		};
	}

	// Handles opening of component editing modals
	openModal(id) {
		if (document.getElementById(id)) {
			document.getElementById(id).classList.add('activated');
			document.getElementById(`${id}-backdrop`).classList.add('activated');
		}
	}

	getModalAction(create) {
		if (create)
			modalCreateLab(this.state.lab, (id) => { window.location = "/prof-page/" + id});
		else
			modalDeleteLab(this.state.selected_lab, this.loadLabs.bind(this));
	}

	updateLabState(name, value) {
		let lab = this.state.lab;
		lab[name] = value;
		this.setState({lab});
	}

	componentWillMount() {
	}

	loadLabs() {
		getUserLabs(this.state.user_id).then(r => {
			this.setState({labs: r.data, loading_labs: false});
		})
	}

	sendContactInfo() {
		// updateUser()
		console.log('Sending to backend', this.state.updated_user)
		// updateFaculty(getCurrentFacultyId(), this.state.updated_user)
		updateFaculty(getCurrentFacultyId(), this.state.updated_user)
		.then(r=>console.log(r))
	}

	// this just updates the state object, not the backend
	updateUser(field, newValue) {
	    var newState = this.state;
	    newState.updated_user[field] = newValue;
		if (field === 'classes')
			newState.classes = newValue;
	    this.setState(newState, () => console.log("updated", field, newValue));
  	}

	componentDidMount() {
		if (isLoggedIn()) {
			// check if user or faculty for viewing positions
			if (isStudent())
				this.setState({user_type: "user"});
			else if (isFaculty())
				this.setState({user_type: "faculty"});

			var prof_id = window.location.pathname.split('/')[2];
			getFaculty(prof_id).then((r) => {
				console.log('fFFFFFac object')
				console.log(r)
				r = r.data
				this.setState({
					name: r.first_name,
					contact_email: r.contact_email,
					contact_phone: r.contact_phone,
					user_id: r.user_id,
				})
			})
			.then(r => getUserLabs(this.state.user_id))
			.then(r => {
				console.log(r)
				this.setState({labs: r.data, loading_labs: false});
			})
			.catch(e=>alert('ERRRROR'))

			this.loadLabs();

			var lab_id = window.location.pathname.split('/')[2];
			getLab(lab_id).then((resp) => {
				console.log(resp);
				if (resp.data) {
					getAllLabPositions(lab_id).then(positions => {
						console.log(positions);
						this.setState({ positions: positions });
					});
					var contact_info = [];
					if (resp.data.location) {
						contact_info.push({label: 'location', value: resp.data.location});
					}
					if (resp.data.contact_email) {
						contact_info.push({label: 'email', value: resp.data.contact_email});
					}
					this.setState(
						{
							lab_name: resp.data.name,
							contact_info: contact_info,
							lab_summary: resp.data.description,
							labels: resp.tags,
							skills: resp.skills,
							//img_src: resp.data.labpic_path, ADD BACK IN TO SHOW IMAGE ONCE ON SAME SERVER!
						}
					);
				} else {
					this.setState({ no_lab: true });
				}
	        });
		}
	}

	handleLabCreation() {
		let name = document.getElementById('lab-create-name').value
		let email = document.getElementById('lab-create-email').value
		let phone = document.getElementById('lab-create-phone').value
		let description = document.getElementById('lab-create-description').value
		let lab = {
			'name': name,
			'email': email,
			'phone': phone,
			'description': description,
		}

		createLab(lab)
			.then(r => {
				console.log('created lab')
				console.log(r)
				this.loadLabs();
			})
	}

	render() {
		var apply_dest = '/apply/' + window.location.pathname.split('/')[2];
		// TODO TEMPORARILY COMMENTED OUT UNTIL INTEGRATED WITH BACKEND
		// if (!isLoggedIn()) {
		// 	return <ErrorPage />
		// } else if (this.state.no_lab) {
		// 	return <ErrorPage fourofour="true" />
		// } else {
		return (
			<div id='user-content-body'>
				<EditModal id="contact-edit" title="Edit Contact Info" modalAction={this.sendContactInfo.bind(this)}>
					<EditContact modalEdit={true} user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
				<EditModal id="link-edit" title="Edit Links" modalAction={this.sendContactInfo.bind(this)}>
					<EditLinks prof modalEdit={true} user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
				<EditModal id="work-edit" title="Edit Work Info">
					<EditExperience type="work"/>
				</EditModal>
				<EditModal id="education-edit" title="Edit Education Info">
					<EditExperience type="educ"/>
				</EditModal>
				<EditModal id="bio-edit" title="Edit Bio">
					<textarea placeholder='As a youngster on Tattooine, I always wanted to become a star-pilot ...'></textarea>
				</EditModal>
				<EditModal id="quickview-edit" title="Edit Quickview Info" modalAction={this.sendContactInfo.bind(this)}>
					<EditQuickview img='/img/headshots/bcoppola.jpg' modalEdit={true} user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
				{/*<EditModal id="join-lab-modal" title="Join A Lab">
					<input type='text' placeholder=''></input>
				</EditModal>*/}
				<EditModal id="create-lab-modal" title="Create A Lab" modalAction={r=>this.handleLabCreation()}>
					<div className='input-field'>
						<input id='lab-create-name' type='text' placeholder='Smooth Jazz Lab' />
						<label htmlFor='name' className="active">Lab Name</label>
					</div>
					<div className='input-field'>
						<input id='lab-create-email' type='email' placeholder='lab@labemail.com' />
						<label htmlFor='email' className="active">Email</label>
					</div>
					<div className='input-field'>
						<input id='lab-create-phone' type='text' placeholder='123-456-7890' />
						<label htmlFor='phone' className="active">Phone</label>
					</div>
					<div className='input-field'>
						<textarea id='lab-create-description' placeholder='we do cool stuff' />
					</div>
					<br/><br/>
				</EditModal>
				<EditModal id={`create-lab`} wide={true} actionName="create"
					title={`Create New Lab`} modalAction={() => this.getModalAction(true)}>
					<CreateLab updateLabState={this.updateLabState.bind(this)}/>
				</EditModal>
				<EditModal id="delete-lab" title={`Delete ${this.state.selected_lab.name}`} actionName="Delete Lab" slim={true}
					modalAction={() => this.getModalAction(false)}>
				 	<p>Are you sure you want to delete the lab {this.state.selected_lab.name}? This action cannot be undone.</p>
				</EditModal>
	 			<div id='user-column-L'>
	 				{/*<div className='join-lab' onClick={r => this.openModal('join-lab-modal')}>
						<div>Join A Lab</div>
					</div>*/}
					<div className='join-lab' onClick={r => this.openModal('create-lab-modal')}>
						<div>Create A Lab</div>
					</div>
	 				<div>
	 					<h1>Quick Info</h1>
	 					<div>
	 						Extraordinary Alchemist
	 					</div>
	 				</div>
	 				<div>
	 					<h1>Contact Info</h1>
	 					<div>
	 						<div id='user-email'><b>Email</b> <a href={`mailto:${'bearb@umich.edu'}`}>{this.state.contact_email}</a></div>
	 						<div><b>Phone</b>{this.state.contact_phone}</div>
	 					</div>
	 					<Editor superClick={() => this.openModal('contact-edit')}/>
	 				</div>
	 				{/*<div id='user-links'>
	 					<h1>Links</h1>
	 					<div>
	 						<a>LinkedIn</a>
	 						<a>Website</a>
	 						<a>Lab Resources</a>
	 					</div>
	 					<Editor superClick={() => this.openModal('link-edit')}/>
	 				</div>*/}
	 			</div>
	 			<div id='user-column-R'>
 				
 			</div>
	 			<div id='user-column-Dashboard'>
	 				<div id='user-quickview'>
	 					<div id='user-quickview-img-container'>
 							<img id='user-quickview-img' src='https://homewoodfamilyaz.org/wp-content/uploads/2017/04/square_profile_pic_male.png'/>
 						</div>
	 					{/*<img id='user-quickview-coverimage' src='https://images.pexels.com/photos/242236/pexels-photo-242236.jpeg?auto=compress&cs=tinysrgb&h=350' />
	 					<div id='user-quickview-footer'>University of Michigan</div>*/}
	 					<div id='user-quickview-name'>{this.state.name}</div>
	 					<Editor superClick={() => this.openModal('quickview-edit')}/>
	 				</div>

	 				<div id='user-labs'>
	 					<h1>Labs</h1>
	 					<div>
	 						{this.state.labs.map(labAssoc => {
	 							console.log(labAssoc)
								return (<div>
									<a key={labAssoc.lab.id} href={`/prof-page/${labAssoc.lab.id}`}>{labAssoc.lab.name || `No Name, id:${labAssoc.lab.id}`}</a>
									<span>{labAssoc.lab.description}</span>
									</div>)
							})}
	 					</div>
	 					<Editor superClick={() => this.openModal('create-lab-modal')} add={true}/>
	 				</div>
					{/*<div id='user-labs'>
	 					<h1>Labs</h1>
 						{ this.state.loading_labs ? "Loading Labs ..." :
							this.state.labs.map(labAssoc => {
							return <div key={labAssoc.lab.id}>
									<a className="user-labs-name" href={`/prof-page/${labAssoc.lab.id}`}>{labAssoc.lab.name || `No Name, id:${labAssoc.lab.id}`}</a>
									<a onClick={() => this.setState({selected_lab: labAssoc.lab}, ()=>{this.openModal('delete-lab')})}
										className="user-labs-delete">
										<i className="material-icons">delete</i>
									</a>
								</div>
						})}
	 					<Editor superClick={() => this.openModal('create-lab')} add={true}/>
	 				</div>*/}
	 				<div>
	 					<h1>Work Experience</h1>
	 					<UserWorkExperience title="Manhattan Project" description="Did some pretty cool stuff, including but not limited to: sleeping in the acetone bath, juggling vials, playing russian hydrochloric acid roulette, spontaneous macarena, salsa making in the vacuum room. spontaneous macarena, salsa making in the vacuum room. spontaneous macarena, salsa making in the vacuum room. spontaneous macarena, salsa making in the vacuum room." startTime='August 2017' endTime='Present'/>
	 					<Editor superClick={() => this.openModal('work-edit')}/>
	 				</div>
	 			</div>
 			</div>
		)
	}
}




class UserClasses extends Component {
	expand() {
		let elem = document.getElementById('user-classes-expander')
		elem.innerHTML = elem.innerHTML === 'expand_more' ? 'expand_less' : 'expand_more'
		document.getElementById('user-classes').classList.toggle('active-blue')
		document.getElementById('user-classes-list').classList.toggle('expand');

	}

	render() {
		return(
			<div id='user-classes' >
				<span onClick={this.expand.bind(this)}>
					Notable Classes
					<i className="material-icons" id='user-classes-expander'>expand_more</i>
				</span>
				<div id='user-classes-list'>
					{this.props.list.map(item => <div>{item}</div>)}
				</div>
			</div>
		)
	}
}

class UserWorkExperience extends Component {
	expand() {
		document.getElementById(`user-work-description-${this.props.title}`).classList.toggle('expand')
	}

	render() {
		return(
			<div id={`user-work-${this.props.title}`} className='user-work-experience'>
				<div className='user-work-title'>{this.props.title}</div>
				<div className='user-work-time'>
					{`${this.props.startTime} - ${this.props.endTime}`}
				</div>
				<div id={`user-work-description-${this.props.title}`} className='user-work-description'>{this.props.description}</div>
				<ExpanderIcons id={`user-work-${this.props.title}`} action={this.expand.bind(this)}/>
			</div>
		)
	}
}


class JoinLab extends Component {
	handleClick() {
		alert('hello')
	}

	render() {
		return(
			<div id='join-lab' onClick={r => this.openModal('join-lab-modal')}>
				<div>Join A Lab</div>
			</div>
		)
	}
}





export default ProfPage;
