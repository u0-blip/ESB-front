import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { ExecGraphQl } from '../../http/httpService';
import { GET_PICK_STATS_QL } from '../../http/graphqlQuerys';

function PickStats(props) {
  const [pickStats, setPickStats] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    loadPickStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sportIdFilter]);

  const loadPickStats = async () => {
    setShowSkeleton(true);
    const gqlVariables = {
      sportId: props.sportIdFilter ? props.sportIdFilter : undefined
    };
    const pickStatsData = await ExecGraphQl(GET_PICK_STATS_QL, gqlVariables);
    if (pickStatsData?.data?.GetPickStats) {
      setPickStats(pickStatsData.data.GetPickStats);
    }
    setShowSkeleton(false);
  };

  return (
    <div className='level is-mobile box'>
      <div className='level-item has-text-centered'>
        <div>
          <p className='heading'>Overall correct</p>
          <p className='title has-text-warning'>
            {showSkeleton ? <Skeleton /> : <>{`${pickStats?.percentageALL}%`}</>}
          </p>
        </div>
      </div>

      <div className='level-item has-text-centered'>
        <div>
          <p className='heading'>Correct this week</p>
          <p className='title has-text-success'>
            {showSkeleton ? <Skeleton /> : <>{`${pickStats?.percentage7D}%`}</>}
          </p>
        </div>
      </div>
    </div>
  );
}

PickStats.propTypes = {
  sportIdFilter: PropTypes.number
};

export default PickStats;
