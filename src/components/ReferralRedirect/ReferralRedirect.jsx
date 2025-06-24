import React from 'react'
import { SESSIONSTORAGE_KEYS } from '../../utils/constants';
import { useRouter } from '../../utils/router';

/**
 *
 * If a user receives a email related to a referral code from a friend,
 * before send the user to cognito to create an account
 * we stop in the app first to save the referralCode into the localstorage,
 * and then we send the user to cognito create account flow.
 */
function ReferralRedirect(props) {
  const router = useRouter();
  sessionStorage.setItem(SESSIONSTORAGE_KEYS.OTHER_REFERRAL_CODE, `${router?.query?.otherReferralCode}`);
  window.location.href = process.env.REACT_APP_COGNITO_SIGNUP_URL;
  return <div></div>;
}

export default ReferralRedirect;
