import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext'; // Importe se você usa Toast
import { FiCheckCircle, FiLoader, FiAlertCircle } from 'react-icons/fi';
import styles from './PaymentStatus.module.css'; // Estilos genéricos

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const employerCpf = user?.cpf; // CPF do empregador logado

  const [statusMessage, setStatusMessage] = useState('Confirmando pagamento...');
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(false);
  const { addToast } = useToast(); // Se você usa Toast

  useEffect(() => {
    // Pegar os IDs que foram salvos antes do redirecionamento para o MP
    const projectId = localStorage.getItem('tempProjectIdForPayment');
    const freelancerCpf = localStorage.getItem('tempFreelancerCpfForPayment');
    console.log(employerCpf);

    // Limpar os itens temporários imediatamente após recuperá-los
    localStorage.removeItem('tempProjectIdForPayment');
    localStorage.removeItem('tempFreelancerCpfForPayment');

    if (!projectId || !freelancerCpf || !employerCpf) {
      setStatusMessage('Erro: Informações de projeto ou contratação ausentes. Não foi possível finalizar a contratação.');
      setError(true);
      setIsProcessing(false);
      addToast('error', 'Erro ao finalizar a contratação: IDs ausentes.');
      return;
    }

    // --- CHAMADA PARA O BACKEND PARA CONFIRMAR A CONTRATAÇÃO ---
    // Este endpoint (`/projects/{projectId}/hire/{freelancerCpf}/{employerCpf}`)
    // é o que realmente muda o status do projeto no seu DB.
    api.post(`/projects/${projectId}/hire/${freelancerCpf}/${employerCpf}`)
      .then(res => {
        setStatusMessage('Pagamento APROVADO! Projeto contratado com sucesso!');
        setIsProcessing(false);
        setError(false);
        addToast('success', 'Contratação realizada!');
        // Opcional: Redirecionar para a página do projeto ou de 'Meus Projetos' após um tempo
        setTimeout(() => {
          navigate('/contratante/meus-projetos'); // ou `/projetos/${projectId}`
        }, 3000); // Redireciona após 3 segundos
      })
      .catch(err => {
        console.error("Erro ao confirmar contratação no backend:", err);
        setStatusMessage(`Pagamento APROVADO, mas houve um erro ao finalizar a contratação. Contate o suporte. Detalhe: ${err.response?.data?.message || err.message}`);
        setError(true);
        setIsProcessing(false);
        addToast('error', 'Erro na confirmação da contratação.');
      });
  }, [employerCpf, navigate]); // Dependências do useEffect: employerCpf e navigate

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {isProcessing ? (
          <div className={styles.processingState}>
            <FiLoader className={styles.spinIcon} />
            <p>{statusMessage}</p>
          </div>
        ) : (
          <div className={`${styles.statusDisplay} ${error ? styles.error : styles.success}`}>
            {error ? <FiAlertCircle className={styles.icon} /> : <FiCheckCircle className={styles.icon} />}
            <h2 className={styles.message}>{statusMessage}</h2>
            {!error && <p>Você será redirecionado em breve.</p>}
            <Link to="/contratante/meus-projetos" className={styles.btnBackToProjects}>Voltar para Meus Projetos</Link>
          </div>
        )}
      </div>
    </div>
  );
}