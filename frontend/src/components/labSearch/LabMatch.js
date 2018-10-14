import React, {Component} from 'react';
import LabSearch2 from './LabSearch2';
import LabList from './LabList';
import {getAllLabs, getLabTags, isLoggedIn} from '../../helper.js'
import ErrorPage from '../utilities/ErrorPage'

class LabMatch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			labs: [],
		}
	}

	render() {
		if (isLoggedIn()) {
			return (
				<div className='shift-down'>
					<LabSearch2 />
				</div>
			);
		}
		else {
			return <ErrorPage />
		}
	}
}

export default LabMatch;
