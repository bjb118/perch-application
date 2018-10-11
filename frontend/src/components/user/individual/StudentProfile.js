import React, {Component} from 'react';
import {getCurrentStudentId, addTagsToStudent, removeTagsFromStudent, removeSkillsFromStudent,
		removeWorkExperiencesFromStudent, addEduExperienceToStudent, updateEduExperienceOfStudent,
		addWorkExperienceToStudent, addSkillsToStudent, getStudentFromUser,
		getStudentTags, getStudentSkills, updateStudent, deepCopy, primeExternalLink,
		uploadUserFile, getUserFile, exists} from '../../../helper.js'
import ErrorPage from '../../utilities/ErrorPage'
import ExpanderIcons from '../../utilities/ExpanderIcons'
import Editor from '../../utilities/Editor'
import EditModal from '../../utilities/modals/EditModal'
import {EditContact, EditExperience, EditQuickview, EditLinks, EditBio, EditClasses} from './StudentEditors'
import NotableClasses from './NotableClasses'
import PickYourInterests from './PickYourInterests'
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import './StudentProfile.css';

class StudentProfile extends Component {
	constructor(props) {
		super(props);
		this.openModal = this.openModal.bind(this);
		var user = {
			name: "",
			gpa: "",
			major: "",
			year: "",
			bio: "",
			university: "",
			contact_email: "",
			contact_phone: "",
			classes: [],
			experience: [],
			linkedin: "",
			skills: [],
			interests: [],
			work_experiences: [],
			edu_experiences: [],
			resume: "",
			student: true,
			s_id: "",
			work_experiences: [],
		}
		this.state = {
			user, 
			updated_user: deepCopy(user),
		}
	}

	// this just updates the state object, not the backend
	updateUser(field, newValue) {
	    var newState = this.state;
	    newState.updated_user[field] = newValue;
		if (field === 'classes')
			newState.classes = newValue;
	    this.setState(newState, () => console.log("updated", field, newValue));
	  }

  	// sends work experiences to the backend
	sendExperiences() {
		if (this.state.updated_user.work_experiences) {
			var idsToRemove = [];
			if (exists(this.state.user.work_experiences)) 
				this.state.user.work_experiences.map(exp => idsToRemove.push(exp.id))
			removeWorkExperiencesFromStudent(idsToRemove)
				.then(r => {
					if (exists(this.state.updated_user.work_experiences)) 
						this.state.updated_user.work_experiences.map(exp => addWorkExperienceToStudent(exp).then(r => this.generalHandler()))
				})
		}
	}

	sendEduExp(edu_exp) {
		if (this.state.user.edu_experiences.length)
			updateEduExperienceOfStudent(this.state.user.edu_experiences[0].id, edu_exp).then((resp) => {
				console.log("CLASSES RESP!!!", resp)
				this.generalHandler() })
		else 
			addEduExperienceToStudent(edu_exp).then((resp) => {
				console.log("CLASSES RESP!!!", resp)
				this.generalHandler();
			})
	}

	// send classes to the backend
	sendClasses() {
		let class_arr = [];
		if (exists(this.state.updated_user.classes))
			this.state.updated_user.classes.map(c => class_arr.push(c.name))

		let edu_exp = {
			university_name: this.state.user.university,
			start_date: 'Start',
			end_date: 'End',
			current: true,
			class_experience_names: class_arr,
			major_names: [this.state.user.major],
		}
		this.sendEduExp(edu_exp);
	}

	sendHeaderInfo() {
	    var name = this.state.updated_user.name
	    // build class array
		var class_arr = [];
		if (this.state.user.classes) 
			this.state.user.classes.map(c => class_arr.push(c.name))
		// update profile picture
		if (this.state.updated_user.img) {
			console.log(this.state.updated_user.img)
			let formData = new FormData();
			formData.append('file', this.state.updated_user.img);
			let to_return = {
	            formData: formData,
	            type: 'profile_pic'
	        }
			uploadUserFile(to_return, 'profile_pic')
				.then(r => console.log(r))
				.catch(e => console.log(e))
		}
		// update name, school, general handler
		updateStudent({first_name: name})
			.then(r => addEduExperienceToStudent(this.state.updated_user.university,'start','end', true, this.state.user.year, this.state.user.gpa, class_arr, [this.state.user.major]))
			.then((resp) => this.generalHandler());
	}

	sendLinks() {
		updateStudent({linkedin_link: primeExternalLink(this.state.updated_user.linkedin_link), website_link: primeExternalLink(this.state.updated_user.website_link)})
			.then(r => this.generalHandler());
	}

	sendAcademicInfo() {
		var major_arr = [this.state.updated_user.major];
		var class_arr = [];
		if (this.state.user.classes) 
			this.state.user.classes.map(c => class_arr.push(c.name))
		let edu_exp = {
			university_name: this.state.user.university || 'University of Michigan',
			start_date: 'Start',
			end_date: 'End',
			current: true,
			class_experience_names: class_arr || [],
			major_names: [this.state.user.major],
		}
		this.sendEduExp(edu_exp);
	}

	sendContactInfo() {
		updateStudent({contact_email: this.state.updated_user.contact_email, contact_phone: this.state.updated_user.contact_phone})
			.then(r => this.generalHandler());
	}

	sendBio() {
		updateStudent({bio: this.state.updated_user.bio})
			.then(r => this.generalHandler());
	}

	updateTags() {
		var skillIds = [],
			intIds = [],
			updated_user = this.state.updated_user,
			skill_match = {},
			int_match = {},
			skill_diff = [],
			int_diff = [];

		if (exists(updated_user.skills)) {
			updated_user.skills.map(skill => {
				skillIds.push(skill.id);
				skill_match[skill.id] = true;
			})
		}
		if (exists(updated_user.interests)) {
			updated_user.interests.map(interest => {
				intIds.push(interest.id);
				int_match[interest.id] = true;
			})
		}
		if (exists(this.state.user.skills)) {
			this.state.user.skills.map(skill => {
				if (!skill_match[skill.id]) 
					skill_diff.push(skill.id);
			})
		}
		if (exists(this.state.user.interests)) {
			this.state.user.interests.map(interest => {
				if (!int_match[interest.id]) 
					int_diff.push(interest.id);
			})
		}
		addTagsToStudent(intIds)
			.then(r => addSkillsToStudent(skillIds))
			.then(r => removeTagsFromStudent(int_diff))
			.then(r => removeSkillsFromStudent(skill_diff))
			.then(r => this.generalHandler())
	}

	// Handles retrieving skills and tags
	retrieveTags() {
		var newState = this.state,
			skills = [],
			interests = []

		getStudentSkills(getCurrentStudentId())
			.then(skillsResp => {
				if (skillsResp.data)
					newState.user.skills = skillsResp.data
			})

		getStudentTags(getCurrentStudentId())
			.then(tagsResp => {
				if (tagsResp.data) 
					newState.user.interests = tagsResp.data
				this.setState(newState);
			})
	}

	// Handles data for page
	generalHandler() {
			let id = this.retrieveSlug();
			var user = {}
			getStudentFromUser(id)
			.then((resp) => {
				console.log(resp)
				var class_arr = [],
					major = "",
					gpa = "",
					year = "",
					university = ""

				if (exists(resp.data.edu_experiences)) {
					var eduExp = resp.data.edu_experiences.slice(-1)[0];
					if (exists(eduExp.majors))
						major = eduExp.majors[0] || "";
					if (exists(eduExp.classes))
						class_arr = eduExp.classes;
					if (exists(eduExp.gpa))
						gpa = eduExp.gpa;
					if (exists(eduExp.year))
						year = eduExp.year;
					if (exists(eduExp.university))
						university = eduExp.university.name;
				}

				user = {
					name: resp.data.first_name,
					user_id: resp.data.user_id,
					gpa,
					major,
					year,
					university,
					bio: resp.data.bio || "",
					contact_email: resp.data.contact_email,
					contact_phone: resp.data.contact_phone,
					classes: class_arr,
					experience: resp.data.experiences,
					linkedin: resp.data.linkedin,
					linkedin_link: resp.data.linkedin_link,
					website_link: resp.data.website_link,
					resume: resp.data.resume_path,
					skills: resp.data.skills || [],
					interests: resp.data.tags || [],
					work_experiences: resp.data.work_experiences,
					edu_experiences: resp.data.edu_experiences,
					student: true,
					s_id: resp.data.id,
				}
				// var updated_user = deepCopy(user);
		  //       this.setState({
				// 	user, updated_user
				// });
			})
			.then(r => getUserFile('profile_pic', user.user_id))
			.then(r => {
				user.img = r.data.file.url,
				console.log(user.img)
			})
			.catch(e => console.log(e))
			.then(r => {
				var updated_user = deepCopy(user);
				this.setState({user, updated_user});
			})
			// getUserFile('profile_pic').then(resp => {
			// 	console.log('trying to get profile pic')
			// 	// console.log("RESP!!!", resp);
			// })
	}

	// Retrives slug from url
	retrieveSlug() {
		return window.location.pathname.split( '/' )[2];
	}

	// Set's student ID into state for future use
	setStudentId(r) {
		this.setState({s_id: r.result.id})
		return this;
	}

	// Beginning point for data handling
	componentDidMount() {
		// getUserFile('profile_pic')
		// .then(r=>{
		// 	console.log(r)
		// })
		// .catch(e => console.log(e))
		this.generalHandler();
	}

	// Handles opening of component editing modals
	openModal(id) {
		if (document.getElementById(id)) {
			document.getElementById(id).classList.add('activated');
			document.getElementById(`${id}-backdrop`).classList.add('activated');
		}
	}

	render() {
		var linkedinLink, resumeLink = null;
		if (exists(this.state.user.linkedin_link)) {
			linkedinLink = this.state.user.linkedin_link;
		}
		if (exists(this.state.user.resume_path)) {
			resumeLink = this.state.user.resume_path;
		}
		else if (exists(this.state.user.website_link)) {
			resumeLink = this.state.user.website_link;
		}
		else if (exists(this.state.user.resume)) {
			resumeLink = this.state.user.resume;
		}
		if (!true) {//(!isLoggedIn()) {
			return <ErrorPage />
		} else if (this.state.not_student) {
			return <ErrorPage fourofour="true" />
		} else {
	 	return (
	 		<div id='user-content-body'>
				<EditModal id="skills-interests-edit" title="Edit Skills and Interests" modalAction={this.updateTags.bind(this)} noPadding={true}>
					<PickYourInterests modalEdit={true} editorOnly={true} user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal >
				<EditModal id="contact-edit" title="Edit Contact Info" modalAction={this.sendContactInfo.bind(this)}>
					<EditContact modalEdit={true} user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
				<EditModal id="link-edit" title="Edit Links" modalAction={this.sendLinks.bind(this)}>
					<EditLinks modalEdit={true} user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
				<EditModal id="academics-edit" title="Edit Academic Info" modalAction={this.sendAcademicInfo.bind(this)}>
					<NotableClasses modalEdit={true} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
				<EditModal id="work-edit" title="Edit Work Info" modalAction={this.sendExperiences.bind(this)}>
					<EditExperience type="work" modalEdit={true} user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
				<EditModal id="education-edit" title="Edit Classes" modalAction={this.sendClasses.bind(this)}>
					<EditClasses modalEdit={true} user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
				<EditModal id="bio-edit" title="Edit Bio" modalAction={this.sendBio.bind(this)}>
					<EditBio modalEdit={true} user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
				<EditModal id="quickview-edit" title="Edit Quickview Info" modalAction={this.sendHeaderInfo.bind(this)}>
					<EditQuickview modalEdit={true} img='/img/rodriguez.jpg' user={this.state.updated_user} updateUser={this.updateUser.bind(this)}/>
				</EditModal>
	 			<div id='user-column-L'>
	 				<div>
	 					<h1>Academics</h1>
	 					<div>
	 						<div><b>GPA</b> {this.state.user.gpa}</div>
							<div><b>Major</b> {this.state.user.major}</div>
	 						<div><b>Year</b> {this.state.user.year}</div>
	 					</div>
	 					<Editor superClick={() => this.openModal('academics-edit')}/>
	 				</div>
	 				<div>
	 					<h1>Contact</h1>
	 					<div>
	 						<div id='user-email'><b>Email</b> <a href={`mailto:${this.state.user.contact_email}`}>{this.state.user.contact_email}</a></div>
	 						<div id='user-phone'><b>Phone</b> {this.state.user.contact_phone}</div>
	 					</div>
	 					<Editor superClick={() => this.openModal('contact-edit')}/>
	 				</div>
	 				<div id='user-links'>
	 					<h1>Links</h1>
	 					<div>
	 						<a target="_blank" href={linkedinLink} style={{textAlign: 'left', textDecoration: 'underline'}}>LinkedIn</a>
	 						{/*<a target="_blank" href={resumeLink} style={{textAlign: 'left', textDecoration: 'underline'}}>Resume</a>*/}
	 					</div>
	 					<Editor superClick={() => this.openModal('link-edit')}/>
	 				</div>
	 			</div>
	 			<div id='user-column-R'>
	 				<TwitterTimelineEmbed
					  sourceType="profile"
					  screenName="UMichResearch"
					  options={{height: 'calc(100vh - 200px)'}}
					/>
	 			</div>
	 			<div id='user-profile-column-C'>
	 				<div id='user-quickview'>
	 					<div id='user-quickview-img-container'>
	 						<img id='user-quickview-img' src={this.state.user.img ? this.state.user.img : '/img/rodriguez.jpg'}/>
	 					</div>
	 					<div style={{position: 'relative'}}>
		 					{/*<img id='user-quickview-coverimage' src='https://www.idcwonline.com.au/WebRoot/ecshared01/Shops/shsh11971/543D/EABA/662D/F139/1B09/AC10/0040/8D0F/cards_single_lightblue.png' />
		 					<div id='user-quickview-footer'>
								{this.state.user.university}
							</div>*/}
		 					<div id='user-quickview-name'>{this.state.user.name}</div>
	 					</div>
	 					<SkillsInterests skills={this.state.user.skills} interests={this.state.user.interests}/>
	 					<Editor superClick={() => this.openModal('quickview-edit')}/>
	 				</div>
	 				<div id='user-bio'>
	 					<h1>Bio</h1>
	 					<UserBio>{this.state.user.bio}</UserBio>
	 					<Editor superClick={() => this.openModal('bio-edit')}/>
	 				</div>
	 				<div>
	 					<h1>Experience</h1>
	 					<UserWorkExperience expObjs={this.state.user.work_experiences}/>
	 					<Editor superClick={() => this.openModal('work-edit')}/>
	 				</div>
					{/* Removing classes b/c they don't feel particularly relevant...
	 				<div id='user-education'>
	 					<h1>Classes</h1>
	 					<UserEducation classes={this.state.user.classes}/>
	 					<Editor superClick={() => this.openModal('education-edit')}/>
	 				</div>
					*/}
	 			</div>
			</div>

		);
	 }
	}
}



class StudentClasses extends Component {
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
					{this.props.list.map((item, index) => <div key={index}>{item.name}</div>)}
				</div>
			</div>
		)
	}
}

class UserWorkExperience extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showExpander: false,
			description: "",
		}
	}

	componentDidMount() {
		if (this.state.description.length >= 250)
			this.setState({showExpander: true})
	}

	expand() {
		document.getElementById(`user-work-description-${this.props.title}`).classList.toggle('expand')
	}

	render() {
		var expObjs = this.props.expObjs ? this.props.expObjs : [];
		return(expObjs.map((expObj, index) => {
			return(
				<div key={`user-work-${index}`}  id={`user-work-${expObj.title}`} className='user-work-experience'>
					<div className='user-work-title'>{expObj.title}</div>
					<div className='user-work-time'>
						{`${expObj.start_date} - ${expObj.end_date}`}
					</div>
					<div id={`user-work-description-${expObj.title}`} className='user-work-description'>{expObj.description}</div>
					{this.state.showExpander && <ExpanderIcons id={`user-work-${"title"}`} action={this.expand.bind(this)}/>}
				</div>
			)
		}))
	}
}

class UserEducation extends Component {
	constructor(props) {
		super(props)
		var classes = [];
		if (exists(props.classes)) {
			classes: props.classes;
		}
		this.state = {
			showExpander: false,
			classes
		}
	}

	componentWillReceiveProps(props) {
		if (exists(props.classes)) {
			this.setState({classes: props.classes})
		}
	}

	expand() {
		document.getElementById(`user-education-description-${this.props.title}`).classList.toggle('expand')
	}

	render() {
		return(
			<div className='user-classes'>
				{this.state.classes.map(classObj => {
					return(<div key={classObj.id}>{classObj.name}</div>)
				})}
			</div>
		)
	}
}

class UserBio extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showExpander: false,
		}
	}

	componentWillReceiveProps() {
		// if (this.props.children.length >= 280)
			this.setState({showExpander: true})
	}

	expand() {
		document.getElementById('user-bio-content').classList.toggle('expand')
	}

	render() {
		return(
			<div id='user-bio' className='user-bio'>
				<div id='user-bio-content' className='user-bio-content'>{this.props.children} </div>
				{this.state.showExpander && <ExpanderIcons id={`user-bio`} action={this.expand.bind(this)}/>}
			</div>
		)
	}
}

class SkillsInterests extends Component {
	openModal(id) {
		if (document.getElementById(id)) {
			document.getElementById(id).classList.add('activated');
			document.getElementById(`${id}-backdrop`).classList.add('activated');
		}
	}

	render(){
		return(
			<div id='user-skills-interests'>
				<Editor superClick={() => this.openModal('skills-interests-edit')}/>
				{this.props.interests.map((item, index) => <Bubble key={`${index}-int`} type='interest'>{item.name}</Bubble>)}
				{this.props.skills.map((item, index) => <Bubble  key={`${index}-skill`} type='skill'>{item.name}</Bubble>)}
			</div>
		)
	}
}

class Bubble extends Component {
	render(){
		return(
			<span className='bubble-container'>
				<div className={this.props.type == 'skill' ? 'skill' : 'interest'}>
					{this.props.children}
				</div>
			</span>
		)
	}
}

export default StudentProfile;
