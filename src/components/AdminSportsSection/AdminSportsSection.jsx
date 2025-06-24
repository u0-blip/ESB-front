import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';

// COMPONENTS
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import { COLORS, ICON_SIZES } from '../../utils/enums';
import { ExecGraphQl } from '../../http/httpService';
import { LIST_SPORTS_QL } from '../../http/graphqlQuerys';
import { CREATE_OR_SAVE_SPORT_QL } from '../../http/graphqlMutations';
import Table from '../Table/Table';
import Modal from '../Modal/Modal';
import Field from '../Field/Field';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import { MODAL_TYPES } from '../../utils/constants';

import './AdminSportsSection.scss';

function AdminSportsSection(props) {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [sportId, setSportId] = useState(undefined);
  const [sportTitle, setSportTitle] = useState('');
  const [sportShortTitle, setSportShortTitle] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [modalType, setModalType] = useState('');

  // TOAST
  const { addToast } = useToasts();

  useEffect(() => {
    loadSports(1, 1000);
  }, []);

  const loadSports = async (currentPage, sportsPerPage) => {
    const picksData = await ExecGraphQl(LIST_SPORTS_QL, {
      page: currentPage - 1,
      pageSize: sportsPerPage,
      sort: ['id'],
      sortDir: ['DESC']
    });
    setData(picksData.data.ListSports.rows);
  };

  const handleClickEditSport = sportObj => {
    setIsEdit(true);
    setSportId(sportObj.id);
    setSportTitle(sportObj.title);
    setSportShortTitle(sportObj.shortTitle);
    setModalType(MODAL_TYPES.UPDATE);
    setShowModal(true);
  };

  const handleClickAddSport = () => {
    setIsEdit(false);
    setSportId(undefined);
    setSportTitle('');
    setSportShortTitle('');
    setModalType(MODAL_TYPES.UPDATE);
    setShowModal(true);
  };

  const handleClickDeleteSport = sportObj => {
    setIsEdit(true);
    setSportId(sportObj.id * -1);
    setSportShortTitle('sport');
    setSportTitle('sport');
    setModalType(MODAL_TYPES.CONFIRMATION);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    const gqlVariables = {
      id: sportId,
      shortTitle: sportShortTitle,
      title: sportTitle
    };
    if (!isEdit && !(sportId < 0)) {
      delete gqlVariables.id;
    }
    const response = await ExecGraphQl(CREATE_OR_SAVE_SPORT_QL, gqlVariables);
    if (sportId < 0) {
      addToast('Sport deleted successfully!', {
        appearance: 'success',
        autoDismiss: true
      });
    } else {
      if (response?.data?.CreateOrSaveSport?.id) {
        addToast('Sport saved successfully!', {
          appearance: 'success',
          autoDismiss: true
        });
      } else {
        addToast(response?.errors?.length ? response.errors[0].message : 'Something went wrong!', {
          appearance: 'error',
          autoDismiss: true
        });
      }
    }
    loadSports(1, 1000);
    setShowModal(false);
  };

  const getEditButton = item => {
    return (
      <Button
        label='edit'
        className='margin-4'
        color={COLORS.DARK}
        isUpperCase={true}
        handleClick={() => handleClickEditSport(item)}
      >
        <Icon name='fas fa-pen' size={ICON_SIZES.SMALL} />
      </Button>
    );
  };

  const getDeleteButton = item => {
    return (
      <Button
        label='delete'
        className='margin-4'
        color={COLORS.DARK}
        isUpperCase={true}
        handleClick={() => handleClickDeleteSport(item)}
      >
        <Icon name='fas fa-trash-alt' size={ICON_SIZES.SMALL} />
      </Button>
    );
  };

  const getActionButtons = item => {
    return (
      <div className='isFlex'>
        {getEditButton(item)}
        {getDeleteButton(item)}
      </div>
    );
  };

  const getRows = () => {
    return data.map(item => [item.shortTitle, item.title, getActionButtons(item)]);
  };

  const getModalCreateFields = () => {
    return (
      <div className='notification'>
        <div className='subtitle'>Edit Sport league</div>
        <Field label='Title'>
          <Input type='text' value={sportTitle} onChange={value => setSportTitle(value)} />
        </Field>
        <Field label='Short title'>
          <Input type='text' value={sportShortTitle} onChange={value => setSportShortTitle(value)} />
        </Field>
        <div className='buttons'>
          <Button label='close' isUpperCase={true} handleClick={handleCloseModal}>
            <Icon name='fas fa-times' size={ICON_SIZES.SMALL} />
          </Button>
          <Button label='save' color={COLORS.DARK} isUpperCase={true} handleClick={handleSave}>
            <Icon name='fas fa-check' size={ICON_SIZES.SMALL} />
          </Button>
        </div>
      </div>
    );
  };

  const getModalConfirmationFields = () => {
    return (
      <div className='notification'>
        <div className='title'>Delete Sport</div>
        <div className='subtitle'>Are you sure you want to delete the sport selected?</div>
        <div className='buttons'>
          <div className='button' onClick={() => setShowModal(false)}>
            Cancel
          </div>
          <button className='button is-dark' onClick={handleSave}>
            Confirm
          </button>
        </div>
      </div>
    );
  };

  const getModalFields = modalTypeParam => {
    switch (modalTypeParam) {
      case MODAL_TYPES.CONFIRMATION:
        return getModalConfirmationFields();

      case MODAL_TYPES.UPDATE:
        return getModalCreateFields();

      default:
        return null;
    }
  };

  return (
    <Section>
      <Modal
        showModal={showModal}
        handleClose={handleCloseModal}
        render={() => getModalFields(modalType)}
      />
      <div className='AdminDashboardSectionComponent container'>
        <SectionHeader
          title='Sports'
          subtitle='Sports leagues we currently work with'
          fontColor={COLORS.BLACK}
          fontSize=''
        />
        <button onClick={() => handleClickAddSport()} className='button is-dark is-uppercase'>
          <span className='icon is-small'>
            <i className='fas fa-plus-circle'></i>
          </span>
          <span>create</span>
        </button>
        <br />
        <br />

        <div className='box'>
          <Table headers={['Title', 'Short Title', 'Actions']} rows={getRows()} />
        </div>
      </div>
    </Section>
  );
}

export default AdminSportsSection;
