import React from 'react';

import './Tabs.scss';

const Tabs = props => {
  return (
    <div className='TabsComponent tabs is-small'>
      <ul>{props.children}</ul>
    </div>
  );
};

export default Tabs;
