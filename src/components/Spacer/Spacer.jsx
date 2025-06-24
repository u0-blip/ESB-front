import React from 'react';
import PropTypes from 'prop-types';

import './Spacer.scss';

/**
 *
 * @param height small, medium, big
 */
function Spacer(props) {
  return <div className={`SpacerComponent ${props.height}`}></div>;
}

Spacer.defaultProps = {
  height: 'medium'
};

Spacer.propTypes = {
  height: PropTypes.string
};

export default Spacer;
