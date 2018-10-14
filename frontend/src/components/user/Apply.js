import React, {Component} from 'react';
import AppQuestionTab from './AppQuestionTab';
import { getLabPosition, getLab, getPositionApplication, createApplication } from '../../helper.js';
import './Apply.css';

class Apply extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: [],
			applyHelpText: "To apply, fill out the questions below & click submit. A lab contact will reach out to you if it seems like a good match!",
		};
	}

	updateQuestions(questions) {
		if (this.props.updateQuestions) {
			this.props.updateQuestions(questions);
		}
	}

	componentDidMount() {
		// set state from passed-in position information (some currently defaulted)
		this.setState({
			pos_description: this.props.description ? this.props.description : "You do interesting work.",
			time_comm: "5-10 hours", // TODO: receive & set actual time commitment
			questions: [ // currently using default two questions, could make position-specific
				{
					id: 1,
					question: "Why are you interested in this project?",
					response: "",
				},
				{
					id: 2,
					question: "What makes you a good fit to work in our lab?",
					response: "",
				},
			]
		});
	}

	render() {
		return (
			<div className="apply-wrapper">
				<div className="apply-descriptor"><b>Position Description: </b>{this.state.pos_description}</div>
				<div className="apply-descriptor"><b>Time Commitment: </b>{this.state.time_comm}</div>
				<div className="apply-help-text">{this.state.applyHelpText}</div>
				<AppQuestionTab updateQuestions={this.updateQuestions.bind(this)} questions={(this.state.questions && this.state.questions.length) ? this.state.questions : []} />
			</div>
		);
	}
}

export default Apply;
