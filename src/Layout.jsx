// src/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Nav";
import Footer from "./components/Footer";
import ChatAssistant from "./components/ChatAssistant";


const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <ChatAssistant />
            <Footer />
        </div>
    );
};

export default Layout;
