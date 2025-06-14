import React, { useState } from 'react';
import Input from '../../components/Input/Input.jsx';
import axios from 'axios';
import styles from './Publish.module.css';
import { useToast } from '../../context/ToastContext.jsx';
import { FiLoader } from 'react-icons/fi';

export default function Publish() {
  const [project, setProject] = useState({ name: '', specifications: '', description: '', deadline: '', projectPrice: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToast } = useToast();
  const cpf = localStorage.getItem('cpf');
  const token = localStorage.getItem('token');

  const handleChange = e => {
    const { name, value } = e.target;
    setProject(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!project.name.trim()) e.name = 'O nome do projeto é obrigatório.';
    if (!project.specifications.trim()) e.specifications = 'As especificações são obrigatórias.';
    if (!project.description.trim()) e.description = 'A descrição é obrigatória.';
    if (!project.deadline) {
      e.deadline = 'O prazo de entrega é obrigatório.';
    } else {
      const today = new Date(); today.setHours(0,0,0,0);
      const sel = new Date(project.deadline);
      if (sel < today) e.deadline = 'A data não pode ser no passado.';
    }
    const preco = parseFloat(project.projectPrice);
    if (isNaN(preco) || preco <= 0) {
      e.projectPrice = 'Digite um valor de projeto válido.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const gerarDescricaoIA = () => {
    const { name, specifications, deadline } = project;
    if(!name || !specifications) {
        addToast('warning', 'Preencha o nome e as especificações para gerar.');
        return;
    }
    setIsGenerating(true);
    // CHAMADA PARA A API DE IA (URL absoluta)
    axios.post('https://fastapi-markcollabia.onrender.com/api/ia/gerar-descricao', { name, specifications, deadline })
      .then(res => {
        const desc = res.data.descricao?.trim();
        if (!desc) throw new Error("Descrição vazia recebida.");
        setProject(p => ({ ...p, description: desc }));
        addToast('success', 'Descrição gerada com IA!');
      })
      .catch(() => addToast('error', 'Não foi possível gerar a descrição.'))
      .finally(() => setIsGenerating(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cpf || !token) {
      addToast('error', 'CPF ou Token não encontrado. Faça login novamente.');
      return;
    }
    if (!validate()) {
      addToast('warning', 'Por favor, corrija os erros no formulário.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      projectTitle: project.name,
      projectSpecifications: project.specifications,
      projectDescription: project.description,
      deadline: project.deadline,
      projectPrice: parseFloat(project.projectPrice),
      open: true,
      status: 'Ativo'
    };

    try {
      // CHAMADA PARA A API PRINCIPAL (URL relativa)
      await axios.post(`/api/projects/${cpf}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('success', 'Projeto publicado com sucesso!');
      setProject({ name:'', specifications:'', description:'', deadline:'', projectPrice:'' });
      setErrors({});
    } catch (err) {
      console.error("Erro ao publicar:", err);
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao publicar o projeto.';
      addToast('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Publique o que você precisa!</h2>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <Input label="Nome do projeto" name="name" value={project.name} onChange={handleChange} error={errors.name} />
          <div className={styles.formGroup}>
            <label className={styles.label}>Especificações</label>
            <textarea name="specifications" className={`${styles.textarea} ${errors.specifications ? styles.inputError : ''}`} value={project.specifications} onChange={handleChange} placeholder="Ex: Preciso de 3 artes para Instagram, formato feed, com foco em..." />
            {errors.specifications && <span className={styles.error}>{errors.specifications}</span>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Descrição Completa</label>
            <textarea name="description" className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`} value={project.description} onChange={handleChange} placeholder="Detalhe o máximo possível sobre o projeto, público-alvo, objetivos, etc." />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
          </div>
          <button type="button" className={styles.iaButton} onClick={gerarDescricaoIA} disabled={isGenerating}>
            {isGenerating ? <><FiLoader className={styles.loaderIconSmall} /> Gerando...</> : '🤖 Gerar descrição com IA'}
          </button>
          <div className={styles.grid}>
            <Input label="Prazo de entrega" name="deadline" type="date" value={project.deadline} onChange={handleChange} error={errors.deadline} />
            <Input label="Valor do Projeto (R$)" name="projectPrice" type="number" step="0.01" value={project.projectPrice} onChange={handleChange} error={errors.projectPrice} placeholder="Ex: 500.00" />
          </div>
          <button type="submit" className={styles.publishButton} disabled={isSubmitting}>
            {isSubmitting ? <><FiLoader className={styles.loaderIconSmall} /> Publicando...</> : 'Publicar Projeto'}
          </button>
        </form>
      </div>
    </div>
  );
}