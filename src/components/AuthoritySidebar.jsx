
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaListAlt, FaBullhorn, FaUsers } from 'react-icons/fa';

const AuthoritySidebar = () => {
    const location = useLocation();
    const navItems = [
        { name: 'Complaints', icon: FaListAlt, path: '/authority/complaints' },
        { name: 'Broadcast Feed', icon: FaBullhorn, path: '/authority/broadcast-feed' },
        { name: 'Group Chat', icon: FaUsers, path: '/authority/group-chat' },
    ];

    // Get authority name from localStorage
    let authorityName = 'Authority';
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.fullName) authorityName = user.fullName.split(' ')[0];
    } catch {}

    return (
        <aside
            className="w-72 min-h-screen flex flex-col py-8 px-6 bg-white/20 backdrop-blur-2xl shadow-2xl border-r border-blue-900 relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(30,64,175,0.93) 100%)',
                boxShadow: '0 8px 32px 0 rgba(15,23,42,0.45)',
            }}
        >
            {/* Glassy gradient accent */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600/60 to-blue-400/30 blur-2xl opacity-60 pointer-events-none z-0" />
            {/* Profile Section */}
            <div className="relative z-10 flex flex-col items-center mb-10">
                <span className="text-lg font-bold text-blue-50 tracking-wide drop-shadow-lg mt-2">Welcome, <span className="font-extrabold text-blue-100">{authorityName}</span>!</span>
            </div>
            {/* Navigation */}
            <nav className="flex-grow relative z-10">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                        return (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-4 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-300 shadow-sm
                                        ${isActive
                                            ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-xl scale-105 ring-2 ring-blue-400/80 border border-blue-400/80'
                                            : 'text-blue-100/90 hover:bg-blue-800/90 hover:text-white hover:scale-105'}
                                    `}
                                    style={isActive ? {
                                        boxShadow: '0 6px 32px 0 rgba(30,64,175,0.35)',
                                        border: '2px solid #2563eb',
                                    } : {}}
                                >
                                    <item.icon className={`text-2xl ${isActive ? 'drop-shadow-glow' : ''}`} />
                                    <span className="tracking-wide">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            {/* Footer */}
            <div className="mt-auto pt-8 border-t border-blue-200 text-xs text-blue-300 text-center tracking-wide relative z-10">
                &copy; 2025 Authority Access
            </div>
            {/* Glow effect */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-60 h-24 bg-blue-400/30 blur-3xl rounded-full opacity-60 z-0" />
        </aside>
    );
};

export default AuthoritySidebar;
