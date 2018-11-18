// Text gathering component for both lab-name and lab-description pages

import React, { Component } from 'react'
import BasicButton from '../../utilities/buttons/BasicButton'
import {
  getAllPreferences,
  getLabPreferences,
  getCurrentLabId,
  addPreferencesToLab
} from '../../../helper'
import './LabSpecifications.css'

class LabSpecifications extends Component {
  constructor (props) {
    super(props)
    this.state = {
      specs: [
        {
          id: 's_1',
          text: 'Spots open?'
        },
        {
          id: 's_2',
          text: 'Paying lab assistants?'
        },
        {
          id: 's_3',
          text: 'Accepting undergraduate students?'
        },
        {
          id: 's_4',
          text: 'May assistants use for credit?'
        },
        {
          id: 's_5',
          text: 'Nobel prize prerequisite?'
        },
        {
          id: 's_6',
          text: 'Payment available in bitcoin?'
        },
        {
          id: 's_7',
          text: 'Placeholder'
        },
        {
          id: 's_8',
          text: 'Placeholder'
        }
      ]
    }
  }

  componentDidMount () {
    getAllPreferences().then(r => console.log(r))
    getLabPreferences(getCurrentLabId()).then(r => console.log(r))
    addPreferencesToLab(getCurrentLabId(), [1])
  }

  render () {
    var header = 'Lab Specifications'
    var dest = '/lab-website'
    var btn_msg = 'next'
    var url_arr = this.props.location.pathname.split('/')
    if (url_arr[1] === 'update-lab-specifications') {
      header = 'Update Lab Specifications'
      dest = '/prof-page'
      btn_msg = 'back'
    }
    return (
      <div className='lab-specifications shift-down'>
        <div className='container center-align lab-specifications-form shadow'>
          <div className='lab-specifications-header'>{header}</div>
          <form className='lab-specifications-checklist'>
            <ul className='columned-list'>
              {this.state.specs.map(spec => {
                return (
                  <li>
                    <input
                      type='checkbox'
                      className='checkbox-white filled-in'
                      id={spec.id}
                    />
                    <label className='lab-specifications-text' for={spec.id}>
                      {spec.text}
                    </label>
                  </li>
                )
              })}
            </ul>
          </form>
          <BasicButton destination={dest} msg={btn_msg} />
        </div>
      </div>
    )
  }
}
export default LabSpecifications
