import React from 'react';
import PropTypes from 'prop-types';
import Section from '../Section/Section';
import { Link } from 'react-router-dom';
import { MENU_ITEM } from '../../utils/constants';

const UnlockPickModal = props => {
  return (
    <Section>
      <div className='container'>
        <div className='title'>Unlock Pick</div>
        {props.userCredits > 0 ? (
          <>
            <div className='subtitle'>Are you sure you want to unlock the pick selected?</div>
            <div className='buttons'>
              <div className='button' onClick={props.handleCloseModal}>
                Cancel
              </div>
              <button
                className='button is-dark'
                onClick={() => props.handleClickConfirmUnlockPick(props.pickId)}
              >
                Confirm
              </button>
            </div>
          </>
        ) : (
          <>
            <div className='subtitle'>You don't have credits to unlock the selected pick!</div>
            <div className='buttons'>
              <div className='button' onClick={props.handleCloseModal}>
                Cancel
              </div>
              <Link to={MENU_ITEM.PACKAGES.PATH} className='button is-dark'>
                Buy more credits
              </Link>
            </div>
          </>
        )}
      </div>
    </Section>
  );
};

UnlockPickModal.propTypes = {
  handleCloseModal: PropTypes.func,
  userCredits: PropTypes.number,
  pickId: PropTypes.number,
  handleClickConfirmUnlockPick: PropTypes.func
};

export default UnlockPickModal;
