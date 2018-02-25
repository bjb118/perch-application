import React, {Component} from 'react';
import './AcademicsTab.css';

class AcademicsTab extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='tab-container'>
				<div className='tab-header tab academic-tab-header'>school
					<a href='/update-notable-classes' id="editImageText" className="null-link-style" >
						<i className="material-icons interest-editor edit-icon" style={{float: 'right'}} >create</i>
					</a>
				</div> 
				<div className='academics-tab left-align'>
					<div>
						<span className='academic-label'>GPA: </span>
						<span className='academic-info'>{this.props.GPA}</span>
					</div>
					<div>
						<span className='academic-label'>Year: </span>
						<span className='academic-info'>{this.props.year}</span>
					</div>
					<div>
						<span className='academic-label'>Major: </span>
						<span className='academic-info'>{this.props.major}</span>
					</div>
					<ul className='academic-label'>Notable Classes: 
						{this.props.classes.map((c) => <li className='academic-info'>{c}</li>)}
					</ul>
				</div>
			</div>
		);
	}
}

export default AcademicsTab;