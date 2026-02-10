import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import DeletedRequests from './pages/DeletedRequests';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

import Layout from './Layout';
import Registers from './pages/Registers';

import HomePage from './pages/HomePage';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/home" />}
        />
        <Route
          path="/home"
          element={
            <Layout user={user} onLogout={handleLogout} fullWidth={true}>
              <HomePage />
            </Layout>
          }
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
          path="/deleted-requests"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <DeletedRequests />
              </Layout>
            ) : <Navigate to="/login" />
          }
        />
        <Route
          path="/about-us"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <AboutUs />
            </Layout>
          }
        />
        <Route
          path="/contact-us"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <ContactUs />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
