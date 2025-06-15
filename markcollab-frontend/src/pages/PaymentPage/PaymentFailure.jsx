import React from 'react';
import { Link } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';
import styles from './PaymentStatus.module.css'; // Estilos genéricos

export default function PaymentFailure() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={`${styles.statusDisplay} ${styles.error}`}>
          <FiXCircle className={styles.icon} />
          <h2 className={styles.message}>Pagamento Recusado</h2>
          <p>Ocorreu um problema ao processar seu pagamento. Por favor, verifique os dados ou tente outro método.</p>
          <p>Detalhes do erro podem ter sido fornecidos pelo provedor de pagamento.</p>
          <Link to="/contratante/meus-projetos" className={styles.btnBackToProjects}>Voltar para Meus Projetos</Link>
        </div>
      </div>
    </div>
  );
}