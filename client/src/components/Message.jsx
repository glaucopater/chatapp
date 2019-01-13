import React from 'react'
import PropTypes from 'prop-types' 
import Moment from 'react-moment';

function Message (props) {
  const {author, body, timeStamp} = props.message
  const unixTimestamp = timeStamp
  return (
  <div>
    <div>
    <strong>{author}: </strong>{body}
    </div>
    <Moment unix format="DD MMM YYYY HH:MM">{unixTimestamp}</Moment>
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
