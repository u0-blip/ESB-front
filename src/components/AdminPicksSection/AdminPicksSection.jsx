/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import * as moment from 'moment';

// COMPONENTS
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import { COLORS, ICON_SIZES } from '../../utils/enums';
import { ExecGraphQl } from '../../http/httpService';
import { LIST_TEAMS_QL, LIST_SPORTS_QL, LIST_ADMIN_PICKS_QL } from '../../http/graphqlQuerys';
import { CREATE_OR_SAVE_PICK_QL } from '../../http/graphqlMutations';
import Table from '../Table/Table';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import Field from '../Field/Field';
import Input from '../Input/Input';
import Select from '../Select/Select';
import Textarea from '../Textarea/TextArea';
import PaginationComp from '../Pagination/Pagination';
import { PICK_STATUS } from '../../utils/constants';
import DateTimeSelect from '../DateTimeSelect/DateTimeSelect';
import { someObjectIsEmpty } from '../../utils/functions';

import './AdminPicksSection.scss';

const getFilterPick = filterPick => {
  const filterPickObj = {};

  switch (filterPick) {
    case '_AWAITING_EVALUATION':
      filterPickObj.type = '_AWAITING_EVALUATION';
      filterPickObj.statuses = [PICK_STATUS.NEW.LABEL];
      filterPickObj.matchTime = { op: 'LT', value: moment().format() };
      break;

    case '_SETTLED_PICKS':
      filterPickObj.type = '_SETTLED_PICKS';
      filterPickObj.statuses = [
        PICK_STATUS.PUSH.LABEL,
        PICK_STATUS.CORRECT.LABEL,
        PICK_STATUS.INCORRECT.LABEL
      ];
      filterPickObj.matchTime = undefined;
      break;

    default:
      filterPickObj.type = '_ACTIVE_PICKS';
      filterPickObj.statuses = [PICK_STATUS.NEW.LABEL];
      filterPickObj.matchTime = { op: 'GT', value: moment().format() };
      break;
  }

  return filterPickObj;
};

function AdminPicksSection(props) {
  const [picks, setPicks] = useState([]);
  const [sports, setSports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDateTimeCalendar, setShowDateTimeCalendar] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [picksPerPage, setPicksPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const [filterPicks, setFilterPicks] = useState(getFilterPick('_ACTIVE_PICKS'));

  // TOAST
  const { addToast } = useToasts();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const filter = getFilterPick('_ACTIVE_PICKS');
    loadPicks(1, 30, filter.statuses, filter.matchTime);
    loadSports();
    loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPicks = async (currentPage, picksPerPage, statusesFilter, matchTimeFilter = undefined) => {
    const gqlVariables = {
      page: currentPage - 1,
      pageSize: picksPerPage,
      sort: ['id'],
      sortDir: ['DESC'],
      filter: {
        status: statusesFilter,
        matchTime: matchTimeFilter
      }
    };

    const picksData = await ExecGraphQl(LIST_ADMIN_PICKS_QL, gqlVariables);
    if (picksData?.data?.ListPicks?.rows) {
      setPicks(picksData.data.ListPicks.rows);
      setCurrentPage(picksData.data.ListPicks.page + 1);
      setPicksPerPage(picksData.data.ListPicks.pageSize);
      setTotalPages(picksData.data.ListPicks.totalPages);
    } else {
      addToast('No data available to display!', { appearance: 'error', autoDismiss: true });
    }
  };

  const loadTeams = async (currentPage, picksPerPage, sportId) => {
    const gqlVariables = {
      page: currentPage - 1,
      pageSize: picksPerPage,
      sort: ['name'],
      sortDir: ['ASC'],
      filter: { SportId: sportId }
    };

    const teamsData = await ExecGraphQl(LIST_TEAMS_QL, gqlVariables);
    if (teamsData?.data?.ListTeams?.rows) {
      setTeams(teamsData.data.ListTeams.rows);
    } else {
      addToast('No data available to display!', { appearance: 'error', autoDismiss: true });
    }
  };

  const loadSports = async (currentPage, teamsPerPage) => {
    const sportsData = await ExecGraphQl(LIST_SPORTS_QL);
    setSports(sportsData.data.ListSports.rows);
  };

  const savePick = async form => {
    try {
      const result = await ExecGraphQl(CREATE_OR_SAVE_PICK_QL, {
        id: form.id ? form.id : undefined,
        sportId: form.sportSelected.value,
        homeCompetitorId: form.homeCompetitorSelected.value,
        awayCompetitorId: form.awayCompetitorSelected.value,
        status: form.statusSelected.label,
        title: form.title,
        matchTime: form.matchTime,
        analysis: form.analysis,
        summary: form.summary,
        isFeatured: false
      });
      if (result?.data?.CreateOrSavePick?.id) {
        addToast('Pick saved!', { appearance: 'success', autoDismiss: true });
        return true;
      } else {
        const errorMessage = result?.errors && result?.errors[0] ? result.errors[0].errorText : 'Something went wrong, please try again!';
        addToast(errorMessage, { appearance: 'error', autoDismiss: true });
      }
    } catch (error) {
      addToast('Something went wrong please contact IT team!', { appearance: 'error', autoDismiss: true });
    }
  };

  const handlePaginationClick = pageItem => {
    loadPicks(pageItem, picksPerPage, filterPicks.statuses, filterPicks.matchTime);
  };

  const handleClickEditPick = pickObj => {
    const pickToEdit = {
      id: pickObj.id,
      sportSelected: { label: pickObj.SportFld.title, value: pickObj.SportId },
      homeCompetitorSelected: { label: pickObj.HomeCompetitorFld.name, value: pickObj.HomeCompetitorId },
      awayCompetitorSelected: { label: pickObj.AwayCompetitorFld.name, value: pickObj.AwayCompetitorId },
      statusSelected: { label: pickObj.status, value: PICK_STATUS[pickObj.status].VALUE },
      title: pickObj.title,
      matchTime: pickObj.matchTime,
      analysis: pickObj.analysis,
      summary: pickObj.summary
    };
    setFormData(pickToEdit);
    setIsEdit(true);
    setSubmitted(false);
    setShowModal(true);
  };

  const handleClickAddPick = () => {
    setFormData({
      id: undefined,
      sportSelected: { label: '', value: null },
      homeCompetitorSelected: { label: '', value: null },
      awayCompetitorSelected: { label: '', value: null },
      statusSelected: { label: '', value: null },
      title: '',
      matchTime: new Date(),
      analysis: '',
      summary: ''
    });
    setIsEdit(false);
    setSubmitted(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChangeTitle = value => {
    setFormData({ ...formData, title: value });
  };

  const handleChangeSportLeague = selectedOption => {
    setFormData({ ...formData, sportSelected: { ...selectedOption } });
  };

  const handleChangeHomeTeam = selectedOption => {
    setFormData({ ...formData, homeCompetitorSelected: { ...selectedOption } });
  };

  const handleChangeAwayTeam = selectedOption => {
    setFormData({ ...formData, awayCompetitorSelected: { ...selectedOption } });
  };

  // const handleChangeIsFeatured = e => {
  //   setFormData({ ...formData, isFeatured: e.target.checked });
  // };

  const handleChangeSummary = value => {
    setFormData({ ...formData, summary: value });
  };

  const handleChangeAnalysis = e => {
    setFormData({ ...formData, analysis: e.target.value });
  };

  const handleChangeMatchTime = value => {
    setFormData({ ...formData, matchTime: value });
  };

  // const handleChangePublishTime = value => {
  //   setFormData({ ...formData, publishTime: value });
  // };

  const handleChangeStatus = selectedOption => {
    setFormData({ ...formData, statusSelected: { ...selectedOption } });
  };

  const handleClickSave = async form => {
    setSubmitted(true);
    if (someObjectIsEmpty(form)) {
      return;
    }
    const isPickSaved = await savePick(form);
    if (isPickSaved) {
      setShowModal(false);
      loadPicks(1, 30, filterPicks.statuses, filterPicks.matchTime);
    }
  };
  // ### END - FORM HANDLERS ### //

  // ### BEGIN - FILTER PICKS HANDLERS ### //
  const handleClickFilterPicks = filterPick => {
    const filterPickObj = getFilterPick(filterPick);

    setFilterPicks(filterPickObj);
    loadPicks(1, 30, filterPickObj.statuses, filterPickObj.matchTime);
  };

  // ### END - FILTER PICKS HANDLERS ### //

  const getSportOptions = sports => {
    return sports.map(sportItem => ({ label: sportItem.title, value: sportItem.id }));
  };

  const getTeamOptions = (teams, sportId) => {
    if (!sportId) {
      return teams.map(teamItem => ({ label: teamItem.name, value: teamItem.id }));
    }

    const teamOptions = [];
    teams.forEach(teamItem => {
      if (teamItem.SportId === sportId) {
        teamOptions.push({ label: teamItem.name, value: teamItem.id });
      }
    });
    return teamOptions;
  };

  const getStatusOptions = status => {
    return Object.keys(status).map(statusItem => {
      return { label: status[statusItem].LABEL, value: status[statusItem].VALUE };
    });
  };

  const getEditButton = item => {
    return (
      <Button
        label='edit'
        className='margin-4'
        handleClick={() => handleClickEditPick(item)}
        color={COLORS.DARK}
        vibrateOnClick={true}
        isUpperCase={true}
      >
        <Icon size={ICON_SIZES.SMALL} name='fas fa-pen' />
      </Button>
    );
  };

  const getRows = () => {
    return picks.map(item => [
      item.title,
      moment(item.matchTime).format('MMMM Do YYYY, k:mm'),
      getEditButton(item)
    ]);
  };

  const getModalFields = () => {
    return (
      <div className='AdminPicksSectionModal notification'>
        <div className='subtitle is-capitalized'>{isEdit ? 'edit pick' : 'new pick'}</div>

        {/* ### Team name field ### */}
        <Field label='Title'>
          <Input
            type='text'
            value={formData?.title}
            onChange={handleChangeTitle}
            required={true}
            touched={submitted}
          />
        </Field>

        {/* ### Sport selection field ### */}
        <Field label='Sports League'>
          <Select
            value={formData?.sportSelected}
            options={getSportOptions(sports)}
            onChange={handleChangeSportLeague}
            isSearchable={false}
            required={true}
            touched={submitted}
          />
        </Field>

        {/* ### Home Team and Away Team fields ### */}
        <div className='columns'>
          <div className='column'>
            <Field label='Home Team'>
              <Select
                value={formData?.homeCompetitorSelected}
                options={getTeamOptions(teams, formData?.sportSelected?.value)}
                onChange={handleChangeHomeTeam}
                isSearchable={false}
                isDisabled={!formData?.sportSelected?.value}
                required={true}
                touched={submitted}
              />
            </Field>
          </div>

          <div className='column'>
            <Field label='Away Team'>
              <Select
                value={formData?.awayCompetitorSelected}
                options={getTeamOptions(teams, formData?.sportSelected?.value)}
                onChange={handleChangeAwayTeam}
                isSearchable={false}
                isDisabled={!formData?.sportSelected?.value}
                required={true}
                touched={submitted}
              />
            </Field>
          </div>
        </div>

        {/* ### Pick Summary field ### */}
        <Field label='Pick Summary'>
          <Input
            type='text'
            value={formData?.summary}
            onChange={handleChangeSummary}
            required={true}
            touched={submitted}
          />
        </Field>

        {/* ### Match Time and Publish Time fields ### */}
        <div className='columns'>
          <div className='column'>
            <Field label='Match Time' hasIconAtRight={true}>
              <Input
                type='text'
                value={moment(new Date(formData?.matchTime)).format('MMMM Do YYYY, k:mm')}
                onChange={handleChangeTitle}
                onClick={() => setShowDateTimeCalendar(!showDateTimeCalendar)}
                required={true}
                touched={submitted}
              />

              <span className='icon is-small is-right'>
                <i className='fas fa-calendar'></i>
              </span>
            </Field>
            <DateTimeSelect
              showInput={false}
              value={new Date(formData?.matchTime)}
              onChange={handleChangeMatchTime}
              open={showDateTimeCalendar}
            />
          </div>

          <div className='column'>
            <Field label='Status'>
              <Select
                value={formData?.statusSelected}
                options={getStatusOptions(PICK_STATUS)}
                onChange={handleChangeStatus}
                isSearchable={false}
                required={true}
                touched={submitted}
              />
            </Field>
          </div>

          {/* <div className="column">
            <Field label='Publish Time'>
              <DateTimePicker className='DateTimePickerComponent' onChange={handleChangePublishTime} value={formData.publishTime} />
            </Field>
          </div> */}
        </div>

        {/* ### Is Featured Pick checkbox ### */}
        {/* <label className="checkbox">
          <input value={formData?.isFeatured} onChange={handleChangeIsFeatured} type="checkbox" />
          &nbsp;Featured Pick
        </label> */}

        {/* ### Pick Summary field ### */}
        <Field label='Analysis'>
          <Textarea
            rows={10}
            value={formData?.analysis}
            onChange={handleChangeAnalysis}
            placeholder='e.g. The Team/Competitor will seek to extend their current win...'
            required={true}
            touched={submitted}
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
            handleClick={() => handleClickSave(formData)}
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
    <Section>
      <Modal showModal={showModal} handleClose={handleCloseModal} render={() => getModalFields()} />
      <div className='AdminDashboardSectionComponent container'>
        <SectionHeader title='Picks' subtitle='Manage Picks' fontColor={COLORS.BLACK} fontSize='' />
        <Button
          label='create'
          handleClick={() => handleClickAddPick()}
          color={COLORS.DARK}
          vibrateOnClick={true}
          isUpperCase={true}
        >
          <Icon size={ICON_SIZES.SMALL} name='fas fa-plus-circle' />
        </Button>
        <br />
        <br />

        <div className='tabs is-centered'>
          <ul>
            <li
              onClick={() => handleClickFilterPicks('_ACTIVE_PICKS')}
              className={filterPicks.type.includes('_ACTIVE_PICKS') ? 'is-active' : ''}
            >
              <a>Active Picks</a>
            </li>
            <li
              onClick={() => handleClickFilterPicks('_AWAITING_EVALUATION')}
              className={filterPicks.type.includes('_AWAITING_EVALUATION') ? 'is-active' : ''}
            >
              <a>Awaiting Evaluation</a>
            </li>
            <li
              onClick={() => handleClickFilterPicks('_SETTLED_PICKS')}
              className={filterPicks.type.includes('_SETTLED_PICKS') ? 'is-active' : ''}
            >
              <a>Settled Picks</a>
            </li>
          </ul>
        </div>

        <div className='box'>
          {!!getRows() && !!getRows().length ? (
            <Table headers={['Title', 'Match Time', 'Action']} rows={getRows()} />
          ) : (
            <div className='subtitle has-text-centered'>No data available to display!</div>
          )}
        </div>

        <PaginationComp page={currentPage} totalPages={totalPages} handlePageClick={handlePaginationClick} />
      </div>
    </Section>
  );
}

export default AdminPicksSection;
