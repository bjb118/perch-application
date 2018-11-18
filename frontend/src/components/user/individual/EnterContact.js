import React, { Component } from 'react'
import { EditContainerOnboarding, EditContact } from './StudentEditors.js'
import './EnterContact.css'

class EnterContact extends Component {
  constructor (props) {
    super(props)
  }

  redirect () {
    window.location = '/lab-skills'
  }

  render () {
    return (
      <EditContainerOnboarding
        title='Contact Information'
        redirect={this.redirect.bind(this)}
      >
        <EditContact
          noEmail
          updateUser={this.props.updateUser}
          user={this.props.user}
        />
      </EditContainerOnboarding>
    )
  }
}

export default EnterContact
