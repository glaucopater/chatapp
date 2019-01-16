import React, { Component } from 'react'
import ControlBar from './components/ControlBar'
import Conversations from './components/Conversations'
import Flash from './components/Flash'
import io from 'socket.io-client' 
import './App.scss'
import { read_cookie, bake_cookie, delete_cookie }  from 'sfcookies'
import * as constants from './constants'

const socket = io(constants.SOCKET_IO_SERVER_URL) 

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      connected: false,
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
    if(username && username !== ""){
      this.setState({ username }, () => {
        socket.emit('activate_user', { username: this.state.username },() => {
          bake_cookie(constants.USERNAME_COOKIE,username)
        })
      })
    }

  }

  loadMessages () {
    fetch(constants.API_URL)
      .then(response => response.json())
      .then(data => { 
        const dbMessages = data.map( mex => { 
          return { 
            room: mex.room, 
            author: mex.author, 
            body: mex.body, 
            timeStamp: new Date(mex.timeStamp).getTime() 
          }}) 
        if (dbMessages) {
          this.setState({ messages: dbMessages || [] })
        }
      }).catch(function(error) {
        console.warn("Cannot fetch messages from server");
    })
  }

  saveMessage(data){
    fetch(constants.API_URL, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    }).catch(function(error) {
      console.warn("Cannot save last message");
    })
  }

  setSocketListeners () {
    socket.on('message', (data) => {
      console.log(data.message)
    })

    socket.on('message_sent', (message) => {
      const room = message['room']
      this.setState({ messages: [...this.state.messages, message] }, () => {
        if (this.state.rooms.indexOf(room) === -1) {
          this.setState({ rooms: [...this.state.rooms, room] })
        }
      })
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
        },() => { 
          this.createFlash(deactivatedUser, " offline")
        })})
      }
      delete_cookie(constants.USERNAME_COOKIE)
    })

    socket.on('open_room', (data) => {
      const room = data['room']
      const openRooms = this.state.rooms
      const userInRoom = true
      const roomNotOpen = openRooms.indexOf(room) === -1
      if (userInRoom && roomNotOpen) {
        this.joinRoom(room, this.state.username)
      }
    })
    socket.on('connect_error', () => { 
      console.warn('Server disconnect! Retrying to connect...')
      this.setState({ connected: false })
    })
    socket.on('connect', () => { 
      console.log('Server connected!') 
      this.setState({ connected: true })
    })
  }

  joinRoom (room, username) {
    room = room || constants.ROOM_NAME
    if (this.state.rooms.indexOf(room) === -1) {
      this.setState({rooms: [...this.state.rooms, room]}, () => {
        socket.emit('join_room', { username, room })
      })
    }
  }

  leaveRoom (room) {
    this.setState({ rooms: this.state.rooms.filter((r) => r !== room) }, () => {
      })
  }

  deactivateUser (username) { 
    socket.emit('deactivate_user', { username },()=>{
      this.setState({username:''})
    })
  }

  sendMessage (message, room) {
    const newMessage = {
      room,
      author: this.state.username,
      body: message,
      timeStamp: new Date().getTime() 
    }
    socket.emit(
      'send_message',
      newMessage
    )
    this.saveMessage(newMessage)
    socket.emit('broadcast_message',{message,room})
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

  login(username) {
    this.createFlash('successfully logged in')
    this.setUsername(username)
    this.joinRoom(null, username)
  }

  loadUserSession() { 
    const username = read_cookie(constants.USERNAME_COOKIE)
    if(typeof username === "string" && username !== ''){
      this.login(username)
    }
  }

  componentDidMount () {
    this.loadUserSession()
    this.loadMessages()
    this.setSocketListeners()
  }

  getConnectingMessage(){
    return <div className="connectingMessage">Connecting to the server...</div>
  }

  render () {
    const {username, rooms, messages, flashNotice} = this.state
    const app = !this.state.connected ? this.getConnectingMessage() :
      <div className='App'>
        <div className='header'>
          <h1 className='title'>ChatApp</h1>
        </div>
        <Flash notice={flashNotice} />
        <ControlBar
          loggedInUsername={username}
          activeUsers={this.state.activeUsers}
          setUsername={this.setUsername}
          deactivateUser={this.deactivateUser}
          createFlash={this.createFlash}
          joinRoom={this.joinRoom}
          leaveRoom={this.leaveRoom}
          login={this.login}
          />
        <Conversations
          activeUsers={this.state.activeUsers}
          rooms={rooms}
          messages={messages}
          username={username}
          leaveRoom={this.leaveRoom}
          sendMessage={this.sendMessage} />
      </div>

      return app;
    
  }
}

export default App
