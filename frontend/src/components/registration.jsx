import React, { useState, useEffect } from 'react';
import PasswordRecoveryModal from './PasswordRecoveryModal';
import './registration.css'; 

const AuthCard = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

   
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); 

   
    const [signupName, setSignupName] = useState('');
    const [signupPhone, setSignupPhone] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
    const [location, setLocation] = useState('');
    const [role, setRole] = useState('');
    const [crop, setCrop] = useState('');
    const [productionStage, setProductionStage] = useState('');

   
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation(`Lat: ${latitude}, Lon: ${longitude}`); 
                },
                (error) => {
                    console.error("Location error: ", error);
                    setLocation('Unable to detect location');
                }
            );
        }
    }, []);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) => password.length >= 6;

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (validateEmail(loginEmail) && validatePassword(loginPassword)) {
            setSuccessMessage('Login successful!');
            setTimeout(() => setSuccessMessage(''), 3000);
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', loginEmail);
            }
        }
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        if (
            validateEmail(signupEmail) &&
            validatePassword(signupPassword) &&
            signupPassword === signupConfirmPassword
        ) {
            setSuccessMessage('Signup successful!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="card-title">Welcome to AgroNexus</div>
                <div className="card-description">Empowering Agriculture, One Step at a Time</div>
            </div>
            <div className="tabs">
                <button
                    type="button"
                    className={`tab-link ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => setActiveTab('login')}
                >
                    Login
                </button>
                <button
                    type="button"
                    className={`tab-link ${activeTab === 'signup' ? 'active' : ''}`}
                    onClick={() => setActiveTab('signup')}
                >
                    Sign Up
                </button>
            </div>

            <div className="tab-container">
                {activeTab === 'login' && (
                    <div className="tab-content active" id="login">
                        <form onSubmit={handleLoginSubmit}>
                            <div className="form-group">
                                <label htmlFor="login-email">Email</label>
                                <input
                                    type="email"
                                    id="login-email"
                                    placeholder="Enter your email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="login-password">Password</label>
                                <input
                                    type="password"
                                    id="login-password"
                                    placeholder="Enter your password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group remember-me">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <label htmlFor="remember-me">Remember me</label>
                            </div>
                            <button type="submit" className="btn">Login</button>
                            {successMessage && <div className="success">{successMessage}</div>}
                        </form>
                    </div>
                )}

                {activeTab === 'signup' && (
                    <div className="tab-content active" id="signup">
                        <form onSubmit={handleSignupSubmit}>
                            <div className="form-group">
                                <label htmlFor="signup-name">Name</label>
                                <input
                                    type="text"
                                    id="signup-name"
                                    placeholder="Enter your name"
                                    value={signupName}
                                    onChange={(e) => setSignupName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="signup-phone"
                                    placeholder="Enter your phone number"
                                    value={signupPhone}
                                    onChange={(e) => setSignupPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-email">Email</label>
                                <input
                                    type="email"
                                    id="signup-email"
                                    placeholder="Enter your email"
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-location">Location</label>
                                <input
                                    type="text"
                                    id="signup-location"
                                    placeholder="Detecting location..."
                                    value={location}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-role">Role</label>
                                <select
                                    id="signup-role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Expert">Expert</option>
                                    <option value="Retailer">Retailer</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-crop">Crop</label>
                                <input
                                    type="text"
                                    id="signup-crop"
                                    placeholder="Enter the crop you work on"
                                    value={crop}
                                    onChange={(e) => setCrop(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-production-stage">Production Stage</label>
                                <select
                                    id="signup-production-stage"
                                    value={productionStage}
                                    onChange={(e) => setProductionStage(e.target.value)}
                                    required
                                >
                                    <option value="">Select Stage</option>
                                    <option value="Sowing">Sowing</option>
                                    <option value="Growing">Growing</option>
                                    <option value="Harvesting">Harvesting</option>
                                    <option value="Post-Harvest">Post-Harvest</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-password">Password</label>
                                <input
                                    type="password"
                                    id="signup-password"
                                    placeholder="Create a password"
                                    value={signupPassword}
                                    onChange={(e) => setSignupPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="signup-confirm-password">Confirm Password</label>
                                <input
                                    type="password"
                                    id="signup-confirm-password"
                                    placeholder="Confirm your password"
                                    value={signupConfirmPassword}
                                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn">Sign Up</button>
                            {successMessage && <div className="success">{successMessage}</div>}
                        </form>
                    </div>
                )}
            </div>
            {isModalOpen && <PasswordRecoveryModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default AuthCard;
