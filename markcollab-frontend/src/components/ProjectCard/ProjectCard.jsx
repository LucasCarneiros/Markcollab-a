import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css';
import { FiCalendar, FiTool, FiMoreVertical } from 'react-icons/fi';

export default function ProjectCard({
  project,
  showDropdown = false,
  showViewProposals = false,
  showSendProposal = false,
  showDetailsButton = false,
  showDeliverButton = false,
  onEdit,
  onCancel,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
    projectId,
    projectTitle,
    projectDescription,
    projectSpecifications,
    deadline,
    projectPrice,
    status
  } = project;

  const normalizedStatus = (status || 'aberto').toLowerCase().replace(/\s+/g, '');

  return (
    <div className={styles.card} ref={ref}>
      {showDropdown && (
        <button
          className={styles.btnMenu}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          aria-label="Menu"
          type="button"
        >
          <FiMoreVertical />
        </button>
      )}

      {menuOpen && (
        <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button className={styles.dropdownButton} onClick={() => onEdit(projectId)}>
              Editar
            </button>
          )}
          {onCancel && (
            <button className={`${styles.dropdownButton} ${styles.danger}`} onClick={() => onCancel(projectId)}>
              Cancelar
            </button>
          )}
        </div>
      )}

      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{projectTitle}</h2>
        <span className={styles.priceTag}>
          {projectPrice?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.cardText}>{projectDescription}</p>
        
        <div className={styles.projectMeta}>
          <div className={styles.metaItem}>
            <FiTool className={styles.metaIcon} />
            <span className={styles.metaText} title={projectSpecifications}>
              {projectSpecifications}
            </span>
          </div>
          <div className={styles.metaItem}>
            <FiCalendar className={styles.metaIcon} />
            <span className={styles.metaText}>
              Prazo: {new Date(deadline).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.statusBadge} data-status={normalizedStatus}>
          {status}
        </span>
        
        <div className={styles.footerActions}>
          {/* == LINKS CORRIGIDOS ABAIXO == */}
          {showDetailsButton && <Link to={`/projetos/${projectId}`} className={styles.btnAction}>Detalhes</Link>}
          {showViewProposals && <Link to={`/projetos/${projectId}/propostas`} className={styles.btnAction}>Ver Propostas</Link>}
          {showSendProposal && <Link to={`/projetos/${projectId}/enviar-proposta`} className={styles.btnAction}>Fazer Proposta</Link>}
          {showDeliverButton && <Link to={`/projetos/${projectId}/entregar`} className={styles.btnAction}>Entregar</Link>}
        </div>
      </div>
    </div>
  );
}