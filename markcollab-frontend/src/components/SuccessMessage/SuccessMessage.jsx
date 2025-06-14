import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SuccessMessage.module.css';

export default function SuccessMessage({ title, text, linkText, linkTo }) {
  return (
    <div className={styles.successBox}>
      <h2>🎉 {title}</h2>
      <p>
        {text}{' '}
        <Link to={linkTo} className={styles.loginLink}>
          {linkText}
        </Link>
      </p>
    </div>
  );
}
