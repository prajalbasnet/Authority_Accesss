// src/UserLayout.jsx
import React from "react";
import UserNavbar from "./components/UserNavbar";

const UserLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <UserNavbar />
            <main className="flex-grow bg-gray-50 p-4">{children}</main>
        </div>
    );
};

export default UserLayout;
