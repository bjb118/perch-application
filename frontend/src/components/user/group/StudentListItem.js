import React, {Component} from 'react';
import ListModalButton from '../../utilities/buttons/ListModalButton';
import './StudentListItem.css';

class StudentListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			student_info: {
				name: this.props.name,
				tags: this.props.tags,
				profile_link: this.props.dest,
				slug: this.props.slug,
			}
		};
	}

	render() {
		return (
			<div className='student-list-item shadow'>
				<a href={this.props.dest}><img src={this.props.img} className='student-list-item-img' alt=''/></a>
				<div className='student-list-tag-container'>
					<a className='null-link-style' href={this.props.profile_link}><div className='student-list-name hide-on-small-only'>{this.props.name}</div></a>
					<span className='hide-on-small-only'>{this.props.tags.map((tag) => <div key={tag} className='floater-item'>{tag}</div>)}</span>
				</div>
				<div id="modalBackdrop"></div>
				<div className="student-list-btn-container" id="studentListButton"><ListModalButton info={this.state.student_info} /></div>
			</div>
		);
	}
}

export default StudentListItem;