import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            marginTop: 'auto',
            padding: '1.5rem',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.875rem'
        }}>
            <p>&copy; {new Date().getFullYear()} File Tracking System. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
