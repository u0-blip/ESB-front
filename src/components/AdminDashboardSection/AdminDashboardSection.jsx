/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';

// COMPONENTS
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import { COLORS } from '../../utils/enums';
import DashboardVitalCard from '../DashboardVitalCard/DashboardVitalCard';
import Table from '../Table/Table';
import { ExecGraphQl } from '../../http/httpService';
import {
  listUsersQl,
  listPicksQl,
  listCreditPurchases,
  LIST_UNLOCKED_PICK_QL
} from '../../http/graphqlQuerys';
import { PICK_STATUS } from '../../utils/constants';
import { sum, formatter } from '../../utils/functions';
import Tabs from '../Tabs/Tabs';
import PaginationComp from '../Pagination/Pagination';
import Spacer from '../Spacer/Spacer';

const PICKS_UNLOCKED_FILTER = {
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year'
};

function AdminDashboardSection(props) {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalPicks, setTotalPicks] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [unlockedPicks, setUnlockedPicks] = useState([]);
  const [unlockedPicksPage, setUnlockedPicksPage] = useState(1);
  const [unlockedPicksPageSize, setUnlockedPicksPageSize] = useState(10);
  const [unlockedPicksTotalPages, setUnlockedPicksTotalPages] = useState(0);
  const [unlockedPicksTotalRecords, setUnlockedPicksTotalRecords] = useState(0);
  const [isLoadingUnlockedPicks, setIsLoadingUnlockedPicks] = useState(false);
  const [unlockedPicksFilter, setUnlockedPicksFilter] = useState(PICKS_UNLOCKED_FILTER.WEEK);

  useEffect(() => {
    loadUser();
    loadPicks();
    loadCreditPurchases();
    loadUnlockedPicks(unlockedPicksPage, unlockedPicksPageSize, unlockedPicksFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    const fieldsToHide = ['cognitoUserId', 'roles'];
    const gqlVariables = {
      pageSize: null,
    };
    const userData = await ExecGraphQl(listUsersQl(fieldsToHide), gqlVariables);
    if (userData?.data?.ListUsers?.rows) {
      const newUsersThisWeek = userData.data.ListUsers.rows.filter(item => {
        const sevenDaysBefore = moment().subtract(7, 'd');
        return moment(item.createdAt).isBetween(sevenDaysBefore, moment());
      });
      const userCredits = userData.data.ListUsers.rows.reduce((prevItem, currentItem) => {
        return sum(prevItem, currentItem.credits);
      }, 0);
      setTotalCredits(userCredits);
      setTotalUsers(userData.data.ListUsers.totalRecords);
      setUsers(newUsersThisWeek);
    }
  };

  const loadPicks = async () => {
    const fieldsToHide = [];
    const gqlVariables = {
      filter: { status: [PICK_STATUS.NEW.LABEL, PICK_STATUS.CORRECT.LABEL, PICK_STATUS.INCORRECT.LABEL] }
    };

    const picksData = await ExecGraphQl(listPicksQl(fieldsToHide, true), gqlVariables);
    if (picksData?.data?.ListPicks?.rows) {
      setTotalPicks(picksData.data.ListPicks.totalRecords);
    }
  };

  const loadCreditPurchases = async () => {
    const fieldsToHide = ['id', 'UserId'];
    const creditPurchaseData = await ExecGraphQl(listCreditPurchases(fieldsToHide));
    if (creditPurchaseData?.data?.ListCreditPurchases?.rows) {
      setRevenue(
        creditPurchaseData.data.ListCreditPurchases.rows.reduce(
          (prevValue, currentValue) => sum(prevValue, currentValue.priceInCents),
          0
        ) / 100
      );
    }
  };

  const loadUnlockedPicks = async (pageItem, pageSize, filter = PICKS_UNLOCKED_FILTER.WEEK) => {
    setIsLoadingUnlockedPicks(true);
    let daysToSubtract = undefined;

    switch (filter) {
      case PICKS_UNLOCKED_FILTER.MONTH:
        daysToSubtract = 30;
        break;

      case PICKS_UNLOCKED_FILTER.YEAR:
        daysToSubtract = 364;
        break;

      default:
        daysToSubtract = 7;
        break;
    }

    const gqlVariables = {
      page: pageItem - 1,
      pageSize: pageSize,
      sort: ['id'],
      sortDir: ['DESC'],
      op: 'GT',
      createdAt: moment()
        .subtract(daysToSubtract, 'd')
        .format()
    };

    const unlockedPicksData = await ExecGraphQl(LIST_UNLOCKED_PICK_QL, gqlVariables);
    if (unlockedPicksData?.data?.ListUnlockedPicks?.rows) {
      setUnlockedPicks(unlockedPicksData.data.ListUnlockedPicks.rows);
      setUnlockedPicksPage(unlockedPicksData.data.ListUnlockedPicks.page + 1);
      setUnlockedPicksPageSize(unlockedPicksData.data.ListUnlockedPicks.pageSize);
      setUnlockedPicksTotalPages(unlockedPicksData.data.ListUnlockedPicks.totalPages);
      setUnlockedPicksTotalRecords(unlockedPicksData.data.ListUnlockedPicks.totalRecords);
      setIsLoadingUnlockedPicks(false);
    }
  };

  const handleClickUnlockedPicksFilter = filter => {
    setUnlockedPicksFilter(filter);
    setUnlockedPicksPage(1);
    loadUnlockedPicks(1, unlockedPicksPageSize, filter);
  };

  const handlePaginationClickUnlockedPick = pageItem => {
    loadUnlockedPicks(pageItem, unlockedPicksPageSize, unlockedPicksFilter);
  };

  return (
    <Section>
      <div className='AdminDashboardSectionComponent container'>
        <SectionHeader
          title='Some numbers to consider'
          subtitle='Check your business health'
          fontColor={COLORS.BLACK}
          fontSize=''
        />

        <div className='columns'>
          <div className='column'>
            <DashboardVitalCard icon='fa-users' label='users' title={`${totalUsers}`} />
          </div>
          <div className='column'>
            <DashboardVitalCard icon='fa-coins' label='revenue' title={formatter.format(revenue)} />
          </div>
          <div className='column'>
            <DashboardVitalCard icon='fa-box-open' label='picks' title={`${totalPicks}`} />
          </div>
          <div className='column'>
            <DashboardVitalCard icon='fa-clipboard-check' label='total credits' title={`${totalCredits}`} />
          </div>
        </div>

        <div className='columns'>
          <div className='column'>
            <div className='box'>
              <div className='subtitle'>
                New Users This Week: <span className='has-text-weight-semibold'>{users.length}</span>
              </div>
              <Table
                headers={['Name', 'Email', 'Date']}
                rows={users.map(item => [
                  item.name,
                  item.email,
                  moment(item.createdAt).format('MMMM Do YYYY, k:mm')
                ])}
              />
            </div>
          </div>

          <div className='column'>
            <div className='box'>
              <Tabs>
                <li
                  className='is-size-5'
                  onClick={() => handleClickUnlockedPicksFilter(PICKS_UNLOCKED_FILTER.WEEK)}
                >
                  <a
                    className={
                      unlockedPicksFilter === PICKS_UNLOCKED_FILTER.WEEK
                        ? 'has-text-weight-bold border-botton-color-dark'
                        : ''
                    }
                  >
                    {PICKS_UNLOCKED_FILTER.WEEK}
                  </a>
                </li>
                <li
                  className='is-size-5'
                  onClick={() => handleClickUnlockedPicksFilter(PICKS_UNLOCKED_FILTER.MONTH)}
                >
                  <a
                    className={
                      unlockedPicksFilter === PICKS_UNLOCKED_FILTER.MONTH
                        ? 'has-text-weight-bold border-botton-color-dark'
                        : ''
                    }
                  >
                    {PICKS_UNLOCKED_FILTER.MONTH}
                  </a>
                </li>
                <li
                  className='is-size-5'
                  onClick={() => handleClickUnlockedPicksFilter(PICKS_UNLOCKED_FILTER.YEAR)}
                >
                  <a
                    className={
                      unlockedPicksFilter === PICKS_UNLOCKED_FILTER.YEAR
                        ? 'has-text-weight-bold border-botton-color-dark'
                        : ''
                    }
                  >
                    {PICKS_UNLOCKED_FILTER.YEAR}
                  </a>
                </li>
              </Tabs>
              {isLoadingUnlockedPicks ? (
                <>
                  <Skeleton height='26px' width='350px' />
                  <br />
                  <br />
                  <Skeleton width='390px' />
                  <Skeleton width='390px' />
                  <Skeleton width='390px' />
                </>
              ) : (
                <>
                  <div className='subtitle'>
                    Picks Unlocked on a {unlockedPicksFilter} period:{' '}
                    <span className='has-text-weight-semibold'>{unlockedPicksTotalRecords}</span>
                  </div>
                  <Table
                    headers={['Pick', 'User', 'Date']}
                    rows={unlockedPicks.map(item => [
                      item.PickFld.title,
                      item.UserFld.name ? item.UserFld.name : item.UserFld.email,
                      moment(item.createdAt).format('MMMM Do YYYY, k:mm')
                    ])}
                  />
                  <Spacer />
                  <PaginationComp
                    page={unlockedPicksPage}
                    pageSize={unlockedPicksPageSize}
                    totalPages={unlockedPicksTotalPages}
                    handlePageClick={handlePaginationClickUnlockedPick}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default AdminDashboardSection;
