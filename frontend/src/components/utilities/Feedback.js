import React, {Component} from 'react';
import {submitUserFeedback, getCurrentUserId} from '../../helper'
import BasicButton from './buttons/BasicButton'
import './Feedback.css';

class Feedback extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: 'false',
			url: window.location.href.split('?source=')[1],
			text: '',
		};
		this.submitFeedback = this.submitFeedback.bind(this);
	}

	submitFeedback(event) {
		alert(this.state.text)
		submitUserFeedback(getCurrentUserId(), this.state.url, this.state.text)
		this.setState({ submitted: 'true' });

	}

	render() {
		return (
			<div className='feedback shift-down'>
				{ (this.state.submitted === 'true') ? 
					<div className='container big-feedback valign-wrapper'>
						<div className='container center-align'>
							Thank You!
						</div>
					</div>
				:
					<div>
						<div class="container center-align">
							<h3 className='feedback-preface'> 
								Something go terribly wrong? <br/> 
								Particularly right? We want to know! 
							</h3>
						</div>
						<div className='container center-align feedback-form'>
							<div className='feedback-header'>Submit Feedback</div>
							<form className='feedback-input-container input-field'>
								<input id='feedback-src' className='feedback-input' value={this.state.url} onChange={e => this.setState({url: e.target.value})} type="text" placeholder="Page URL"></input>
								<label htmlFor='feedback-src'>Problem Url</label>
								<textarea className='feedback-textarea-input' type="textArea" 
									placeholder="A short description of your experience" onChange={e => this.setState({text: e.target.value})}></textarea>
								<br/>
								<BasicButton msg='roast us' superClick={this.submitFeedback}/>
							</form>
						</div>
					</div> 
				}
			</div>
		);
	}
}

export default Feedback;
