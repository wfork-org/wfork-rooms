import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Video, Shield, Zap, Globe } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const createRoom = () => {
        const id = uuidv4();
        navigate(`/room/${id}`);
    };

    return (
        <div className="container">
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
                        <Video size={48} color="#60a5fa" />
                    </div>
                </div>
                <h1>Telemost Clone</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--secondary-text)' }}>
                    Secure, high-quality video conferencing for everyone. <br />
                    No registration required. Just click and meet.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
                    <Feature icon={<Shield size={20} />} text="Secure" />
                    <Feature icon={<Zap size={20} />} text="Fast" />
                    <Feature icon={<Globe size={20} />} text="Global" />
                </div>

                <button className="btn" onClick={createRoom} style={{ width: '100%', justifyContent: 'center' }}>
                    <Video size={20} />
                    Start Instant Meeting
                </button>
            </div>
        </div>
    );
};

const Feature = ({ icon, text }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary-text)' }}>
        {icon}
        <span style={{ fontSize: '0.9rem' }}>{text}</span>
    </div>
);

export default Landing;
