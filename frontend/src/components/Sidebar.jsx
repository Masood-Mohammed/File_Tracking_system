import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, FileText, BarChart2, Trash2 } from 'lucide-react'; // Added Trash2 for DeletedRequests if needed, or just the main ones

const Sidebar = ({ user, isOpen, onClose }) => {
    // Only show sidebar if user is logged in? The request implies it ("home, Dashboard..."). 
    // If not logged in, usually we just show Login page which uses Layout?
    // The Layout handles `user` prop.
    // If user is null, we might not want to show the sidebar or show a limited one.
    // The previous Header only showed nav if user existed.

    if (!user) return null;

    const navItems = [
        { name: 'Home', path: '/home', icon: <Home size={20} /> },
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Registers', path: '/registers', icon: <FileText size={20} /> },
        { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    ];

    return (
        <aside style={{
            width: isOpen ? '250px' : '0',
            backgroundColor: '#fff',
            borderRight: isOpen ? '1px solid var(--border-color)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            padding: isOpen ? '1.5rem 1rem' : '0',
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            opacity: isOpen ? 1 : 0
        }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            textDecoration: 'none',
                            color: isActive ? 'white' : '#64748b',
                            backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'all 0.2s ease'
                        })}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
