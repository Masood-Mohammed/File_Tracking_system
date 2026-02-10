import React from 'react';
import { useNavigate } from 'react-router-dom';

import bg2 from '../assets/bg2.jpg';
import collectorImg from '../assets/collector.png';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* Hero Section */}
            <div className="hero-section" style={{
                backgroundImage: `url(${bg2})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '85vh',
                width: '100%',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '4rem',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)', // Dark overlay
                    zIndex: 1
                }}></div>

                <div className="hero-content" style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '0 1rem' }}>
                    <h1 style={{
                        fontWeight: '800',
                        marginBottom: '1rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '-0.025em'
                    }}>
                        File Tracking System
                    </h1>
                    <p style={{
                        maxWidth: '700px',
                        margin: '0 auto',
                        color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                        Streamlining administrative workflows and ensuring transparency, accountability, and timely request redressal.
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Collector Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: '700' }}>Collector and District Magistrate</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '4px solid var(--primary)',
                            padding: '4px',
                            background: 'white',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <img
                                src={collectorImg}
                                alt="District Collector"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Sri S RamSundar Reddy I.A.S.</h3>
                            <p style={{ color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>District Collector & Magistrate</p>
                        </div>
                    </div>
                </div>

                <div className="feature-grid-responsive">
                    <div
                        className="feature-card"
                        style={{ '--card-color': '#2563eb' }}
                        onClick={() => navigate('/dashboard')}
                    >
                        <h3 style={{ color: '#2563eb' }}>Dashboard</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Access your centralized file dashboard to track movements, manage pending actions, and oversee request resolutions.</p>
                        <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>Go to Dashboard</button>
                    </div>

                    <div
                        className="feature-card"
                        style={{ '--card-color': '#dc2626' }}
                        onClick={() => navigate('/registers')}
                    >
                        <h3 style={{ color: '#dc2626' }}>Registers</h3>
                        <p style={{ color: 'var(--text-muted)' }}>View comprehensive Inward and Outward registers to maintain detailed records of all file transactions.</p>
                        <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>View Registers</button>
                    </div>

                    <div
                        className="feature-card"
                        style={{
                            '--card-color': '#16a34a',
                        }}
                        onClick={() => navigate('/analytics')}
                    >
                        <h3 style={{ color: '#16a34a' }}>Analytics</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Visualize system performance with data-driven insights, charts, and reports to identify bottlenecks.</p>
                        <button className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>View Analytics</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
