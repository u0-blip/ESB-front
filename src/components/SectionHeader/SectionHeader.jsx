import React from 'react';
import PropTypes from 'prop-types';

import './SectionHeader.scss';

const SectionHeader = props => {
  return (
    <>
      {(props.title || props.subtitle) && (
        <header className='SectionHeaderComponent'>
          {props.title && (
            <h1
              className={
                'title is-spaced has-text-weight-bold' +
                (props.fontSize ? ` is-${props.fontSize}` : '') +
                (props.fontSize === 1 ? ' is-size-2-mobile' : '') +
                (props.fontColor ? ` has-text-${props.fontColor}` : '')
              }
            >
              {props.title}
            </h1>
          )}

          {props.subtitle && (
            <p
              className={
                'subtitle' +
                (props.fontSize > 4 ? ' is-6' : '') +
                (props.fontColor ? ` has-text-${props.fontColor}` : '')
              }
            >
              {props.subtitle}
            </p>
          )}
        </header>
      )}
    </>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  fontSize: PropTypes.string,
  fontColor: PropTypes.string
};

export default SectionHeader;
