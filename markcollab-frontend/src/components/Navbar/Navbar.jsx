import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import './Navbar.css';
import MainLogo from '../../assets/img/logo_markcollab.png'; 
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const toggleSidebar = () => setSidebarOpen(o => !o);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    addToast('info', 'Você foi desconectado.');
    setDropdownOpen(false);
    closeSidebar();
    navigate('/login');
  };

  const getProjectsPath = () => {
    if (!user) return '/login';
    return user.role === 'FREELANCER' ? '/freelancer/meus-projetos' : '/contratante/meus-projetos';
  };

  const NavLink = ({ to, children, className, onClick }) => (
    <li className={className}>
      <Link to={to} onClick={() => { closeSidebar(); onClick?.(); }}>{children}</Link>
    </li>
  );

  const isFreelancer = user?.role === 'FREELANCER';

  return (
    <>
      <header className="main-header">
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeSidebar}>
            <img src={MainLogo} alt="MarkCollab Logo" />
          </Link>

          <nav className="desktop-nav">
            <ul className="nav-links">
              <NavLink to="/home">Home</NavLink>
              {!isAuthenticated && (
                <>
                  <NavLink to="/sobre">Sobre</NavLink>
                  <NavLink to="/servicos">Serviços</NavLink>
                </>
              )}
              {isAuthenticated && (
                <>
                  <NavLink to={getProjectsPath()}>Meus Projetos</NavLink>
                  {isFreelancer && <NavLink to="/buscar-projetos">Buscar Projetos</NavLink>}
                </>
              )}
            </ul>
          </nav>

          <div className="nav-actions">
            {isAuthenticated ? (
              <div className="profile-menu" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(o => !o)} className="profile-btn">
                  <User size={20} />
                  <span>Olá, {user?.name?.split(' ')[0] || 'Usuário'}</span>
                </button>
                {dropdownOpen && (
                  <ul className="dropdown">
                    <NavLink to="/perfil" onClick={() => setDropdownOpen(false)}>
                        <Settings size={16}/> Minha Conta
                    </NavLink>
                    {/* AJUSTADO: O wrapper do item de logout foi simplificado */}
                    <li onClick={handleLogout} className="logout-item-wrapper">
                      <div className="logout-item"><LogOut size={16}/> Sair</div>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/cadastro" className="btn-register">Cadastro</Link>
              </div>
            )}
            <button className="menu-btn" onClick={toggleSidebar}>
              {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
          <ul className="sidebar-links">
            {isAuthenticated && (
              <li className="sidebar-user-info">
                <User size={22} />
                <span>Olá, {user?.name?.split(' ')[0] || 'Usuário'}</span>
              </li>
            )}
            <hr />
            <NavLink to="/home">Home</NavLink>
            {!isAuthenticated ? (
              <>
                <NavLink to="/sobre">Sobre</NavLink>
                <NavLink to="/servicos">Serviços</NavLink>
                <hr />
                {/* AJUSTADO: Botões de login/cadastro agrupados */}
                <li className="sidebar-auth-actions">
                  <Link to="/login" className="sidebar-btn-login" onClick={closeSidebar}>Login</Link>
                  <Link to="/cadastro" className="sidebar-btn-register" onClick={closeSidebar}>Cadastro</Link>
                </li>
              </>
            ) : (
              <>
                <NavLink to={getProjectsPath()}>Meus Projetos</NavLink>
                {isFreelancer && <NavLink to="/buscar-projetos">Buscar Projetos</NavLink>}
                <NavLink to="/perfil">Minha Conta</NavLink>
                <hr/>
                <li onClick={handleLogout} className="sidebar-logout">Sair</li>
              </>
            )}
          </ul>
        </div>
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      </div>
    </>
  );
};

export default Navbar;