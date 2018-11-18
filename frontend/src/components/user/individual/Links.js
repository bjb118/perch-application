import React, { Component } from 'react'
import { EditContainerOnboarding, EditLinks } from './StudentEditors.js'

class Links extends Component {
  constructor (props) {
    super(props)
  }

  redirect () {
    window.location = '/student-profile/'
  }

  render () {
    return (
      <EditContainerOnboarding
        title='Links'
        redirect={this.redirect.bind(this)}
      >
        <form>
          <EditLinks
            prof={this.props.prof}
            user={this.props.user}
            updateUser={this.props.updateUser}
          />
        </form>
      </EditContainerOnboarding>
    )
  }
}

export default Links
