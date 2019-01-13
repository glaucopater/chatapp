import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Flash extends Component {
  render () {
    return (<p className='flash'>{this.props.notice}</p>)
  }
}

Flash.propTypes = {
  notice: PropTypes.string
}

export default Flash
