import React, {Component} from 'react';
import BasicButton from './BasicButton';
import shave from 'shave';
import './LabListItem.css';

class LabListItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='lab-list-item shadow'>
				<a href={this.props.profile_link}><img src={this.props.img} className='lab-list-item-img'/></a>
				<div className='lab-list-tag-container'>
					<a className='null-link-style' href={this.props.profile_link}><div className='lab-list-name hide-on-small-only'>{this.props.labName}</div></a>
					<span className='hide-on-small-only'>{this.props.tags.map((tag) => <div key={tag} className='floater-item'>{tag}</div>)}</span>
				</div>
				
				<div className="lab-list-btn-container"><BasicButton dest={this.props.dest} msg={this.props.btn_msg}/></div>
			</div>
		);
	}
}

export default LabListItem;