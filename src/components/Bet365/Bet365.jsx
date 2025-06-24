import React from 'react';

import './Bet365.scss';

function Bet365(props) {
  return (
    <div className='Bet365Component iframe-container'>
      <iframe
        title='Bet365'
        src='https://imstore.bet365affiliates.com/365_455806-449-32-6-149-1-88420.aspx'
        frameBorder='0'
        scrolling='no'
      ></iframe>
    </div>
  );
}

export default Bet365;
