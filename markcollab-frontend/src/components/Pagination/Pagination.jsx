import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const goTo = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <ul className={styles.pagination}>
      <li className={styles['page-item']}>
        <button
          className={styles['page-link']}
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
      </li>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <li key={num} className={styles['page-item']}>
          <button
            className={`${styles['page-link']} ${
              num === currentPage ? styles.active : ''
            }`}
            onClick={() => goTo(num)}
          >
            {num}
          </button>
        </li>
      ))}
      <li className={styles['page-item']}>
        <button
          className={styles['page-link']}
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
