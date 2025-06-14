import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./SendProposal.module.css";
import { FiDollarSign, FiFileText, FiCalendar, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

const SendProposal = () => {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();
  const { projectId } = useParams();
  
  // Pega o usuário logado a partir do Contexto de Autenticação
  const { user } = useContext(AuthContext);
  const freelancerCpf = user?.cpf;

  const validateFields = () => {
    const novosErros = {};
    if (!valor.trim()) {
      novosErros.valor = "O valor da proposta é obrigatório.";
    } else if (isNaN(Number(valor)) || Number(valor) <= 0) {
      novosErros.valor = "O valor deve ser um número válido e maior que zero.";
    }
    if (!descricao.trim()) {
      novosErros.descricao = "A descrição da proposta é obrigatória.";
    }
    if (!dataEntrega) {
      novosErros.dataEntrega = "A data de entrega é obrigatória.";
    } else {
      const hoje = new Date();
      const dataSelecionada = new Date(dataEntrega);
      // Ajusta para comparar as datas corretamente, ignorando fuso horário
      hoje.setHours(0, 0, 0, 0);
      dataSelecionada.setMinutes(dataSelecionada.getMinutes() + dataSelecionada.getTimezoneOffset());
      if (dataSelecionada < hoje) {
        novosErros.dataEntrega = "A data de entrega não pode ser no passado.";
      }
    }
    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateFields() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const propostaPayload = {
        projectId: Number(projectId),
        freelancerCpf: freelancerCpf,
        proposalValue: Number(valor),
        proposalDescription: descricao,
        deliveryDate: dataEntrega,
      };
      
      // Chamada real para a API para criar a proposta (Interest)
      await api.post('/interests/', propostaPayload);
      
      setIsSuccess(true);
      setTimeout(() => navigate("/freelancer/meus-projetos"), 2500);

    } catch (error) {
      console.error("Erro ao enviar proposta:", error);
      const errorMessage = error.response?.data?.message || "Não foi possível enviar a proposta. Tente novamente.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {isSuccess ? (
            <div className={styles.successMessage}>
              <FiCheckCircle className={styles.successIcon} />
              <h2>Proposta Enviada com Sucesso!</h2>
              <p>O contratante foi notificado. Você será redirecionado em breve.</p>
            </div>
          ) : (
            <form className={styles.proposalForm} onSubmit={handleSubmit} noValidate>
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Enviar Proposta</h2>
                <p className={styles.formSubtitle}>Detalhe sua oferta para este projeto com atenção.</p>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="valor"><FiDollarSign /> Valor da Proposta (R$)</label>
                  <input id="valor" type="number" step="0.01" placeholder="1500,00" value={valor} onChange={e => setValor(e.target.value)} />
                  {errors.valor && <span className={styles.errorText}>{errors.valor}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="dataEntrega"><FiCalendar /> Prazo de Entrega</label>
                  <input id="dataEntrega" type="date" value={dataEntrega} onChange={e => setDataEntrega(e.target.value)} />
                  {errors.dataEntrega && <span className={styles.errorText}>{errors.dataEntrega}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="descricao"><FiFileText /> Mensagem e Detalhes da Proposta</label>
                <textarea id="descricao" placeholder="Apresente-se, detalhe como você pode ajudar e por que você é a pessoa certa para este projeto." rows={8} value={descricao} onChange={e => setDescricao(e.target.value)} />
                {errors.descricao && <span className={styles.errorText}>{errors.descricao}</span>}
              </div>

              {submitError && 
                <div className={styles.submitError}>
                  <FiAlertCircle />
                  {submitError}
                </div>
              }

              <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Confirmar e Enviar Proposta'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default SendProposal;