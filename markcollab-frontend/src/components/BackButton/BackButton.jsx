import React from "react";
import styles from "./BackButton.module.css";
import { FiArrowLeft } from "react-icons/fi";

const BackButton = ({ onClick }) => {
  return (
    <button className={styles.backButton} onClick={onClick}>
      <FiArrowLeft style={{ marginRight: "0.5rem" }} />
      Voltar
    </button>
  );
};

export default BackButton;
