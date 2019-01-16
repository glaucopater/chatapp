import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import io from 'socket.io-client'
import * as constants from './constants'

const socket = io(constants.SOCKET_IO_SERVER_URL) 

ReactDOM.render(<App socket={socket} />, document.getElementById('root'))
