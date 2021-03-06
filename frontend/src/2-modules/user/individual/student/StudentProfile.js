import React, { Component } from 'react'
import Presentation from './Presentation'
import Modals from './Modals'
import {
  getUserProfile,
  getProfilePicture,
  getCurrentUserId,
  updateUserProfile
} from '../../../../backend/index'
import Axios from 'axios'

let getStudentFromUser, updateStudent, uploadUserProfilePic, getUserProfilePic
/* In charge of all state requests and management for student profile */
class StudentProfile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      id: null,
      contactEmail: '',
      contactPhone: '',
      profile: {},
      degrees: [],
      experiences: [],
      honors: [],
      links: [],
      role: '',
      universityId: null,

      profilePictureFiles: [],
      resumeFiles: [],

      skills: [],
      tags: [],
      work_experiences: [],
      crop: {
        x: 0.5,
        y: 0.5,
        scale: 1
      },
      owner: false,
      student: true,
      img: ''
    }

    this.updateUser = this.updateUser.bind(this)
    this.sendHeaderInfo = this.sendHeaderInfo.bind(this)
  }

  // Beginning point for data handling
  componentDidMount () {
    let id = window.location.pathname.split('/')[2]
    this.retrieveStudent(id)
    this.retrieveProfilePicture(id)
  }

  // set intitial student data and ownership
  retrieveStudent (id) {
    getUserProfile({ user_id: id }).then(r => {
      let data = r.data.profile
      data.owner = data.userId === getCurrentUserId()
      console.log(data)
      this.setState(data)
    })
  }

  // this just updates the state object, not the backend
  // used by modals to keep the state object up to date
  // eliminates the need to re-query the backend after updates
  updateUser (field, newValue) {
    this.state[field] = newValue
    this.setState(this.state)
  }

  /*******************/
  /* IMAGE FUNCTIONS */
  /*******************/

  // grab picture from backend
  retrieveProfilePicture (id) {
    // getUserProfilePic(id)
    //   .catch(e => console.log('PIC ERROR', e))
    //   .then(r => {
    //     this.state.img = r.data.url || 'default image'
    //     this.setState(this.state)
    //   })
  }

  // backend needs a specially formatted object to send to backend for images
  // probably will be deprecated in the new node backend
  getImageData (user) {
    // default crop
    if (!user.crop) {
      user.crop = {
        x: 0.5,
        y: 0.5,
        scale: 1
      }
    }
    let formData = new FormData()
    formData.append('file', user.img)
    let to_return = {
      formData: formData,
      type: 'profile_pic',
      x: user.crop.x,
      y: user.crop.y,
      scale: user.crop.scale,
      user_id: getCurrentUserId()
    }
    return to_return
  }

  /*******************/
  /* MODAL FUNCTIONS */
  /*******************/

  // updates name and profile picture
  sendHeaderInfo () {
    let { name } = this.state
    updateUserProfile({ name })
    // var user = this.state
    // updateStudent({ first_name: user.name })
    // if (user.img) {
    //   uploadUserProfilePic(this.getImageData(user))
    //     .catch(e => console.log('profile pic bug'))
    //     .then(r => this.retrieveProfilePicture())
    // }
  }

  // sends links to backend
  sendLinks () {
    let { linkedin_link, website_link } = this.state
    updateStudent({ linkedin_link, website_link })
  }

  // sends email and phone to backend
  sendContactInfo () {
    let { contactEmail, contactPhone } = this.state
    updateStudent({
      contactEmail,
      contactPhone
    })
  }

  // sends bio to backend
  sendBio = () => {
    let { bio } = this.state
    updateStudent({ bio })
  }

  // sends work experiences to the backend
  // BROKEN, should keep track of work_experiences that are deleted rather than brute forcing
  // ask akshay for a sync function
  sendExperiences () {
    console.log('deprecated')
  }

  get functions () {
    return {
      updateUser: this.updateUser,
      sendHeaderInfo: this.sendHeaderInfo
    }
  }

  render () {
    return <Presentation {...this.state} {...this.functions} />
  }
}

export default StudentProfile
