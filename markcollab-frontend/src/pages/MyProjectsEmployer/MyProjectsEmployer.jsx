import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";  // usa api, não axios
import Popupcancelar from "../../components/CancelProject/CancelProject.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import ProjectCard from "../../components/ProjectCard/ProjectCard.jsx";
import styles from "./MyProjectsEmployer.module.css";
import { useToast } from "../../context/ToastContext.jsx";
import { FiLoader } from "react-icons/fi";

export default function MyProjectsEmployer() {
  const [projetos, setProjetos]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [popupVisivel, setPopupVisivel] = useState(false);
  const [selId, setSelId]             = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage                  = 3;

  const { addToast } = useToast();
  const cpf          = localStorage.getItem("cpf");
  const navigate     = useNavigate();

  useEffect(() => {
    if (!cpf) {
      addToast("error", "Você precisa estar logado para ver seus projetos.");
      return setLoading(false);
    }

    setLoading(true);
    api.get(`/projects/employer/${cpf}`)
      .then(({ data }) => setProjetos(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Erro ao buscar projetos (Contratante):", err);
        addToast("error", "Não foi possível carregar seus projetos.");
        setProjetos([]);
      })
      .finally(() => setLoading(false));
  }, [cpf, addToast]);

  const normalize = str => (str || "").trim().toLowerCase();
  const listaFiltrada =
    filterStatus === "Todos"
      ? projetos
      : projetos.filter(p => normalize(p.status) === normalize(filterStatus));

  const totalPages = Math.ceil(listaFiltrada.length / itemsPerPage);
  const paged      = listaFiltrada.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEdit   = id => navigate(`/projetos/${id}/editar`);
  const handleCancel = id => {
    setSelId(id);
    setPopupVisivel(true);
  };
  const confirmCancel = () => {
    api.delete(`/projects/${selId}/${cpf}`)
      .then(() => {
        setProjetos(prev => prev.filter(x => x.projectId !== selId));
        addToast("success", "Projeto cancelado com sucesso.");
        setPopupVisivel(false);
      })
      .catch(err => {
        console.error("Erro ao cancelar projeto:", err);
        addToast("error", "Erro ao cancelar o projeto.");
        setPopupVisivel(false);
      });
  };

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingState}>
          <FiLoader className={styles.loaderIcon} /> Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Meus Projetos</h1>
          <div className={styles.headerActions}>
            <select
              className={styles.selectStatus}
              value={filterStatus}
              onChange={e => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>Todos</option>
              <option>Aberto</option>
              <option>Em andamento</option>
              <option>Concluído</option>
            </select>
            <Link to="/contratante/publicar-projeto" className={`${styles.btn} ${styles.primary} ${styles.btnPublish}`}>
              Publicar Projeto
            </Link>
          </div>
        </div>

        {paged.length > 0 ? (
          <>
            <div className={styles.cards}>
              {paged.map(p => (
                <ProjectCard
                  key={p.projectId}
                  project={p}
                  userRole="employer"
                  showDropdown={normalize(p.status) === "aberto"}
                  showViewProposals={normalize(p.status) === "aberto"}
                  showDetailsButton={true}
                  onEdit={() => handleEdit(p.projectId)}
                  onCancel={() => handleCancel(p.projectId)}
                />
              ))}
            </div>
            <div className={styles.paginationWrapper}>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
            </div>
          </>
        ) : (
          <p className={styles.noProjects}>
            Nenhum projeto encontrado com o filtro "{filterStatus}".
          </p>
        )}
      </div>

      {popupVisivel && <Popupcancelar onClose={() => setPopupVisivel(false)} onConfirm={confirmCancel}/>}
    </div>
  );
}
