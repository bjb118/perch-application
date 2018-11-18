import React, {Component} from 'react';
import AppQuestionTab from './AppQuestionTab';
import './Apply.css';
import { getLabPosition } from '../../helper';

class Apply extends Component {
	constructor(props) {
		super(props);
		let position = this.props.position || {}
		this.state = {
			questions: position.questions || [],
			position,
			applyHelpText: "Let the lab get to know you! It's like tinder... but a lab",
		};
	}

	updateQuestions(questions) {
		if (this.props.updateQuestions) {
			this.props.updateQuestions(questions);
		}
	}

	componentDidMount() {
		let questions = [ // currently using default two questions, could make position-specific
			{
				number: 1,
				question: "Why are you interested in this project?",
				answer: "",
			},
			{
				number: 2,
				question: "What makes you a good fit to work in our lab?",
				answer: "",
			},
		];
		getLabPosition(this.props.lab_id, this.props.pos_id).then(resp => {
			if (resp.data && resp.data.application && resp.data.application.questions && resp.data.application.questions.length) {
				questions = resp.data.application.questions;
			}
			this.setState({
				pos_description: this.state.position.description || "No description provided.",
				time_comm: this.state.position.min_time_commitment || "No minimum time provided.",
				min_qual: this.state.position.min_qual,
				questions
			});
		})
	}

	render() {
		return (
			<div className="apply-wrapper">
				<div className="apply-descriptor"><b>Position Description: </b>{this.state.pos_description}</div>
				<div className="apply-descriptor"><b>Time Commitment: </b>{this.state.time_comm} hours per week</div>
				{this.state.min_qual && <div className="apply-descriptor"><b>Minimum Qualifications: </b>{this.state.min_qual}</div>}
				<AppQuestionTab updateQuestions={this.updateQuestions.bind(this)} questions={(this.state.questions && this.state.questions.length) ? this.state.questions : []} />
			</div>
		);
	}
}

export default Apply;
