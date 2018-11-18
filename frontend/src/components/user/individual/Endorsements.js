import React, { Component } from 'react'
import './Endorsements.css'

class Endorsements extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dest: '/update-student-bio'
    }
    if (this.props.user_type === 'faculty') {
      this.state.dest = '/update-lab-description'
    }
  }

  render () {
    return (
      <div className='tab-container shadow'>
        <div className='tab-header'>
          <div className='endorsement-header'>Faculty Endorsements</div>
          {/* <a href={this.state.dest}><i className="material-icons interest-editor edit-icon">create</i></a> */}
        </div>
        <div className='endorsement-tab center-align'>
          {this.props.endorsements.map(endorsement => (
            <a href={endorsement.url} className='endorsement-name'>
              <div>{endorsement.name}</div>
            </a>
          ))}
        </div>
      </div>
    )
  }
}

export default Endorsements
