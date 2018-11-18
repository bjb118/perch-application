/**
 * Created by aksha on 7/22/2018.
 */
import React, { Component } from 'react'
import './Nothing.scss'

class Nothing extends Component {
  constructor () {
    super()
    this.state = {
      value: null
    }
  }
  render () {
    return (
      <div id='test'>
        <input
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
          
        />
      </div>
    )
  }
}

export default Nothing
