

import React, { useState } from 'react';
import './PasswordRecoveryModal.css'; 

const PasswordRecoveryModal = ({ onClose }) => {
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleRecoverySubmit = (e) => {
        e.preventDefault();
        if (validateEmail(recoveryEmail)) {
            setSuccessMessage('Recovery email sent!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Password Recovery</h2>
                <form id="password-recovery-form" onSubmit={handleRecoverySubmit}>
                    <div className="form-group">
                        <label htmlFor="recovery-email">Email</label>
                        <input
                            type="email"
                            id="recovery-email"
                            placeholder="Enter your email"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn">Send Recovery Email</button>
                    {successMessage && <div className="success">{successMessage}</div>}
                </form>
            </div>
        </div>
    );
};

export default PasswordRecoveryModal;
