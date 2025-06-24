import React from 'react';
import PropTypes from 'prop-types';

import './TeamImage.scss';

function TeamImage(props) {
  return (
    <div className='TeamImageComponent'>
      <div className='image-wrapper'>
        <figure className='image is-square'>
          <img
            src={props.imageUrl}
            alt='Team flag'
          />
        </figure>
      </div>
      <div className='title has-text-centered is-4 is-size-7-mobile'>{props.teamName}</div>
    </div>
  );
};

TeamImage.propTypes = {
  imageUrl: PropTypes.string,
  teamName: PropTypes.string
};

export default TeamImage;
