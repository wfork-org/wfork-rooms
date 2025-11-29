import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Video } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const createRoom = () => {
        const id = uuidv4();
        navigate(`/room/${id}`);
    };

    return (
        <div className="container">
            <div className="glass-card">
                <h1 style={{ marginBottom: '2rem' }}>Telemost Clone</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--secondary-text)' }}>
                    Free video meetings. No registration required.
                </p>
                <button className="btn" onClick={createRoom}>
                    <Video size={20} />
                    Create Video Meeting
                </button>
            </div>
        </div>
    );
};

export default Landing;
