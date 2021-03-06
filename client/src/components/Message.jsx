import React from 'react'
import PropTypes from 'prop-types' 
import Moment from 'react-moment';
import classnames from 'classnames';
import "./Message.scss"

function Message (props) {
  const { body, timeStamp} = props.message
  const author = props.message.author === props.username ? "You" : props.message.author
  const unixTimestamp = timeStamp

  const className = classnames({
    message: true,
    personal: author === "You"
  })  
  return (
  <div className={className}>
    <div className="author">{author}</div>
    <div className="body">{body}</div>
    <Moment className="timestamp" format="DD MMM YYYY HH:mm">{unixTimestamp}</Moment> 

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