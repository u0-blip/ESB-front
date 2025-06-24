import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import Select from 'react-select';
import moment from 'moment';

// COMPONENTS
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import { COLORS, ICON_SIZES } from '../../utils/enums';
import { ExecGraphQl } from '../../http/httpService';
import { LIST_USERS_QL } from '../../http/graphqlQuerys';
import Table from '../Table/Table';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import Field from '../Field/Field';
import Input from '../Input/Input';
import PaginationComp from '../Pagination/Pagination';
import { USER_ROLES } from '../../utils/constants';
import Spacer from '../Spacer/Spacer';
import { CREATE_OR_SAVE_USER } from '../../http/graphqlMutations';

import './AdminUsersSection.scss';

function AdminUsersSection(props) {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [userId, setUserId] = useState(undefined);
  const [userCognitoId, setUserCognitoId] = useState(undefined);
  const [userName, setUserName] = useState('');
  // const [userBillingAddress, setUserBillingAddress] = useState('');
  // const [userPhoneNumber, setUserPhoneNumber] = useState('');
  // const [userDOB, setUserDOB] = useState('');
  const [userCredits, setUserCredits] = useState(0);
  const [userDob, setUserDob] = useState('');
  const [userRole, setUserRole] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [userCreated, setUserCreated] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(0);

  // TOAST
  const { addToast } = useToasts();

  useEffect(() => {
    loadUsers(1, 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUsers = async (currentPage, usersPerPage) => {
    const gqlVariables = {
      page: currentPage - 1,
      pageSize: usersPerPage,
      sort: ['name'],
      sortDir: ['ASC']
    };

    const usersData = await ExecGraphQl(LIST_USERS_QL, gqlVariables);
    if (usersData?.data?.ListUsers?.rows) {
      setUsers(usersData.data.ListUsers.rows);
      setCurrentPage(usersData.data.ListUsers.page + 1);
      setUsersPerPage(usersData.data.ListUsers.pageSize);
      setTotalPages(usersData.data.ListUsers.totalPages);
    } else {
      addToast('No data available to display!', { appearance: 'error', autoDismiss: true });
    }
  };

  const handleClickSave = async (id, cognitoUserId, email, name, credits, roles, dateOfBirth) => {
    const userParams = {
      id,
      cognitoUserId,
      email,
      name,
      credits,
      roles: roles.value,
      dateOfBirth,
      creditType: 'MANUAL'
    };
    const saveUserResult = await ExecGraphQl(CREATE_OR_SAVE_USER, userParams);
    if (saveUserResult?.data?.CreateOrSaveUser?.id) {
      addToast('User updated successfully!', { appearance: 'success', autoDismiss: true });
      setShowModal(false);
      loadUsers(1, 30);
    } else {
      addToast('Something went wrong, please try again!', { appearance: 'error', autoDismiss: true });
    }
  };

  const handleChangeCredits = value => {
    setUserCredits(+value);
  };

  const handleChangeRole = roleSelectedObj => {
    setUserRole(roleSelectedObj);
  };

  const handlePaginationClick = pageItem => {
    loadUsers(pageItem, usersPerPage);
  };

  const handleClickViewUser = userObj => {
    const userToView = {
      id: userObj.id,
      cognitoUserId: userObj.cognitoUserId,
      name: userObj.name,
      email: userObj.email,
      dateOfBirth: userObj.dateOfBirth,
      createdAt: userObj.createdAt,
      role: { label: userObj.roles[0], value: `${userObj.roles[0]}` },
      credits: +userObj.credits
    };
    setUserId(userToView.id);
    setUserCognitoId(userToView.cognitoUserId);
    setUserName(userToView.name);
    setUserEmail(userToView.email);
    setUserCredits(userToView.credits);
    setUserRole(userToView.role);
    setUserDob(userToView.dateOfBirth);
    setUserCreated(userToView.createdAt);
    setIsModalEdit(false);
    setShowModal(true);
  };

  const handleClickEditUser = userObj => {
    const userToEdit = {
      id: userObj.id,
      cognitoUserId: userObj.cognitoUserId,
      name: userObj.name,
      email: userObj.email,
      dateOfBirth: userObj.dateOfBirth,
      createdAt: userObj.createdAt,
      role: { label: userObj.roles[0], value: `${userObj.roles[0]}` },
      credits: +userObj.credits
    };
    setUserId(userToEdit.id);
    setUserCognitoId(userToEdit.cognitoUserId);
    setUserName(userToEdit.name);
    setUserEmail(userToEdit.email);
    setUserCredits(userToEdit.credits);
    setUserRole(userToEdit.role);
    setUserDob(userToEdit.dateOfBirth);
    setUserCreated(userToEdit.createdAt);
    setIsModalEdit(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getRoleOptions = sports => {
    return Object.keys(USER_ROLES).map(roleItem => {
      return { label: USER_ROLES[roleItem].LABEL, value: USER_ROLES[roleItem].VALUE };
    });
  };

  const getActionButtons = item => {
    return (
      <div className='isFlex'>
        {getEditButton(item)}
        {getViewButton(item)}
      </div>
    );
  };

  const getEditButton = item => {
    return (
      <Button
        className='margin-4'
        label='edit'
        handleClick={() => handleClickEditUser(item)}
        color={COLORS.DARK}
        vibrateOnClick={true}
        isUpperCase={true}
      >
        <Icon size={ICON_SIZES.SMALL} name='fas fa-pen' />
      </Button>
    );
  };

  const getViewButton = item => {
    return (
      <Button
        label='View'
        className='margin-4'
        handleClick={() => handleClickViewUser(item)}
        color={COLORS.DARK}
        vibrateOnClick={true}
        isUpperCase={true}
      >
        <Icon size={ICON_SIZES.SMALL} name='fas fa-search' />
      </Button>
    );
  };

  const getDob = (dobString = '') => {
    // this format 1985-02-15 is converted to this 15/02/1985
    let dob = dobString.split('-').join('/');
    if (dob && dob.charAt(4) === '/') {
      dob = dob.split('/').reverse().join('/');
    }
    return dob;
  }

  const getCreated = (created = '') => {
    return moment(created).format('DD/MM/YYYY');
  };

  const getRows = () => {
    return users.map(item => [
      item.name,
      item.email,
      getDob(item.dateOfBirth),
      !!item.credits ? item.credits : '0',
      item.roles && item.roles[0],
      getCreated(item.createdAt),
      getActionButtons(item)
    ]);
  };

  const getModalViewUser = () => {
    return (
      <div className='AdminUsersSectionModal notification'>
        <div className='subtitle is-capitalized'>user info</div>

        {/* ### Name field ### */}
        <Field label='Name'>
          <Input disabled={{ disabled: true }} type='text' value={userName} />
        </Field>

        {/* ### Email field ### */}
        <Field label='Email'>
          <Input disabled={{ disabled: true }} type='text' value={userEmail} />
        </Field>

        {/* ### DOB field ### */}
        <Field label='DOB'>
          <Input disabled={{ disabled: true }} type='text' value={getDob(userDob)} />
        </Field>

        {/* ### Credits field ### */}
        <Field label='Credits'>
          <Input
            disabled={{ disabled: true }}
            type='number'
            value={`${userCredits}`}
            onChange={handleChangeCredits}
          />
        </Field>

        {/* ### Role field ### */}
        <Field label='Role'>
          <Select
            isDisabled={true}
            value={userRole}
            options={getRoleOptions()}
            onChange={handleChangeRole}
            isSearchable={false}
          />
        </Field>

        {/* ### Created field ### */}
        <Field label='Created'>
          <Input disabled={{ disabled: true }} type='text' value={getCreated(userCreated)} />
        </Field>

        <Button
          label='close'
          handleClick={handleCloseModal}
          color={COLORS.DARK}
          vibrateOnClick={true}
          isUpperCase={true}
        >
          <Icon size={ICON_SIZES.SMALL} name='fas fa-times' />
        </Button>
      </div>
    );
  };

  const getModalEditUser = () => {
    return (
      <div className='AdminUsersSectionModal notification'>
        <div className='subtitle is-capitalized'>edit user info</div>

        {/* ### Name field ### */}
        <Field label='Name'>
          <Input disabled={{ disabled: true }} type='text' value={userName} />
        </Field>

        {/* ### Email field ### */}
        <Field label='Email'>
          <Input disabled={{ disabled: true }} type='text' value={userEmail} />
        </Field>

        {/* ### DOB field ### */}
        <Field label='DOB'>
          <Input onChange={value => setUserDob(value)} type='date' value={userDob} />
        </Field>

        {/* ### Credits field ### */}
        <Field label='Credits'>
          <Input type='number' value={`${userCredits}`} onChange={handleChangeCredits} />
        </Field>

        {/* ### Role field ### */}
        <Field label='Role'>
          <Select
            value={userRole}
            options={getRoleOptions()}
            onChange={handleChangeRole}
            isSearchable={false}
          />
        </Field>

        {/* ### Created field ### */}
        <Field label='Created'>
          <Input disabled={{ disabled: true }} type='text' value={getCreated(userCreated)} />
        </Field>

        <div className='buttons'>
          {/* <Button
            label='delete'
            handleClick={() => console.log('clicked delete')}
            vibrateOnClick={true}
            isUpperCase={true}>
            <Icon size={ICON_SIZES.SMALL} name='fas fa-trash' />
          </Button> */}
          <Button
            label='close'
            handleClick={handleCloseModal}
            color={COLORS.DARK}
            vibrateOnClick={true}
            isUpperCase={true}
          >
            <Icon size={ICON_SIZES.SMALL} name='fas fa-times' />
          </Button>
          <Button
            label='save'
            handleClick={() =>
              handleClickSave(userId, userCognitoId, userEmail, userName, userCredits, userRole, userDob)
            }
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

  const getModalFields = () => {
    if (isModalEdit) {
      return getModalEditUser();
    }
    return getModalViewUser();
  };

  return (
    <Section>
      <Modal showModal={showModal} handleClose={handleCloseModal} render={() => getModalFields()} />
      <div className='AdminDashboardSectionComponent container'>
        <SectionHeader title='Users' subtitle='Manage Users' fontColor={COLORS.BLACK} fontSize='' />
        <Spacer />
        <Spacer />

        <div className='box'>
          {!!getRows() && !!getRows().length ? (
            <Table headers={['Name', 'Email', 'DOB', 'Credits', 'Role', 'Created', 'Actions']} rows={getRows()} />
          ) : (
            <div className='subtitle has-text-centered'>No data available to display!</div>
          )}
        </div>

        <PaginationComp
          page={currentPage}
          pageSize={usersPerPage}
          totalPages={totalPages}
          handlePageClick={handlePaginationClick}
        />
      </div>
    </Section>
  );
}

export default AdminUsersSection;
