import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ControlBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      other: ''
    }

    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this)
    this.handleOtherSubmit = this.handleOtherSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleUsernameLogOut = this.handleUsernameLogOut.bind(this)
    
  }

  handleOtherSubmit (event) {
    event.preventDefault()
    const {username} = this.state
    if (username) {
      this.props.joinRoom(null, username)
    }
  }

  handleUsernameSubmit (event) {
    event.preventDefault()
    const username = this.state.username
    if (username) {
      this.props.createFlash('successfully registered')
      this.props.setUsername(username)
    }
  }

  handleUsernameLogOut (event) {
    event.preventDefault()
    const {username} = this.state
    if (username) { 
      console.log(username, "is leaving the chat")
      this.props.deactivateUser(username)
    }
  }

  handleChange (event) {
    const {name, value} = event.target
    this.setState({ [name]: value })
  }

  render () {
    const usersList = this.props.activeUsers.map((user, i) => {
      return <option key={i} value={user}>{user}</option>
    })
    return (
      <div className='ControlBar'>

        <form onSubmit={this.handleUsernameSubmit}>
          <label>
            <strong>Username:</strong>
            <input
              id='username-input'
              name='username'
              onChange={this.handleChange}
              type='text'
              placeholder='e.g. evmo' />
          </label>
          <button type='submit'>Login</button>
          <button type='button' onClick={this.handleUsernameLogOut}>LogOut</button>
        </form>

<div>
        <form onSubmit={this.handleOtherSubmit}>
          <div>
            <label>
              <strong>Online users:</strong>
              <select
                id='partner-select'
                name='partner'
                onChange={this.handleChange}
                value={this.state.partner}>
                {this.props.activeUsers.length > 0
                  ? <option value=''>Select a user...</option>
                  : <option value=''>Waiting for the others...</option>
                }
                {usersList}
              </select>
            </label>
            <button type='submit'>Join Room</button>
          </div>
        </form>
        </div>
      </div>
    )
  }
}

ControlBar.PropTypes = {
  joinRoom: PropTypes.func,
  activeUsers: PropTypes.arrayOf(PropTypes.string),
  setUsername: PropTypes.func,
  createFlash: PropTypes.func
}

export default ControlBar
