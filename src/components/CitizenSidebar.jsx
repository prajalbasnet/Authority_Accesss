import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaEdit, FaListAlt, FaBullhorn } from 'react-icons/fa'; // Importing icons

const CitizenSidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: FaHome, path: '/citizen' },
        { name: 'File Complaint', icon: FaEdit, path: '/citizen/file-complaint' }, // CitizenPage is the complaint form
        { name: 'My Complaints', icon: FaListAlt, path: '/citizen/my-complaints' },
        { name: 'Complaint Feed', icon: FaBullhorn, path: '/citizen/complaint-feed' },
    ];

    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col p-6 min-h-screen shadow-lg">
            <div className="text-3xl font-extrabold mb-8 text-red-500 text-center">
                Citizen Hub
            </div>
            <nav className="flex-grow">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name} className="mb-3">
                            <Link
                                to={item.path}
                                className={`flex items-center p-3 rounded-lg text-lg font-medium transition-all duration-200
                                    ${location.pathname === item.path || (item.path === '/citizen' && location.pathname === '/citizen')
                                        ? 'bg-blue-700 text-white shadow-md'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                <item.icon className="mr-4 text-xl" />
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-auto pt-6 border-t border-gray-700 text-sm text-gray-400 text-center">
                &copy; 2025 Authority Access
            </div>
        </div>
    );
};

export default CitizenSidebar;
