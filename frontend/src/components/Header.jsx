import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Header = ({ user, onLogout }) => {
    return (
        <header style={{
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)', margin: 0 }}>
                    FileTrack
                </h1>
                <nav style={{ display: 'flex', gap: '1rem' }}>
                    <NavLink
                        to="/dashboard"
                        style={({ isActive }) => ({
                            textDecoration: 'none',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: isActive ? '600' : '500',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            background: isActive ? '#eff6ff' : 'transparent'
                        })}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/registers"
                        style={({ isActive }) => ({
                            textDecoration: 'none',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: isActive ? '600' : '500',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            background: isActive ? '#eff6ff' : 'transparent'
                        })}
                    >
                        Registers
                    </NavLink>
                </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                        <div style={{ background: '#f1f5f9', padding: '0.4rem', borderRadius: '50%' }}>
                            <User size={18} />
                        </div>
                        <span style={{ fontWeight: 500 }}>{user.username} ({user.role})</span>
                    </div>
                )}
                <button
                    onClick={onLogout}
                    className="btn"
                    style={{ background: '#fef2f2', color: '#dc2626', padding: '0.5rem', display: 'flex' }}
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
};

export default Header;
