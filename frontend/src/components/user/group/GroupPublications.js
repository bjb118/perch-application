import React, {Component} from 'react';
import './GroupPublications.css'
import ExpanderIcons from '../../utilities/ExpanderIcons'

export class GroupPublication extends Component {
	expand() {
		document.getElementById(`group-publication-description-${this.props.title}`).classList.toggle('expand');
	}

	render() {
		return(
			<div className='group-publication'>
				<i>{this.props.title}</i>
				<div id={`group-publication-description-${this.props.title}`} className='group-publication-description'>{this.props.description}</div>
				<ExpanderIcons id={`group-publication-description-${this.props.title}`} classBase='group-publication' action={this.expand.bind(this)}/>
			</div>
		)
	}
}

export const GroupPublicationsContainer = (props) => {
	let content = <div>{props.children}</div>
	if (props.children.length == 0)
		content = <div className="group-default-text">No Current Publications</div>
	return(
		<div id='group-publications-container'>
			<h1>Publications</h1>
			{content}
		</div>
	)
}
