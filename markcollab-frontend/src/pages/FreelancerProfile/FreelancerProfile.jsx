import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import styles from './FreelancerProfile.module.css';
import { 
  FiMail, 
  FiBriefcase, 
  FiLink, 
  FiAward, 
  FiArrowLeft, 
  FiLoader, 
  FiAlertCircle 
} from 'react-icons/fi';

// Componente para a tela de Carregamento
const LoadingState = () => (
  <div className={styles.messageState}>
    <FiLoader className={styles.spinIcon} />
    <p>Carregando perfil...</p>
  </div>
);

// Componente para a tela de Erro
const ErrorState = ({ message }) => (
  <div className={styles.messageState}>
    <FiAlertCircle className={styles.errorIcon} />
    <h2>Erro ao Carregar</h2>
    <p>{message}</p>
    <Link to="/" className={styles.backLink}>&larr; Voltar para a Home</Link>
  </div>
);

// Componente Principal do Perfil
const FreelancerProfile = () => {
  const { cpf } = useParams();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cpf) {
      setError('CPF do freelancer não foi informado na URL.');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/freelancers/${cpf}`);
        setFreelancer(data);
      } catch (err) {
        console.error('Erro ao carregar perfil do freelancer:', err);
        setError('Não foi possível carregar o perfil. Verifique se o link está correto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [cpf]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }
  
  if (!freelancer) {
    return <ErrorState message="O perfil que você está tentando acessar não existe." />;
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileCard}>
        <header className={styles.header}>
          <Link to={-1} className={styles.backButton}>
            <FiArrowLeft /> Voltar
          </Link>
          <img
            src={freelancer.profilePicture || '/default-avatar.png'}
            alt={`Foto de ${freelancer.name}`}
            className={styles.avatar}
          />
          <h1 className={styles.name}>{freelancer.name}</h1>
          <p className={styles.username}>@{freelancer.username}</p>
          <div className={styles.contactInfo}>
            <span className={styles.contactItem}><FiMail /> {freelancer.email}</span>
            {freelancer.portfolioLink && (
              <a href={freelancer.portfolioLink} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                <FiLink /> Portfólio
              </a>
            )}
          </div>
        </header>
        
        <main className={styles.mainContent}>
          {freelancer.aboutMe && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}><FiBriefcase /> Sobre Mim</h2>
              <p className={styles.sectionContent}>{freelancer.aboutMe}</p>
            </section>
          )}

          {freelancer.experience && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}><FiAward /> Experiência Profissional</h2>
              <p className={styles.sectionContent}>{freelancer.experience}</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default FreelancerProfile;