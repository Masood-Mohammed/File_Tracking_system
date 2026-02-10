import React from 'react';

const AboutUs = () => {
    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>About Us</h1>
            <div className="card" style={{ padding: '2rem', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '1rem' }}>
                    The <strong>Collector Office Vizianagaram</strong> is the principal administrative authority of Vizianagaram District, functioning under the Government of Andhra Pradesh. The office plays a vital role in implementing government policies, maintaining law and order, and ensuring effective delivery of public services to citizens.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                    The Collector Office coordinates with various departments to manage revenue administration, land records, elections, disaster management, social welfare schemes, and development programs. With a strong focus on transparency, accountability, and citizen-centric governance, the office strives to address public requests efficiently and promote inclusive growth across the district.
                </p>
                <p>
                    Leveraging digital initiatives and e-governance solutions, the Collector Office Vizianagaram aims to simplify administrative processes, improve service accessibility, and enhance communication between the government and the public. Our mission is to work with integrity and dedication to improve the quality of life for the people of Vizianagaram District.
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
