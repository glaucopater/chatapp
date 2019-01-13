import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import "./ChatWindow.scss"

class ChatWindow extends Component {
  constructor (props) {
    super(props)
    this.state = { message: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this) 
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()
    if (this.state.message) {
      this.props.sendMessage(this.state.message, this.props.room)
      this.setState({ message: '' })
    }
  }

  handleChange (event) {
    const {name, value} = event.target
    this.setState({ [name]: value })
  }

  scrollToBottom () {
    this.messageWindow.scrollTop = this.messageWindow.scrollHeight
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  componentDidMount () {
    this.scrollToBottom()
  }

  render () {
    const { username, messages} = this.props
    const messageList = messages.map((message, i) => {
      return (
        <Message
          message={message}
          username={username}
          key={i} />
      )
    })
    return (
      <div className='ChatWindow'>
        <div className='chat-header'>
          <h2>{this.props.room}</h2> 
        </div>
        <div className='chat-body' ref={(el) => { this.messageWindow = el }}>
          {messageList}
        </div>
        <div className='chat-input'>
          <form onSubmit={this.handleSubmit}>
            <input
              type='text'
              name='message'
              className='chat-message'
              placeholder='write your message here...'
              value={this.state.message}
              onChange={this.handleChange} />
            <button className="button-send" type="submit">Send</button>
          </form>
        </div>
      </div>
    )
  }
}

ChatWindow.propTypes = {
  username: PropTypes.string,
  others: PropTypes.arrayOf(PropTypes.string),
  room: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.shape({
    author: PropTypes.string,
    body: PropTypes.string,
    timestamp: PropTypes.instanceOf(Date),
    room: PropTypes.string
  })),
  sendMessage: PropTypes.func,
  leaveRoom: PropTypes.func
}

export default ChatWindow
