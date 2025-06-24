/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';

// COMPONENTS
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import { COLORS, ICON_SIZES } from '../../utils/enums';
import { ExecGraphQl } from '../../http/httpService';
import { LIST_TEAMS_QL, LIST_SPORTS_QL } from '../../http/graphqlQuerys';
import { CREATE_OR_SAVE_COMPETITOR_QL } from '../../http/graphqlMutations';
import Table from '../Table/Table';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import Field from '../Field/Field';
import Input from '../Input/Input';
import Select from '../Select/Select';
import FileInput from '../FileInput/FileInput';
import PaginationComp from '../Pagination/Pagination';
import Dropdown from '../Dropdown/Dropdown';
import { getSportTabOptions } from '../../service/SportService';
import { MODAL_TYPES } from '../../utils/constants';
import { upload } from '../../http/httpService';

// CSS
import 'react-image-crop/lib/ReactCrop.scss';

function AdminTeamsSection(props) {
  const [data, setData] = useState([]);
  const [sports, setSports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [competitorNameFormField, setCompetitorNameFormField] = useState('');
  const [competitorSportFormField, setCompetitorSportFormField] = useState(null);
  const [competitorLogoFormField, setCompetitorLogoFormField] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage, setTeamsPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const [sportItemSelected, setSportItemSelected] = useState({
    id: 1001,
    shortTitle: 'All',
    title: 'All'
  });
  const [competitorIdSelected, setCompetitorIdSelected] = useState(null);
  const [modalType, setModalType] = useState('');
  const [croppedImgBase64, setCroppedImgBase64] = useState(null);

  // TOAST
  const { addToast } = useToasts();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    loadTeams(1, 30);
    loadSports();
  }, []);

  const loadTeams = async (currentPage, teamsPerPage, sportId) => {
    const gqlVariables = {
      page: currentPage - 1,
      pageSize: teamsPerPage,
      sort: ['name'],
      sortDir: ['ASC']
    };

    if (!!sportId) {
      gqlVariables.sportId = sportId;
    }

    const teamsData = await ExecGraphQl(LIST_TEAMS_QL, gqlVariables);
    setData(teamsData.data.ListTeams.rows);
    setCurrentPage(teamsData.data.ListTeams.page + 1);
    setTeamsPerPage(teamsData.data.ListTeams.pageSize);
    setTotalPages(teamsData.data.ListTeams.totalPages);
  };

  const loadSports = async () => {
    const sportsData = await ExecGraphQl(LIST_SPORTS_QL);
    if (sportsData?.data?.ListSports?.rows) {
      const topOptions = [{ id: 1001, shortTitle: 'All', title: 'All' }];
      setSports(getSportTabOptions(sportsData.data.ListSports.rows, topOptions));
    }
  };

  const saveImage = async () => {
    if (croppedImgBase64) {

      const formData = new FormData();
      formData.append('competitors', croppedImgBase64);

      const fileUploadResponse = await upload(formData);
      if (fileUploadResponse?.data?.file) {
        setCompetitorLogoFormField(fileUploadResponse.data.file);
        addToast('File uploaded!', {
          appearance: 'success',
          autoDismiss: true
        });
      } else {
        addToast('File not uploaded!', {
          appearance: 'warning',
          autoDismiss: true
        });
      }
      return fileUploadResponse.data.file;
    } else {
      addToast('No file selected!', {
        appearance: 'info',
        autoDismiss: true
      });
    }
  }

  const handleClickSave = async () => {

    const imageFileName = await saveImage();

    const gqlVariables = {
      id: competitorIdSelected,
      sportId: competitorSportFormField?.value,
      name: competitorNameFormField,
      logo: imageFileName || competitorLogoFormField
    };

    if (!isEdit && !(competitorIdSelected < 0)) {
      delete gqlVariables.id;
    }

    const response = await ExecGraphQl(CREATE_OR_SAVE_COMPETITOR_QL, gqlVariables);

    if (competitorIdSelected < 0) {
      loadTeams(1, 30);
      setShowModal(false);
      addToast('Team deleted successfully!', {
        appearance: 'success',
        autoDismiss: true
      });
    } else {
      if (response?.data?.CreateOrSaveCompetitor?.id) {
        loadTeams(1, 30);
        setShowModal(false);
        addToast('Team saved successfully!', {
          appearance: 'success',
          autoDismiss: true
        });
      }
    }
  };

  const handlePaginationClick = pageItem => {
    loadTeams(pageItem, teamsPerPage, sportItemSelected.id);
  };

  const handleClickEditTeam = teamObj => {
    setCompetitorIdSelected(teamObj.id);
    setCompetitorNameFormField(teamObj.name);
    setCompetitorSportFormField(teamObj?.SportFld);
    setCompetitorLogoFormField(teamObj.logo);
    setModalType(MODAL_TYPES.UPDATE);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleClickAddTeam = () => {
    setCompetitorNameFormField('');
    setCompetitorSportFormField(null);
    setCompetitorLogoFormField('');
    setModalType(MODAL_TYPES.UPDATE);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleClickDeleteTeam = teamObj => {
    setCompetitorNameFormField('team');
    setCompetitorSportFormField({ value: 1 });
    setCompetitorLogoFormField('team');
    setCompetitorIdSelected(teamObj.id * -1);
    setModalType(MODAL_TYPES.CONFIRMATION);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChangeName = value => {
    setCompetitorNameFormField(value);
  };

  const handleChangeSportLeague = selectedOption => {
    setCompetitorSportFormField(selectedOption);
  };

  const handleClickFilterSport = sportItem => {
    let sportFilterId = sportItem?.id;
    // let sortByFilterParam = 'id'; // The default sort by is by ID

    if (sportItem?.shortTitle === 'All') {
      sportFilterId = null; // bring all
    }

    setSportItemSelected(sportItem);
    setCurrentPage(1);
    setTotalPages(0);
    loadTeams(1, teamsPerPage, sportFilterId);
  };

  const handleChangeFile = fileBase64 => {
    setCroppedImgBase64(fileBase64);
  };

  const getSportOptions = sports => {
    return sports.map(sportItem => ({
      label: sportItem.title,
      value: sportItem.id
    }));
  };

  const getEditButton = item => {
    return (
      <Button
        label='edit'
        className='margin-4'
        handleClick={() => handleClickEditTeam(item)}
        color={COLORS.DARK}
        vibrateOnClick={true}
        isUpperCase={true}
      >
        <Icon size={ICON_SIZES.SMALL} name='fas fa-pen' />
      </Button>
    );
  };

  const getDeleteButton = item => {
    return (
      <Button
        label='delete'
        className='margin-4'
        handleClick={() => handleClickDeleteTeam(item)}
        color={COLORS.DARK}
        vibrateOnClick={true}
        isUpperCase={true}
      >
        <Icon size={ICON_SIZES.SMALL} name='fas fa-trash-alt' />
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
    return data.map(item => [item.name, item.SportFld.label, getActionButtons(item)]);
  };

  const getModalConfirmationFields = () => {
    return (
      <div className='notification'>
        <div className='title'>Delete Team</div>
        <div className='subtitle'>Are you sure you want to delete the team selected?</div>
        <div className='buttons'>
          <div className='button' onClick={() => setShowModal(false)}>
            Cancel
          </div>
          <button className='button is-dark' onClick={handleClickSave}>
            Confirm
          </button>
        </div>
      </div>
    );
  };

  const getModalCreateFields = () => {
    return (
      <div className='notification'>
        <div className='subtitle is-capitalized'>{isEdit ? 'edit team' : 'new team'}</div>

        {/* ### Team name field ### */}
        <Field label='Name'>
          <Input type='text' value={competitorNameFormField} onChange={value => handleChangeName(value)} />
        </Field>

        {/* ### Sport selection field ### */}
        <Field label='Sports League'>
          <Select
            value={competitorSportFormField}
            options={getSportOptions(sports)}
            onChange={handleChangeSportLeague}
            isSearchable={false}
            isMenuFixed={true}
          />
        </Field>

        {/* ### logo image field ### */}
        <Field label='Logo'>
          <FileInput
            handleChangeFile={handleChangeFile}
            category='competitors'
            value={competitorLogoFormField}
          />
        </Field>

        <div className='buttons'>
          <Button
            label='close'
            handleClick={() => setShowModal(false)}
            vibrateOnClick={true}
            isUpperCase={true}
          >
            <Icon size={ICON_SIZES.SMALL} name='fas fa-times' />
          </Button>
          <Button
            label='save'
            handleClick={handleClickSave}
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
          title='Teams'
          subtitle='Teams leagues we currently work with'
          fontColor={COLORS.BLACK}
          fontSize=''
        />
        <Button
          label='create'
          handleClick={() => handleClickAddTeam()}
          color={COLORS.DARK}
          vibrateOnClick={true}
          isUpperCase={true}
        >
          <Icon size={ICON_SIZES.SMALL} name='fas fa-plus-circle' />
        </Button>
        <br />
        <br />

        <Dropdown label={sportItemSelected?.shortTitle || 'Choose Sport'}>
          {sports.map((sportItem, idx) => {
            return (
              <React.Fragment key={idx}>
                {idx === 0 ? (
                  <>
                    <a
                      key={`${idx}-dropdown-item`}
                      className={`dropdown-item${
                        sportItemSelected && sportItem.shortTitle === sportItemSelected.shortTitle
                          ? ' is-active'
                          : ''
                      }`}
                      onClick={() => handleClickFilterSport(sportItem)}
                    >
                      {sportItem.shortTitle}
                    </a>
                    <hr key={`${idx}-dropdown-divider`} className='dropdown-divider'></hr>
                  </>
                ) : (
                  <a
                    key={idx}
                    className={`dropdown-item${
                      sportItemSelected && sportItem.shortTitle === sportItemSelected.shortTitle
                        ? ' is-active'
                        : ''
                    }`}
                    onClick={() => handleClickFilterSport(sportItem)}
                  >
                    {sportItem?.shortTitle}
                  </a>
                )}
              </React.Fragment>
            );
          })}
        </Dropdown>

        <div className='box'>
          <Table headers={['Title', 'Sport', 'Action']} rows={getRows()} />
        </div>

        <PaginationComp
          page={currentPage}
          pageSize={teamsPerPage}
          totalPages={totalPages}
          handlePageClick={handlePaginationClick}
        />
      </div>
    </Section>
  );
}

export default AdminTeamsSection;
