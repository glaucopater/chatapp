import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as constants from './constants'
import io from 'socket.io-client'

const socket = io(constants.SOCKET_IO_SERVER_URL)

ReactDOM.render(<App socket={socket} />, document.getElementById('root'))
