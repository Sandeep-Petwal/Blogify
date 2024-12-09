/* eslint-disable react/prop-types */
import { IoSend } from "react-icons/io5";
import { useRef, useEffect } from 'react';

function MessageInput({ message, setMessage, onSendMessage, onStartTyping, onStopTyping }) {
    const typingTimeoutRef = useRef(null);
    const wasTypingRef = useRef(false);

    const handleInputChange = (e) => {
        setMessage(e.target.value);
        
        // Handle typing start
        if (!wasTypingRef.current) {
            onStartTyping();
            wasTypingRef.current = true;
        }
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Set new timeout for typing detection
        typingTimeoutRef.current = setTimeout(() => {
            wasTypingRef.current = false;
            onStopTyping();
        }, 1000);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSendMessage();
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="p-4 bg-gray-800 border-t border-gray-700 flex">
            <input
                type="text"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 p-2 bg-gray-900 text-white rounded-lg outline-none"
            />
            <button onClick={onSendMessage} className="ml-2 text-blue-400">
                <IoSend size={24} />
            </button>
        </div>
    );
}

export default MessageInput;