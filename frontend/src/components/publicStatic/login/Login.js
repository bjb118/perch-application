import React, { Component } from 'react'
import './Login.css'
import {
  loginUser,
  getCurrentUserId,
  isStudent,
  getCurrentFacultyId
} from '../../../helper.js'
import iziToast from 'izitoast'

class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  // called when user tries to login
  handleLogin (event) {
    event.preventDefault()

    let email = this.state.email
    let password = this.state.password

    // 1. Login user
    loginUser(email, password)
      .then(
        resp =>
          (window.location.href = isStudent()
            ? `/student-profile/${getCurrentUserId()}`
            : `/prof/${getCurrentFacultyId()}`)
      )

      // 2. or show Error message
      .catch(e =>
        iziToast.show({
          title: 'Error',
          titleColor: 'black',
          messageColor: 'black',
          message: 'Incorrect Username or Password',
          color: 'red',
          position: 'bottomLeft',
          progressBarColor: 'white',
          timeout: '5000',
          class: 'toast-custom'
        })
      )
  }

  render () {
    return (
      <div className='login-container valign-wrapper'>
        <form
          className='container login shadow'
          onSubmit={this.handleLogin.bind(this)}
        >

          <div className='new-signup-header center-align'>LOG IN</div>

          <div className='input-field'>
            <input
              id='email'
              type='email'
              required
              autofocus='autofocus'
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />
            <label htmlFor='email'>Email</label>
          </div>

          <div className='input-field'>
            <input
              onChange={e => this.setState({ password: e.target.value })}
              id='password'
              type='password'
              required
              autofocus='autofocus'
              value={this.state.password}
            />
            <label htmlFor='password'>Password</label>
          </div>

          <br />

          <button
            className='btn waves-effect waves-blue waves-light basic-btn'
            style={{ width: '100%', height: '50px' }}
            name='action'
          >

            <i className='material-icons'>lock_open</i>
          </button>
        </form>
      </div>
    )
  }
}

export default Login
