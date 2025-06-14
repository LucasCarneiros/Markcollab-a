import React from 'react';
import './CancelProject.css'; 
import { FaDoorOpen } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 

const CancelProject = ({ onClose, onConfirm }) => {
  const handleConfirmExit = () => {
    onConfirm();  // Chama a função de exclusão
    onClose();  // Fecha o pop-up
  };

  return (
    <div className="popup-container" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <FaDoorOpen className="popup-header-icon" /> 
          <span className="popup-header-title">CANCELAR PROJETO</span>
        </div>
        
        <div className="popup-body">
          <p className="popup-message">TEM CERTEZA QUE DESEJA CANCELAR O PROJETO?</p>
        </div>

        <div className="popup-footer">
          <button className="popup-button sim" onClick={handleConfirmExit}>
            SIM
          </button>
          <button className="popup-button nao" onClick={onClose}>
            NÃO
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelProject;
