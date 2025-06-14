import React from 'react';
import styles from './Input.module.css';

const Input = ({
  label, name, value, onChange,
  type = 'text', error,
  maxLength, icon: Icon, onIconClick, iconRight: IconRight
}) => {
  const inputClassName = error ? styles.error : '';

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.inputWrapper}>
        {Icon && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onIconClick}
          >
            <Icon />
          </button>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          maxLength={maxLength}
          className={inputClassName}
        />
        {IconRight && (
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onIconClick}
          >
            <IconRight />
          </button>
        )}
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;