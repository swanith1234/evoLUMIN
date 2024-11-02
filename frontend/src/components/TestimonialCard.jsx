// src/components/TestimonialCard.jsx
import React from 'react';
import './TestimonialCard.css'; 

const TestimonialCard = ({ photo, name, text }) => {
    return (
        <div className="testimonial-card">
            <img src={photo} alt={name} className="testimonial-photo" />
            <h3 className="testimonial-name">{name}</h3>
            <p className="testimonial-text">{text}</p>
        </div>
    );
};

export default TestimonialCard;
