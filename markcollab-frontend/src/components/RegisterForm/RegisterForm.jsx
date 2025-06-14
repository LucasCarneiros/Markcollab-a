import React, { useState } from 'react';
import axios from 'axios';
import Input from '../Input/Input';
import Button from '../Button/Button';
import SuccessMessage from '../SuccessMessage/SuccessMessage';
import useRegisterValidation from '../../hooks/useRegisterValidation';
import { formatCpfCnpj, stripFormatting } from '../../utils/formatUtils';
import styles from './RegisterForm.module.css';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaAddressCard,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const API_BASE = 'http://localhost:8080/api/auth/register';

export default function RegisterForm({ type }) {
  const validate = useRegisterValidation(type);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    company: '',
    cpfCnpj: '',
    email: '',
    password: ''
  });
  const [clientErrors, setClientErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    if (name === 'cpfCnpj') {
      const digits = stripFormatting(value).slice(0, 14);
      setFormData((fd) => ({ ...fd, cpfCnpj: formatCpfCnpj(digits) }));
    } else {
      setFormData((fd) => ({ ...fd, [name]: value }));
    }
    setClientErrors((ce) => ({ ...ce, [name]: '' }));
    setServerError(null);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError(null);
    const frontErr = validate(formData);
    if (Object.keys(frontErr).length) {
      setClientErrors(frontErr);
      return;
    }

    setSubmitting(true);
    setClientErrors({});
    const payload = {
      name: formData.name.trim(),
      username: formData.username.trim(),
      cpf: stripFormatting(formData.cpfCnpj),
      email: formData.email.trim(),
      password: formData.password,
      role: type === 'freelancer' ? 'FREELANCER' : 'EMPLOYER',
      ...(type === 'contratante' && { companyName: formData.company.trim() })
    };

    try {
      await axios.post(API_BASE, payload);
      setSuccess(true);
    } catch (err) {
      const resp = err.response;
      let msg = 'Não foi possível conectar ao servidor.';
      if (resp?.data) {
        if (resp.data.message) msg = resp.data.message;
        else if (typeof resp.data === 'string') msg = resp.data;
      }
      if (resp?.status === 400) {
        if (
          msg.includes('username:') ||
          msg.includes('cpf:') ||
          msg.includes('email:')
        ) {
          const top = msg
            .split(';')
            .map((p) => p.split(':')[1].trim())
            .join('; ');
          setServerError(top);
        } else {
          const fe = {};
          msg.split(';').forEach((pair) => {
            const [f, m] = pair.split(':').map((s) => s.trim());
            if (
              ['name', 'username', 'company', 'cpf', 'email', 'password'].includes(
                f
              )
            ) {
              fe[f === 'cpf' ? 'cpfCnpj' : f] = m;
            }
          });
          setClientErrors(fe);
        }
      } else {
        setServerError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <SuccessMessage
        title="Conta criada com sucesso!"
        text="Enviamos uma confirmação para o seu e-mail. Faça o login para começar."
        linkText="Ir para o Login"
        linkTo="/login"
      />
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {serverError && <div className={styles.serverError}>{serverError}</div>}

      <Input
        label="Nome Completo"
        name="name"
        id="name"
        value={formData.name}
        onChange={handleChange}
        error={clientErrors.name}
        icon={FaUser}
      />

      <Input
        label="Username"
        name="username"
        id="username"
        value={formData.username}
        onChange={handleChange}
        error={clientErrors.username}
        icon={FaUser}
      />

      {type === 'contratante' && (
        <Input
          label="Nome da Empresa"
          name="company"
          id="company"
          value={formData.company}
          onChange={handleChange}
          error={clientErrors.company}
          icon={FaBuilding}
        />
      )}

      <Input
        label="CPF ou CNPJ"
        name="cpfCnpj"
        id="cpfCnpj"
        value={formData.cpfCnpj}
        onChange={handleChange}
        error={clientErrors.cpfCnpj}
        icon={FaAddressCard}
      />

      <Input
        label="E-mail"
        name="email"
        id="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={clientErrors.email}
        icon={FaEnvelope}
      />

      <Input
        label="Senha"
        name="password"
        id="password"
        type={showPwd ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        error={clientErrors.password}
        icon={FaLock}
        onIconClick={() => setShowPwd((v) => !v)}
        iconRight={showPwd ? FaEyeSlash : FaEye}
      />

      <Button type="submit" disabled={submitting} loading={submitting}>
        {submitting ? 'Criando Conta...' : 'Finalizar Cadastro'}
      </Button>
    </form>
  );
}
