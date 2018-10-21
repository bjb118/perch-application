import React, {Component} from 'react';
import AppQuestionTab from './AppQuestionTab';
import { getLabPosition, getLab, getPositionApplication, getCurrentUserId, createApplication, createLab, updateLab, deleteLab, addMembersToLab, getCurrentFacultyId, getAllLabData, getAllLabs, isFaculty } from '../../helper.js';
import './CreateLab.css';

export let modalCreateLab = (lab, callback) => {
	if (isFaculty()) {
		console.log("Attempting to create lab ...");
		console.log("CLAB", lab);
		createLab(getCurrentFacultyId(), lab).then(r => {
			updateLab(r.data.id, lab).then(r2 => {
				callback(r.data.id);
			})
		})
	}
}

export let modalUpdateLab = (lab, callback) => {
	if (isFaculty()) {
		console.log("Attempting to update lab ...");
		console.log("ULAB", lab);
		updateLab(lab.id, lab).then(r => {
			console.log(r);
			callback();
		})
	}
}

export let modalDeleteLab = (lab, callback) => {
	if (isFaculty()) {
		console.log("Attempting to delete lab ...", lab.id);
		deleteLab(lab.id).then(r => {
			console.log(r)
			callback();
		})
	}
}

class CreateLab extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lab: {
				name: "",
				description: "",
				publications: "",
				url: "",
				location: "",
				contact_phone: "",
				contact_email: "",
				labpic_path: "",
				id: "",
			}
		};
	}

	updateQuestions(questions) {
		if (this.props.updateQuestions) {
			this.props.updateQuestions(questions);
		}
	}

	alterObj(e) {
		let lab = this.state.lab;
		lab[e.target.name] = e.target.value;
		this.setState({lab});
		if (this.props.updateLabState) {
			this.props.updateLabState(e.target.name, e.target.value);
		}
	}

	componentDidMount() {
		getAllLabs().then(r => {
			console.log("trying to get all labs!", r);
		})
	}

	render() {
		return (
			<div className="create-lab-wrapper">
				<p>So you want to create a new lab, eh? Let&#39;s get started! Upon clicking 'create', you&#39;ll be redirected to your new lab page.</p>
				<b>Name</b>
				<input type='text' name='name' value={this.state.lab.name} onChange={(e) => this.alterObj(e)}/>
				<b>Description</b>
				<textarea className="textarea-experience" id="textArea" type="text" name='description' value={this.state.lab.description} placeholder="short description of project and responsibilities for workers on project team" onChange={(e) => this.alterObj(e)}></textarea>
				<br/>
				<b>Publications</b>
				<input type='text' name='publications' value={this.state.lab.publications} onChange={(e) => this.alterObj(e)}/>
				<b>URL</b>
				<input type='text' name='url' value={this.state.lab.url} onChange={(e) => this.alterObj(e)}/>
				<b>Location</b>
				<input type='text' name='location' value={this.state.lab.location} onChange={(e) => this.alterObj(e)}/>
				<div className="contact-line">
					<div className="contact-left">
						<b>Contact Phone</b>
						<input type='text' name='contact_phone' value={this.state.lab.contact_phone} onChange={(e) => this.alterObj(e)}/>
					</div>
					<div>
						<b>Contact Email</b>
						<input type='text' name='contact_email' value={this.state.lab.contact_email} onChange={(e) => this.alterObj(e)}/>
					</div>
				</div>
				{/*<b>LabPic Path</b>
				<input type='text' name='labpic_path' value={this.state.lab.labpic_path} onChange={(e) => this.alterObj(e)}/>*/}
				{/*<br/><button onClick={this.modalCreateLab.bind(this)}>CREATE A NEW LAB!</button><br/><br/>*/}
				{/*<br/><button onClick={this.modalUpdateLab.bind(this)}>Update Lab! (Be sure to include the correct id below)</button><br/>*/}
			</div>
		);
	}
}

export default CreateLab;
