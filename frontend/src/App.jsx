import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AgroConnect from './components/AgroConnect';
import AgroMarket from './components/AgroMarket';
import BrowseWebsites from './components/BrowseWebsites';
import AgroTools from './components/AgroTools';
import ToolDetails from './components/ToolDetails'; // Import ToolDetails
import GetStartedButton from './components/GetStartedButton';
import AuthCard from './components/registration';
import AutoSlideTestimonials from './components/AutoSlideTestimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import './App.css';

export default function App() {
    return (
        <Router>
            <div className="app-container">
                {/* Navigation Bar */}
                <Navbar /> {/* Navbar appears on every page */}

                {/* Routes for different pages */}
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <>
                                {/* Hero Section */}
                                <header className="header">
                                    <h1 className="header-title">Welcome to AgroNexus</h1>
                                    <div className="get-started">
                                        <Link to="/auth">
                                            <GetStartedButton />
                                        </Link>
                                    </div>
                                </header>

                                {/* Section 2: Agro Connect */}
                                <section className="section agro-connect">
                                    <div className="section-content">
                                        <div className="text-left">
                                            <h2>Agro Connect</h2>
                                            <p>Agro Connect is your gateway to connecting with experts, fellow farmers, and customers.</p>
                                        </div>
                                        <div className="video-right">
                                            <video controls>
                                                <source src="/path/to/video1.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3: Digital Tools */}
                                <section className="section digital-tools">
                                    <div className="section-content">
                                        <div className="video-left">
                                            <video controls>
                                                <source src="/path/to/video2.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div className="text-right">
                                            <h2>Digital Tools</h2>
                                            <p>Explore the latest digital tools that can help boost your agricultural productivity.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 4: Agro Tools */}
                                <section className="section agro-tools">
                                    <div className="section-content">
                                        <div className="text-left">
                                            <h2>Agro Tools</h2>
                                            <p>Find the right tools for your farm. Modernize your farming techniques with advanced tools.</p>
                                        </div>
                                        <div className="video-right">
                                            <video controls>
                                                <source src="/path/to/video3.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div className="agro-tools-link">
                                            <Link to="/agro-tools" className="view-agro-tools">Explore Agro Tools</Link>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 5: Agri Market */}
                                <section className="section agri-market">
                                    <div className="section-content">
                                        <div className="video-left">
                                            <video controls>
                                                <source src="/path/to/video4.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div className="text-right">
                                            <h2>Agri Market</h2>
                                            <p>Discover the best places to sell your produce at competitive prices.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Auto-Slide Testimonials Section */}
                                <section className="testimonials-section">
                                    <h2>What Our Users Say</h2>
                                    <AutoSlideTestimonials />
                                </section>

                                {/* FAQ Section */}
                                <section className="faq-section">
                                    <FAQ />
                                </section>
                            </>
                        } 
                    />
                    
                    {/* Other routes */}
                    <Route path="/auth" element={<AuthCard />} />
                    <Route path="/agro-connect" element={<AgroConnect />} />
                    <Route path="/agro-market" element={<AgroMarket />} />
                    <Route path="/browse-websites" element={<BrowseWebsites />} />
                    <Route path="/agro-tools" element={<AgroTools />} /> {/* AgroTools page */}
                    <Route path="/tool/:id" element={<ToolDetails />} /> {/* ToolDetails page */}
                </Routes>

                {/* Footer Section */}
                <Footer /> {/* Footer appears on every page */}
            </div>
        </Router>
    );
}
