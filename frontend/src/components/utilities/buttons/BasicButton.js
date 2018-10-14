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
		return (
			<div id="BasicBtnWrap" style={this.props.style}>
				{this.props.color === 'light' ? 
					<a onClick={this.onClick} href={this.props.dest} target={this.target}>
						<button className="btn waves-effect waves-blue waves-light basic-btn-light" name="action">
							{this.props.msg}
						</button>
					</a> 
					: 
					<a onClick={this.onClick} href={this.props.dest} target={this.target}>
						<button className="btn waves-effect waves-blue waves-light basic-btn" name="action">
							{this.props.msg}
						</button>
					</a> 
				}
			</div>
		);
	}
}

export default BasicButton;