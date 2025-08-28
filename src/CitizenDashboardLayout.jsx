import React from 'react';
import CitizenNavbar from './components/CitizenNavbar';
import CitizenSidebar from './components/CitizenSidebar';
import { Outlet } from 'react-router-dom';

const CitizenDashboardLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <CitizenNavbar />
            <div className="flex flex-grow">
                <CitizenSidebar />
                <main className="flex-grow bg-gray-50 p-4">
                    <Outlet /> {/* This is where nested routes will render */}
                </main>
            </div>
        </div>
    );
};

export default CitizenDashboardLayout;
