import React, { useState } from 'react';
import './FAQ.css'; 

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: 'What is AgroNexus?',
            answer: 'AgroNexus is a platform to connect farmers with agricultural experts, markets, and tools for better farming solutions.'
        },
        {
            question: 'How can I use Agro Connect?',
            answer: 'Agro Connect allows you to interact with experts, fellow farmers, and customers through our easy-to-use interface.'
        },
        {
            question: 'Is the platform free to use?',
            answer: 'Yes, AgroNexus is completely free for farmers and experts to connect and collaborate.'
        },
        {
            question: 'What tools are available in Agro Tools?',
            answer: 'Agro Tools provides you with a variety of advanced tools that can help you enhance your farming techniques.'
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-container">
                {faqs.map((faq, index) => (
                    <div 
                        className={`faq ${activeIndex === index ? 'active' : ''}`} 
                        key={index}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="faq-question">
                            {faq.question}
                        </div>
                        {activeIndex === index && (
                            <div className="faq-answer">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
