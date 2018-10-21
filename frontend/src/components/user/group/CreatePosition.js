import React, {Component} from 'react';
import './CreatePosition.css';

class CreatePosition extends Component {
	constructor(props) {
		super(props);
		let new_pos = {
			title: '',
			description: '',
			duties: '',
			min_qual: '',
			min_time_commitment: 10,
			contact_email: '',
			contact_phone: '',
		}
		if (props.new_pos) {
			console.log("NEW POS!", props.new_pos)
			new_pos = props.new_pos;
		}
		this.state = {
			lab_name: "",
			createGenHelpText: "Create a new group project! First, fill out some quick project information.",
			createAppQuestionsHelpText: "Next, add or edit questions you'd like to see answered by applicants to your lab.",
			editGenHelpText: "Edit .",
			editAppQuestionsHelpText: "Next, add or edit questions you'd like to see answered by applicants to your lab.",
			positionName: '',
			questions: [
				{
					"id": "q_0",
					"text": "Why are you interested in this project?"
				},
				{
					"id": "q_1",
					"text": "What makes you a good fit to work in our lab?"
				},
			],
			lowerHours: 8,
			upperHours: 10,
			numSlots: 1,
			q_index: 0,
			new_pos,
			modal_info: {},
		};
		this.state.modal_info.questions = this.state.questions;
		this.state.q_index = this.state.questions.length;
		this.alterQuestion = this.alterQuestion.bind(this);
	}
	
	// send position updates to parent
	updateNewPosState(event) {
		let new_pos = this.state.new_pos;
		new_pos[event.target.name] = event.target.value;
		if (this.props.updateNewPosState)
			this.props.updateNewPosState(event.target.name, event.target.value)
	}

	addQuestion() {
		var newQuestion = {
			"id": "q_" + this.state.q_index,
			"text": ''
		};
		var newQIndex = this.state.q_index + 1;
		var updated_questions = this.state.questions.concat([newQuestion]);
		this.setState({
			questions: updated_questions,
			q_index: newQIndex,
		});
		if (this.props.updateAppQuestions)
			this.props.updateAppQuestions(updated_questions)
	}

	alterQuestion(event, question_id) {
		var temp_questions = this.state.questions;
		var index = temp_questions.findIndex(item => item.id === question_id);
		temp_questions[index].text = event.target.value;
		this.setState({ questions: temp_questions });
		if (this.props.updateAppQuestions)
			this.props.updateAppQuestions(temp_questions)
	}

	removeQuestion(question_id) {
		this.setState((prevState) => {
			var temp_questions = prevState.questions;
			var removeIndex = temp_questions.map(function(item) { return item.id; }).indexOf(question_id);
			temp_questions.splice(removeIndex, 1);
			if (this.props.updateAppQuestions)
				this.props.updateAppQuestions(temp_questions)
			return { questions: temp_questions };
		});
	}

	render() {
		return (
			<div className='center-align'>
					<form className='file-field'>
					{/* GENERAL POSITION INFORMATION */}
						<div className="apply-help-text">{this.props.edit ? this.state.editGenHelpText : this.state.createGenHelpText}</div>
						<h2 className="apply-question-label"><b>Title & Description</b></h2>
						<input name="title" value={this.state.new_pos.title} type="text" placeholder="Project Title" onChange={event => this.updateNewPosState(event)}></input>
						<textarea className="textarea-experience" name="description" value={this.state.new_pos.description} type="text" placeholder="short description of project and responsibilities for workers on project team" onChange={event => this.updateNewPosState(event)}></textarea>
						<div className='row create-position-row'>
							<h2 className="apply-question-label col s7"><b>Primary Contact Information</b></h2>
							<h2 className="apply-question-label col s5"><b>Expected Time Commitment</b></h2>
						</div>
		  				<div className='row create-position-row-input'>
		  					<div className="input-field col s3">
			                	<input className='gen-input' name="contact_phone" value={this.state.new_pos.contact_phone} type='text' placeholder="123-456-7890" onChange={event => this.updateNewPosState(event)} />
			                	<label htmlFor="lower_bound_hours" className="active">Contact Phone</label>
			            	</div>
			            	<div className="input-field col s3">
				                <input className='gen-input' name="contact_email" value={this.state.new_pos.contact_email} type='text' placeholder="contact@univ.edu"onChange={event => this.updateNewPosState(event)} />
				                <label htmlFor="upper_bound_hours" className="active">Contact Email</label>
				            </div>
                        	<div className="input-field col s1">
            	            </div>
                        	<div className="input-field col s4">
            	                <input className='gen-input' name="min_time_commitment" value={this.state.new_pos.min_time_commitment} type='number' step="1" onChange={event => this.updateNewPosState(event)} />
            	                <label htmlFor="num_open_slots" className="active">Hours/Week</label>
            	            </div>
		  				</div>
				    {/* APPLICATION QUESTIONS */}
		  			<div className="apply-help-text">{this.props.edit ? this.state.editAppQuestionsHelpText : this.state.createAppQuestionsHelpText}</div>
						<h2 className="apply-question-label application"><b>Project Application Questions</b></h2>
						    {this.state.questions.map((question) => {
								return (
									<div key={`${question.id}-q`} className="row">
										<div className="col s11">
											<textarea id={question.id} type="text" className="textarea-experience" value={question.text} rows='3' onChange={event => this.alterQuestion(event, question.id)} required></textarea>
										</div>
										<div className="col s1">
											<a id={question.id} className="remove-question" onClick={() => this.removeQuestion(question.id)}><i className="material-icons interest-editor opacity-1">clear</i></a>
										</div>
									</div>);
							})}
						<a onClick={this.addQuestion.bind(this)} id="addQuestionCenter" > <i className="material-icons">add</i></a>
						<br/><br/>
					</form>
				</div>
		);
	}
}

export default CreatePosition;
