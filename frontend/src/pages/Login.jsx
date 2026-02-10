import React, { useState } from 'react';
import { login, setupUsers } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            setUser(data.user);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    const handleSetup = async () => {
        await setupUsers();
        alert('Demo users created! Try logging in as collector/password');
    }

    return (
        <div className="auth-container" style={{ padding: '1rem' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Request System Login</h2>
                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input value={username} onChange={e => setUsername(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <button onClick={handleSetup} style={{ background: 'none', color: 'var(--primary)', textDecoration: 'underline' }}>
                        Initialize Demo Users
                    </button>
                </div>
            </div>
        </div>
    );
}
