import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import DeletedGrievances from './pages/DeletedGrievances';

import Layout from './Layout';
import Registers from './pages/Registers';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Dashboard user={user} onLogout={handleLogout} />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />
        <Route
          path="/registers"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Registers user={user} />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />
        <Route
          path="/analytics"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Analytics />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />
        <Route
          path="/deleted-grievances"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <DeletedGrievances />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
