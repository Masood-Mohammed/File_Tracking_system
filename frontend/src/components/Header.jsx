import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LogOut, User, Menu, X } from 'lucide-react';

import logo from '../assets/logo.png';
import apLogo from '../assets/ap.png';

const Header = ({ user, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header style={{
            background: 'var(--primary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div className="container header-wrapper">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                    <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        <img src={logo} alt="JNTUGV Logo" style={{ height: '50px', objectFit: 'contain' }} />
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '-0.025em' }}>
                            FileTrack<span style={{ color: 'white' }}>.gov</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    {user && (
                        <nav className="nav-desktop">
                            <NavLink
                                to="/home"
                                className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/registers"
                                className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
                            >
                                Registers
                            </NavLink>
                            <NavLink
                                to="/analytics"
                                className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
                            >
                                Analytics
                            </NavLink>
                        </nav>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {user ? (
                        <>
                            <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontSize: '0.9rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid #e2e8f0' }}>
                                <User size={16} className="text-muted" />
                                <span style={{ fontWeight: 600 }}>
                                    {user.username.toLowerCase() === 'collector' ? 'District Collector' : user.username}
                                    <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({user.role})</span>
                                </span>
                            </div>
                            <button
                                onClick={onLogout}
                                className="btn"
                                style={{ border: '1px solid #fee2e2', color: '#dc2626', background: '#fff' }}
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <NavLink to="/login" className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 600 }}>Login</NavLink>
                    )}

                    {user && (
                        <img src={apLogo} alt="AP Govt Logo" style={{ height: '50px', objectFit: 'contain' }} />
                    )}

                    {/* Mobile Menu Toggle */}
                    {user && (
                        <button className="nav-mobile-toggle" onClick={toggleMobileMenu}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`nav-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <NavLink
                    to="/home"
                    className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/registers"
                    className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                >
                    Registers
                </NavLink>
                <NavLink
                    to="/analytics"
                    className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                >
                    Analytics
                </NavLink>
                {user && (
                    <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'white', marginTop: '0.5rem' }}>
                        <span style={{ fontWeight: 600, display: 'block' }}>
                            {user.username.toLowerCase() === 'collector' ? 'District Collector' : user.username}
                        </span>
                        <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{user.role}</span>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
