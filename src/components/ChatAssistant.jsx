import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import axios from "axios";

const ChatAssistant = () => {
    const [open, setOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "🙏 Namaste! How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const chatEndRef = useRef(null); // For auto-scroll
    let idleTimer = null;

    const webhookUrl =
        "http://localhost:5678/webhook/9a2e8d22-f066-46b0-810e-b85b54b45b60";

    // Auto scroll when messages change
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, typing]);

    // Reset idle timer when user does something
    const resetIdle = () => {
        if (idleTimer) clearTimeout(idleTimer);

        idleTimer = setTimeout(() => {
            if (!open) {
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 4000);
            }
        }, 5000);
    };

    useEffect(() => {
        const events = ["mousemove", "keydown", "scroll", "click"];
        events.forEach((event) => window.addEventListener(event, resetIdle));
        resetIdle();

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, resetIdle)
            );
            if (idleTimer) clearTimeout(idleTimer);
        };
    }, [open]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setTyping(true);

        try {
            const res = await axios.post(webhookUrl, { message: input });
            const data = res.data;

            const botMessage = {
                sender: "bot",
                text:
                    data.output ||
                    data.reply ||
                    data.message ||
                    data.text ||
                    data.response ||
                    "Got your request.",
                structured: data.structured || null,
            };

            setTimeout(() => {
                setMessages((prev) => [...prev, botMessage]);
                setTyping(false);
            }, Math.min(1000 + botMessage.text.length * 20, 2500));
        } catch (err) {
            console.error("Webhook error:", err);
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: "Kripaya feri try garnuhos." },
                ]);
                setTyping(false);
            }, 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Popup bubble */}
            {showPopup && !open && (
                <div className="mb-2 bg-white border px-3 py-2 rounded-lg shadow-lg text-sm text-gray-700 animate-bounce relative">
                    Need any help?
                    <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-l border-b rotate-45"></div>
                </div>
            )}

            {/* Chat Toggle */}
            {!open ? (
                <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
                >
                    <FaComments size={24} />
                </button>
            ) : (
                <div className="w-80 h-96 bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col animate-fadeIn">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                        <h3 className="text-lg font-semibold">AI Assistant</h3>
                        <button onClick={() => setOpen(false)}>
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700 space-y-3">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.sender === "user"
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`p-2 rounded-lg max-w-[75%] ${msg.sender === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-black"
                                        }`}
                                >
                                    {msg.text}
                                    {msg.structured && (
                                        <div className="mt-2 text-xs bg-gray-200 p-2 rounded">
                                            <div>
                                                <strong>Category:</strong>{" "}
                                                {msg.structured.category}
                                            </div>
                                            <div>
                                                <strong>Urgency:</strong>{" "}
                                                {msg.structured.urgency}
                                            </div>
                                            <div>
                                                <strong>Authority:</strong>{" "}
                                                {msg.structured.assignedAuthority}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {typing && (
                            <div className="flex justify-start">
                                <div className="p-2 rounded-lg bg-gray-200 text-gray-600 animate-pulse">
                                    Typing...
                                </div>
                            </div>
                        )}
                        {/* Dummy div for auto scroll */}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none"
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <FaPaperPlane size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatAssistant;
