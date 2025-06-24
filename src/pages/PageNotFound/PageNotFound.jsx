import React from 'react';
import PropTypes from 'prop-types';

function PageNotFound(props) {
  return (
    <div
      style={{
        padding: '50px',
        width: '100%',
        textAlign: 'center'
      }}
    >
      The page <code>{props.location.pathname}</code> could not be found.
    </div>
  );
};

PageNotFound.propTypes = {
  location: PropTypes.object
};

export default PageNotFound;
