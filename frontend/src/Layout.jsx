import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import Sidebar from './components/Sidebar';

const Layout = ({ children, user, onLogout, fullWidth = false }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {user && <Sidebar user={user} isOpen={isSidebarOpen} />}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100%' }}>
                <Header user={user} onLogout={onLogout} onToggleSidebar={toggleSidebar} />
                <main style={fullWidth ?
                    { flex: 1, width: '100%', boxSizing: 'border-box', padding: 0 } :
                    { flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }
                }>
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
