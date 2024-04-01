// Pagination.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button key={i} onClick={() => onPageChange(i)} className={currentPage === i ? 'active' : ''}>
          {i}
        </button>
      );
    }

    return pages;
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    onItemsPerPageChange(newItemsPerPage);
  };

  return (
    <div className="pagination-container">
      <div className="pagination-inputs">
        <span>Rows per page:</span>
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={2}>10</option>
          <option value={4}>20</option>
          <option value={6}>30</option>
          <option value={10}>50</option>
        </select>

        <span>Go to page:</span>
        <input
          type="number"
          value={currentPage}
          onChange={(e) => onPageChange(parseInt(e.target.value, 10))}
          min={1}
          max={totalPages}
        />
      </div>
      <div className="pagination-controls">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {renderPageNumbers()}

        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
