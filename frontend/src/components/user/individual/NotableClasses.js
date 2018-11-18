import React, { Component } from 'react'
import $ from 'jquery'
import { EditContainerOnboarding, EditClasses } from './StudentEditors.js'
import {
  getStudent,
  getCurrentUserId,
  getCurrentStudentId,
  getStudentFromUser
} from '../../../helper.js'
import './NotableClasses.css'

class NotableClasses extends Component {
  constructor (props) {
    super(props)
    var class_arr = props.user && props.user.classes
      ? props.user.classes
      : [{ id: 'c_0', name: '' }]
    this.state = {
      gpa: props.user && props.user.gpa ? props.user.gpa : '3.7',
      year: props.user && props.user.year ? props.user.year : '',
      major: props.user && props.user.major ? props.user.major : '',
      student_id: getCurrentStudentId(),
      class_arr,
      url_string: this.props.location
        ? this.props.location.pathname.split('/')[1]
        : ''
    }
    this.saveAndContinue = this.saveAndContinue.bind(this)
    this.state.c_index = this.state.class_arr.length
  }

  componentDidMount () {
    var id = getCurrentUserId()
    if (id) {
      getStudentFromUser(id).then(r => {
        let s_id = 0
        if (r.data) s_id = r.data.id
        this.setState({ student_id: s_id, user_id: id }, () => {
          getStudent(this.state.student_id).then(resp => {
            if (resp.data) {
              var class_arr = []
              var class_str_arr = ['']
              if (resp.data.classes) {
                class_str_arr = resp.data.classes.split('|')
              }
              var index = 1
              for (var i = 0; i < class_str_arr.length; ++i) {
                var class_item = {
                  id: `c_${index}`,
                  name: class_str_arr[i]
                }
                class_arr.push(class_item)
                ++index
              }
              this.setState({
                gpa: resp.data.gpa ? resp.data.gpa : 3.7,
                major: resp.data.major ? resp.data.major : '',
                year: resp.data.year ? resp.data.year : '',
                classes: class_str_arr,
                class_arr: class_arr,
                c_index: index
              })
            }
          })
        })
      })
    }
  }

  componentWillMount () {
    document.body.addEventListener(
      'mousedown',
      this.handleScreenMouseDown.bind(this)
    )
  }

  componentWillUnmount () {
    document.body.removeEventListener(
      'mousedown',
      this.handleScreenMouseDown.bind(this)
    )
  }

  handleScreenMouseDown () {
    if (this.props.updateUser && $('#year_select').val()) {
      this.props.updateUser('year', $('#year_select').val())
    }
  }

  updateGPA (event) {
    this.setState({ gpa: event.target.value })
    if (this.props.updateUser) {
      this.props.updateUser('gpa', event.target.value)
    }
  }

  updateYear () {
    if (this.props.updateUser && $('#year_select').val()) {
      this.props.updateUser('year', $('#year_select').val())
    }
  }

  updateMajor (event) {
    this.setState({ major: event.target.value })
    if (this.props.updateUser) {
      this.props.updateUser('major', event.target.value)
    }
  }

  saveAndContinue (event) {
    var temp_year = $('#year_select').val()
    var year = this.state.year
    if (temp_year) {
      year = temp_year
    }
    var classString = this.state.class_arr[0].namw
    for (var i = 1; i < this.state.class_arr.length; ++i) {
      classString += '|' + this.state.class_arr[i].name
    }
  }

  redirect () {
    window.location = '/student-bio'
  }

  render () {
    var schoolSection = null
    var classesSection = null
    var classesLabel = null

    if (this.props.noRender) {
      return ''
    }

    if (this.props.showAllEducation) {
      schoolSection = (
        <div className='input-field'>
          <input
            id='profile-school'
            type='text'
            placeholder='Hogwarts'
            value={this.state.university}
            onChange={e => {
              if (this.props.updateUser) {
                this.props.updateUser('university', e.target.value)
              }
              this.setState({ university: e.target.value })
            }}
          />
          <label htmlFor='profile-school' className='active'>School</label>
        </div>
      )

      classesLabel = (
        <div className='notable-classes-label left-align'>Relevant Classes</div>
      )

      classesSection = (
        <EditClasses
          user={this.state.user}
          updateUser={this.props.updateUser}
        />
      )
    }
    var notableClassesForm = (
      <form onClick={this.updateYear.bind(this)}>
        {schoolSection}
        <div className='row'>
          <div className='input-field col s4'>
            <div className='notable-classes-label left-align'>GPA</div>
            <input
              type='number'
              step='0.1'
              placeholder='3.7'
              value={this.state.gpa}
              onChange={event => this.updateGPA(event)}
            />
          </div>
          <div className='input-field col s4'>
            <div className='notable-classes-label left-align'>Major</div>
            <input
              type='text'
              placeholder='Your Major'
              value={this.state.major}
              onChange={event => this.updateMajor(event)}
            />
          </div>
          <div className='input-field col s4'>
            <div className='notable-classes-label left-align'>Year</div>
            <select
              className='year-selector'
              id='year_select'
              value={this.state.year}
            >
              <option className='year-selector-item' value='' disabled>
                Choose your year
              </option>
              <option className='year-selector-item' value='Freshman'>
                Freshman
              </option>
              <option className='year-selector-item' value='Sophomore'>
                Sophomore
              </option>
              <option className='year-selector-item' value='Junior'>
                Junior
              </option>
              <option className='year-selector-item' value='Senior'>
                Senior
              </option>
              <option className='year-selector-item' value='Senior+'>
                Senior+
              </option>
            </select>
          </div>
        </div>
        {classesLabel}
        {classesSection}
      </form>
    )

    if (this.state.url_string === 'notable-classes' || this.props.showForm) {
      return (
        <EditContainerOnboarding
          title='Academics'
          redirect={this.redirect.bind(this)}
        >
          {notableClassesForm}
        </EditContainerOnboarding>
      )
    }
    return notableClassesForm
  }
}

export default NotableClasses
