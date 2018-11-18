import React, {Component} from 'react';
import Editor from '../../utilities/Editor'
import ExpanderIcons from '../../utilities/ExpanderIcons'

import './GroupQuickview.css'

class GroupQuickview extends Component {

	expandDescription() {
        document.getElementById('group-page-description').classList.toggle('expand')
    }

	render() {
		return(
			<div id='group-page-quickview'>
				{this.props.admin_access && <Editor superClick={this.props.superClick}/>}
				<div id='gradient-overlay'></div>
				{/*<img src='https://d2v9y0dukr6mq2.cloudfront.net/video/thumbnail/BloSxjK/a-dynamic-texture-of-mud-spots-and-smears-over-a-white-background-composite-this-over-your-footage-or-use-for-transitions-to-give-your-footage-a-grunge-style_vkwbeh56__F0000.png' id='group-page-coverimage' />*/}
				{<img src='https://www.chem.ucla.edu/houk/houk-group-conf-room-1-august-2017.jpeg' id='group-page-coverimage' />}
				<div id='group-page-name' className='truncate'>{this.props.title}</div>
				{this.props.description !== 'NULL' &&
					<div>
						<div id='group-page-description'>{this.props.description}</div>
						{/*<ExpanderIcons id='group-page' action={this.expandDescription.bind(this)}/>*/}
					</div>
				}
			</div>
		)
	}
}

export default GroupQuickview;
