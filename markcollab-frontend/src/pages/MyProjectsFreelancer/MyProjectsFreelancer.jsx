// src/pages/MyProjectsFreelancer/MyProjectsFreelancer.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../../components/ProjectCard/ProjectCard.jsx";
import api from "../../services/api";                 // <— usa api, não axios
import styles from "./MyProjectsFreelancer.module.css";
import { FiBriefcase, FiPlus, FiLoader } from "react-icons/fi";
import { useToast } from "../../context/ToastContext.jsx";

export default function MyProjectsFreelancer() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading]   = useState(true);
  const { addToast }            = useToast();
  const cpf                     = localStorage.getItem("cpf");

  useEffect(() => {
    if (!cpf) {
      addToast("error", "Você precisa estar logado para ver seus projetos.");
      return setLoading(false);
    }

    setLoading(true);
    // **path variable**, exatamente como o back espera**
    api.get(`/projects/freelancer/${cpf}`)
      .then(({ data }) => setProjetos(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Erro ao buscar projetos (Freelancer):", err);
        addToast("error", "Não foi possível carregar seus projetos.");
        setProjetos([]);
      })
      .finally(() => setLoading(false));
  }, [cpf, addToast]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingState}>
          <FiLoader className={styles.loaderIcon} /> Carregando seus projetos...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meus Projetos</h1>
          <Link to="/buscar-projetos" className={styles.btnPrimary}>
            <FiPlus /> Buscar Novos Projetos
          </Link>
        </div>

        {projetos.length > 0 ? (
          <div className={styles.cardsGrid}>
            {projetos.map(p => (
              <ProjectCard
                key={p.projectId}
                project={p}
                userRole="freelancer"
                showDetailsButton
                showDeliverButton={p.status === "Em andamento"}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <FiBriefcase className={styles.emptyStateIcon} />
            <h3>Nenhum projeto no momento</h3>
            <p>Você ainda não foi contratado.</p>
            <Link to="/buscar-projetos" className={styles.btnPrimary}>
              Encontrar Projetos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
