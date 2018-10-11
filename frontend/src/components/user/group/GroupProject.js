import React, {Component} from 'react'
import ExpanderIcons from '../../utilities/ExpanderIcons'
import Editor from '../../utilities/Editor'
import Apply from '../../user/Apply'
import EditModal from '../../utilities/modals/EditModal'
import CreatePosition from './CreatePosition'
import GroupProjectRequirement from './GroupProjectRequirement'
import {createApplicationResponse, isFaculty, getCurrentUserId, getGroupMemberships} from '../../../helper.js'
import './GroupProject.css'

export class GroupProject extends Component {
	constructor(props) {
		super(props)
		this.state = {
			question_resps: [],
			app_questions: [],
			new_pos: { min_time_commitment: 10 },
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

	// updates application from question responses to be ready for submittal
	updateApplication = (question_resps) => {
		this.setState({question_resps});
	}

	// Update the new position from modal, to be submitted by createPosition
	updateNewPosState(name, value) {
		let newState = this.state;
		newState.new_pos[name] = value;
		this.setState(newState);
	  }

	// Update this function with backend functionality to save application
	// You can access the response under 'this.state.question_resps'
	submitApplication = () => {
		createApplicationResponse(this.state.question_resps).then(resp => {
			if (resp.data) {
				// get some info from resp when working

			}
		});
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
		let edit_modal = <EditModal id={`${this.props.id}-apply`} wide={true} actionName="submit"
							title={`Apply To ${this.props.title}`} modalAction={this.submitApplication}>
							<Apply updateQuestions={this.updateApplication} lab_id={this.props.lab_id} pos_id={this.props.pos_id} description={this.state.description}/>
						</EditModal>
		// If owner of lab, show edit position modal.
		if (this.isAdmin()) {
			edit_modal = <EditModal id={`${this.props.id}-apply`} wide={true} actionName="submit"
							title={`Edit ${this.props.title}`} modalAction={this.submitApplication}>
							<CreatePosition edit={true} updateNewPosState={this.updateNewPosState.bind(this)} updateAppQuestions={(app_questions) => this.setState({app_questions})} />
						</EditModal>
		}
		return edit_modal
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
				<GroupProjectRequirement title='Time commitment' value={this.props.time_commit}/>
				{/*Edited For now since not in back end
				<GroupProjectRequirement title='GPA' value={this.props.gpa}/>
				<GroupProjectRequirement title='Year' value={this.props.year}/>
				<GroupProjectRequirement value="MISSING"/>
				*/}
				{/* Edited for now ssince we don't have much
				<div className='group-project-requirements-header'>Skills</div>*/}
				<GroupProjectRequirement value="MISSING"/>
			</div>
		)
	}

	renderApply() {
		let project_action = <div className='group-project-apply' onClick={() => this.openModal(`${this.props.id}-apply`)}>Apply</div>
		if (this.isAdmin()) 
			project_action = <Editor superClick={() => this.openModal(`${this.props.id}-apply`)}/>
		return(
			<div>
				{project_action}
				{this.props.spots && <div className='group-project-openings'><b>{this.props.spots}</b> {this.props.spots - 1 ? "spots" : "spot"}</div>}
			</div>
		)
	}

	render() {
		return(
			<div id={`group-project-${this.props.title}`} className='group-project'>
				{this.renderModal()}
				{this.renderProjectName()}
				{this.renderKeywords()}
				{this.renderDescription()}
				{this.renderApply()}
				<ExpanderIcons id={`group-project-description-${this.props.title}`} classBase='group-project' action={this.expand.bind(this)}/>
			</div>
		)
	}
}

export const GroupProjectContainer = (props) => {
	let editor = isFaculty() ? <Editor superClick={props.addFunction} add={true}/> : null
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
