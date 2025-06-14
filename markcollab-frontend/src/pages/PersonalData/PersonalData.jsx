import React, { useState, useEffect } from 'react';
import SubNavbar from '../../components/SubNavbar/SubNavbar';
import './PersonalData.css';

const PersonalData = () => {
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          console.error('Erro ao buscar dados do usuário:', response.status);
          return;
        }

        const data = await response.json();
        setFormData(data);
        setIsEmployer(data.role === 'EMPLOYER');
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/me/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Dados atualizados com sucesso!');
      } else {
        console.error('Erro ao atualizar os dados:', response.status);
        alert('Erro ao atualizar os dados.');
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar os dados.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <SubNavbar />
      <div className="personal-data-container">
        <h2>Editar Dados</h2>
        <form className="profile_form">
          <label className="profile_label">Nome completo</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="personal_input"
          />

          <label className="profile_label">Nome de usuário</label>
          <input
            type="text"
            name="username"
            value={formData.username || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="personal_input"
          />

          <label className="profile_label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="personal_input"
          />

          <label className="profile_label">CPF</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf || ''}
            onChange={handleChange}
            disabled
            className="personal_input"
          />

          <label className="profile_label">
            {isEmployer ? 'Sobre a empresa' : 'Sobre mim'}
          </label>
          <input
            type="text"
            name="aboutMe"
            value={formData.aboutMe || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="personal_input"
          />

          {!isEmployer && (
            <>
              <label className="profile_label">Minha experiência</label>
              <input
                type="text"
                name="experience"
                value={formData.experience || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="personal_input"
              />
            </>
          )}

          {isEmployer && (
            <>
              <label className="profile_label">Nome da empresa</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="personal_input"
              />
            </>
          )}

          {isEditing ? (
            <div className="form-buttons">
              <button type="button" onClick={handleSave}>Salvar</button>
              <button type="button" onClick={handleCancel}>Cancelar</button>
            </div>
          ) : (
            <button
              type="button"
              className="editData-btn"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default PersonalData;
