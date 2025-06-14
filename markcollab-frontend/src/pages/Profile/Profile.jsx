import React, { useRef, useState, useEffect } from 'react';
import SubNavbar from '../../components/SubNavbar/SubNavbar';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEmployer, setIsEmployer] = useState(false);
  const fileInputRef = useRef(null);

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
        setUserData(data);
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
        setUserData(formData);
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
    setFormData(userData);
    setIsEditing(false);
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append('profilePicture', file);

    try {
      const response = await fetch('/api/user/upload-profile-picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataImg,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        setFormData(updatedUser);
        alert('Foto de perfil atualizada com sucesso!');
      } else {
        alert('Erro ao atualizar a foto de perfil.');
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      alert('Erro ao enviar a foto.');
    }
  };

  return (
    <>
      <SubNavbar />
      <div className="personal-data-container">
        <div className="profile-header">
          <h2>Perfil</h2>
          <div className="profile-info">
            <div>
              <div className="profile-picture">
                <img
                  src={userData?.profilePicture || '/default-avatar.png'}
                  alt="Foto de perfil"
                />
              </div>

              {isEditing && (
                <>
                  <button className="btnPhoto" type="button" onClick={() => fileInputRef.current.click()}>
                    Editar foto
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleUploadPhoto}
                    style={{ display: 'none' }}
                  />
                </>
              )}
            </div>

            <div className="profile-name">
              <h3>{userData?.name}</h3>
            </div>
          </div>

          {!isEditing && (
            <button className="editProfile-button" onClick={() => setIsEditing(true)}>
              Editar perfil
            </button>
          )}
        </div>

        <form className="profile_form">
          <label className="profile_label">Usuário</label>
          <input
            type="text"
            name="username"
            value={formData?.username || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="profile_input"
          />

          {!isEmployer && (
            <>
              <label className="profile_label">Sobre mim</label>
              <textarea
                name="aboutMe"
                value={formData?.aboutMe || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="aboutInput"
              />

              <label className="profile_label">Minha experiência profissional</label>
              <textarea
                name="experience"
                value={formData?.experience || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="aboutInput"
              />
            </>
          )}

          {isEmployer && (
            <>
              <label className="profile_label">Sobre a empresa</label>
              <textarea
                name="aboutMe"
                value={formData?.aboutMe || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="aboutInput"
              />
            </>
          )}

          {isEditing && (
            <div className="form-buttons">
              <button type="button" onClick={handleSave}>Salvar</button>
              <button type="button" onClick={handleCancel}>Cancelar</button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default Profile;
