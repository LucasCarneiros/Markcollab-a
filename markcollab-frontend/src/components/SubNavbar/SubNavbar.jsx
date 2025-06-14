import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaIdCard, FaSignOutAlt } from 'react-icons/fa';
import './SubNavbar.css';
import { AuthContext } from '../../context/AuthContext'; 

const SubNavbar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); 

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  return (
    <div className="subnavbar">
      <button onClick={() => navigate('/perfil')}>
        <FaUser className="icon" />
        Perfil
      </button>
      <button onClick={() => navigate('/dadospessoais')}>
        <FaIdCard className="icon" />
        Dados pessoais
      </button>
      <button onClick={handleLogout}>
        <FaSignOutAlt className="icon" />
        Sair da conta
      </button>
    </div>
  );
};

export default SubNavbar;
