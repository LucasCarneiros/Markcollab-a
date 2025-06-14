import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiXCircle } from 'react-icons/fi';
import './Toast.css';

const icons = {
  success: <FiCheckCircle />,
  error: <FiXCircle />,
  warning: <FiAlertTriangle />,
  info: <FiInfo />,
};

const Toast = ({ toast }) => (
  <div className={`toast toast-${toast.type}`}>
    <span className="toast-icon">{icons[toast.type]}</span>
    <p>{toast.message}</p>
  </div>
);

const ToastContainer = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(toast => <Toast key={toast.id} toast={toast} />)}
  </div>
);

export default ToastContainer;