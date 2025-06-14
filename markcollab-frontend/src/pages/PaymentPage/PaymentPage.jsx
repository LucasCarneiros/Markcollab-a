import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PaymentPage.module.css';

export default function PaymentPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${process.env.REACT_APP_API}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setProject(res.data))
      .catch(console.error);
  }, [projectId]);

  const handlePayment = () => {
    const token = localStorage.getItem('token');
    axios
      .post(
        `${process.env.REACT_APP_API}/projects/${projectId}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => setProject(res.data))
      .catch(console.error);
  };

  if (!project) return <div>Carregando...</div>;

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Pagamento - {project.projectTitle}</h2>
        <p><strong>Valor:</strong> R$ {project.projectPrice.toFixed(2)}</p>
        <button className="btnPrimary" onClick={handlePayment}>
          Confirmar Pagamento
        </button>

        {project.status === 'Pago' && (
          <div className="delivery-view">
            <h3>Entrega do Freelancer</h3>
            <p>{project.deliveryText}</p>
            <p><strong>Links:</strong> {project.deliveryLinks}</p>
            {project.attachments?.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                Anexo {i + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
