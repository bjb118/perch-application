import React, { Component } from 'react'
import { EditContainerOnboarding, EditClasses } from './StudentEditors.js'

class Education extends Component {
  constructor (props) {
    super(props)
  }

  redirect () {
    window.location = '/links'
  }

  render () {
    return (
      <EditContainerOnboarding
        title='Education'
        redirect={this.redirect.bind(this)}
      >
        <EditClasses
          user={this.props.user}
          updateUser={this.props.updateUser}
        />
      </EditContainerOnboarding>
    )
  }
}

export default Education
