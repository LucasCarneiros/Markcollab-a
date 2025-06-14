import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // 'user' now holds the basic info (cpf, role) from localStorage,
  // or full profile if /user/me call is successful.
  const [user, setUser] = useState(null); 
  const [isAuthenticated, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect runs once on component mount to check for existing token/user in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const cpf = localStorage.getItem('cpf');
    const role = localStorage.getItem('role');

    // If any piece of essential auth info is missing, user is not authenticated
    if (!token || !cpf || !role) {
      setLoading(false);
      return;
    }

    // If token exists, set default Authorization header for API calls
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Set basic user info from localStorage immediately to prevent UI flicker
    // and allow protected routes to work while /user/me (if used) fetches full data.
    setUser({ cpf, role });
    setIsAuth(true);
    setLoading(false); // Authentication state is established

    // OPTIONAL: Call /user/me here if you need more detailed user profile data
    // to populate the 'user' state right after page refresh.
    // Ensure your /user/me endpoint handles proper JWT validation and returns user data.
    /*
    api.get('/user/me')
      .then(({ data }) => {
        // Update user state with full profile data
        setUser(prevUser => ({ ...prevUser, ...data })); 
        // No need to set localStorage items again as they are already set in login()
      })
      .catch((error) => {
        console.error("Failed to fetch full user profile on refresh:", error);
        // If /user/me fails, it might mean the token is invalid/expired, so log out
        localStorage.removeItem('token');
        localStorage.removeItem('cpf');
        localStorage.removeItem('role');
        setUser(null);
        setIsAuth(false);
      })
      .finally(() => setLoading(false)); // Ensure loading is false after /user/me resolves or rejects
    */
  }, []); // Empty dependency array means this runs only once on mount

  // 'login' function is called from LoginPage upon successful authentication
  const login = async ({ token, cpf, role }) => {
    // Save all necessary auth info to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('cpf', cpf);
    localStorage.setItem('role', role);

    // Set default Authorization header for all future API calls
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Set user state and authentication status
    setUser({ cpf, role }); // Initially set with basic info received from login
    setIsAuth(true);

    // OPTIONAL: Call /user/me here if you need more user details right after login.
    // This call should now succeed because the token is set.
    /*
    try {
      const { data } = await api.get('/user/me');
      setUser(prevUser => ({ ...prevUser, ...data })); // Merge or overwrite with full profile
    } catch (error) {
      console.error("Failed to fetch full user profile after login:", error);
      // If /user/me fails even after successful login, it's an unexpected error,
      // consider logging out the user or showing an error message.
    }
    */
  };

  // 'logout' function clears authentication state and localStorage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cpf');
    localStorage.removeItem('role');

    // Clear user state and authentication status
    setUser(null);
    setIsAuth(false);
    
    // Remove default Authorization header from Axios instance
    delete api.defaults.headers.common['Authorization'];

    // Redirect to login page to ensure a clean state
    window.location.href = '/login';
  };

  return (
    // Only render children when loading is false to avoid rendering UI before auth check completes
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};