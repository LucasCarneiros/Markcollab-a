import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './ProjectDetails.module.css';
import { FiCalendar, FiTool, FiCheck, FiX, FiDownload, FiArrowLeft } from 'react-icons/fi';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [error, setError] = useState(null);
  
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userCpf = localStorage.getItem('cpf');

  useEffect(() => {
    if (!projectId || !token) {
        setError('Informações de autenticação ausentes.');
        return;
    }

    axios.get(`/api/projects/${projectId}`, { headers: { Authorization: `Bearer ${token}` }})
      .then(res => {
        const proj = res.data;
        setProject(proj);
        // Exemplo: Se o projeto foi entregue, busca os detalhes da entrega
        if (proj.status === 'Em Revisão' || proj.status === 'Concluído') {
          // Substitua pelo seu endpoint real para buscar a entrega
          axios.get(`/api/projects/${projectId}/delivery`, { headers: { Authorization: `Bearer ${token}` }})
            .then(deliveryRes => setDelivery(deliveryRes.data))
            .catch(() => console.error("Não foi possível carregar os detalhes da entrega."));
        }
      })
      .catch(() => setError('Não foi possível carregar os detalhes do projeto.'));
  }, [projectId, token]);

  // Lógica de renderização de botões para o contratante e freelancer
  const renderActionButtons = () => {
    if (!project) return null;

    const isEmployerOwner = userRole === 'EMPLOYER' && userCpf === project.employerCpf;
    const isFreelancer = userRole === 'FREELANCER';

    if (isEmployerOwner && project.status === 'Aberto') {
      return (
        <Link to={`/propostas/${projectId}`} className={`${styles.btn} ${styles.primary}`}>
          Visualizar Propostas
        </Link>
      );
    }
    
    if (isFreelancer && project.status === 'Aberto') {
      return (
        <>
          <Link to={`/fazerproposta/${projectId}`} className={`${styles.btn} ${styles.primary}`}>
            Fazer Proposta
          </Link>
          <Link to={`/perfilcontratante/${project.employerCpf}`} className={`${styles.btn} ${styles.outlined}`}>
            Ver Perfil do Contratante
          </Link>
        </>
      );
    }

    return null;
  };

  // Lógica de renderização da seção de entrega para o contratante
  const renderDeliveryDetails = () => {
    if (!delivery || userCpf !== project.employerCpf) return null;

    return (
      <div className={styles.deliverySection}>
        <h2 className={styles.sectionTitle}>Entrega do Projeto</h2>
        <p><strong>Links:</strong> <a href={delivery.deliveryLinks} target="_blank" rel="noopener noreferrer">{delivery.deliveryLinks}</a></p>
        <p><strong>Descrição da Entrega:</strong> {delivery.deliveryText}</p>
        {delivery.attachments && delivery.attachments.length > 0 && (
            <div>
              <strong>Anexos:</strong>
              <ul className={styles.attachmentList}>
                {delivery.attachments.map(file => (
                  <li key={file.id}>
                    <a href={file.url} download><FiDownload /> {file.name}</a>
                  </li>
                ))}
              </ul>
            </div>
        )}
        {project.status === 'Em Revisão' && (
           <div className={styles.deliveryActions}>
              <button className={`${styles.btn} ${styles.btnApprove}`}><FiCheck/> Aprovar Entrega</button>
              <button className={`${styles.btn} ${styles.btnReject}`}><FiX/> Pedir Ajustes</button>
           </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className={styles.detailsPage}>
        <div className={styles.detailsContainer}><p className={styles.error}>{error}</p></div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className={styles.detailsPage}>
        <div className={styles.detailsContainer}><p>Carregando...</p></div>
      </div>
    )
  }

  const normalizedStatus = (project.status || 'aberto').toLowerCase().replace(/\s+/g, '');

  return (
    <div className={styles.detailsPage}>
      <div className={styles.detailsContainer}>
        <Link to={-1} className={styles.btnBack}><FiArrowLeft/> Voltar</Link>
        
        <div className={styles.header}>
            <h1 className={styles.title}>{project.projectTitle}</h1>
            <span className={styles.statusBadge} data-status={normalizedStatus}>
                {project.status}
            </span>
        </div>

        <div className={styles.keyInfoGrid}>
          <div className={styles.keyInfoItem}>
            <span className={styles.keyInfoLabel}>PREÇO</span>
            <span className={styles.keyInfoValue}>
              {project.projectPrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className={styles.keyInfoItem}>
            <span className={styles.keyInfoLabel}><FiCalendar/> PRAZO FINAL</span>
            <span className={styles.keyInfoValue}>
              {new Date(project.deadline).toLocaleDateString()}
            </span>
          </div>
          <div className={styles.keyInfoItem}>
            <span className={styles.keyInfoLabel}><FiTool/> ESPECIFICAÇÕES</span>
            <span className={styles.keyInfoValue}>
              {project.projectSpecifications}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Descrição do Projeto</h2>
          <p>{project.projectDescription}</p>
        </div>
        
        {renderDeliveryDetails()}

        <div className={styles.actions}>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
}