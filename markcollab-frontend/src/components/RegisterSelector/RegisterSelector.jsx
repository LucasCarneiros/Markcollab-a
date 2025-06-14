import React from 'react';
import { FaUserTie, FaPencilRuler } from 'react-icons/fa';
import styles from './RegisterSelector.module.css';

const RegisterSelector = ({ onSelect }) => (
  <div className={styles.container}>
    <h2 className={styles.title}>Vamos criar seu cadastro!</h2>
    <p className={styles.subtitle}>Primeiro, escolha como você deseja usar a nossa plataforma:</p>
    <div className={styles.selectorGrid}>
      <button className={styles.card} onClick={() => onSelect('contratante')}>
        <div className={styles.iconWrapper} style={{'--icon-bg': '#e0f2fe'}}>
          <FaUserTie className={styles.icon} style={{'--icon-color': '#0ea5e9'}} />
        </div>
        <h3 className={styles.cardTitle}>Sou Contratante</h3>
        <p className={styles.cardDescription}>Quero contratar freelancers para os meus projetos.</p>
      </button>

      <button className={styles.card} onClick={() => onSelect('freelancer')}>
        <div className={styles.iconWrapper} style={{'--icon-bg': '#e0fdf4'}}>
          <FaPencilRuler className={styles.icon} style={{'--icon-color': '#10b981'}}/>
        </div>
        <h3 className={styles.cardTitle}>Sou Freelancer</h3>
        <p className={styles.cardDescription}>Quero encontrar projetos e oferecer meus serviços.</p>
      </button>
    </div>
  </div>
);

export default RegisterSelector;