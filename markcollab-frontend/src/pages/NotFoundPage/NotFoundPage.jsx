import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Página Não Encontrada</h2>
        <p className={styles.description}>
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/home" className={styles.homeButton}>
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
