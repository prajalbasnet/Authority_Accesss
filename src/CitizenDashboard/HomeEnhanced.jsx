import React, { useState, useEffect } from "react";
import Navbar from "../components/Nav";
import { Link } from "react-router-dom";
import { FaFileAlt, FaClipboardList, FaGlobe, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaExclamationCircle, FaHistory, FaBullhorn } from 'react-icons/fa';

const HomeEnhanced = () => {
    const [complaintStats, setComplaintStats] = useState({
        new: 0,
        pending: 0,
        solved: 0,
        escalated: 0,
    });
    const [loadingStats, setLoadingStats] = useState(true);
    const [errorStats, setErrorStats] = useState(null);

    const [recentActivity, setRecentActivity] = useState([]);
    const [loadingActivity, setLoadingActivity] = useState(true);
    const [errorActivity, setErrorActivity] = useState(null);

    const [showNavbar, setShowNavbar] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowNavbar(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchComplaintStats = async () => {
            try {
                const API = import.meta.env.VITE_API_BASE_URL || "";
                const response = await fetch(`${API}/api/user/complaint-stats`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setComplaintStats(data);
            } catch (err) {
                setErrorStats(err);
            } finally {
                setLoadingStats(false);
            }
        };

        const fetchRecentActivity = async () => {
            try {
                const API = import.meta.env.VITE_API_BASE_URL || "";
                
                // Fetch user's recent complaints
                const myComplaintsResponse = await fetch(`${API}/api/user/complaints?limit=3`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });
                if (!myComplaintsResponse.ok) {
                    throw new Error(`HTTP error! status: ${myComplaintsResponse.status}`);
                }
                const myComplaintsData = await myComplaintsResponse.json();

                // Fetch recent public broadcasts
                const publicFeedResponse = await fetch(`${API}/api/public-feed?limit=3`);
                if (!publicFeedResponse.ok) {
                    throw new Error(`HTTP error! status: ${publicFeedResponse.status}`);
                }
                const publicFeedData = await publicFeedResponse.json();

                // Combine and sort by date
                const combinedActivity = [
                    ...myComplaintsData.map(c => ({ ...c, type: 'my-complaint', displayDate: c.dateFiled })),
                    ...publicFeedData.map(f => ({ ...f, type: 'broadcast', displayDate: f.date || f.dateFiled }))
                ].sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate)).slice(0, 5);

                setRecentActivity(combinedActivity);
            } catch (err) {
                setErrorActivity(err);
            } finally {
                setLoadingActivity(false);
            }
        };

        fetchComplaintStats();
        fetchRecentActivity();
    }, []);

    return (
        <>
            {showNavbar && <Navbar />}
            <div className="min-h-screen bg-gradient-primary font-inter">
                {/* Hero Section with Enhanced Typography */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
                    <div className="relative z-10 px-6 pt-16 pb-20">
                        <div className="max-w-6xl mx-auto text-center">
                            <h1 className="heading-primary text-6xl md:text-7xl lg:text-8xl font-black mb-6 text-white text-shadow-lg animate-fade-in-up">
                                <span className="block">Welcome to Your</span>
                                <span className="gradient-text-fire block mt-2">Citizen Dashboard</span>
                            </h1>
                            <p className="text-body text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed text-shadow-md animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                                Your powerful hub for managing complaints, staying informed about community issues, and connecting directly with authorities for faster resolutions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 px-6 pb-16 -mt-10">
                    <div className="max-w-7xl mx-auto">
                        {/* Complaint Statistics with Modern Cards */}
                        <div className="card-modern p-8 mb-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                            <h2 className="heading-secondary text-4xl md:text-5xl font-bold mb-8 text-gray-800 text-center">
                                Your Complaint <span className="gradient-text">Overview</span>
                            </h2>
                            {loadingStats ? (
                                <div className="text-center">
                                    <div className="animate-pulse-gentle text-primary-600 text-xl font-medium">Loading statistics...</div>
                                </div>
                            ) : errorStats ? (
                                <div className="text-center">
                                    <div className="text-danger-600 text-xl font-medium">Error loading stats: {errorStats.message}</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="group card-modern p-6 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-primary-50 to-primary-100 border-l-4 border-primary-500">
                                        <FaFileAlt className="text-5xl text-primary-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                                        <p className="text-4xl font-black text-primary-800 mb-2">{complaintStats.new}</p>
                                        <p className="text-gray-700 font-medium">New Complaints</p>
                                    </div>
                                    <div className="group card-modern p-6 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-warning-50 to-warning-100 border-l-4 border-warning-500">
                                        <FaHourglassHalf className="text-5xl text-warning-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                                        <p className="text-4xl font-black text-warning-800 mb-2">{complaintStats.pending}</p>
                                        <p className="text-gray-700 font-medium">Pending Complaints</p>
                                    </div>
                                    <div className="group card-modern p-6 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-success-50 to-success-100 border-l-4 border-success-500">
                                        <FaCheckCircle className="text-5xl text-success-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                                        <p className="text-4xl font-black text-success-800 mb-2">{complaintStats.solved}</p>
                                        <p className="text-gray-700 font-medium">Solved Complaints</p>
                                    </div>
                                    <div className="group card-modern p-6 text-center hover:scale-105 transition-all duration-300 bg-gradient-to-br from-danger-50 to-danger-100 border-l-4 border-danger-500">
                                        <FaExclamationCircle className="text-5xl text-danger-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                                        <p className="text-4xl font-black text-danger-800 mb-2">{complaintStats.escalated}</p>
                                        <p className="text-gray-700 font-medium">Escalated Complaints</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions with Enhanced Design */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {/* File Complaint Card */}
                            <div className="group card-modern p-8 text-center bg-gradient-to-br from-danger-500 to-danger-600 text-white hover:from-danger-600 hover:to-danger-700 animate-fade-in-up relative overflow-hidden" style={{animationDelay: '0.6s'}}>
                                <div className="absolute inset-0 bg-gradient-glass rounded-3xl opacity-30"></div>
                                <div className="relative z-10">
                                    <FaFileAlt className="text-7xl mb-6 mx-auto group-hover:animate-bounce-gentle" />
                                    <h2 className="heading-secondary text-3xl font-bold mb-4">File New Complaint</h2>
                                    <p className="text-white/90 mb-8 text-lg leading-relaxed">Report issues quickly with detailed information to get faster responses from authorities.</p>
                                    <Link 
                                        to="/citizen/file-complaint" 
                                        className="inline-block bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 shadow-glass border border-white/30 hover:scale-105"
                                    >
                                        Start Complaint
                                    </Link>
                                </div>
                            </div>

                            {/* My Complaints Card */}
                            <div className="group card-modern p-8 text-center bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 animate-fade-in-up relative overflow-hidden" style={{animationDelay: '0.8s'}}>
                                <div className="absolute inset-0 bg-gradient-glass rounded-3xl opacity-30"></div>
                                <div className="relative z-10">
                                    <FaClipboardList className="text-7xl mb-6 mx-auto group-hover:animate-bounce-gentle" />
                                    <h2 className="heading-secondary text-3xl font-bold mb-4">Track My Complaints</h2>
                                    <p className="text-white/90 mb-8 text-lg leading-relaxed">Monitor the status and receive updates on all your submitted complaints.</p>
                                    <Link 
                                        to="/citizen/my-complaints" 
                                        className="inline-block bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 shadow-glass border border-white/30 hover:scale-105"
                                    >
                                        View My Complaints
                                    </Link>
                                </div>
                            </div>

                            {/* Public Feed Card */}
                            <div className="group card-modern p-8 text-center bg-gradient-to-br from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 animate-fade-in-up relative overflow-hidden" style={{animationDelay: '1s'}}>
                                <div className="absolute inset-0 bg-gradient-glass rounded-3xl opacity-30"></div>
                                <div className="relative z-10">
                                    <FaGlobe className="text-7xl mb-6 mx-auto group-hover:animate-bounce-gentle" />
                                    <h2 className="heading-secondary text-3xl font-bold mb-4">Public Feed</h2>
                                    <p className="text-white/90 mb-8 text-lg leading-relaxed">Explore community issues and stay updated with official announcements from authorities.</p>
                                    <Link 
                                        to="/public-feed" 
                                        className="inline-block bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 shadow-glass border border-white/30 hover:scale-105"
                                    >
                                        Browse Feed
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="card-modern p-8 animate-fade-in-up" style={{animationDelay: '1.2s'}}>
                            <h2 className="heading-secondary text-4xl md:text-5xl font-bold mb-8 text-gray-800 flex items-center justify-center">
                                <FaHistory className="mr-4 text-primary-600" /> 
                                Recent <span className="gradient-text ml-2">Activity</span>
                            </h2>
                            {loadingActivity ? (
                                <div className="text-center">
                                    <div className="animate-pulse-gentle text-primary-600 text-xl font-medium">Loading recent activity...</div>
                                </div>
                            ) : errorActivity ? (
                                <div className="text-center">
                                    <div className="text-danger-600 text-xl font-medium">Error loading activity: {errorActivity.message}</div>
                                </div>
                            ) : recentActivity.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="text-gray-600 text-xl mb-4">No recent activities to display.</div>
                                    <p className="text-gray-500 text-lg">File a complaint or check the public feed to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {recentActivity.map((activity, index) => (
                                        <div key={activity.id} className="group card-modern p-6 flex items-start space-x-6 hover:scale-[1.02] transition-all duration-300 animate-fade-in" style={{animationDelay: `${1.4 + index * 0.1}s`}}>
                                            <div className="flex-shrink-0">
                                                {activity.type === 'my-complaint' ? (
                                                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-neon-blue">
                                                        <FaClipboardList className="text-2xl text-white" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 bg-gradient-danger rounded-2xl flex items-center justify-center shadow-neon-pink">
                                                        <FaBullhorn className="text-2xl text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                                                    {activity.type === 'my-complaint' ? `Your Complaint: ${activity.title}` : `Broadcast: ${activity.title}`}
                                                </h3>
                                                <p className="text-gray-700 text-lg mb-3 leading-relaxed">
                                                    {activity.type === 'my-complaint' ? `Status: ${activity.status}` : activity.message}
                                                </p>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span className="font-medium">
                                                        {new Date(activity.displayDate).toLocaleString()}
                                                    </span>
                                                    {activity.type === 'my-complaint' && activity.status && (
                                                        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold ${
                                                            activity.status === 'Solved' ? 'status-solved' :
                                                            activity.status === 'Pending' ? 'status-pending' :
                                                            activity.status === 'Escalated' ? 'status-escalated' : 'status-new'
                                                        }`}>
                                                            {activity.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeEnhanced;
