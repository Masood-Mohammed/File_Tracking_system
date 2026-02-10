import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactUs = () => {
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Contact Us</h1>
            <div className="card" style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Have questions or need assistance? Reach out to us through any of the following channels.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}>
                            <Mail size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email</h4>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: '1.1rem' }}>support@filetrack.gov.in</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '50%', color: '#166534' }}>
                            <Phone size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Phone</h4>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: '1.1rem' }}>+91 123-456-7890</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '50%', color: '#b45309' }}>
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Address</h4>
                            <p style={{ margin: 0, fontWeight: 500, fontSize: '1.1rem' }}>
                                District Collectorate Office,<br />
                                Vizianagaram, Andhra Pradesh - 535003
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
