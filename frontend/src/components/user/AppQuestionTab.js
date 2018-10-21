import React, {Component} from 'react';
import ModalButton from '../utilities/buttons/ModalButton';
import './AppQuestionTab.css';

class AppQuestionTab extends Component {
	constructor(props) {
		super(props);
		this.updateQuestions = this.updateQuestions.bind(this);
		this.state = {
			questions: props.questions,
		}
	}

	// set initial questions from parent
	componentWillReceiveProps(props) {
		if (props.questions) {
			this.setState({questions: props.questions})
		}
	}

	// update questions in state & return updated array to parent
	updateQuestions(event, index) {
		var temp_questions = this.state.questions;
		temp_questions[index].response = event.target.value;
		this.setState({
			questions: temp_questions,
		});
		if (this.props.updateQuestions) {
			this.props.updateQuestions(temp_questions);
		}
	}

	render() {
		return (
			<div className="app-question-tab" id="appQuestionTab">
				<h1 className='app-question-tab-header'>APPLICATION QUESTIONS</h1>
				<div className='app-question-tab-body'>
					<form className='file-field'>
					    {this.props.questions.map((question, index) => {
					    	var key1 = question.id + "_p";
					    	var key2 = question.id + "_text_input";
							return (
								<div key={key1}><div className="apply-question-tab-label" htmlFor={question.id}>{question.question}</div>
								<textarea key={key2} id={question.id} type="text" className="textarea-experience" value={question.response} onChange={(e) => this.updateQuestions(e, index)} required />
								<br/></div>);
						})}
					</form>
				</div>
			</div>
		);
	}
}

export default AppQuestionTab;
