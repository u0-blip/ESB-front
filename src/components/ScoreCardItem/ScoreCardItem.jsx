import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import TeamImage from '../TeamImage/TeamImage';
import { PICK_STATUS } from '../../utils/constants';
import { useAuth } from '../../utils/auth';

import './ScoreCardItem.scss';

function ScoreCardItem(props) {
  const [status, setStatus] = useState({});

  // AUTH
  const auth = useAuth();

  useEffect(() => {
    setStatus(PICK_STATUS[props.data.status] || {});
  }, [props.data.status]);

  return (
    <div className='ScoreCardItemComponent box'>
      {/* TOP */}
      <div className='columns is-mobile is-gapless'>
        <div className='column has-text-centered'>
          <p className='subtitle is-size-6-mobile'>
            <strong>Match: </strong>
            {props.data.title}
          </p>
          <p className='subtitle is-size-6-mobile'>
            <strong>Start: </strong>
            {moment(props.data.matchTime).format('MMMM Do YYYY, k:mm')}
          </p>
        </div>
      </div>

      <div className='columns is-mobile is-gapless'>
        {/* LEFT COLUMN */}
        <div className='column team'>
          <TeamImage
            imageUrl={`${process.env.REACT_APP_ESB_COMPETITOR_ASSETS}${props.data.HomeCompetitorFld.logo}`}
            teamName={props.data.HomeCompetitorFld.name}
          />
        </div>

        {/* BEGIN - CENTER COLUMN */}
        <div className='column column-center'>
          {props.data.status === PICK_STATUS.NEW.LABEL ? (
            <div className='content'>
              <div className='subtitle pick-result has-text-centered is-size-6-mobile'></div>
              <div className='has-text-centered'>
                <span className={`icon is-large`}>
                  <i className={`fas fa-3x ${!!props.isUnlockedPick ? 'fa-lock-open' : 'fa-lock'}`}></i>
                </span>
              </div>
              <div className='subtitle pick-summary has-text-centered is-size-6-mobile'>
                {!!props.isUnlockedPick ? props.data.summary : ''}
              </div>
            </div>
          ) : (
            <div className='content'>
              <div className='subtitle pick-result has-text-centered is-size-6-mobile'>{status.NAME}</div>
              <div className='has-text-centered'>
                <span className={`icon is-large ${status.COLOR}`}>
                  <i className={`fas fa-3x ${status.ICON}`}></i>
                </span>
              </div>
              <div className='subtitle pick-summary has-text-centered is-size-6-mobile'>
                {props.data.summary}
              </div>
            </div>
          )}
        </div>
        {/* END - CENTER COLUMN */}

        {/* RIGHT COLUMN */}
        <div className='column team'>
          <TeamImage
            imageUrl={`${process.env.REACT_APP_ESB_COMPETITOR_ASSETS}${props.data.AwayCompetitorFld.logo}`}
            teamName={props.data.AwayCompetitorFld.name}
          />
        </div>
      </div>

      {/* BUTTON */}
      {!props.hideButtons && (
        <>
          {!props.isValidAuthorizationToken ? (
            <a
              className='button is-small is-dark is-fullwidth is-uppercase'
              href={process.env.REACT_APP_COGNITO_SIGNIN_URL}
            >
              Log In to check options available
            </a>
          ) : (
            <>
              {props.isUnlockedPick || auth.isAdminUser() ? (
                <button
                  className='button is-small is-dark is-fullwidth is-uppercase'
                  onClick={() => props.handleClickUnlockedPick(props.data.id)}
                >
                  Show unlocked pick
                </button>
              ) : (
                <button
                  className='button is-small is-dark is-fullwidth is-uppercase'
                  onClick={() => props.handleClickUnlockPick(props.data.id)}
                >
                  Unlock pick
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

ScoreCardItem.propTypes = {
  data: PropTypes.object,
  handleClickUnlockPick: PropTypes.func,
  handleClickUnlockedPick: PropTypes.func,
  isUnlockedPick: PropTypes.bool,
  isValidAuthorizationToken: PropTypes.bool,
  hideButtons: PropTypes.bool
};

export default ScoreCardItem;
