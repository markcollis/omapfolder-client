import React from 'react';
import PropTypes from 'prop-types';
import { renderToString } from 'react-dom/server';

// The TableHeader component renders the header row of a table
const TableHeader = ({
  setSortColumn,
  sortColumn,
  sortAscending,
  tableHead,
}) => {
  const headerThArray = tableHead.map((item, index) => {
    let className = index;
    if (sortColumn === index && sortAscending) className = 'sorted ascending';
    if (sortColumn === index && !sortAscending) className = 'sorted descending';
    return (
      <th className={className} key={renderToString(item)} onClick={() => setSortColumn(index)}>
        {item}
      </th>
    );
  });
  return (
    <tr>
      {headerThArray}
    </tr>
  );
};

TableHeader.propTypes = {
  setSortColumn: PropTypes.func,
  sortColumn: PropTypes.number,
  sortAscending: PropTypes.bool,
  tableHead: PropTypes.arrayOf(PropTypes.node).isRequired,
};
TableHeader.defaultProps = {
  setSortColumn: null,
  sortColumn: null,
  sortAscending: true,
};

export default TableHeader;
