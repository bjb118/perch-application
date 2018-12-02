import React, { Component } from 'react'
import BasicButton from '../../utilities/buttons/BasicButton'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import $ from 'jquery'
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
import {
  getStudent,
  isLoggedIn,
  isStudent,
  getCurrentStudentId,
  getCurrentUserId,
  verifyLogin,
  getStudentFromUser,
  getStudentTags,
  getStudentSkills,
  getUser,
  updateStudent,
  addSkillsToStudent,
  addTagsToStudent,
  addWorkExperienceToStudent,
  addEduExperienceToStudent,
  primeExternalLink
} from '../../../helper.js'
import './StudentOnboarding.scss'

class StudentOnboarding extends Component {
  constructor (props) {
    super(props)
    this.sendUpdate = this.sendUpdate.bind(this)
    this.updateTags = this.updateTags.bind(this)
    this.updateExperience = this.updateExperience.bind(this)
    this.sendAcademicInfo = this.sendAcademicInfo.bind(this)

    this.state = {
      curStep: 0,
      numSteps: 4,
      user: {
        gpa: 3.7,
        year: 'None Selected',
        classes: [],
        bio: ''
      }
    }
  }

  componentDidMount () {
    /* Get student information and prefill form */
    getStudentFromUser(getCurrentUserId())
      .then(({ data }) => this.setState({user: data}))
  }

  sendUpdate (redirect) {
    var user = this.state.user
    var nameArr = user && user.name ? user.name.split(' ') : []
    var first_name = nameArr[0] || ''
    var last_name = nameArr[1] || ''
    var linkedin_link = user.linkedin_link
      ? primeExternalLink(user.linkedin_link)
      : ''
    var website_link = user.website_link
      ? primeExternalLink(user.website_link)
      : ''
    var s = {
      contact_email: user.contact_email || '',
      contact_phone: user.contact_phone || '',
      year: user.year || '',
      bio: user.bio || '',
      major: user.major || '',
      gpa: user.gpa || 4.0,
      classes: user.classes || [],
      skills: user.skills || [],
      interests: user.tags || []
    }

    updateStudent(s)
      .then(r => console.log('updated student', r))
      .then(r => {
        getStudentFromUser(getCurrentUserId())
          .then(r => {
            if (redirect) {
              window.location = '/student-profile/' + getCurrentUserId()
            }
          })
          .catch(e => alert('ERROR'))
      })
  }

  sendAcademicInfo () {
    var class_arr = []
    if (this.state.user.classes) {
      this.state.user.classes.map(c => {
        class_arr.push(c.name)
      })
    }
    var major_arr = []
    major_arr.push(this.state.user.major)

    addEduExperienceToStudent(
      this.state.user.university,
      'start',
      'end',
      true,
      this.state.user.year,
      this.state.user.gpa,
      class_arr,
      major_arr
    ).then(resp => {
      getStudentFromUser(getCurrentUserId()).then(r => {})
    })
  }

  updateTags () {
    var skillIds = []
    var intIds = []
    if (this.state.user.skills && this.state.user.skills.length) {
      this.state.user.skills.map(skill => {
        skillIds.push(skill.id)
      })
    }
    if (this.state.user.tags && this.state.user.tags.length) {
      this.state.user.tags.map(interest => {
        intIds.push(interest.id)
      })
    }
    addTagsToStudent(intIds).then(r => {
      addSkillsToStudent(skillIds).then(r => {})
    })
  }

  updateExperience () {
    if (
      this.state.user.work_experiences &&
      this.state.user.work_experiences.length
    ) {
      this.state.user.work_experiences.map(exp => {
        addWorkExperienceToStudent(exp).then(r => {
          getStudentFromUser(getCurrentUserId()).then(r2 => {})
        })
      })
    }
  }

  updateUser (field, newValue) {
    var newState = this.state
    newState.user[field] = newValue
    this.setState(newState)
  }

  render () {
    var backBtn = (
      <BasicButton
        msg='back'
        superClick={() => {
          this.setState({ curStep: this.state.curStep - 1 })
          this.sendUpdate()
        }}
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
    var steps = {
      0: {
        comp: [
          <UploadImage
            showContact
            user={this.state.user}
            updateUser={this.updateUser.bind(this)}
          />,
          <EnterContact
            user={this.state.user}
            updateUser={this.updateUser.bind(this)}
          />,
          <Links
            user={this.state.user}
            updateUser={this.updateUser.bind(this)}
          />
        ],
        text:
          "Welcome to Perch! We'll begin by gathering some information about you to set up your profile. \nDon't worry about perfection - you can edit these fields afterwards at any time."
      },
      1: {
        comp: (
          <PickYourInterests
            user={this.state.user}
            updateUser={this.updateUser.bind(this)}
          />
        ),
        text:
          'Search skills and interests that apply to you, and click on the bubbles to add them to your profile.'
      },
      // 2: {
      //   comp: '',
      //   text: 'Enter your school and your GPA, major (or intended major), class year, and relevant classes for this school.'
      // },
      2: {
        comp: (
          <Experience
            user={this.state.user}
            updateUser={this.updateUser.bind(this)}
          />
        ),
        text:
          'Enter any relevant lab or work experience and a short description of your contributions.'
      },
      3: {
        comp: (
          <EnterBio
            user={this.state.user}
            updateUser={this.updateUser.bind(this)}
          />
        ),
        text:
          'Enter a short description to describe yourself research interests and experience.' // add word limit
      }
    }
    var stepToRender = steps[this.state.curStep]
    if (this.state.curStep === 0) {
      backBtn = null
    } else if (this.state.curStep === this.state.numSteps - 1) {
      nextBtn = (
        <BasicButton
          msg='go to profile'
          superClick={() => this.sendUpdate(true)}
        />
      )
    }
    var css = 'invisible'
    if (this.state.curStep === 1) {
      nextBtn = (
        <BasicButton
          msg='next'
          superClick={() => {
            this.setState({ curStep: this.state.curStep + 1 })
            this.updateTags()
          }}
        />
      )
    }
    // if (this.state.curStep === 2) {
    //   css = 'visible-yes'
    //   nextBtn = (
    //     <BasicButton
    //       msg='next'
    //       superClick={() => {
    //         this.setState({ curStep: this.state.curStep + 1 })
    //         this.sendAcademicInfo()
    //       }}
    //     />
    //   )
    // }
    if (this.state.curStep === 2) {
      nextBtn = (
        <BasicButton
          msg='next'
          superClick={() => {
            this.setState({ curStep: this.state.curStep + 1 })
            this.updateExperience()
          }}
        />
      )
    }
    var dropDown = (
      <div className={css}>
        <NotableClasses
          user={this.state.user}
          showForm
          showAllEducation
          updateUser={this.updateUser.bind(this)}
        />
      </div>
    )
    return (
      <div className='onboarding-container'>
        <ProgressIndicator
          steps={this.state.numSteps}
          curStep={this.state.curStep}
        />
        <div className='onboarding-text'>{stepToRender.text}</div>
        {dropDown}
        {stepToRender.comp}
        {backBtn}
        {nextBtn}
      </div>
    )
  }
}

export default StudentOnboarding
