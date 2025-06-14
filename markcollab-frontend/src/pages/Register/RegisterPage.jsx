import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCheckCircle,
  FaArrowLeft,
  FaUserTie,
  FaPencilRuler
} from 'react-icons/fa';
import RegisterSelector from '../../components/RegisterSelector/RegisterSelector';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import styles from './RegisterPage.module.css';
import Logo from '../../assets/img/logo_markcollab.png';

export default function RegisterPage() {
  const [selectedType, setSelectedType] = useState(null);
  const handleBack = () => setSelectedType(null);
  const handleSelectType = (type) => setSelectedType(type);

  const pageContent = {
    initial: {
      logo: true,
      title: 'Junte-se à nossa comunidade',
      subtitle:
        'Escolha seu perfil e comece a transformar suas ideias em realidade hoje mesmo.'
    },
    contratante: {
      icon: <FaUserTie size={32} />,
      title: 'Encontre os Melhores Talentos',
      bullets: [
        'Publique seus projetos com facilidade e clareza.',
        'Receba propostas de freelancers qualificados e verificados.',
        'Gerencie pagamentos e entregas em uma única plataforma segura.'
      ]
    },
    freelancer: {
      icon: <FaPencilRuler size={32} />,
      title: 'Descubra Projetos Incríveis',
      bullets: [
        'Acesse um mercado de projetos exclusivos para suas habilidades.',
        'Construa sua reputação e um portfólio de sucesso.',
        'Receba pagamentos com segurança e pontualidade.'
      ]
    }
  };

  const content = selectedType ? pageContent[selectedType] : pageContent.initial;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.registerCard}>
        <div className={styles.infoPanel}>
          {selectedType && (
            <button onClick={handleBack} className={styles.backButton}>
              <FaArrowLeft /> Voltar
            </button>
          )}
          <div className={styles.infoContent}>
            {content.logo && (
              <img src={Logo} alt="Logo" className={styles.logo} />
            )}
            {content.icon && (
              <div className={styles.infoIcon}>{content.icon}</div>
            )}
            <h1 className={styles.title}>{content.title}</h1>
            {content.subtitle && (
              <p className={styles.subtitle}>{content.subtitle}</p>
            )}
            {content.bullets && (
              <ul className={styles.bulletList}>
                {content.bullets.map((b, i) => (
                  <li key={i}>
                    <FaCheckCircle /> {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.formPanel}>
          {selectedType && (
            <button onClick={handleBack} className={styles.mobileBackButton}>
              <FaArrowLeft /> Voltar
            </button>
          )}

          {!selectedType ? (
            <RegisterSelector onSelect={handleSelectType} />
          ) : (
            <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>
                Crie sua conta de{' '}
                <strong>
                  {selectedType === 'contratante' ? 'Contratante' : 'Freelancer'}
                </strong>
              </h2>
              <RegisterForm type={selectedType} />
              <p className={styles.loginLink}>
                Já possui uma conta? <Link to="/login">Faça login</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
