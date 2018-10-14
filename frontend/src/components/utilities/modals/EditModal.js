/*t
Modal for profile edit components; usage:

1) Pass relevant props:
	id, title, actionName (name for action button, default = "save"),
	modalAction (function to call on action button click).
	Pass child component as usual! (e.g. <EditModal ... ><Child/></EditModal>)

2) Add the following line of code to the parent component return:
	<div id="greyBackdrop" className="modal-backdrop"></div>

	Create & call handler in parent adding 'activated' classes to open, e.g. ...
	openEditModal() {
		document.getElementById( *id* ).classList.add('activated');
		document.getElementById("greyBackdrop").classList.add('activated');
	}
*/

import React, {Component} from 'react';
import BasicButton from '../buttons/BasicButton';
import './EditModal.css'

class EditModal extends Component {

	handleClose(event) {
	    document.getElementById(this.props.id).classList.remove('activated');
	    document.getElementById(`${this.props.id}-backdrop`).classList.remove('activated');
	}

	render() {
		var contentCSS = this.props.noPadding ? "modal-content modal-no-padding" : "modal-content";
		var bodyCSS = "modal modal-fixed-footer display-modal"
		if (this.props.wide)
			bodyCSS = "modal modal-fixed-footer wide-modal"
		if (this.props.medium)
			bodyCSS = "modal modal-fixed-footer medium-modal"
		if (this.props.slim)
			bodyCSS = "modal modal-fixed-footer slim-modal"

		return(
			<div>
				<div className="modal-backdrop" id={`${this.props.id}-backdrop`} />
				<div id={this.props.id} className={bodyCSS}>
					<h1>{this.props.title}</h1>
			 		<div className={contentCSS}>
						{this.props.children}
          			</div>
		          	<div className="modal-footer">
				     	<BasicButton superClick={this.handleClose.bind(this)} msg='close' />
				     	<BasicButton
								superClick={() => {
									if (this.props.modalAction) {
										this.props.modalAction();
									}
									this.handleClose();}}
								msg={this.props.actionName ? this.props.actionName : "save"} />
				  	</div>
			 	</div>
			</div>
		);
	}
}

export default EditModal;
