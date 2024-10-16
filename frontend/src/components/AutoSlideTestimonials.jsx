import React, { useState, useEffect } from 'react';
import './AutoSlideTestimonials.css';

const testimonials = [
    {
        name: "John Doe",
        text: "This platform has changed my farming experience for the better! Highly recommended!",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Jane Smith",
        text: "The tools available here are top-notch! My yield has significantly increased.",
        photo: "https://plus.unsplash.com/premium_photo-1682089897177-4dbc85aa672f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://plus.unsplash.com/premium_photo-1726873351723-cb980a1d6dcb?q=80&w=2804&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://plus.unsplash.com/premium_photo-1682092096832-7990b9bc6b9f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://plus.unsplash.com/premium_photo-1663025440660-a322c5a9d2a6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://images.unsplash.com/photo-1541752171745-4176eee47556?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://images.unsplash.com/photo-1616002851413-ebcc9611139d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHJhbmRvbSUyMGluZGlhbiUyMGZhcm1lciUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://plus.unsplash.com/premium_photo-1682089849389-5edb734abd48?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://plus.unsplash.com/premium_photo-1718570253383-68418c73ac60?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://plus.unsplash.com/premium_photo-1722682239201-21c8173e776b?q=80&w=2886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://images.unsplash.com/photo-1487069838269-7c05365b400b?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://plus.unsplash.com/premium_photo-1682092610151-f91e1afa5f60?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://plus.unsplash.com/premium_photo-1682092671769-f1a7f45982cc?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        name: "Alice Green",
        text: "Connecting with other farmers through AgroNexus has helped me share and learn new techniques!",
        photo: "https://images.unsplash.com/photo-1484328861630-cf73b7d34ea3?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    // Add more testimonials here
];

const AutoSlideTestimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000); // Autoslide every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="auto-slide-container">
            <button className="slide-button left" onClick={prevSlide}>
                &#10094;
            </button>

            <div
                className="auto-slide-wrapper"
                style={{
                    transform: `translateX(-${currentIndex * 300}px)` // Slide effect
                }}
            >
                {testimonials.map((testimonial, index) => (
                    <div className="testimonial-card" key={index}>
                        <img
                            src={testimonial.photo}
                            alt={`${testimonial.name}'s photo`}
                        />
                        <h3>{testimonial.name}</h3>
                        <p>{testimonial.text}</p>
                    </div>
                ))}
            </div>

            <button className="slide-button right" onClick={nextSlide}>
                &#10095;
            </button>
        </div>
    );
};

export default AutoSlideTestimonials;
