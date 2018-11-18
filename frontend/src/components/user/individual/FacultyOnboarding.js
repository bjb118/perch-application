import React, { Component } from 'react'
import BasicButton from '../../utilities/buttons/BasicButton'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import './StudentEditors.css'
import { EditContact } from './StudentEditors'
import ProgressIndicator from '../../utilities/ProgressIndicator'
import EnterContact from './EnterContact'
import EnterBio from './EnterBio'
import PickYourInterests from './PickYourInterests'
import NotableClasses from './NotableClasses'
import UploadImage from '../maintenance/UploadImage'
import Experience from './Experience'
import Education from './Education'
import Links from './Links'
import { getCurrentFacultyId, updateFaculty } from '../../../helper.js'

class FacultyOnboarding extends Component {
  constructor (props) {
    super(props)
    this.state = {
      curStep: 0,
      numSteps: 6,
      user: {},
      steps: {}
    }
  }

  componentDidMount () {
    var steps = {
      0: (
        <EnterContact
          user={this.state.user}
          updateUser={this.updateUser.bind(this)}
        />
      ),
      1: (
        <EnterBio
          user={this.state.user}
          updateUser={this.updateUser.bind(this)}
        />
      ),
      2: (
        <UploadImage
          user={this.state.user}
          updateUser={this.updateUser.bind(this)}
        />
      ),
      3: (
        <Experience
          user={this.state.user}
          updateUser={this.updateUser.bind(this)}
        />
      ),
      4: (
        <Education
          user={this.state.user}
          updateUser={this.updateUser.bind(this)}
        />
      ),
      5: (
        <Links
          prof
          user={this.state.user}
          updateUser={this.updateUser.bind(this)}
        />
      )
    }
    this.setState({ steps })
  }

  redirect () {
    window.location = `/prof/${getCurrentFacultyId()}`
  }

  updateUser (field, newValue) {
    console.log('updating ', field, ' to ', newValue)
    var newState = this.state
    newState.user[field] = newValue
    this.setState(newState)
  }

  sendUpdate () {
    console.log(this.state.user)
    updateFaculty(getCurrentFacultyId(), this.state.user).then(r =>
      console.log(r)
    )
  }

  render () {
    var backBtn = (
      <BasicButton
        msg='back'
        superClick={() => this.setState({ curStep: this.state.curStep - 1 })}
      />
    )
    var nextBtn = (
      <BasicButton
        msg='next'
        superClick={() => {
          this.setState({ curStep: this.state.curStep + 1 })
          this.sendUpdate()
        }}
      />
    )
    var stepToRender = this.state.steps[this.state.curStep]
    if (this.state.curStep === 0) {
      backBtn = null
    } else if (this.state.curStep === this.state.numSteps - 1) {
      nextBtn = (
        <BasicButton
          msg='go to profile'
          superClick={this.redirect.bind(this)}
        />
      )
    }
    return (
      <div className='onboarding-container'>
        {backBtn}
        {nextBtn}
        <ProgressIndicator
          steps={this.state.numSteps}
          curStep={this.state.curStep}
        />
        {stepToRender}
      </div>
    )
  }
}

export default FacultyOnboarding
