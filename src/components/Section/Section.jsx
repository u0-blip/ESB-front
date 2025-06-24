import React from 'react';
import PropTypes from 'prop-types';

import './Section.scss';

const Section = props => {
  return (
    <section
      className={'SectionComponent section' + (props.backGroundColor ? ` has-background-${props.backGroundColor}` : '') + (props.sectionSize ? ` is-${props.sectionSize}` : '')}
    >
      {props.children}
    </section>
  );
};

Section.propTypes = {
  backGroundColor: PropTypes.string,
  sectionSize: PropTypes.string
};

export default Section;
