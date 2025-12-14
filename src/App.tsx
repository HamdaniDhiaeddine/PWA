import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AnimalsList } from './pages/AnimalsList';
import { AddEditAnimal } from './pages/AddEditAnimal';
import { AnimalDetails } from './pages/AnimalDetails';
import { CareManagement } from './pages/CareManagement';
import { Settings } from './pages/Settings';
import { OfflineBanner } from './components/OfflineBanner';
import { initializeMockData } from './utils/offlineStorage';
export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    // Initialize offline storage with mock data
    initializeMockData();
  }, []);
  return <BrowserRouter>
      <OfflineBanner />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={() => setIsAuthenticated(true)} />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/animals" element={isAuthenticated ? <AnimalsList /> : <Navigate to="/login" />} />
        <Route path="/animals/add" element={isAuthenticated ? <AddEditAnimal /> : <Navigate to="/login" />} />
        <Route path="/animals/:id" element={isAuthenticated ? <AnimalDetails /> : <Navigate to="/login" />} />
        <Route path="/animals/:id/edit" element={isAuthenticated ? <AddEditAnimal /> : <Navigate to="/login" />} />
        <Route path="/care/add" element={isAuthenticated ? <CareManagement /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>;
}