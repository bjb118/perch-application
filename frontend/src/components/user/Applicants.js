/* Lab Dashboard ('YOUR PROJECTS') page for both students and faculty
Students:
  -  Display saved projects
	-  Display projects that they've applied to

Faculty: (an idea)
  -  Display the projects that they own / have created
	-  Display applicants to their projects (THIS COULD DEFINITELY GO IN ANOTHER AREA)
*/

import React, { Component } from 'react'
import { getStudent, getLabPositionApplicationResponses } from '../../helper.js'
import './Applicants.css'

class Applicants extends Component {
  constructor (props) {
    super(props)
    this.state = {
      applicants: [],
      namesMap: {}
    }
  }

  componentDidMount () {
    getLabPositionApplicationResponses(
      this.props.lab_id,
      this.props.pos_id
    ).then(resp => {
      if (resp.data && resp.data.length) {
        this.setState({ applicants: resp.data })
        let namesMap = {}
        resp.data.map(app => {
          getStudent(app.student_id).then(r => {
            if (r && r.data) {
              namesMap[app.student_id] = r.data.first_name
              this.setState({ namesMap })
            }
          })
        })
      }
    })
  }

  render () {
    return (
      <div className='applicants-container'>
        {this.state.applicants.map((app, index) => {
          return (
            <ApplicantContainer
              key={index}
              application={app}
              name={this.state.namesMap[app.student_id]}
            />
          )
        })}
        <br /><br />
      </div>
    )
  }
}

const ApplicantContainer = props => {
  let app = props.application
  let project_action = (
    <a href={`/student-profile/${app.student_id}`} target='_blank'>
      <div className='applicant-cta'>View Profile</div>
    </a>
  )

  return (
    <div className='applicant-wrapper'>
      {project_action}
      <div className='applicant-name'>{props.name}</div>
      <div className='applicant-descriptor'>
        <i>
          Applied on
          {' '}
          {app.created_at &&
            app.created_at.length &&
            app.created_at.split(' ')[0]}
        </i>
      </div>
      {app.answers.map(a => {
        return (
          <div key={a.number} className='app-response-container'>
            <div className='app-question-text'><b>{a.question}</b></div>
            <div className='app-response-text'>{a.answer}</div>
          </div>
        )
      })}
    </div>
  )
}

export default Applicants
