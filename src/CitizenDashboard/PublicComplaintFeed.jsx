
import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaUserCircle, FaBroadcastTower, FaCheckCircle, FaHourglassHalf, FaArrowUp, FaInfoCircle, FaBolt } from 'react-icons/fa';

const PublicComplaintFeed = () => {
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAuthority, setSelectedAuthority] = useState('All');
    const [locationFilter, setLocationFilter] = useState('');

    const authorities = [
        'All',
        'Electricity',
        'Water',
        'Road',
        'Transportation',
        'Cyber Bureau',
        'Police',
        'Fire',
    ];

    const fetchFeed = async () => {
        setLoading(true);
        setError(null);
        try {
            const API = import.meta.env.VITE_API_BASE_URL || "";
            let url = `${API}/api/public-feed`;
            const params = new URLSearchParams();

            if (selectedAuthority !== 'All') {
                params.append('authority', selectedAuthority);
            }
            if (locationFilter) {
                params.append('location', locationFilter);
            }

            if (params.toString()) {
                url = `${url}?${params.toString()}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFeedItems(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, [selectedAuthority, locationFilter]); // Refetch when filters change


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

    // Time ago helper
    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    return (
        <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 via-white to-red-50 pb-16">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-5xl font-extrabold mb-6 text-red-700 text-center tracking-tight leading-tight drop-shadow-lg animate-fadeIn">
                    Public Complaint & Broadcast Feed
                </h1>
                <p className="text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto animate-fadeIn">
                    Stay informed about community issues and official updates from various authorities.
                </p>

                {/* Enhanced Filter Controls */}
                <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md rounded-xl shadow-lg flex flex-wrap justify-center items-center space-x-2 md:space-x-6 mb-8 py-3 px-2 border border-blue-100 animate-fadeIn">
                    <div className="flex items-center space-x-2 animate-fadeIn">
                        <FaFilter className="text-blue-700 text-xl" />
                        <label htmlFor="authority-select" className="text-lg font-semibold text-gray-700">Authority:</label>
                        <select
                            id="authority-select"
                            value={selectedAuthority}
                            onChange={(e) => setSelectedAuthority(e.target.value)}
                            className="p-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        >
                            {authorities.map((auth) => (
                                <option key={auth} value={auth}>
                                    {auth}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2 animate-fadeIn">
                        <FaSearch className="text-blue-700 text-xl" />
                        <label htmlFor="location-input" className="text-lg font-semibold text-gray-700">Location:</label>
                        <input
                            id="location-input"
                            type="text"
                            placeholder="e.g., Ward 5, Kathmandu"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="p-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                        />
                    </div>

                    <button
                        onClick={fetchFeed}
                        className="px-6 py-2 bg-red-700 text-white rounded-full font-semibold text-lg hover:bg-red-800 transition-colors duration-300 shadow-md flex items-center animate-fadeIn"
                        aria-label="Apply Filters"
                    >
                        <FaSearch className="mr-2" /> Apply
                    </button>
                    {(selectedAuthority !== 'All' || locationFilter) && (
                        <button
                            onClick={() => { setSelectedAuthority('All'); setLocationFilter(''); fetchFeed(); }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold text-md hover:bg-gray-300 transition-colors duration-200 ml-2 animate-fadeIn"
                            aria-label="Clear Filters"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64 text-xl text-blue-700 animate-pulse">Loading public feed...</div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64 text-xl text-red-700 animate-fadeIn">Error: {error.message}. Could not load feed.</div>
                ) : feedItems.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl shadow-2xl text-center text-gray-600 border border-blue-100 animate-fadeIn flex flex-col items-center">
                        <img src="/vite.svg" alt="No complaints" className="w-24 h-24 mb-4 opacity-70 animate-bounce" />
                        <p className="text-2xl font-semibold mb-3">No public complaints or broadcasts available for the selected filters.</p>
                        <p className="text-lg">Try adjusting your filters or check back later for new updates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                        {feedItems.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`relative p-8 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 border-t-8 ${item.type === 'complaint' ? 'bg-white border-red-700' : 'bg-blue-50 border-blue-700'} group animate-fadeIn`}
                            >
                                {/* Avatar/Icon */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-blue-100 to-red-100 rounded-full shadow-lg p-2 border-4 border-white animate-fadeIn">
                                    {item.type === 'complaint' ? <FaUserCircle className="text-4xl text-blue-700" title="Citizen" /> : <FaBroadcastTower className="text-4xl text-red-700" title="Broadcast" />}
                                </div>
                                <div className="absolute top-4 right-4 text-xs font-semibold text-gray-500 animate-fadeIn">
                                    {timeAgo(item.date)}
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-gray-800 leading-snug mt-6 text-center animate-fadeIn">
                                    {item.type === 'complaint' ? `Complaint: ${item.title}` : `Broadcast from ${item.authority}`}
                                </h2>
                                <div className="flex justify-center mb-2 animate-fadeIn">
                                    {item.type === 'complaint' && statusBadge(item.status)}
                                    {item.type === 'broadcast' && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800 shadow-sm mr-2 animate-fadeIn"><FaBolt className="mr-1" />Broadcast</span>}
                                    {idx === 0 && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-200 text-green-800 shadow animate-fadeIn ml-2">New</span>}
                                </div>
                                <p className="text-base text-gray-600 mb-2 text-center animate-fadeIn">
                                    {item.type === 'complaint' ? `Filed by: ${item.filedBy}` : `Authority: ${item.authority}`}
                                </p>
                                <p className="text-gray-700 leading-relaxed text-lg mb-4 text-center animate-fadeIn">
                                    {item.type === 'complaint' ? item.description : item.message}
                                </p>
                                {/* Modern chat UI for complaint replies/messages */}
                                {item.type === 'complaint' && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
                                        {item.authority && (
                                            <p className="text-sm text-gray-500 flex items-center justify-center gap-1 animate-fadeIn">
                                                <FaUserCircle className="mr-1 text-blue-700" /> Assigned to: <span className="font-semibold">{item.authority}</span>
                                            </p>
                                        )}
                                        {item.location && (
                                            <p className="text-sm text-gray-500 flex items-center justify-center gap-1 animate-fadeIn">
                                                <FaInfoCircle className="mr-1 text-blue-700" /> Location: <span className="font-semibold">{item.location}</span>
                                            </p>
                                        )}
                                        {/* Chat message area */}
                                        <div className="bg-white rounded-lg p-3 mt-4 mb-2 max-h-40 overflow-y-auto border border-blue-100 shadow-inner">
                                            {item.replies && item.replies.length > 0 ? (
                                                item.replies.map((r, i) => (
                                                    <div key={i} className={`flex ${r.from === "authority" ? "justify-end" : "justify-start"} mb-2`}>
                                                        <div className={`inline-block px-4 py-2 rounded-2xl shadow text-sm font-medium ${r.from === "authority" ? "bg-blue-700 text-white" : "bg-blue-100 text-blue-900"}`}>
                                                            {r.text}
                                                            <div className="text-[10px] text-right text-gray-200/80 mt-1 font-normal">
                                                                {timeAgo(r.date)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-xs text-gray-400 text-center">No replies yet.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicComplaintFeed;
