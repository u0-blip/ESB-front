import React from 'react';
import PropTypes from 'prop-types';
import {
  Table as ResponsiveTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from 'react-super-responsive-table';

// CSS
import './Table.scss';

function Table(props) {
  return (
    <ResponsiveTable>
      <Thead>
        <Tr>
          {props.headers.map((headerItem, idx) => (
            <Th key={idx}>{headerItem}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
          {props.rows.map((rowItem, idx) => (
            <Tr className='' key={idx}>
              {/* Always show button on last column of each row */}
              {rowItem.map((rowCellValue, idx) => {
                return <Td key={idx}>{rowCellValue}</Td>
              })}
            </Tr>
          ))}
      </Tbody>
    </ResponsiveTable>
  );
}

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  rows: PropTypes.arrayOf(PropTypes.array).isRequired
}

export default Table;
