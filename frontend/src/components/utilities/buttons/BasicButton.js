import React, {Component} from 'react';
import './BasicButton.css';

class BasicButton extends Component {
	constructor(props) {
		super(props);
		this.onClick = this.onClick.bind(this);
		if (this.props.target)
			this.target = '_blank'
	}

	onClick(event) {
		if (this.props.superClick) {
			this.props.superClick();
		}
	}

	render() {
		let button_css = "btn waves-effect waves-blue waves-light basic-btn";
		if (this.props.color === 'light')
			button_css = "btn waves-effect waves-blue waves-light basic-btn-light";
		if (this.props.delete)
			button_css = "btn waves-effect waves-blue waves-light basic-btn-delete";

		return (
			<div id="BasicBtnWrap" style={this.props.style}>
				<a onClick={this.onClick} href={this.props.dest} target={this.target}>
					<button className={button_css} name="action">
						{this.props.msg}
					</button>
				</a> 
			</div>
		);
	}
}

export default BasicButton;