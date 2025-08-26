import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './components/Landing';
import AdminDashboard from './components/AdminDashboard';
import AuthorityDashboard from './components/Authority/AuthorityDashboard';
import CitizenDashboard from './components/Dashboard/CitizenDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EnhancedAuthModal from './components/Auth/EnhancedAuthModal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

const AppRoutes: React.FC = () => {
  const { userProfile } = useAuth();

  // This component will handle redirection after login
  const HomeRedirect = () => {
    if (!userProfile) {
      // If for some reason we are here without a profile, go to landing
      return <Navigate to="/" replace />;
    }

    switch (userProfile.userType) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'authority':
        return <Navigate to="/authority" replace />;
      case 'citizen':
        return <Navigate to="/citizen" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<EnhancedAuthModal />} />
      <Route path="/home" element={<HomeRedirect />} />

      {/* Protected Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/authority" 
        element={
          <ProtectedRoute allowedRoles={['authority']}>
            <AuthorityDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/citizen" 
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <CitizenDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;