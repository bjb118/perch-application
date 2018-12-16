import React, { Component } from 'react'
import BubbleChoice from '../../utilities/BubbleChoice'
import { EditContainerOnboarding } from './StudentEditors'
import { deepCopy, exists } from '../../../helper.js'

class PickYourInterests extends Component {
  constructor (props) {
    super(props)
    this.updateBubbleChoice = this.updateBubbleChoice.bind(this)
  }

  updateBubbleChoice (bubble_array, skills) {
    let updateUser = this.props.updateUser
    if (updateUser) {
      let type = skills ? 'skills' : 'tags'
      updateUser(type, bubble_array)
    }
  }

  render () {
    let editorOnly = this.props.editorOnly

    var bubblePickers = (
      <div>
        <BubbleChoice
          ref='bubble_choice'
          skills
          passChosen={this.updateBubbleChoice}
        />
        <BubbleChoice
          ref='bubble_choice'
          skills={false}
          passChosen={this.updateBubbleChoice}
        />
      </div>
    )

    if (editorOnly) {
      return bubblePickers
    } else {
      return (
        <EditContainerOnboarding title='Skills and Interests'>
          {bubblePickers}
        </EditContainerOnboarding>
      )
    }
  }
}

export default PickYourInterests
