import React, {Component} from 'react'
import ExpanderIcons from '../../utilities/ExpanderIcons'
import Editor from '../../utilities/Editor'
import Apply from '../../user/Apply'
import Applicants from '../../user/Applicants'
import EditModal from '../../utilities/modals/EditModal'
import CreatePosition from './CreatePosition'
import GroupProjectRequirement from './GroupProjectRequirement'
import {addToStudentPositionList, removeFromStudentPositionList, getLabPosition, getStudentApplicationResponse, createStudentApplicationResponse, isFaculty, getCurrentUserId, updateLabPosition, deleteLabPosition, getLabPositionApplicationResponses, submitStudentApplicationResponse, getCurrentStudentId} from '../../../helper.js'
import './GroupProject.css'

export class GroupProject extends Component {
	constructor(props) {
		super(props)
		this.state = {
			question_resps: [],
			app_questions: [],
			applicants: [],
			new_pos: { min_time_commitment: 10 },
			added: false,
			submitted: false,
		}
	}

	componentWillReceiveProps(props) {
		let saved = false
	    for (let item in props.saved_labs) {
	        if (props.saved_labs[item].id === this.props.pos_id) {
	        	saved = true
	        }
        }
		this.setState({added: saved})
	}

	componentDidMount() {
		getLabPosition(this.props.lab_id, this.props.pos_id).then(resp => {
			let orig_questions = null;
			if (resp.data && resp.data.application && resp.data.application.questions && resp.data.application.questions.length) {
				orig_questions = resp.data.application.questions;
			}
			this.setState({orig_questions});
		})
		if (isFaculty()) {
			getLabPositionApplicationResponses(this.props.lab_id, this.props.pos_id)
				.then(resp => {
					if (resp.data && resp.data.length) 
						this.setState({applicants: resp.data})
				})
		}
		else { // If student, check against positions_applied prop to see if already submitted an application for position
			let pos_ids = this.props.positions_applied
			if (pos_ids && pos_ids.length) {
				pos_ids.map(pos => {
					if (pos == this.props.pos_id) this.setState({submitted: true})
				})
			}
		}
	}

	componentWillReceiveProps(props) {
		let pos_ids = props.positions_applied
		if (pos_ids && pos_ids.length) {
			pos_ids.map(pos => {
				if (pos == props.pos_id) this.setState({submitted: true})
			})
		}
	}

	// Grab the description and add expand
	expand() {
		document.getElementById(`group-project-description-${this.props.title}`).classList.toggle('expand')
	}

	openModal(id) {
		if (document.getElementById(id)) {
			document.getElementById(id).classList.add('activated');
			document.getElementById(`${id}-backdrop`).classList.add('activated');
		}
	}

	// Send updated position & application to server
	updatePosition() {
		let new_pos = this.state.new_pos;
		let old_pos = this.props.cur_pos;
		let updated_pos = { // Will likely be able to reduce this to just passing in new_pos on backend confirmation.
			min_time_commitment: new_pos.min_time_commitment || old_pos.min_time_commitment,
			contact_email: new_pos.contact_email || old_pos.contact_email,
			contact_phone: new_pos.contact_phone || old_pos.contact_phone,
			description: new_pos.description || old_pos.description,
			location: new_pos.location || old_pos.location,
			title: new_pos.title || old_pos.title,
			duties: "",
			min_qual: "",
		};
		let questions = this.state.app_questions.map(q => {return {question: q.question}});
		updated_pos.application = {questions};
		console.log("UPDATED POS!!!", updated_pos)
		updateLabPosition(this.props.lab_id, this.props.pos_id, updated_pos)
			.then(resp => {
				if (this.props.updatePositions)
					this.props.updatePositions();
			})
	}

	toggleAdder = () => {
        this.setState({added: !this.state.added})
    }

	// Delete position and application from server
	deletePosition() {
		deleteLabPosition(this.props.lab_id, [this.props.pos_id]).then(resp => {
			// TODO: Delete application

			if (this.props.updatePositions)
				this.props.updatePositions();
		})
	}

	// updates application from question responses to be ready for submittal
	updateApplication = (question_resps) => {
		this.setState({question_resps});
	}

	// Update the new position from modal, to be submitted by updatePostion
	updateNewPosState(name, value) {
		let newState = this.state;
		newState.new_pos[name] = value;
		this.setState(newState);
	  }

	// Update this function with backend functionality to save application
	// You can access the response under 'this.state.question_resps'
	submitApplication() {
		let question_resps = this.state.question_resps,
			resps = []

		if (question_resps) 
			resps = question_resps.map(q => { return {question: q.question, answer: q.answer}})

		let application = {
			position_id: this.props.pos_id,
			responses: resps,
		}

		createStudentApplicationResponse(getCurrentStudentId(), this.props.pos_id, application).then((resp) => {
			if (resp.data && resp.data.id) {
				submitStudentApplicationResponse(getCurrentStudentId(), this.props.pos_id)
					.then(r => {
						alert("Application Successfully Submitted!")
						this.setState({submitted: true})
					})
					.catch(e=>alert('Error in create application response'))
			}
		})
	}

	isAdmin() {
		let i = 0;
		let admins = this.props.admins || []
		for (i = 0; i < admins.length; i++) {
			if (admins[i][1] === parseInt(getCurrentUserId(), 10)) {
				return true;
			}
		}
		return false;
	}

	renderModal() {
		// If not owner of lab (use-case, student), render application modal.
		let edit_modal = ""
		if (!this.isAdmin()) {
			edit_modal = <EditModal id={`${this.props.pos_id}-apply`} wide={true} actionName="submit"
							title={`Apply To ${this.props.title}`} modalAction={this.submitApplication.bind(this)}>
							<Apply updateQuestions={this.updateApplication} lab_id={this.props.lab_id} pos_id={this.props.pos_id} position={this.props.cur_pos}/>
						</EditModal>
		}
		// If owner of lab, show edit position modal.
		else {
			edit_modal = <EditModal id={`${this.props.pos_id}-apply`} wide={true} actionName="update" deleteFunc={this.deletePosition.bind(this)}
							title={`Edit ${this.props.title}`} modalAction={this.updatePosition.bind(this)}>
							<CreatePosition edit={true} pos_id={this.props.pos_id} lab_id={this.props.lab_id} new_pos={this.props.cur_pos} updateNewPosState={this.updateNewPosState.bind(this)} updateAppQuestions={(app_questions) => this.setState({app_questions})} />
						</EditModal>
		}
		return edit_modal
	}

	renderApplicantModal() {
		if (!this.isAdmin())
			return;
		// Show current applicants to lab
		return <EditModal id={`${this.props.pos_id}-applicants`} wide={true} noAction={true}
					title={`Applicants to ${this.props.title}`} >
					<Applicants applicants={this.state.applicants} pos_id={this.props.pos_id} lab_id={this.props.lab_id}/>
				</EditModal>
	}

	renderProjectName() {
		return(
			<div className='group-project-name-container'>
				<span className='group-project-name'>
					<span>{this.props.title}</span>
					{this.props.urop && <span className='group-project-tag'>UROP</span>}
				</span>
			</div>
		)
	}

	// Display number of applicants and modal to show applicants
	renderApplicantCTA() {
		if (!this.isAdmin())
			return;
		let view_app_text = "No Applicants"
		let view_app_css = 'group-project-applicant-cta'
		let openFunc = () => this.openModal(`${this.props.pos_id}-applicants`)
		if (!this.state.applicants.length || this.state.applicants.length == 0) {
			view_app_css = 'group-project-no-applicants'
			openFunc = () => {}
		}
		else if (this.state.applicants.length == 1) 
			view_app_text = "View 1 Applicant"
		else if (this.state.applicants.length > 1)
			view_app_text = "View " + this.state.applicants.length + " Applicants"
		let project_action = <div className={view_app_css} onClick={openFunc}>{view_app_text}</div>
		return project_action;
	}

	renderKeywords() {
		return(
			<div className='group-project-keywords'>{this.props.keywords}</div>
		)
	}

	renderDescription() {
		return(
			<div id={`group-project-description-${this.props.title}`} className='group-project-description'>
				<div>{this.props.description}</div>
				{/* Edited for now since we don't have much
					<div className='group-project-requirements-header'>Minimum Requirements</div>*/}
				<GroupProjectRequirement title='Time commitment' value={`${this.props.time_commit} hrs/week`}/>
				{/*Edited For now since not in back end
				<GroupProjectRequirement title='GPA' value={this.props.gpa} />
				<GroupProjectRequirement title='Year' value={this.props.year}/>
				<GroupProjectRequirement value="MISSING"/>
				*/}
				{/* Edited for now ssince we don't have much
				<div className='group-project-requirements-header'>Skills</div>*/}
				{/*<GroupProjectRequirement value="MISSING"/>*/}
			</div>
		)
	}

	renderApply() {
		let project_action = <div className='group-project-apply' onClick={() => this.openModal(`${this.props.pos_id}-apply`)}>Apply</div>
		if (this.isAdmin()) 
			project_action = <Editor superClick={() => this.openModal(`${this.props.pos_id}-apply`)}/>
		if (this.state.submitted) 
			project_action = <div className='group-project-application-submitted' >Application<br/>Submitted</div>;
		return(
			<div>
				{project_action}
				{this.props.spots && <div className='group-project-openings'><b>{this.props.spots}</b> {this.props.spots - 1 ? "spots" : "spot"}</div>}
			</div>
		)
	}

	saveProject = () => {
        addToStudentPositionList([this.props.pos_id])
        this.toggleAdder()
    }

    removeProject = () => {
        removeFromStudentPositionList([this.props.pos_id])
        this.toggleAdder()
    }

	renderSave() {
		// let saved = false
		// console.log('saved!!',this.props.saved_labs)
  //         for (let item in this.props.saved_labs) {
  //         	console.log('item!!!', item)
  //             if (item.id == this.props.pos_id)
  //                 saved = true
  //         }
		// this.setState({added: saved})
		var saveRemoveButton =
	      <div>
	        {!this.state.added && <div className='lab-srch-project-adder lab-srch-project-action-label' onClick={this.saveProject}>save</div>}
	        {this.state.added && <div className='lab-srch-project-adder lab-srch-project-action-label' onClick={this.removeProject}>remove</div>}
	      </div>
		if (this.state.submitted) {
			saveRemoveButton = null;
		}

	   	return saveRemoveButton

	}

	render() {

		return(
			<div id={`group-project-${this.props.title}`} className='group-project'>
				{this.renderModal()}
				{this.renderApplicantModal()}
				{this.renderProjectName()}
				{/*this.renderKeywords()*/}
				{this.renderDescription()}
				{this.renderApply()}
				{this.isAdmin() || this.renderSave()}
				{this.renderApplicantCTA()}
				<ExpanderIcons id={`group-project-description-${this.props.title}`} classBase='group-project' action={this.expand.bind(this)}/>
			</div>
		)
	}
}

export const GroupProjectContainer = (props) => {
	let editor = props.admin_access ? <Editor superClick={props.addFunction} add={true}/> : null
	let content = <div>{props.children}</div>
	if (props.children.length == 0)
		content = <div className="group-default-text">No Current Projects</div>
	return(
		<div id='group-project-container'>
			<h1>Projects
			{editor}
			</h1>
			{content}
		</div>
	)
}
