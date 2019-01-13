import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as constants from '../constants'
import './ControlBar.scss'

class ControlBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      other: ''
    }

    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this) 
    this.handleChange = this.handleChange.bind(this)
    this.handleUsernameLogOut = this.handleUsernameLogOut.bind(this)
    
  }

  handleUsernameSubmit (event) {
    event.preventDefault()
    const username = this.state.username
    if(this.props.activeUsers.includes(username)){
      this.props.createFlash('username already in use')
    } else if (username!=="") {
      this.props.createFlash('successfully logged in')
      this.props.setUsername(username)
      this.props.joinRoom(null, username)
    }
  }

  handleUsernameLogOut (event) {
    event.preventDefault()
    const username = this.state.username !== '' ? this.state.username : this.props.loggedInUsername
    if (username) {  
      this.props.deactivateUser(username) 
      this.props.leaveRoom(constants.ROOM_NAME, username)
    }
  }

  handleChange (event) {
    const {name, value} = event.target
    this.setState({ [name]: value })
  }

  render () {
    const usernameInput =  this.props.loggedInUsername === "" ? <input
    id='username-input'
    name='username'
    onChange={this.handleChange}
    type='text' 
    placeholder='choose a nickname' /> : <div className="loggedInUsername">{this.props.loggedInUsername}</div>

    const loginButton = this.props.loggedInUsername === "" ? <button type='submit'>Join Chat</button> : null
    const logoutButton = !loginButton ? 
    <button className="alert" type='button' onClick={this.handleUsernameLogOut}>Logout</button> : null;

    return (
      <div className='ControlBar'>
        <div>
          <form onSubmit={this.handleUsernameSubmit}>
            <label>
              <strong>Username:</strong>
              {usernameInput}
            </label>
            {loginButton}
            {logoutButton} 
          </form>
        </div>
      </div>
    )
  }
}

ControlBar.propTypes = {
  joinRoom: PropTypes.func,
  activeUsers: PropTypes.arrayOf(PropTypes.string),
  setUsername: PropTypes.func,
  createFlash: PropTypes.func
}

export default ControlBar
