// Remova qualquer System.out.println ou console.log de depuração que não seja necessário.

import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import styles from './Proposals.module.css';
import {
  FiArrowLeft, FiCheck, FiX, FiFileText, FiLoader, FiAlertCircle,
  FiUser, FiDollarSign, FiCalendar
} from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext'; // Importe se você usa Toast

export default function Proposals() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // user deve ter { cpf, role }
  const employerCpf = user?.cpf; // CPF do empregador logado

  const [project, setProject] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToast } = useToast(); // Se você usa Toast

  useEffect(() => {
    if (!projectId) {
      setError('ID do projeto não encontrado.');
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      api.get(`/projects/${projectId}`),
      api.get(`/interests/project/${projectId}`)
    ])
      .then(([pRes, iRes]) => {
        setProject(pRes.data);
        setProposals(Array.isArray(iRes.data) ? iRes.data : []);
      })
      .catch(err => {
        console.error("Falha ao carregar dados:", err);
        setError('Falha ao carregar dados do projeto. ' + (err.response?.data?.message || err.message));
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  const handleAccept = async (freelancerCpf) => {
    if (!projectId || !employerCpf || !project?.projectId) {
      addToast('error', 'Não foi possível iniciar o pagamento. Faltam informações do projeto ou do empregador.');
      return;
    }

    // Certifique-se de que o status do projeto permite a contratação antes do pagamento
    // Ajuste a validação conforme seus status de projeto.
    // Ex: Se só se paga projetos 'Abertos':
    if (project.status !== 'Aberto') {
      addToast('warning', 'Este projeto não pode ser pago no status atual. Apenas projetos "Abertos" podem ser aceitos.');
      return;
    }

    try {
      // --- PASSO IMPORTANTE: SALVAR IDs NO localStorage ANTES DE REDIRECIONAR ---
      // Usaremos esses IDs na página de sucesso após o pagamento.
      localStorage.setItem('tempProjectIdForPayment', projectId);
      localStorage.setItem('tempFreelancerCpfForPayment', freelancerCpf);
      // ADICIONE ESTES LOGS PARA DEPURAR:
      console.log('Salvando no localStorage: Project ID:', projectId);
      console.log('Salvando no localStorage: Freelancer CPF:', freelancerCpf);
      // -----------------------------------------------------------------------

      // 1. Chamada para o backend para iniciar o fluxo de pagamento do Mercado Pago
      // O endpoint `/api/projects/{projectId}/pay/{employerCpf}` retornará a URL de pagamento.
      const response = await api.post(`/projects/${project.projectId}/pay/${employerCpf}`);
      const initPointUrl = response.data; // A URL do Mercado Pago é o corpo da resposta

      if (initPointUrl) {
        // 2. Redirecionar o usuário para a URL de pagamento do Mercado Pago
        window.location.href = initPointUrl;
      } else {
        addToast('error', 'Não foi possível obter a URL de pagamento do Mercado Pago.');
        // Limpar itens temporários se a URL não for obtida
        localStorage.removeItem('tempProjectIdForPayment');
        localStorage.removeItem('tempFreelancerCpfForPayment');
      }

      // IMPORTANTE: A lógica de 'hire' (contratação real do freelancer no DB)
      // deve ser acionada APENAS DEPOIS que o pagamento for CONFIRMADO pelo Mercado Pago (via IPN/Webhook no backend).
      // A navegação para 'meus-projetos' NÃO deve acontecer aqui, mas sim nas páginas de retorno do MP.

    } catch (err) {
      console.error("Erro ao aceitar proposta ou iniciar pagamento:", err);
      // Tratamento de erros do backend
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao aceitar a proposta ou iniciar o pagamento.';
      addToast('error', errorMessage);
      // Limpar itens temporários se a requisição falhar
      localStorage.removeItem('tempProjectIdForPayment');
      localStorage.removeItem('tempFreelancerCpfForPayment');
    }
  };

  const handleReject = async (interestId) => {
    try {
      await api.put(`/interests/${interestId}/status`, 'Recusado', {
        headers: { 'Content-Type': 'text/plain' }
      });
      setProposals(ps => ps.map(p => p.id === interestId ? { ...p, status: 'Recusado' } : p));
      addToast('info', 'Proposta recusada.'); // Adicionar Toast
    } catch (err) {
      console.error("Erro ao recusar proposta:", err);
      addToast('error', 'Não foi possível recusar a proposta.');
    }
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingState}><FiLoader className={styles.spinIcon} /> Carregando...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <Link to="/contratante/meus-projetos" className={styles.btnBack}>
          <FiArrowLeft /> Voltar para Meus Projetos
        </Link>
        {error && <div className={styles.errorBanner}><FiAlertCircle /> {error}</div>}

        {project && <h1 className={styles.projectTitle}>Propostas para: "{project.projectTitle}"</h1>}

        {proposals.length > 0 ? (
          <div className={styles.proposalsGrid}>
            {proposals.map(p => (
              <div key={p.id} className={styles.proposalCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.freelancerName}>{p.freelancerName}</h3>
                  <span className={`${styles.statusBadge} ${styles[p.status.toLowerCase().replace(/\s+/g, '')]}`}>
                    {p.status}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.proposalMeta}>
                    <span><FiDollarSign /> {Number(p.proposalValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span><FiCalendar /> {new Date(p.deliveryDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                  </div>
                  <blockquote className={styles.proposalDescription}>
                    {p.proposalDescription}
                  </blockquote>
                </div>
                <div className={styles.cardActions}>
                  <Link to={`/perfis/${p.freelancerCpf}`} className={styles.btnProfile}>
                    <FiUser /> Ver Perfil
                  </Link>
                  {p.status.toLowerCase() === 'aguardando resposta' && (
                    <div className={styles.actionButtons}>
                      <button onClick={() => handleReject(p.id)} className={styles.btnReject}>
                        <FiX /> Rejeitar
                      </button>
                      <button onClick={() => handleAccept(p.freelancerCpf)} className={styles.btnAccept}>
                        <FiCheck /> Aceitar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiFileText className={styles.emptyStateIcon} />
            <h3>Nenhuma proposta recebida</h3>
            <p>Quando freelancers demonstrarem interesse, as propostas aparecerão aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
}