import React, { useState, useEffect } from 'react';
import { FaFilter, FaCheckCircle, FaHourglassHalf, FaExclamationCircle, FaArrowUp, FaSyncAlt } from 'react-icons/fa';

const MyComplaints = () => {
    const [myComplaints, setMyComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'New', 'Pending', 'Solved', 'Escalated'

    const fetchMyComplaints = async () => {
        setLoading(true);
        setError(null);
        try {
            // --- API Integration Details ---
            // Conceptual API endpoint for fetching user's complaints.
            // Add query parameter for filtering by status.
            // Expected data structure for a complaint:
            // {
            //   id: 'userComp789',
            //   title: 'My Road Damage Complaint',
            //   description: 'The potholes near my house are getting worse.',
            //   dateFiled: '2025-08-25T10:00:00Z', // ISO 8601 format for date
            //   status: 'New', // 'New', 'Pending', 'Solved', 'Escalated'
            //   authorityAssigned: 'Road Department',
            //   lastUpdate: '2025-08-27: Authority acknowledged receipt.'
            // }
            const url = `/api/user/my-complaints${filterStatus !== 'All' ? `?status=${filterStatus}` : ''}`;
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
            // --- API Integration Details ---
            // Conceptual API endpoint for updating complaint status.
            // Send the new status to the backend.
            const response = await fetch(`/api/user/complaints/${complaintId}/update-status`, {
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
            // --- API Integration Details ---
            // Conceptual API endpoint for escalating a complaint.
            const response = await fetch(`/api/user/complaints/${complaintId}/escalate`, {
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <h1 className="text-4xl font-extrabold mb-8 text-red-700 text-center tracking-tight leading-tight">
                My Complaints
            </h1>
            <p className="text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto">
                Here you can view the status and details of all the complaints you have filed.
            </p>

            {/* Filter Options */}
            <div className="flex justify-center space-x-4 mb-8">
                {['All', 'New', 'Pending', 'Solved', 'Escalated'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-6 py-2 rounded-full font-semibold text-lg transition-all duration-200
                            ${filterStatus === status
                                ? 'bg-blue-700 text-white shadow-md'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        <FaFilter className="inline-block mr-2" /> {status}
                    </button>
                ))}
                <button
                    onClick={fetchMyComplaints}
                    className="px-6 py-2 rounded-full font-semibold text-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-300 flex items-center"
                >
                    <FaSyncAlt className="mr-2" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 text-xl text-blue-700">Loading your complaints...</div>
            ) : error ? (
                <div className="flex justify-center items-center h-64 text-xl text-red-700">Error: {error.message}. Could not load your complaints.</div>
            ) : myComplaints.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-lg text-center text-gray-600 border border-blue-100">
                    <p className="text-2xl font-semibold mb-3">You have not filed any complaints yet.</p>
                    <p className="text-lg">File a new complaint to see it listed here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myComplaints.map((complaint) => {
                        const timeElapsedHours = calculateTimeElapsed(complaint.dateFiled);
                        const canEscalate = complaint.status !== 'Escalated' && complaint.status !== 'Solved' && timeElapsedHours >= 8;
                        const canMarkPendingOrSolved = complaint.status !== 'Solved' && complaint.status !== 'Escalated';

                        return (
                            <div key={complaint.id} className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 border-t-8 border-red-700">
                                <h2 className="text-3xl font-bold mb-3 text-gray-800 leading-snug">
                                    {complaint.title}
                                </h2>
                                <p className="text-base text-gray-600 mb-4">
                                    Filed on: {new Date(complaint.dateFiled).toLocaleDateString()} at {new Date(complaint.dateFiled).toLocaleTimeString()}
                                </p>
                                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                    {complaint.description}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-lg font-semibold text-blue-700 mb-1">
                                        Status: <span className="font-bold">{complaint.status}</span>
                                    </p>
                                    {complaint.authorityAssigned && (
                                        <p className="text-sm text-gray-500">
                                            Assigned to: {complaint.authorityAssigned}
                                        </p>
                                    )}
                                    {complaint.lastUpdate && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Last Update: {complaint.lastUpdate}
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm text-gray-500">
                                        Time Elapsed: {timeElapsedHours.toFixed(1)} hours
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    {canMarkPendingOrSolved && complaint.status !== 'Pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(complaint.id, 'Pending')}
                                            className="px-5 py-2 bg-yellow-600 text-white rounded-full text-sm font-semibold hover:bg-yellow-700 transition-colors duration-300 flex items-center"
                                        >
                                            <FaHourglassHalf className="mr-2" /> Mark Pending
                                        </button>
                                    )}
                                    {canMarkPendingOrSolved && complaint.status !== 'Solved' && (
                                        <button
                                            onClick={() => handleStatusUpdate(complaint.id, 'Solved')}
                                            className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center"
                                        >
                                            <FaCheckCircle className="mr-2" /> Mark Solved
                                        </button>
                                    )}
                                    {canEscalate && (
                                        <button
                                            onClick={() => handleEscalate(complaint.id)}
                                            className="px-5 py-2 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center"
                                        >
                                            <FaArrowUp className="mr-2" /> Escalate
                                        </button>
                                    )}
                                    {!canEscalate && complaint.status !== 'Escalated' && complaint.status !== 'Solved' && timeElapsedHours < 8 && (
                                        <span className="px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-full">
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
    );
};

export default MyComplaints;
