import React from 'react'
import PropTypes from 'prop-types';

const DashboardVitalCard = props => {
  return (
    <div className="DashboardVitalCardComponent box">
      <div className='is-flex flex-align-items-center'>
        <span className="icon is-large">
          <i className={`fas fa-2x ${props.icon}`}></i>
        </span>
        <div className="subtitle is-capitalized ml-8">
          {props.label}
        </div>
      </div>
      <div className='has-text-centered is-size-3 has-text-weight-semibold'>
        {props.title}
      </div>
    </div>
  )
}

DashboardVitalCard.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
}

export default DashboardVitalCard;