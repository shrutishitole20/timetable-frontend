import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Timetabler AI Assistant. How can I help you today?", isUser: false }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');

        // Simulate AI Thinking
        setTimeout(() => {
            let responseText = "";
            const lowerInput = currentInput.toLowerCase();

            if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
                responseText = "Hi there! I can help you manage lectures, courses, and generate your timetable. What would you like to do?";
            } else if (lowerInput.includes("lecture")) {
                responseText = "To manage lectures, go to 'Lectures' and fill in the details. **Crucial:** Make sure to select a 'Course Name' so the generator knows which timetable it belongs to!";
            } else if (lowerInput.includes("generate") || lowerInput.includes("timetable")) {
                responseText = "Select your course in the 'Timetables' section and click 'Generate'. It will only use lectures that you've specifically assigned to that course.";
            } else if (lowerInput.includes("tutor")) {
                responseText = "The 'Tutors' section allows you to manage faculty members. You can search for specific tutors using the new search bar I added!";
            } else if (lowerInput.includes("room")) {
                responseText = "Use the 'Rooms' section to add or edit lecture halls. Make sure to set the correct capacity for each room.";
            } else {
                responseText = "That's a great question! I'm trained to help with your Timetabler system. Try asking about 'how to generate a timetable' or 'managing lectures'.";
            }

            setMessages(prev => [...prev, { text: responseText, isUser: false }]);
        }, 800);
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                    <span className="bot-icon">🤖</span>
                    <span className="bot-text">AI Assistant</span>
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="header-info">
                            <span className="bot-status">●</span>
                            <h4>Timetabler AI</h4>
                        </div>
                        <button className="close-bot" onClick={() => setIsOpen(false)}>&times;</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                                <div className="message-content">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
