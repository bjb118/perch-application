import React, {Component} from 'react';
import { parse } from 'query-string';
import ReactDOM from 'react-dom';
import Timeline from './timeline/Timeline'
import Team from './team/Team'
import PerchStory from './story/PerchStory'
import './About.css';
import {updateUrlQuery} from '../../../helper.js'

class About extends Component {
	componentDidMount() {
		let tab_type = this.props.location ? parse(this.props.location.search).tab : "story"
		switch(tab_type) {
			case 'story':
				this.showStory();
				break;
			case 'team':
				this.showTeam();
				break;
			case 'timeline':
				this.showTimeline();
				break;
			default:
				this.showStory();
				break;
		}
	}

	getNavs() {
		return document.getElementsByClassName('about-button');
	}

	//General function to highlight about navigator
	highlightAboutNav(input) {
		let navs = this.getNavs();
		{/*Removes active nav item*/}
		for (var i = navs.length - 1; i >= 0; i--) 
			navs[i].classList.remove('about-active');
		{/*Activates nav item*/}
		for (var i = navs.length - 1; i >= 0; i--) 
			if (input === navs[i].innerText.toLowerCase())
				navs[i].classList.add('about-active')
	}

	clearAboutBody() {
		ReactDOM.unmountComponentAtNode(document.getElementById('about-body'))
	}

	showTimeline() {
		this.highlightAboutNav('timeline');
		this.clearAboutBody();
		updateUrlQuery('tab', 'timeline');
		ReactDOM.render(<Timeline />, document.getElementById('about-body'))
	}

	showStory() {
		this.highlightAboutNav('perch story')
		this.clearAboutBody();
		updateUrlQuery('tab', 'story');
		ReactDOM.render(<PerchStory />, document.getElementById('about-body'))
	}

	showTeam() {
		this.highlightAboutNav('team')
		this.clearAboutBody();
		updateUrlQuery('tab', 'team');
		ReactDOM.render(<Team />, document.getElementById('about-body'))
	}

	render() {
		return (
			<div className="about center-align">
				<div className="about-nav">
					<div className='about-button about-active' onClick={() => this.showStory()}>Perch Story</div>
					<div className='about-button' onClick={() => this.showTeam()}>Team</div>
					<div className='about-button' onClick={() => this.showTimeline()}>Timeline</div>
				</div>
				<div id='about-body' className='about-body'></div>
			</div>

		);
	}
}

export default About;