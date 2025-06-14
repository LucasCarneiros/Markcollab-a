
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext.jsx';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar/Navbar.jsx';

import './App.css'; 

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />

        <main className="main-content-area">
          <AppRoutes />
        </main>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;