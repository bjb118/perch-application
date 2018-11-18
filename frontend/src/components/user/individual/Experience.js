import React, { Component } from 'react'
import { EditContainerOnboarding, EditExperience } from './StudentEditors.js'

class Experience extends Component {
  constructor (props) {
    super(props)
  }

  redirect () {
    window.location = '/education'
  }

  render () {
    return (
      <EditContainerOnboarding
        title='Experience'
        redirect={this.redirect.bind(this)}
      >
        <EditExperience
          type='work'
          user={this.props.user}
          updateUser={this.props.updateUser}
        />
      </EditContainerOnboarding>
    )
  }
}

export default Experience
