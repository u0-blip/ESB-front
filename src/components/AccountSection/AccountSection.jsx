import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import PhoneInput from 'react-phone-number-input';

// COMPONENTS
import SectionHeader from '../SectionHeader/SectionHeader';
import Section from '../Section/Section';
import Loader from '../Loader/Loader';
import Gravatar from '../Gravatar/Gravatar';
import Field from '../Field/Field';
import Input from '../Input/Input';
import Icon from '../Icon/Icon';

// UTILS
import { COLORS, ICON_SIZES } from '../../utils/enums';
import { useAuth } from '../../utils/auth';
import { formatDob } from '../../utils/functions';

// GRAPHQL
import { ExecGraphQl } from '../../http/httpService';
import { LIST_USERS_QL } from '../../http/graphqlQuerys';
import { CREATE_OR_SAVE_USER } from '../../http/graphqlMutations';

// CSS
import 'react-phone-number-input/style.css';
import './AccountSection.scss';

function AccountSection(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  // FIELDS NOT ON FORM
  const [cognitoUserId, setCognitoUserId] = useState('');

  // TOAST
  const { addToast } = useToasts();

  // AUTH
  const auth = useAuth();

  useEffect(() => {
    loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    const userData = await ExecGraphQl(LIST_USERS_QL, {userId: parseInt(auth?.user?.userId)});
    if (userData?.data?.ListUsers?.rows?.length) {
      const userResponse = userData.data.ListUsers.rows[0];
      setName(userResponse.name);
      setEmail(userResponse.email);
      setPhone(userResponse.phone);
      setDateOfBirth(!!userResponse.dateOfBirth ? formatDob(userResponse.dateOfBirth) : '');
      setCognitoUserId(userResponse.cognitoUserId);
    }
  };

  const handleSave = async () => {
    const gqlVariables = {
      id: parseInt(auth?.user?.userId),
      cognitoUserId,
      name,
      email,
      phone,
      dateOfBirth
    }
    const userData = await ExecGraphQl(CREATE_OR_SAVE_USER, gqlVariables);
    if (userData?.data?.CreateOrSaveUser?.id) {
      addToast('Details saved successfully!', {
        appearance: 'success',
        autoDismiss: true
      });
    } else {
      addToast(userData?.errors[0].message, {
        appearance: 'error',
        autoDismiss: true
      });
    }
  }

  return (
    <Section sectionSize=''>
      <Loader isActive={false} />
      <div className='AccountSectionComponent container'>
        <SectionHeader
          title='Your account'
          subtitle={`${name} | ${email}`}
          fontColor={COLORS.BLACK}
          fontSize=''
        />

        <div className="columns">

          <div className="column">
            <div className='container is-flex flex-direction-column flex-align-items-center'>
              <Gravatar email={email} />
              <div className='content pt-8 pb-16 is-size-7-mobile'>
                <p>
                  Your avatar is taken from <a href='https://gravatar.com'>Gravatar</a> using your account email
                  address. Go to <a href='https://gravatar.com'>Gravatar</a> to add or edit your avatar.
                </p>
              </div>
            </div>
          </div>

          <div className="column">
            <div className='field'>
              <label className='label'>Username</label>
              <div className='control has-icons-left'>
                <input
                  className='input'
                  value={name}
                  type='text'
                  placeholder='Name'
                  onChange={e => setName(e.target.value)}
                />
                <span className='icon is-small is-left'>
                  <i className='fas fa-user'></i>
                </span>
              </div>
            </div>

            {/* <div className='field'>
              <label className='label'>Email</label>
              <div className='control has-icons-left'>
                <input
                  className='input'
                  disabled
                  value={email}
                  type='email'
                  placeholder='Email'
                  onChange={e => setEmail(e.target.value)}
                />
                <span className='icon is-small is-left'>
                  <i className='fas fa-envelope'></i>
                </span>
              </div>
            </div> */}

            {/* <div className='field'>
              <label className='label'>Billing Address</label>
              <div className='control has-icons-left'>
                <input className='input' disabled type='text' placeholder='Address' />
                <span className='icon is-small is-left'>
                  <i className='fas fa-user'></i>
                </span>
              </div>
            </div> */}

            <div className='field'>
              <label className='label'>Phone Number</label>
              {/* <div className='control has-icons-left'>
                <input
                  className='input'
                  value={phone}
                  type='text'
                  placeholder='Phone'
                  onChange={e => setPhone(e.target.value)}
                />
                <span className='icon is-small is-left'>
                  <i className='fas fa-phone'></i>
                </span>
              </div> */}
              <div className='control'>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={value => setPhone(value)}
                  className="input phone-number"
                />
              </div>
            </div>

            <Field label='Date of Birth' hasIconAtLeft={true}>
              <Input type='date' value={dateOfBirth} onChange={value => setDateOfBirth(value)} />
              <Icon size={ICON_SIZES.SMALL} isLeft={true} name='fas fa-calendar' />
            </Field>

            <div className='field'>
              <div className='control'>
                <label className='checkbox'>
                  <input disabled type='checkbox' />{' '}I agree to the{' '}
                  <a className='has-text-black has-text-weight-semibold' href='#termsAndConditions'>
                    terms and conditions
                  </a>
                </label>
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button className="button is-dark" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </Section>
  );
}

export default AccountSection;
