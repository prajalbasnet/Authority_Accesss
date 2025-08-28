import React, { useState, useEffect } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';

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
            // --- API Integration Details ---
            // Conceptual API endpoint for fetching public complaints and broadcasts.
            // Add query parameters for filtering by authority and location.
            //
            // Expected data structure for a complaint/broadcast remains the same as before.
            //
            let url = '/api/public-feed';
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <h1 className="text-5xl font-extrabold mb-8 text-red-700 text-center tracking-tight leading-tight">
                Public Complaint & Broadcast Feed
            </h1>
            <p className="text-xl text-gray-700 mb-10 text-center max-w-3xl mx-auto">
                Stay informed about community issues and official updates from various authorities.
            </p>

            {/* Filter Controls */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-10 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 border border-blue-100">
                <div className="flex items-center space-x-3">
                    <FaFilter className="text-blue-700 text-xl" />
                    <label htmlFor="authority-select" className="text-lg font-semibold text-gray-700">Filter by Authority:</label>
                    <select
                        id="authority-select"
                        value={selectedAuthority}
                        onChange={(e) => setSelectedAuthority(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    >
                        {authorities.map((auth) => (
                            <option key={auth} value={auth}>
                                {auth}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center space-x-3">
                    <FaSearch className="text-blue-700 text-xl" />
                    <label htmlFor="location-input" className="text-lg font-semibold text-gray-700">Filter by Location:</label>
                    <input
                        id="location-input"
                        type="text"
                        placeholder="e.g., Ward 5, Kathmandu"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    />
                </div>

                <button
                    onClick={fetchFeed}
                    className="px-6 py-3 bg-red-700 text-white rounded-full font-semibold text-lg hover:bg-red-800 transition-colors duration-300 shadow-md flex items-center"
                >
                    <FaSearch className="mr-2" /> Apply Filters
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64 text-xl text-blue-700">Loading public feed...</div>
            ) : error ? (
                <div className="flex justify-center items-center h-64 text-xl text-red-700">Error: {error.message}. Could not load feed.</div>
            ) : feedItems.length === 0 ? (
                <div className="bg-white p-10 rounded-xl shadow-lg text-center text-gray-600 border border-blue-100">
                    <p className="text-2xl font-semibold mb-3">No public complaints or broadcasts available for the selected filters.</p>
                    <p className="text-lg">Try adjusting your filters or check back later for new updates.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {feedItems.map((item) => (
                        <div
                            key={item.id}
                            className={`relative p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${item.type === 'complaint' ? 'bg-white border-t-8 border-red-700' : 'bg-blue-50 border-t-8 border-blue-700'}`}
                        >
                            <div className="absolute top-4 right-4 text-sm font-semibold text-gray-500">
                                {item.date}
                            </div>
                            <h2 className="text-3xl font-bold mb-3 text-gray-800 leading-snug">
                                {item.type === 'complaint' ? `Complaint: ${item.title}` : `Broadcast from ${item.authority}`}
                            </h2>
                            <p className="text-base text-gray-600 mb-4">
                                {item.type === 'complaint' ? `Filed by: ${item.filedBy}` : `Authority: ${item.authority}`}
                            </p>
                            <p className="text-gray-700 leading-relaxed text-lg">
                                {item.type === 'complaint' ? item.description : item.message}
                            </p>
                            {item.type === 'complaint' && (
                                <div className="mt-5 pt-4 border-t border-gray-200">
                                    <p className="text-lg font-semibold text-blue-700 mb-1">
                                        Status: <span className="font-bold">{item.status}</span>
                                    </p>
                                    {item.authority && (
                                        <p className="text-sm text-gray-500">
                                            Assigned to: {item.authority}
                                        </p>
                                    )}
                                    {item.location && (
                                        <p className="text-sm text-gray-500">
                                            Location: {item.location}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PublicComplaintFeed;
