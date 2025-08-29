import React from 'react';
import AuthoritySidebar from './components/AuthoritySidebar';
import { Outlet } from 'react-router-dom';

const AuthorityDashboardLayout = ({ authorityType }) => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* You can add AuthorityNavbar here if needed */}
            <div className="flex flex-grow">
                <AuthoritySidebar authorityType={authorityType} />
                <main className="flex-grow bg-gray-50 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AuthorityDashboardLayout;
