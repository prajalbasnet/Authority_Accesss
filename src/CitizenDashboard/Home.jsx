import React, { useState, useEffect } from "react";
import Navbar from "../components/Nav";
import { Link } from "react-router-dom";
import { FaFileAlt, FaClipboardList, FaGlobe, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaExclamationCircle, FaHistory, FaBullhorn } from 'react-icons/fa';

const Home = () => {
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
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const API = import.meta.env.VITE_API_BASE_URL || "";

        const fetchComplaintStats = async () => {
            setLoadingStats(true);
            try {
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
            setLoadingActivity(true);
            try {
                // Fetch recent user complaints
                const myComplaintsResponse = await fetch(`${API}/api/user/my-complaints?limit=3`, {
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
            <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <h1 className="text-5xl font-extrabold mb-8 text-red-700 text-center tracking-tight leading-tight">
                Welcome to Your Citizen Dashboard!
            </h1>
            <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
                Your central hub for managing complaints, staying informed, and connecting with authorities.
            </p>

            {/* Complaint Statistics Summary */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 mb-12">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-200 pb-3">
                    Your Complaint Overview
                </h2>
                {loadingStats ? (
                    <div className="text-center text-blue-700">Loading statistics...</div>
                ) : errorStats ? (
                    <div className="text-center text-red-700">Error loading stats: {errorStats.message}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        <div className="p-4 bg-blue-50 rounded-lg shadow-sm border border-blue-200">
                            <FaFileAlt className="text-4xl text-blue-700 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-blue-800">{complaintStats.new}</p>
                            <p className="text-gray-600">New Complaints</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg shadow-sm border border-yellow-200">
                            <FaHourglassHalf className="text-4xl text-yellow-700 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-yellow-800">{complaintStats.pending}</p>
                            <p className="text-gray-600">Pending Complaints</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg shadow-sm border border-green-200">
                            <FaCheckCircle className="text-4xl text-green-700 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-green-800">{complaintStats.solved}</p>
                            <p className="text-gray-600">Solved Complaints</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg shadow-sm border border-red-200">
                            <FaExclamationCircle className="text-4xl text-red-700 mx-auto mb-2" />
                            <p className="text-3xl font-bold text-red-800">{complaintStats.escalated}</p>
                            <p className="text-gray-600">Escalated Complaints</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {/* Quick Action: File a New Complaint */}
                <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-red-700 flex flex-col items-center text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                    <FaFileAlt className="text-6xl text-red-700 mb-4" />
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">File a New Complaint</h2>
                    <p className="text-gray-600 mb-6 flex-grow">Have an issue? Quickly report it to the relevant authority with detailed information.</p>
                    <Link to="/citizen/file-complaint" className="inline-block bg-red-700 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-red-800 transition-colors duration-300 shadow-md">
                        Start Complaint
                    </Link>
                </div>

                {/* Quick Action: View Your Complaints */}
                <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-blue-700 flex flex-col items-center text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                    <FaClipboardList className="text-6xl text-blue-700 mb-4" />
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">Track My Complaints</h2>
                    <p className="text-gray-600 mb-6 flex-grow">Monitor the status and receive updates on all your submitted complaints.</p>
                    <Link to="/citizen/my-complaints" className="inline-block bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-800 transition-colors duration-300 shadow-md">
                        View My Complaints
                    </Link>
                </div>

                {/* Quick Action: Public Feed */}
                <div className="bg-white p-8 rounded-xl shadow-lg border-t-8 border-gray-700 flex flex-col items-center text-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                    <FaGlobe className="text-6xl text-gray-700 mb-4" />
                    <h2 className="text-2xl font-bold mb-3 text-gray-800">Public Complaint Feed</h2>
                    <p className="text-gray-600 mb-6 flex-grow">Explore community issues and official broadcast messages from authorities.</p>
                    <Link to="/public-feed" className="inline-block bg-gray-700 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors duration-300 shadow-md">
                        Browse Feed
                    </Link>
                </div>
            </div>

            {/* Section for Recent Activity */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-blue-200 pb-3 flex items-center">
                    <FaHistory className="mr-3 text-blue-700" /> Your Recent Activity
                </h2>
                {loadingActivity ? (
                    <div className="text-center text-blue-700">Loading recent activity...</div>
                ) : errorActivity ? (
                    <div className="text-center text-red-700">Error loading activity: {errorActivity.message}</div>
                ) : recentActivity.length === 0 ? (
                    <div className="text-gray-600 text-lg">
                        <p className="mb-2">No recent activities to display. File a complaint or check the public feed!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200 flex items-start space-x-4">
                                {activity.type === 'my-complaint' ? (
                                    <FaClipboardList className="text-2xl text-blue-600 flex-shrink-0 mt-1" />
                                ) : (
                                    <FaBullhorn className="text-2xl text-red-600 flex-shrink-0 mt-1" />
                                )}
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800 text-lg">
                                        {activity.type === 'my-complaint' ? `Your Complaint: ${activity.title}` : `Broadcast: ${activity.title}`}
                                    </p>
                                    <p className="text-gray-700 text-base">
                                        {activity.type === 'my-complaint' ? `Status: ${activity.status}` : activity.message}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(activity.displayDate).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default Home;
