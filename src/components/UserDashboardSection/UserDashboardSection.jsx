/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';

// COMPONENTS
import SectionHeader from '../SectionHeader/SectionHeader';
import Section from '../Section/Section';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import Icon from '../Icon/Icon';
import Field from '../Field/Field';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Bet365 from '../Bet365/Bet365';

// UTILS
import { COLORS, ICON_SIZES } from '../../utils/enums';
import { ExecGraphQl, sendReferralInvite } from '../../http/httpService';
import { listUsersQl } from '../../http/graphqlQuerys';
import { useAuth } from '../../utils/auth';
import { isValidEmail } from '../../utils/functions';
import { MENU_ITEM } from '../../utils/constants';

// IMAGES
// import imageCredits from '../../assets/images/credits.jpg'

// CSS
import './UserDashboardSection.scss';

function UserDashboardSection(props) {
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [mateEmail, setMateEmail] = useState('');
  // const [mateReferralCode, setMateReferralCode] = useState('');

  // AUTH
  const auth = useAuth();

  // TOAST
  const { addToast } = useToasts();

  const loadUser = useCallback(async () => {
    const userData = await ExecGraphQl(listUsersQl(), {
      userId: auth?.user?.userId,
    });
    if (userData?.data?.ListUsers?.rows) {
      setUser(userData.data.ListUsers.rows[0]);
    }
  }, [auth?.user?.userId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleCloseModal = () => {
    setShowModal(false);
    setMateEmail('');
  };

  const getAppUrlForReferralInvitation = () => {
    return `${window.location.href}referralredirect?otherReferralCode=${user.myReferralCode}`;
  }

  const handleClickSendReferralCodeToMate = async () => {
    if (isValidEmail(mateEmail)) {
      const response = await sendReferralInvite(mateEmail, 'ESB Referral Invitation', user.name, user.myReferralCode, getAppUrlForReferralInvitation());
      if ('ok' === response?.data) {
        addToast('Email sent!', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        addToast('Email was not delivered!', {
          appearance: 'warning',
          autoDismiss: true,
        });
      }
    } else {
      addToast('Email not valid!', {
        appearance: 'warning',
        autoDismiss: true,
      });
    }
  };

  // const applyMateReferralCode = () => {
  //   // TODO: check if referral code is valid and did not reach Mate credit limit of 50.
  // }

  const getModalFields = () => {
    return (
      <div className='AdminPicksSectionModal notification'>
        <div className='subtitle is-capitalized'>Share your code with your mates by adding their email address</div>

        <Field label='Mate Email' hasIconAtLeft={true}>
          <Input
            type='email'
            value={mateEmail}
            onChange={value => setMateEmail(value)}
          />

          <span className='icon is-small is-left'>
            <i className='fas fa-envelope'></i>
          </span>
        </Field>

        <div className='buttons'>
          <Button
            label='close'
            handleClick={handleCloseModal}
            vibrateOnClick={true}
            isUpperCase={true}
          >
            <Icon size={ICON_SIZES.SMALL} name='fas fa-times' />
          </Button>
          <Button
            label='send'
            handleClick={handleClickSendReferralCodeToMate}
            color={COLORS.DARK}
            vibrateOnClick={true}
            isUpperCase={true}
          >
            <Icon size={ICON_SIZES.SMALL} name='fas fa-check' />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Section sectionSize=''>
      <Modal showModal={showModal} handleClose={handleCloseModal} render={() => getModalFields()} />
      <Loader isActive={false} />
      <div className='container'>
        <div className='columns'>
          <div className='column is-2 is-hidden-touch'>
            <Bet365 />
          </div>
          <div className='column'>
            <SectionHeader
              title='Dashboard'
              subtitle=' '
              fontColor={COLORS.BLACK}
              fontSize=''
            />

            {/* We only show the referral code feature for new users. */}
            {!!user?.myReferralCode && (
              <div className="columns">
                <div className="column">
                  <div className="box">
                    <h3 className="title is-spaced">
                      <span className="has-text-danger">{user.myReferralCode}</span> is <span className="is-uppercase">your</span> referral code
                    </h3>
                    <h5 className="subtitle">
                      <a className="has-text-dark has-text-weight-semibold" onClick={() => setShowModal(true)} href="#">Share</a> your referral code with your mates and get free credits<span className="is-size-6">*</span> to unlock picks and have good change to make extra money<span className="is-size-6">**</span>!
                    </h5>
                    <div className="content">
                      <p className="is-size-7">
                        * Your mates need to create an new account and use your referral code.
                      </p>
                      <p className="is-size-7">
                        * You can get a maximum of 50 credits.
                      </p>
                      <p className="is-size-7">
                        ** ESB does not guarantee a profit.
                      </p>
                    </div>
                    <Button
                      label='get free credits'
                      isUpperCase={true}
                      color='dark'
                      handleClick={() => setShowModal(true)}
                      vibrateOnClick={true}
                    />
                  </div>
                </div>
                {/* {!user.otherReferralCode && <div className="column">
                  <div className="box">
                    <h3 className="title is-spaced">
                      <span className="is-uppercase">Mate</span> referral code
                    </h3>
                    <h5 className="subtitle">
                      Type your mate referral code here!
                    </h5>
                    <Field label='Mate referral code' hasIconAtLeft={true}>
                      <Input
                        type='text'
                        value={mateReferralCode}
                        onChange={value => setMateReferralCode(value)}
                      />
                      <span className='icon is-small is-left'>
                        <i class="fas fa-hashtag"></i>
                      </span>
                    </Field>
                    <Button
                      className="mt-8"
                      label='get my 1 free credit'
                      isUpperCase={true}
                      color='dark'
                      handleClick={checkMateReferralCode}
                      vibrateOnClick={true}
                    />
                  </div>
                </div>} */}
              </div>
            )}

            <div className='columns'>
              <div className='column'>
                <div className='box is-flex flex-space-between'>
                  <div className='box__content'>
                    <div className='title is-capitalized'>
                      <span className='icon is-large'>
                        <i className='fas fa-dollar-sign'></i>
                      </span>
                      credits
                    </div>
                    <div className='subtitle'>
                      You currently have{' '}
                      <span className='has-text-danger has-text-weight-semibold'>
                        {user?.credits ? user?.credits : 0}
                      </span>{' '}
                      credits!
                    </div>
                    <Button
                      label='buy more'
                      isUpperCase={true}
                      color='dark'
                      redirectTo={MENU_ITEM.PACKAGES.PATH}
                      vibrateOnClick={true}
                    />
                  </div>
                  {/* <div className="box__image">
                    <figure className="image is-128x128">
                      <img src={imageCredits} />
                    </figure>
                  </div> */}
                </div>
              </div>
              <div className='column'>
                <div className='box'>
                  <div className='title is-capitalized'>
                    <span className='icon is-large'>
                      <i className='fas fa-tasks'></i>
                    </span>
                    scorecard
                  </div>
                  <div className='subtitle'>View your previous picks and see how you stack up.</div>
                  <Button
                    label='view scorecard'
                    isUpperCase={true}
                    color='dark'
                    redirectTo={MENU_ITEM.SCORECARD.PATH}
                    vibrateOnClick={true}
                  />
                </div>
              </div>
            </div>

            <div className='columns'>
              <div className='column'>
                <div className='box'>
                  <div className='title is-capitalized'>
                    <span className='icon is-large'>
                      <i className='fas fa-box-open'></i>
                    </span>
                    picks
                  </div>
                  <div className='subtitle'>View our current picks.</div>
                  <Button
                    label='view all'
                    isUpperCase={true}
                    color='dark'
                    redirectTo={MENU_ITEM.PICKS.PATH}
                    vibrateOnClick={true}
                  />
                </div>
              </div>
              <div className='column'>
                <div className='box'>
                  <div className='title is-capitalized'>
                    <span className='icon is-large'>
                      <i className='fas fa-user-alt'></i>
                    </span>
                    account
                  </div>
                  <div className='subtitle'>View and edit your account details.</div>
                  <Button
                    label='view account'
                    isUpperCase={true}
                    color='dark'
                    redirectTo={MENU_ITEM.ACCOUNT.PATH}
                    vibrateOnClick={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default UserDashboardSection;
