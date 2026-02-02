import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const Layout = ({ children, user, onLogout }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header user={user} onLogout={onLogout} />
            <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
