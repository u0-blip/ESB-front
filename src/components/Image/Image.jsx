import React from 'react';
import PropTypes from 'prop-types';

const Image = props => {
  return (
    <figure className={`ImageComponent image${props.size ? ` ${props.size}` : ''}`}>
      <img
        className={
          props.isRounded ? 'is-rounded ' : '' + 
          props.isFullwidth ? 'is-fullwidth' : ''
        }
        src={props.imageUrl}
        alt={props.alt}
      />
    </figure>
  );
};

Image.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.string,
  isRounded: PropTypes.bool,
  isFullwidth: PropTypes.bool // The image container will usually take up the whole width while maintaining the perfect ratio. If it doesn't, you can force it by appending the is-fullwidth modifier.
};

export default Image;
