import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ChatWindow from './ChatWindow'

class Conversations extends Component {
  constructor (props) {
    super(props)
    this.getOthers = this.getOthers.bind(this)
  }

  getOthers () { 
    return this.props.activeUsers;
  }

  filterMessages (messages, room) {
    return messages.filter((message) => {
      return message.room === room
    })
  }

  render () {
    const {username, rooms, leaveRoom, sendMessage, messages} = this.props
    const chatWindows = rooms.map((room, i) => {
      const roomMessages = this.filterMessages(messages, room) 
      const others = this.getOthers(room)
      return (
        username !== '' ?
        <ChatWindow
          key={i}
          room={room}
          username={username}
          others={others}
          messages={roomMessages}
          leaveRoom={leaveRoom}
          sendMessage={sendMessage} /> : null
      )
    })
    return (
      <div className='Conversations'>
        {chatWindows}
      </div>
    )
  }
}

Conversations.propTypes = {
  activeUsers: PropTypes.arrayOf(PropTypes.string),
  username: PropTypes.string,
  rooms: PropTypes.arrayOf(PropTypes.string),
  sendMessage: PropTypes.func,
  leaveRoom: PropTypes.func,
  messages: PropTypes.arrayOf(PropTypes.shape({
    author: PropTypes.string,
    body: PropTypes.string,
    timestamp: PropTypes.instanceOf(Date),
    room: PropTypes.string
  }))
}

export default Conversations
