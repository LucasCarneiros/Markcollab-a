import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const from = location.state?.from?.pathname || '/home';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

   async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { identifier, password });
      // Pass the entire data object or relevant parts (token, cpf, role)
      const { token, cpf, role } = res.data; // Destructure all relevant data
      await login({ token, cpf, role }); // Pass an object to the login function
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h2>Acesse sua Conta</h2>
          <p>Bem-vindo de volta! Faça o login para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier">Email, CPF ou Username</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.labelWrapper}>
              <label htmlFor="password">Senha</label>
              <Link to="/esqueci-senha" className={styles.forgotPassword}>Esqueceu a senha?</Link>
            </div>
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)} className={styles.eyeIcon}>
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          {error && <div className={styles.serverError}>{error}</div>}
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <p className={styles.switchFormLink}>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}