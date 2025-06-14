
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProjectEdit.css';

const ProjectEdit = () => {
  const { id } = useParams();
  const [project, setProject] = useState({
    projectTitle: '',
    projectDescription: '',
    projectSpecifications: '',
    deadline: '',
    projectPrice: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const cpf = localStorage.getItem('cpf');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      alert('Você precisa estar logado para editar um projeto.');
      return;
    }

    axios
      .get(`http://localhost:8080/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const p = res.data;
        setProject({
          projectTitle: p.projectTitle || '',
          projectDescription: p.projectDescription || '',
          projectSpecifications: p.projectSpecifications || '',
          // Se não houver deadline, mantemos string vazia
          deadline: p.deadline ? p.deadline.split('T')[0] : '',
          projectPrice: p.projectPrice != null ? p.projectPrice : '',
          status: p.status || ''
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar projeto (GET):', err.response || err);
        alert('Erro ao carregar projeto.');
        setLoading(false);
      });
  }, [id, token]);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const deadlineParaEnviar = project.deadline.trim() === '' ? null : project.deadline;

    axios
      .put(
        `/api/projects/${id}/${cpf}`,
        {
          projectTitle: project.projectTitle,
          projectDescription: project.projectDescription,
          projectSpecifications: project.projectSpecifications,
          deadline: deadlineParaEnviar,
          projectPrice: parseFloat(project.projectPrice),
          status: project.status
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      .then(() => {
        alert('✅ Projeto atualizado com sucesso!');
        navigate('/meusprojetos');
      })
      .catch((err) => {
        console.error('Erro ao atualizar projeto (PUT):', err.response || err);
        const msgBackend = err.response?.data || err.message;
        alert(`❌ Erro ao atualizar projeto: ${msgBackend}`);
      });
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <div className="project-edit-container">
        <a href="/meusprojetos" className="back-link">&larr; Voltar</a>
        <h2 className="edit-title">Editar projeto</h2>
        <form className="edit-form" onSubmit={handleSubmit}>
          <label>Nome do projeto</label>
          <input
            type="text"
            name="projectTitle"
            className="input-field bordered"
            value={project.projectTitle}
            onChange={handleChange}
            required
          />

          <label>Descrição do projeto</label>
          <textarea
            name="projectDescription"
            className="textarea-field"
            value={project.projectDescription}
            onChange={handleChange}
            required
          />

          <label>Especificações do projeto</label>
          <textarea
            name="projectSpecifications"
            className="textarea-field"
            value={project.projectSpecifications}
            onChange={handleChange}
            required
          />

          <label>Prazo de entrega</label>
          <input
            type="date"
            name="deadline"
            className="input-field bordered"
            value={project.deadline}
            onChange={handleChange}
            // não é obrigatório, pois o campo pode ficar vazio
          />

          <label>Preço do projeto</label>
          <input
            type="number"
            step="0.01"
            name="projectPrice"
            className="input-field bordered"
            value={project.projectPrice}
            onChange={handleChange}
            required
          />

          <label>Status do projeto</label>
          <select
            name="status"
            className="input-field bordered"
            value={project.status}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o status</option>
            <option value="Aberto">Aberto</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Concluído">Concluído</option>
          </select>

          <button type="submit" className="edit-button">Salvar alterações</button>
        </form>
      </div>
    </>
  );
};

export default ProjectEdit;
