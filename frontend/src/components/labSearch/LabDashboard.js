/* Lab Dashboard ('YOUR PROJECTS') page for both students and faculty
Students:
  -  Display saved projects
	-  Display projects that they've applied to

Faculty: (an idea)
  -  Display the projects that they own / have created
	-  Display applicants to their projects (THIS COULD DEFINITELY GO IN ANOTHER AREA)
*/

import React, { Component } from 'react'
import LabSearchProject from './LabSearchProject'
import {
  getCurrentUserId,
  getStudentFromUser,
  getFacultyFromUser,
  isStudent,
  isFaculty,
  getAllStudentApplicationResponses
} from '../../helper.js'
import './LabDashboard.css'

class LabDashboard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      position_list: [],
      applied_list: []
    }
  }

  componentDidMount () {
    // if student, show saved projects & applications
    if (isStudent()) {
      getStudentFromUser(getCurrentUserId()).then(resp => {
        console.log(resp.data.position_list)
        this.setState({
          position_list: resp.data.position_list,
          applied_list: resp.data.position_list // TODO: SET TO APPLIED LIST ONCE APPLICABLE
        })
      })
      getAllStudentApplicationResponses(getCurrentUserId()).then(resp => {
        let positions_applied = resp.data.map((app) => {return app.position_id});
        this.setState({positions_applied});
      })
    } else if (isFaculty()) {
      // if faculty, show existing projects (allow to edit?) and applicants.
      getFacultyFromUser(getCurrentUserId()).then(resp => {
        // TODO: set existing projects & applicants.
      })
    }
  }

  updateProjects (id) {
    let new_state = this.state
    console.log(`Removing ${id} from `, this.state.position_list)
    let position_list = new_state.position_list
    position_list = position_list.filter(value => value.id !== id)
    new_state.position_list = position_list
    this.setState(new_state)
  }

  render () {
    var facultyOwned = isFaculty()
    const boxOneTitle = isStudent() ? 'Saved Projects' : 'Your Projects'
    const boxTwoTitle = isStudent()
      ? "Projects You've Applied To"
      : 'Applicants To Your Projects'
    let position_list = this.state.position_list
    return (
      <div className='shift-down' style={{ minHeight: '70vh' }}>
        <div className='lab-dashboard'>
          <h1 className='lab-dashboard-title'>{boxOneTitle}</h1>
          <div className='lab-dashboard-container'>
            {position_list.map((position, index) => {
              let submitted = false
              let pos_ids = this.state.positions_applied
              if (pos_ids && pos_ids.length) {
                pos_ids.map(pos => {
                  if (pos == position.id) submitted = true
                })
              }
              return (
                <div
                  key={`position-${position.id}`}
                  className='lab-dashboard-item'
                >
                  <LabSearchProject
                    position={position}
                    facultyOwned={facultyOwned}
                    id={position.lab_id}
                    submitted={submitted}
                    updateProjects={this.updateProjects.bind(this)}
                  />
                </div>
              )
            })}
          </div>
        </div>

      </div>
    )
  }
}

export default LabDashboard
