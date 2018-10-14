/* Team Member Card Class for the Perch Periodic Table */
/* (or more popularly, the per(ch)iodic table ;))      */

import React, { Component } from 'react';
import './TableCard.css';

class TableCard extends Component {
	constructor(props) {
		super(props);

		var member = props.member ? props.member : {};
		this.state = { member };

	}

	render() {
		var mem = this.state.member;
		var initials = "";
		initials += (mem.firstName && mem.firstName !== "") ? mem.firstName.charAt(0).toUpperCase() : "H";
		initials += (mem.lastName && mem.lastName !== "") ? mem.lastName.charAt(0).toLowerCase() : "i";

		var tableCardCSS = "table-card ";
		var tableCardCoverCSS = "table-card-cover ";
		var tableHoverCardCSS = "table-hovercard ";
		var arrowCSS = "arrow-down ";
		if (this.props.team) {
			tableCardCSS += this.props.team + "-tcs";
			tableCardCoverCSS += this.props.team + "-tccbg";
			tableHoverCardCSS += this.props.team + "-tcs";
			arrowCSS += this.props.team + "-a";
		}
		if (this.props.colSplit) {
			tableCardCSS += " table-split";
		}

		return(
			<div className={tableCardCSS} id={mem.slug}>
				<div className={tableHoverCardCSS}>
					<div>
						<div className="table-hovercard-title">
							{mem.firstName} {mem.lastName}
						</div>
						<div>{mem.position}</div>
					</div>
				</div>
				<div className="arrow-down-white"></div>
				<div className={arrowCSS}></div>
        <img
					className="table-card-image"
					alt="team member"
					src={`img/headshots/${mem.slug}.jpg`} />
        <div className={tableCardCoverCSS}></div>
        <div className="table-card-inits"> {initials} </div>
    	</div>
		);
	}
}

export default TableCard;
