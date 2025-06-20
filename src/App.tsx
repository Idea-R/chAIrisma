import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ScanLook from './pages/ScanLook';
import LiveCoach from './pages/LiveCoach';
import Trends from './pages/Trends';
import Progress from './pages/Progress';

const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Protected route component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/scan" 
          element={
            <ProtectedRoute>
              <ScanLook />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/coach" 
          element={
            <ProtectedRoute>
              <LiveCoach />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/trends" 
          element={
            <ProtectedRoute>
              <Trends />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/progress" 
          element={
            <ProtectedRoute>
              <Progress />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;