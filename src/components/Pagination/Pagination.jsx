import React from 'react';
import PropTypes from 'prop-types';
import Pagination from 'bulma-pagination-react';

import './Pagination.scss';

function PaginationComp(props) {
  const handleClick = (page) => {
    if (props.totalPages > 1 && page > 0 && page <= props.totalPages) {
      props.handlePageClick(page);
    }
  };
  return (
    <Pagination pages={props.totalPages} currentPage={props.page} onChange={(page) => handleClick(page)} />
  );
}

PaginationComp.propTypes = {
  page: PropTypes.number,
  totalPages: PropTypes.number,
  handlePageClick: PropTypes.func,
};

export default PaginationComp;
