/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { listPicksQl, LIST_SPORTS_QL } from '../../http/graphqlQuerys';
import { ExecGraphQl } from '../../http/httpService';
import { getSportTabOptions } from '../../service/SportService';
import { useAuth } from '../../utils/auth';
import { MENU_ITEM, PICK_STATUS } from '../../utils/constants';
import { COLORS } from '../../utils/enums';
import { useRouter } from '../../utils/router';
import Dropdown from '../Dropdown/Dropdown';
import PaginationComp from '../Pagination/Pagination';
import PickStats from '../PickStats/PickStats';
import ScoreCardItem from '../ScoreCardItem/ScoreCardItem';
// COMPONENTS
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import Tabs from '../Tabs/Tabs';
// CSS
import './ScoreCardSection.scss';
import Bet365 from '../Bet365/Bet365';

function ScoreCardSection(props) {
  const [data, setData] = useState([]);
  const [sports, setSports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [picksPerPage, setPicksPerPage] = useState(30);
  const [totalPages, setTotalPages] = useState(0);
  const [sportItemSelected, setSportItemSelected] = useState({
    id: 1003,
    shortTitle: 'Latest',
    title: 'Latest',
  });
  const [sortByFilter, setSortByFilter] = useState('matchTime');

  // ROUTER
  const router = useRouter();

  // TOAST
  const { addToast } = useToasts();

  // AUTH
  const auth = useAuth();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    loadPicks(1, 30);
    loadSports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPicks = async (currentPage, picksPerPage, sportId, sortBy) => {
    const gqlVariables = {
      page: currentPage - 1,
      pageSize: picksPerPage,
      sort: !!sortBy ? [sortBy] : ['matchTime'],
      sortDir: ['DESC'],
      filter: { status: [PICK_STATUS.CORRECT.LABEL, PICK_STATUS.INCORRECT.LABEL, PICK_STATUS.PUSH.LABEL] },
    };

    if (!!sportId) {
      gqlVariables.filter = { ...gqlVariables.filter, SportId: sportId };
    }

    const picksData = await ExecGraphQl(listPicksQl(), gqlVariables);
    if (picksData?.data?.ListPicks?.rows) {
      setData(picksData.data.ListPicks.rows);
      setCurrentPage(picksData.data.ListPicks.page + 1);
      setPicksPerPage(picksData.data.ListPicks.pageSize);
      setTotalPages(picksData.data.ListPicks.totalPages);
    } else {
      addToast('No data available to display!', { appearance: 'error', autoDismiss: true });
    }
  };

  const loadSports = async () => {
    const topOptions = [
      { id: 1001, shortTitle: 'All', title: 'All' },
      { id: 1003, shortTitle: 'Latest', title: 'Latest' },
    ];
    const sportsData = await ExecGraphQl(LIST_SPORTS_QL);
    if (sportsData?.data?.ListSports?.rows) {
      setSports(getSportTabOptions(sportsData.data.ListSports.rows, topOptions));
    }
  };

  const handleClickFilterSport = (sportItem) => {
    let sportFilterId = sportItem?.id;
    let sortByFilterParam = 'id'; // The default sort by is by ID

    if (sportItem?.shortTitle === 'All') {
      sportFilterId = null; // bring all
    } else if (sportItem?.shortTitle === 'Latest') {
      sportFilterId = null; // bring all
      sortByFilterParam = 'matchTime';
      setSortByFilter(sortByFilterParam);
    } else if (sportItem?.shortTitle === 'Top Selling') {
      sportFilterId = null; // bring all
      sortByFilterParam = 'cntUnlocked';
      setSortByFilter(sortByFilterParam);
    }

    setSportItemSelected(sportItem);
    setCurrentPage(1);
    setTotalPages(0);
    loadPicks(1, picksPerPage, sportFilterId, sortByFilterParam);
  };

  const handleClickShowPickDetail = (pickId) => {
    router.push(`${MENU_ITEM.PICK_DETAIL.PATH}${pickId}`);
  };

  const handlePaginationClick = (pageItem) => {
    let sportId = sportItemSelected?.id;
    if ([1001, 1003].includes(sportId)) {
      sportId = undefined;
    }
    loadPicks(pageItem, picksPerPage, sportId, sortByFilter);
  };

  /**
   * if sportItemSelected.id > 1000 this means 'All' and 'Latest' filters
   * so we need to pass undefined
   */
  const getSportIdFilter = () => {
    if (sportItemSelected?.id && sportItemSelected.id < 1000) {
      return sportItemSelected.id;
    }
    return undefined;
  };

  return (
    <Section sectionSize=''>
      <div className='ScoreCardSectionComponent container'>
        <div className='columns'>
          <div className='column is-2 is-hidden-touch'>
            <Bet365 />
          </div>
          <div className='column'>
            <PickStats sportIdFilter={getSportIdFilter()} />
            <SectionHeader
              title='Scorecard'
              subtitle='View your previous picks and see how you stack up'
              fontColor={COLORS.BLACK}
              fontSize=''
            />

            <div className='is-flex'>
              <Dropdown label={sportItemSelected?.shortTitle || 'Choose Sport'}>
                {sports.map((sportItem, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      {idx === 1 ? (
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

              <div className='is-flex w-100-p flex-justified-center is-hidden-mobile'>
                <Tabs>
                  {sports.map((sportItem, idx) => {
                    if (idx < 2) {
                      return (
                        <li
                          key={idx}
                          className={
                            sportItemSelected && sportItem.shortTitle === sportItemSelected.shortTitle
                              ? 'is-active'
                              : ''
                          }
                          onClick={() => handleClickFilterSport(sportItem)}
                        >
                          <a className='is-size-5'>{sportItem?.shortTitle}</a>
                        </li>
                      );
                    }
                    return null;
                  })}
                </Tabs>
              </div>
            </div>

            {!!data && !!data.length ? (
              data.map((item, idx) => (
                <div key={idx} className='columns is-gapless'>
                  <div className='column'>
                    <ScoreCardItem
                      data={item}
                      isUnlockedPick={true}
                      isValidAuthorizationToken={auth.isValidAuthorizationToken()}
                      handleClickUnlockedPick={handleClickShowPickDetail}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className='box'>
                <div className='subtitle has-text-centered'>No data available to display!</div>
              </div>
            )}

            <PaginationComp
              page={currentPage}
              totalPages={totalPages}
              handlePageClick={handlePaginationClick}
            />
          </div>
        </div>
      </div>
    </Section>
  );
}

export default ScoreCardSection;
