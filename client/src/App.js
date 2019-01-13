import React, { Component } from 'react'
import ControlBar from './components/ControlBar'
import Conversations from './components/Conversations'
import Flash from './components/Flash'
import io from 'socket.io-client' 
import "./App.scss"

const socket = io('http://localhost:5000')

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      activeUsers: [],
      rooms: [],
      messages: [],
      flashNotice: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.joinRoom = this.joinRoom.bind(this)
    this.leaveRoom = this.leaveRoom.bind(this)
    this.deactivateUser = this.deactivateUser.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.createFlash = this.createFlash.bind(this)
    this.clearFlash = this.clearFlash.bind(this)

  }

  handleChange (event) {
    const {name, value} = event.target
    this.setState({ [name]: value })
  }

  setUsername (username) { 
    const oldName = this.state.username
    if (oldName && oldName !== username) {
      socket.emit('deactivate_user', { username: oldName })
    }
    this.setState({ username }, () => {
      socket.emit('activate_user', { username: this.state.username })
    })
  }

  loadMessages () {
    const savedMessages = window.localStorage.getItem('messages')
    if (savedMessages) {
      this.setState({ messages: JSON.parse(savedMessages) || [] })
    }
  }

  setSocketListeners () {
    socket.on('message', (data) => {
      console.log(data.message)
    })

    socket.on('message_sent', (message) => {
      const room = message['room']
      this.setState({ messages: [...this.state.messages, message] }, () => {
        window.localStorage.setItem('messages', JSON.stringify(this.state.messages))
        if (this.state.rooms.indexOf(room) === -1) {
          this.setState({ rooms: [...this.state.rooms, room] })
        }
      })
    })

    socket.on('message_broadcasted', (message) => {
      console.log("message_broadcasted from server", message)
    })

    socket.on('retrieve_active_users', () => {
      if (this.state.username) {
        socket.emit('activate_user', { username: this.state.username })
      }
    })

    socket.on('user_activated', (data) => {
      const user = data['user']
      const { activeUsers } = this.state
      if (activeUsers.indexOf(user) === -1 && user !== this.state.username) {
        this.setState({ activeUsers: [...activeUsers, user] }, () => {
          this.createFlash(`${user} is online`)
        })
      }
    })

    socket.on('user_deactivated', (data) => {
      const deactivatedUser = data['user']
      const { activeUsers } = this.state
      if (activeUsers.indexOf(deactivatedUser) !== -1) {
        this.setState({ activeUsers: activeUsers.filter((user) => {
          return user !== deactivatedUser
        },()=>{ this.createFlash(deactivatedUser, " offline")})})
      }
      console.log(deactivatedUser," logged out");
    })

    socket.on('open_room', (data) => {
      const room = data['room']
      const openRooms = this.state.rooms
      console.log("data", data)
      const userInRoom = true
      const roomNotOpen = openRooms.indexOf(room) === -1
      console.log("open_room", room, openRooms, userInRoom)
      if (userInRoom && roomNotOpen) {
        this.joinRoom(room, this.state.username)
        console.log("joinRoom",this.state.username)
      }
    })

    socket.on('roomJoined', (data) => {
      console.log("roomJoined ", data, this.state)
    })

    socket.on('deactivateUser', (data) => {
      console.log("deactivateUser ", data, this.state)
    })

  }

  joinRoom (room, username) {
    room = room || "TheRoom"
    console.log("joinRoom:  ", username, " joined ", room);
    if (this.state.rooms.indexOf(room) === -1) {
      this.setState({rooms: [...this.state.rooms, room]}, () => {
        socket.emit('join_room', { username, room })
      })
    }
  }

  leaveRoom (room) {
    this.setState({ rooms: this.state.rooms.filter((r) => r !== room) }, () => {
      console.log("leaveRoom:  ",  this.state.username, " left ", room)
      })
  }

  deactivateUser (username) { 
    socket.emit('deactivate_user', { username })
  }

  sendMessage (message, room) {
    console.log("sendMessage",message, room)
    socket.emit(
      'send_message',
      {
        room,
        author: this.state.username,
        body: message,
        timeStamp: Date.now()
      }
    )
    socket.emit('broadcast_message',{message,room})
    console.log("broadcast_message",message, room)
  }

  createFlash (text) {
    this.setState({flashNotice: ''}, () => {
      this.setState({flashNotice: text}, () => {
        window.setTimeout(this.clearFlash, 2500)
      })
    })
  }

  clearFlash () {
    this.setState({flashNotice: ''})
  }

  componentDidMount () {
    this.loadMessages()
    this.setSocketListeners()
  }

  render () {
    const {username, rooms, messages, flashNotice} = this.state

    return (
      <div className='App'>
        <div className='header'>
          <h1 className='title'>ChatApp</h1>
        </div>
        <Flash notice={flashNotice} />
        <ControlBar
          activeUsers={this.state.activeUsers}
          setUsername={this.setUsername}
          deactivateUser={this.deactivateUser}
          createFlash={this.createFlash}
          joinRoom={this.joinRoom} />
        <Conversations
          activeUsers={this.state.activeUsers}
          rooms={rooms}
          messages={messages}
          username={username}
          leaveRoom={this.leaveRoom}
          sendMessage={this.sendMessage} />
      </div>
    )
  }
}

export default App
