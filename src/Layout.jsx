// src/Layout.jsx
import React from "react";
// import Navbar from "./components/Nav"; // Comment out
// import Footer from "./components/Footer"; // Comment out
// import ChatAssistant from "./components/ChatAssistant"; // Comment out


const Layout = ({ children }) => {
    return (
        <div style={{ backgroundColor: 'lightblue', padding: '20px', border: '2px solid blue' }}>
            <h1>Layout Test - Stripped Down!</h1>
            <p>If you see this, the problem is in Navbar, Footer, or ChatAssistant.</p>
            <div style={{ border: '1px dashed gray', padding: '10px', marginTop: '10px' }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
