// src/Layout.jsx
import React from "react";
import Navbar from "./components/Nav";
import Footer from "./components/Footer";
import ChatAssistant from "./components/ChatAssistant"; // add this import

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />

            {/* Floating AI Chat Assistant */}
            <ChatAssistant />
        </div>
    );
};

export default Layout;
