import React from 'react';

function PageNotAllowed(props) {
  return (
    <div className='PageNotAllowedComponent'
      style={{
        padding: '50px',
        width: '100%',
        textAlign: 'center'
      }}
    >
      Please login to access requested page
    </div>
  );
};

export default PageNotAllowed;
