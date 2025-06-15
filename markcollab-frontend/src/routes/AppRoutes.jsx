import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Importe todas as suas páginas
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import ServicesPage from '../pages/ServicesPage/ServicesPage';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';

import SearchProjects from '../pages/SearchProjects/SearchProjects';
import ProjectDetails from '../pages/ProjectDetails/ProjectDetails';
import SendProposal from '../pages/SendProposal/SendProposal';
import ProjectDelivery from '../pages/ProjectDelivery/ProjectDelivery';
import PaymentPage from '../pages/PaymentPage/PaymentPage';
import ProjectEdit from '../pages/ProjectEdit/ProjectEdit';
import Publish from '../pages/Publish/Publish';
import Proposals from '../pages/Proposals/Proposals';

import MyProjectsEmployer from '../pages/MyProjectsEmployer/MyProjectsEmployer';
import MyProjectsFreelancer from '../pages/MyProjectsFreelancer/MyProjectsFreelancer';

import ProfilePage from '../pages/ProfilePage/ProfilePage';
import FreelancerProfile from '../pages/FreelancerProfile/FreelancerProfile'; // <--- Perfil Público
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'; 
import PaymentSuccess from '../pages/PaymentPage/PaymentSuccess'; // <--- Importe
import PaymentPending from '../pages/PaymentPage/PaymentPending'; // <--- Importe
import PaymentFailure from '../pages/PaymentPage/PaymentFailure'; // <--- Importe

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/servicos" element={<ServicesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />
      <Route path="/buscar-projetos" element={<SearchProjects />} />
      <Route path="/projetos/:projectId" element={<ProjectDetails />} />
      
      {/* ROTA CORRETA PARA O PERFIL PÚBLICO DO FREELANCER */}
      <Route path="/perfis/:cpf" element={<FreelancerProfile />} />

      <Route path="/nao-autorizado" element={<div><h1>403 - Acesso Negado</h1><p>Você não tem permissão para ver esta página.</p></div>} />

      {/* --- Rotas Protegidas (Requer Autenticação) --- */}
      <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* --- Rotas do Freelancer (Requer Role 'FREELANCER') --- */}
      <Route path="/freelancer">
        <Route path="meus-projetos" element={<ProtectedRoute allowedRoles={['FREELANCER']}><MyProjectsFreelancer /></ProtectedRoute>} />
      </Route>
      <Route path="/projetos/:projectId/enviar-proposta" element={<ProtectedRoute allowedRoles={['FREELANCER']}><SendProposal /></ProtectedRoute>} />
      <Route path="/projetos/:projectId/entregar" element={<ProtectedRoute allowedRoles={['FREELANCER']}><ProjectDelivery /></ProtectedRoute>} />
      
      {/* --- Rotas do Contratante (Requer Role 'EMPLOYER') --- */}
      <Route path="/contratante">
        <Route path="publicar-projeto" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><Publish /></ProtectedRoute>} />
        <Route path="meus-projetos" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><MyProjectsEmployer /></ProtectedRoute>} />
      </Route>
      <Route path="/projetos/:projectId/pagar" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><PaymentPage /></ProtectedRoute>} />
      <Route path="/projetos/:projectId/propostas" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><Proposals /></ProtectedRoute>} />
      <Route path="/projetos/:projectId/editar" element={<ProtectedRoute allowedRoles={['EMPLOYER']}><ProjectEdit /></ProtectedRoute>} />
      
      {/* --- Rota de fallback para páginas não encontradas --- */}
      <Route path="*" element={<NotFoundPage />} />

       {/* Rotas de Status de Pagamento (geralmente acessíveis publicamente após redirecionamento do MP) */}
        <Route path="/pagamento/sucesso" element={<PaymentSuccess />} />
        <Route path="/pagamento/pendente" element={<PaymentPending />} />
        <Route path="/pagamento/falha" element={<PaymentFailure />} />
    </Routes>
  );
};

export default AppRoutes;