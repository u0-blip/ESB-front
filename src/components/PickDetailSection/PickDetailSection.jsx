import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import PropTypes from 'prop-types';
import Section from '../Section/Section';
import SectionHeader from '../SectionHeader/SectionHeader';
import ScoreCardItem from '../ScoreCardItem/ScoreCardItem';
import { GET_PICK_BY_ID_QL, LIST_UNLOCKED_PICK_QL } from '../../http/graphqlQuerys';
import { ExecGraphQl } from '../../http/httpService';
import { COLORS } from '../../utils/enums';
import { useAuth } from '../../utils/auth';
import { useRouter } from '../../utils/router';
import { MENU_ITEM, LOCALSTORAGE_KEYS, PICK_STATUS } from '../../utils/constants';

import './PickDetailSection.scss';
import Bet365 from '../Bet365/Bet365';

const PickDetailSection = (props) => {
  const [data, setData] = useState(null);
  const [isUnlockedPick, setIsUnlockedPick] = useState(false);

  // TOAST
  const { addToast } = useToasts();

  // Router
  const router = useRouter();

  // AUTH
  const auth = useAuth();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    if (auth.isValidAuthorizationToken()) {
      loadPickDetail(props.pickId);
    } else {
      router.push(MENU_ITEM.HOME.PATH);
    }
  };

  const loadPickDetail = async (pickId) => {
    const pickData = await ExecGraphQl(GET_PICK_BY_ID_QL, { pickId });
    if (pickData?.data?.GetPick?.id) {
      const isPickUnlocked = await isPickUnlockedForUser(props.pickId);
      const isAdmin = auth.isAdminUser();
      setIsUnlockedPick( isAdmin || isPickUnlocked );
      if (
        [PICK_STATUS.CORRECT.LABEL, PICK_STATUS.INCORRECT.LABEL].includes(pickData.data.GetPick.status) ||
        isPickUnlocked ||
        auth.isAdminUser()
      ) {
        setData(pickData.data.GetPick);
      } else {
        addToast('Pick not unlocked for user!', { appearance: 'error', autoDismiss: true });
        setTimeout(() => {
          router.push(MENU_ITEM.PICKS.PATH);
        }, 1500);
      }
    } else {
      addToast('No data available to display!', { appearance: 'error', autoDismiss: true });
    }
  };

  const getUnlockedPicks = async () => {
    const gqlVariables = {
      page: 0,
      pageSize: 1000,
      userId: parseInt(localStorage.getItem(LOCALSTORAGE_KEYS.ESB_USER_ID), 10),
    };

    const unlockedPicksData = await ExecGraphQl(LIST_UNLOCKED_PICK_QL, gqlVariables);

    if (unlockedPicksData?.data?.ListUnlockedPicks?.rows) {
      return unlockedPicksData.data.ListUnlockedPicks.rows;
    } else {
      return [];
    }
  };

  const isPickUnlockedForUser = async (pickId) => {
    const unlockedPicksData = await getUnlockedPicks();
    if (!!unlockedPicksData && unlockedPicksData.length) {
      const isPickUnlockedForUser = unlockedPicksData.some(
        (unlockedPickItem) => unlockedPickItem.PickId === pickId
      );
      return isPickUnlockedForUser;
    }
    return false;
  };

  return (
    <Section sectionSize=''>
      <div className='PickDetailSectionComponent container'>
        <div className='columns'>
          <div className='column is-2 is-hidden-touch'>
            <Bet365 />
          </div>
          <div className='column'>
            <SectionHeader title='Pick detail' subtitle={data?.title} fontColor={COLORS.BLACK} fontSize='' />

            {/* PRINTING PICK CARDS HERE */}
            {!!data ? (
              <div className='columns is-gapless'>
                <div className='column'>
                  <ScoreCardItem
                    data={data}
                    isValidAuthorizationToken={auth.isValidAuthorizationToken()}
                    hideButtons={true}
                    isUnlockedPick={isUnlockedPick}
                  />
                </div>
              </div>
            ) : (
              <div className='box'>
                <div className='subtitle has-text-centered'>No data available to display!</div>
              </div>
            )}
            {/* PRINTING PICK CARDS HERE */}

            <div className='columns'>
              <div className='column'>
                <div className='content'>
                  <div className='subtitle'>
                    <strong>Analysis: </strong>
                    {data?.analysis}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

PickDetailSection.propTypes = {
  pickId: PropTypes.number,
};

export default PickDetailSection;
