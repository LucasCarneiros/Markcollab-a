import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock } from 'react-icons/fi';
import styles from './PaymentStatus.module.css'; // Estilos genéricos

export default function PaymentPending() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.statusDisplay}>
          <FiClock className={styles.icon} />
          <h2 className={styles.message}>Pagamento Pendente</h2>
          <p>Seu pagamento está aguardando aprovação ou processamento. Você será notificado por e-mail sobre o status final.</p>
          <p>Isso é comum para pagamentos via boleto, Pix (aguardando pagamento) ou cartões em análise.</p>
          <Link to="/contratante/meus-projetos" className={styles.btnBackToProjects}>Voltar para Meus Projetos</Link>
        </div>
      </div>
    </div>
  );
}