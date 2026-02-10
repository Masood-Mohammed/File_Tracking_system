import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            marginTop: 'auto',
            padding: '1rem',
            background: 'var(--primary)',
            borderTop: '1px solid var(--primary)',
            textAlign: 'center',
            color: 'white',
            fontSize: '0.875rem'
        }}>
            <p>
                Developed by <strong>Mohammed Masoodulla Shariff</strong> and <strong>Sanapathi Rishitha Reddy</strong><br />
                Under the guidance of <strong>Dr. G. Jaya Suma</strong>
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.9rem' }}>
                <a href="/about-us" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>About Us</a>
                <span style={{ opacity: 0.5 }}>|</span>
                <a href="/contact-us" style={{ color: 'white', textDecoration: 'none', opacity: 0.9 }}>Contact Us</a>
            </div>
        </footer>
    );
};

export default Footer;
