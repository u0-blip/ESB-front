import React from 'react'
import PropTypes from 'prop-types';

const Icon = props => {
  return (
    <span className={`
      icon
      is-${props.size}
      ${props.isLeft ? ' is-left' : ''}
      ${props.isRight ? ' is-right' : ''}`
    }>
      <i className={props.name}></i>
    </span>
  )
}

Icon.propTypes = {
  size: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isLeft: PropTypes.bool,
  isRight: PropTypes.bool
}

export default Icon;
