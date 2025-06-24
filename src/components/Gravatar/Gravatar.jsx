import React from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';
import Image from '../Image/Image';
import { IMAGE_DIMENSION } from '../../utils/enums';

const Gravatar = props => {
  const emailHash = md5(props.email);
  const imageUrl = `https://www.gravatar.com/avatar/${emailHash}?s=128`;

  return <Image imageUrl={imageUrl} alt='user gravatar' size={IMAGE_DIMENSION.IS_128X128} isRounded={true} />;
};

Gravatar.propTypes = {
  email: PropTypes.string.isRequired
};

export default Gravatar;
