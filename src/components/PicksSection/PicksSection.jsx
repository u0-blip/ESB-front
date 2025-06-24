/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';

// COMPONENTS
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import ScoreCardItem from '../ScoreCardItem/ScoreCardItem';
import { COLORS } from '../../utils/enums';
import { ExecGraphQl } from '../../http/httpService';
import { LIST_SPORTS_QL, LIST_UNLOCKED_PICK_QL, listPicksQl, LIST_USERS_QL } from '../../http/graphqlQuerys';
import PaginationComp from '../Pagination/Pagination';
import Dropdown from '../Dropdown/Dropdown';
import Tabs from '../Tabs/Tabs';
import { getSportTabOptions } from '../../service/SportService';
import { isUnlockedPick } from '../../service/PickService';
import { useAuth } from '../../utils/auth';
import { MENU_ITEM, LOCALSTORAGE_KEYS, PICK_STATUS } from '../../utils/constants';
import { useRouter } from '../../utils/router';
import Modal from '../Modal/Modal';
import UnlockPickModal from '../UnlockPickModal/UnlockPickModal';
import { CREATE_OR_SAVE_UNLOCK_PICK_QL } from '../../http/graphqlMutations';

// CSS
import './PicksSection.scss';
import Bet365 from '../Bet365/Bet365';

function PicksSection(props) {
  const [data, setData] = useState([]);
  const [sports, setSports] = useState([]);
  const [sportItemSelected, setSportItemSelected] = useState({
    id: 1003,
    shortTitle: 'Latest',
    title: 'Latest',
  });
  const [sortByFilter, setSortByFilter] = useState('matchTime');
  const [currentPage, setCurrentPage] = useState(1);
  const [picksPerPage, setPicksPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [unlockedPicks, setUnlockedPicks] = useState([]);
  const [userCredits, setUserCredits] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pickIdSelected, setPickIdSelected] = useState(null);

  // ROUTER
  const router = useRouter();

  // TOAST
  const { addToast } = useToasts();

  // AUTH
  const auth = useAuth();

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    loadPicks(1, 5);
    loadSports();
    if (auth.isValidAuthorizationToken()) {
      loadUnlockedPicks();
      loadUserCredits();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPicks = async (currentPage, picksPerPage, sportId, sortBy) => {
    const gqlVariables = {
      page: currentPage - 1,
      pageSize: picksPerPage,
      sort: !!sortBy ? [sortBy] : ['matchTime'],
      sortDir: ['ASC'],
      filter: { status: [PICK_STATUS.NEW.LABEL] },
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
      addToast('No data available to display!', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const loadSports = async () => {
    const sportsData = await ExecGraphQl(LIST_SPORTS_QL);
    if (sportsData?.data?.ListSports?.rows) {
      const topOptions = [
        { id: 1001, shortTitle: 'All', title: 'All' },
        { id: 1003, shortTitle: 'Latest', title: 'Latest' },
      ];
      setSports(getSportTabOptions(sportsData.data.ListSports.rows, topOptions));
    }
  };

  const loadUnlockedPicks = async () => {
    const gqlVariables = {
      page: 0,
      pageSize: 1000,
      userId: parseInt(localStorage.getItem(LOCALSTORAGE_KEYS.ESB_USER_ID), 10),
    };

    const unlockedPicksData = await ExecGraphQl(LIST_UNLOCKED_PICK_QL, gqlVariables);
    if (unlockedPicksData?.data?.ListUnlockedPicks?.rows) {
      setUnlockedPicks(unlockedPicksData.data.ListUnlockedPicks.rows);
    }
  };

  const loadUserCredits = async () => {
    const gqlVariables = {
      page: 0,
      pageSize: 10000,
      userId: parseInt(localStorage.getItem(LOCALSTORAGE_KEYS.ESB_USER_ID), 10),
    };

    const userCredits = await ExecGraphQl(LIST_USERS_QL, gqlVariables);
    if (userCredits?.data?.ListUsers?.rows?.length) {
      if (userCredits.data.ListUsers.rows[0].credits) {
        setUserCredits(userCredits.data.ListUsers.rows[0].credits);
      } else {
        setUserCredits(0);
      }
    }
  };

  const unlockPick = async () => {
    const gqlVariables = {
      userId: parseInt(localStorage.getItem(LOCALSTORAGE_KEYS.ESB_USER_ID), 10),
      pickId: pickIdSelected,
    };

    return ExecGraphQl(CREATE_OR_SAVE_UNLOCK_PICK_QL, gqlVariables);
  };

  const handlePaginationClick = (pageItem) => {
    let sportId = sportItemSelected?.id;
    if ([1001, 1003].includes(sportId)) {
      sportId = undefined;
    }
    loadPicks(pageItem, picksPerPage, sportId, sortByFilter);
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

  const handleClickUnlockPick = (pickId) => {
    setPickIdSelected(pickId);
    setShowModal(true);
  };

  const handleClickUnlockedPick = (pickId) => {
    router.push(`${MENU_ITEM.PICK_DETAIL.PATH}${pickId}`);
  };

  const handleClickConfirmUnlockPick = async (pickId) => {
    const unlockPickResult = await unlockPick();
    if (unlockPickResult?.data?.CreateOrSaveUnlockedPick?.id) {
      addToast('Pick Unlocked!', { appearance: 'success', autoDismiss: true });
      setTimeout(() => {
        setShowModal(false);
        router.push(`${MENU_ITEM.PICK_DETAIL.PATH}${pickId}`);
      }, 1500);
    } else {
      addToast('Error during unlock process!', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  return (
    <>
      <Modal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        render={() => (
          <UnlockPickModal
            userCredits={userCredits}
            handleClickConfirmUnlockPick={handleClickConfirmUnlockPick}
            pickId={pickIdSelected}
            handleCloseModal={() => setShowModal(false)}
          />
        )}
      />

      <Section sectionSize=''>
        <div className='PicksSectionComponent container'>
          <div className='columns'>
            <div className='column is-2 is-hidden-touch'>
              <Bet365 />
            </div>
            <div className='column'>
              <SectionHeader
                title='Picks'
                subtitle='View our current picks'
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
                            <a className='is-size-5'>{sportItem.shortTitle}</a>
                          </li>
                        );
                      }
                      return null;
                    })}
                  </Tabs>
                </div>
              </div>

              {/* PRINTING PICK CARDS HERE */}
              {data?.length ? (
                data.map((item, idx) => {
                  const isUnlocked = isUnlockedPick(
                    auth.isAdminUser(),
                    auth.isValidAuthorizationToken(),
                    unlockedPicks,
                    item
                  );
                  return (
                    <div key={idx} className='columns is-gapless'>
                      <div className='column'>
                        <ScoreCardItem
                          data={item}
                          isValidAuthorizationToken={auth.isValidAuthorizationToken()}
                          handleClickUnlockPick={handleClickUnlockPick}
                          handleClickUnlockedPick={handleClickUnlockedPick}
                          isUnlockedPick={isUnlocked}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className='box'>
                  <div className='subtitle has-text-centered'>No data available to display!</div>
                </div>
              )}
              {/* PRINTING PICK CARDS HERE */}

              <PaginationComp
                page={currentPage}
                totalPages={totalPages}
                handlePageClick={handlePaginationClick}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default PicksSection;
