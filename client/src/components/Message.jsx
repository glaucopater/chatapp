import React from 'react'
import PropTypes from 'prop-types' 
import Moment from 'react-moment';
import "./Message.css"

function Message (props) {
  const {author, body, timeStamp} = props.message
  //unix timestamp is in seconds, whil js in milliseconds
  const unixTimestamp = timeStamp / 1000
  return (
  <div className="message">
    <div className="author">{author}</div>
    <div className="body">{body}</div>
    <Moment className="timestamp" unix format="DD MMM YYYY HH:MM">{unixTimestamp}</Moment>
  </div>) 
}

Message.propTypes = {
  message: PropTypes.shape({
    author: PropTypes.string,
    body: PropTypes.string,
    timestamp: PropTypes.instanceOf(Date),
    room: PropTypes.string
  })
}

export default Message
