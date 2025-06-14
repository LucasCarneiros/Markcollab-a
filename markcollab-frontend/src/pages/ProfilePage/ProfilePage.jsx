import React, { useState, useContext, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import styles from './ProfilePage.module.css';
import { FiUser, FiEdit3, FiSave, FiX, FiCamera, FiBriefcase, FiMail, FiFileText } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext';

const API_URL = 'http://localhost:8080/api'; // Substitua pela sua API

// Schema de validação sem o username
const profileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  aboutMe: z.string().optional(),
  experience: z.string().optional(),
  companyName: z.string().optional(),
});

const ProfilePage = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        aboutMe: user.aboutMe || '',
        experience: user.experience || '',
        companyName: user.companyName || '',
      });
    }
  }, [user, reset]);

  const onSave = async (formData) => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/user/me/update`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('success', 'Perfil atualizado com sucesso!');
      await fetchUser();
      setIsEditing(false);
    } catch (error) {
      addToast('error', 'Erro ao atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) reset(user);
    setIsEditing(false);
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append('profilePicture', file);
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${API_URL}/user/upload-profile-picture`, formDataImg, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      addToast('success', 'Foto de perfil atualizada!');
      await fetchUser();
    } catch (error) {
      addToast('error', 'Erro ao enviar a foto. Verifique o formato e tamanho.');
    }
  };

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  const isEmployer = user.role === 'EMPLOYER';

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSave)} noValidate>
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <img
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                alt="Foto de perfil"
                className={styles.avatar}
              />
              {isEditing && (
                <>
                  <button type="button" className={styles.editPhotoButton} onClick={() => fileInputRef.current.click()}>
                    <FiCamera />
                  </button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleUploadPhoto} style={{ display: 'none' }} />
                </>
              )}
            </div>
            <div className={styles.headerInfo}>
              <h1>{user.name}</h1>
              <p>@{user.username}</p>
            </div>
            <div className={styles.headerActions}>
              {!isEditing ? (
                <button type="button" className={styles.editButton} onClick={() => setIsEditing(true)}>
                  <FiEdit3 /> Editar Perfil
                </button>
              ) : (
                <div className={styles.editingActions}>
                  <button type="button" className={styles.cancelButton} onClick={handleCancel} disabled={saving}>
                    <FiX /> Cancelar
                  </button>
                  <button type="submit" className={styles.saveButton} disabled={saving}>
                    {saving ? <FiLoader className={styles.loaderIcon} /> : <FiSave />} Salvar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.profileGrid}>
            <div className={styles.infoCard}>
              <h3>Informações da Conta</h3>
              <div className={styles.formField}>
                <label><FiUser /> Nome Completo</label>
                <input {...register('name')} disabled={!isEditing} className={errors.name ? styles.inputError : ''} />
                {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
              </div>
              <div className={styles.formField}>
                <label><FiUser /> Nome de Usuário (não pode ser alterado)</label>
                <input value={user.username} disabled />
              </div>
              <div className={styles.formField}>
                <label><FiMail /> Email</label>
                <input type="email" value={user.email} disabled />
              </div>
              <div className={styles.formField}>
                <label><FiFileText /> CPF</label>
                <input value={user.cpf} disabled />
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>{isEmployer ? 'Sobre a Empresa' : 'Sobre Mim'}</h3>
              {isEmployer ? (
                <div className={styles.formField}>
                  <label><FiBriefcase /> Nome da Empresa</label>
                  <input {...register('companyName')} disabled={!isEditing} />
                </div>
              ) : (
                <div className={styles.formField}>
                  <label><FiBriefcase /> Minha Experiência</label>
                  <textarea {...register('experience')} disabled={!isEditing} rows="4" placeholder="Ex: Designer Gráfico com 5 anos de experiência em..." />
                </div>
              )}
              <div className={styles.formField}>
                <label>Sobre mim</label>
                <textarea {...register('aboutMe')} disabled={!isEditing} rows="6" placeholder={isEmployer ? 'Descreva a missão e os valores da sua empresa...' : 'Fale um pouco sobre você, suas habilidades e paixões...'} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;