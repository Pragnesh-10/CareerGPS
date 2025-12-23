
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm your AI Career Assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        const newUserMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');

        // Simulate AI response
        setTimeout(() => {
            const botResponses = [
                "That's an interesting question! Based on your profile, I'd suggest focusing on Python and React.",
                "To advance your career, consider connecting with mentors in the 'Experts' section.",
                "Your progress looks great! Keep up the good work on the Data Science track.",
                "I can help you prepare for interviews. Would you like some mock questions?",
                "Have you checked out the latest industry trends in the Dashboard?"
            ];
            const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

            const newBotMessage = {
                id: messages.length + 2,
                text: randomResponse,
                sender: 'bot'
            };
            setMessages(prev => [...prev, newBotMessage]);
        }, 1000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="chatbot-wrapper">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-title">
                            <Sparkles size={18} />
                            <span>AI Assistant</span>
                        </div>
                        <button onClick={toggleChat} className="chatbot-close-btn">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.sender === 'user' ? 'message-user' : 'message-bot'}`}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input-area">
                        <input
                            type="text"
                            placeholder="Ask anything..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="chatbot-input"
                        />
                        <button onClick={handleSendMessage} className="chatbot-send-btn">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            <button onClick={toggleChat} className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}>
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
};

export default Chatbot;
