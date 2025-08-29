
import React, { useState, useEffect, useRef } from 'react';
import { FaFilter, FaCheckCircle, FaHourglassHalf, FaExclamationCircle, FaArrowUp, FaSyncAlt, FaUserShield, FaUserCircle, FaInfoCircle } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const MyComplaints = () => {
    const [myComplaints, setMyComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'New', 'Pending', 'Solved', 'Escalated'

    const fetchMyComplaints = async () => {
        setLoading(true);
        setError(null);
        try {
            const API = import.meta.env.VITE_API_BASE_URL || "";
            const url = `${API}/api/user/my-complaints${filterStatus !== 'All' ? `?status=${filterStatus}` : ''}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setMyComplaints(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyComplaints();
    }, [filterStatus]); // Refetch when filterStatus changes

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            const API = import.meta.env.VITE_API_BASE_URL || "";
            const response = await fetch(`${API}/api/user/complaints/${complaintId}/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // If successful, refetch complaints to update UI
            fetchMyComplaints();
            alert(`Complaint ${complaintId} marked as ${newStatus}.`);
        } catch (err) {
            alert(`Failed to update status: ${err.message}`);
        }
    };

    const handleEscalate = async (complaintId) => {
        try {
            const API = import.meta.env.VITE_API_BASE_URL || "";
            const response = await fetch(`${API}/api/user/complaints/${complaintId}/escalate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // If successful, refetch complaints to update UI
            fetchMyComplaints();
            alert(`Complaint ${complaintId} escalated.`);
        } catch (err) {
            alert(`Failed to escalate complaint: ${err.message}`);
        }
    };

    const calculateTimeElapsed = (dateFiled) => {
        const filedDate = new Date(dateFiled);
        const now = new Date();
        const diffMs = now - filedDate; // difference in milliseconds
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours;
    };


    // Status badge helper
    const statusBadge = (status) => {
        const map = {
            'New': { color: 'bg-blue-100 text-blue-800', icon: <FaInfoCircle className="mr-1" /> },
            'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: <FaHourglassHalf className="mr-1" /> },
            'Solved': { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="mr-1" /> },
            'Escalated': { color: 'bg-red-100 text-red-800', icon: <FaArrowUp className="mr-1" /> },
        };
        const { color, icon } = map[status] || { color: 'bg-gray-100 text-gray-800', icon: null };
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${color} shadow-sm mr-2 animate-fadeIn`}>{icon}{status}</span>
        );
    };

    // Sticky filter bar
    const filterBarRef = useRef(null);

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 via-white to-red-50 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-5xl font-extrabold mb-6 text-red-700 text-center tracking-tight leading-tight drop-shadow-lg animate-fadeIn">
                    My Complaints
                </h1>
                <p className="text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto animate-fadeIn">
                    Here you can view the status and details of all the complaints you have filed.
                </p>

                {/* Sticky Filter Options */}
                <div ref={filterBarRef} className="sticky top-0 z-20 bg-white/80 backdrop-blur-md rounded-xl shadow-lg flex flex-wrap justify-center items-center space-x-2 md:space-x-4 mb-8 py-3 px-2 border border-blue-100 animate-fadeIn">
                    {['All', 'New', 'Pending', 'Solved', 'Escalated'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-2 rounded-full font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
                                ${filterStatus === status
                                    ? 'bg-blue-700 text-white shadow-md scale-105'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                } animate-fadeIn`}
                            aria-label={`Filter by ${status}`}
                        >
                            <FaFilter className="inline-block mr-2" /> {status}
                        </button>
                    ))}
                    <button
                        onClick={fetchMyComplaints}
                        className="px-6 py-2 rounded-full font-semibold text-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-300 flex items-center animate-fadeIn"
                        aria-label="Refresh complaints"
                    >
                        <FaSyncAlt className="mr-2" /> Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64 text-xl text-blue-700 animate-pulse">Loading your complaints...</div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64 text-xl text-red-700 animate-fadeIn">Error: {error.message}. Could not load your complaints.</div>
                ) : myComplaints.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl shadow-2xl text-center text-gray-600 border border-blue-100 animate-fadeIn flex flex-col items-center">
                        <img src="/vite.svg" alt="No complaints" className="w-24 h-24 mb-4 opacity-70 animate-bounce" />
                        <p className="text-2xl font-semibold mb-3">You have not filed any complaints yet.</p>
                        <p className="text-lg mb-2">File a new complaint to see it listed here.</p>
                        <a href="/file-complaint" className="mt-2 px-6 py-2 bg-blue-700 text-white rounded-full font-semibold shadow hover:bg-blue-800 transition-colors duration-300 animate-fadeIn">File New Complaint</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                        {myComplaints.map((complaint) => {
                            const timeElapsedHours = calculateTimeElapsed(complaint.dateFiled);
                            // Only restrict escalate/resend for the same authority as the original complaint
                            // Only restrict 8-hour resend for the same authority as the original complaint
                            const authorities = ["Electricity", "Road", "Water", "Transportation", "Cyber Bureau", "Fire", "Police"];
                            const canEscalate = complaint.status !== 'Escalated' && complaint.status !== 'Solved' && (timeElapsedHours >= 8);
                            const canMarkPendingOrSolved = complaint.status !== 'Solved' && complaint.status !== 'Escalated';

                            // Progress bar for status
                            const statusProgress = {
                                'New': 25,
                                'Pending': 50,
                                'Escalated': 75,
                                'Solved': 100,
                            }[complaint.status] || 0;

                            return (
                                <div key={complaint.id} className="relative bg-white/90 p-8 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 border-t-8 border-red-700 group animate-fadeIn">
                                    {/* Authority avatar/icon */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-blue-100 to-red-100 rounded-full shadow-lg p-2 border-4 border-white animate-fadeIn">
                                        <FaUserShield className="text-4xl text-blue-700" title="Assigned Authority" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2 text-gray-800 leading-snug mt-6 text-center animate-fadeIn">
                                        {complaint.title}
                                    </h2>
                                    <div className="flex justify-center mb-2">
                                        {statusBadge(complaint.status)}
                                    </div>
                                    <p className="text-base text-gray-600 mb-2 text-center animate-fadeIn">
                                        Filed on: <span className="font-semibold">{new Date(complaint.dateFiled).toLocaleDateString()}</span> at <span className="font-semibold">{new Date(complaint.dateFiled).toLocaleTimeString()}</span>
                                    </p>
                                    <p className="text-gray-700 leading-relaxed text-lg mb-4 text-center animate-fadeIn">
                                        {complaint.description}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                                        {complaint.authorityAssigned && (
                                            <p className="text-sm text-gray-500 flex items-center justify-center gap-1 animate-fadeIn">
                                                <FaUserCircle className="mr-1 text-blue-700" /> Assigned to: <span className="font-semibold">{complaint.authorityAssigned}</span>
                                            </p>
                                        )}
                                        {complaint.lastUpdate && (
                                            <p className="mt-2 text-sm text-gray-500 text-center animate-fadeIn">
                                                <FaInfoCircle className="mr-1 text-blue-700" /> Last Update: {complaint.lastUpdate}
                                            </p>
                                        )}
                                        <p className="mt-2 text-sm text-gray-500 text-center animate-fadeIn">
                                            <FaHourglassHalf className="mr-1 text-yellow-600" /> Time Elapsed: <span className="font-semibold">{timeElapsedHours.toFixed(1)} hours</span>
                                        </p>
                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3 animate-fadeIn">
                                            <div className={`h-2.5 rounded-full transition-all duration-500 ${statusProgress === 100 ? 'bg-green-500' : statusProgress >= 75 ? 'bg-red-500' : statusProgress >= 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${statusProgress}%` }}></div>
                                        </div>
                                    </div>
                                    {/* Chat message area for complaint replies/messages */}
                                    {complaint.replies && (
                                        <div className="bg-white rounded-lg p-3 mt-6 mb-2 max-h-40 overflow-y-auto border border-blue-100 shadow-inner">
                                            {complaint.replies.length > 0 ? (
                                                complaint.replies.map((r, i) => (
                                                    <div key={i} className={`flex ${r.from === "authority" ? "justify-end" : "justify-start"} mb-2`}>
                                                        <div className={`inline-block px-4 py-2 rounded-2xl shadow text-sm font-medium ${r.from === "authority" ? "bg-blue-700 text-white" : "bg-blue-100 text-blue-900"}`}>
                                                            {r.text}
                                                            <div className="text-[10px] text-right text-gray-200/80 mt-1 font-normal">
                                                                {new Date(r.date).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-xs text-gray-400 text-center">No replies yet.</div>
                                            )}
                                        </div>
                                    )}
                                    <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fadeIn">
                                        {canMarkPendingOrSolved && complaint.status !== 'Pending' && (
                                            <button
                                                onClick={() => handleStatusUpdate(complaint.id, 'Pending')}
                                                className="px-5 py-2 bg-yellow-600 text-white rounded-full text-sm font-semibold hover:bg-yellow-700 transition-colors duration-300 flex items-center shadow-lg group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                title="Mark as Pending"
                                            >
                                                <FaHourglassHalf className="mr-2" /> Mark Pending
                                            </button>
                                        )}
                                        {canMarkPendingOrSolved && complaint.status !== 'Solved' && (
                                            <button
                                                onClick={() => handleStatusUpdate(complaint.id, 'Solved')}
                                                className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center shadow-lg group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
                                                title="Mark as Solved"
                                            >
                                                <FaCheckCircle className="mr-2" /> Mark Solved
                                            </button>
                                        )}
                                        {canEscalate && (
                                            <button
                                                onClick={() => handleEscalate(complaint.id)}
                                                className="px-5 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center shadow-lg group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                title="Escalate Complaint"
                                            >
                                                <FaArrowUp className="mr-2" /> Escalate
                                            </button>
                                        )}
                                        {/* Only show escalate wait for same authority, not for other authorities */}
                                        {!canEscalate && complaint.status !== 'Escalated' && complaint.status !== 'Solved' && timeElapsedHours < 8 && (
                                            <span className="px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-full animate-fadeIn" title="You can escalate after 8 hours">
                                                Escalate in {(8 - timeElapsedHours).toFixed(1)} hours
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyComplaints;
