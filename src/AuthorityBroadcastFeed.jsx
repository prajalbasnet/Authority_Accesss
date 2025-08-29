import React, { useEffect, useState } from "react";

// Dummy fetch function, replace with real API call
const fetchBroadcasts = async () => {
  // Replace with your API endpoint and logic
  return [
    {
      id: 1,
      citizenName: "Ayush Aryal",
      text: "There is a power outage in my area.",
      date: "2025-08-29T10:00:00Z",
      authorityReply: "We are working on it.",
    },
  ];
};

const AuthorityBroadcastFeed = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBroadcasts().then((data) => {
      setBroadcasts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Broadcast Feed</h2>
      {loading ? (
        <div className="text-center text-blue-700">Loading...</div>
      ) : broadcasts.length === 0 ? (
        <div className="text-center text-gray-500">No broadcasts found.</div>
      ) : (
        <div className="space-y-6">
          {broadcasts.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <span className="text-lg font-semibold text-blue-800">{b.citizenName}</span>
                <span className="text-xs text-gray-400 mt-2 md:mt-0">{new Date(b.date).toLocaleString()}</span>
              </div>
              <div className="text-gray-800 text-base mb-4">{b.text}</div>
              <div className="bg-blue-50 rounded p-3 text-blue-700 text-sm mb-2">
                <span className="font-semibold">Authority Reply:</span> {b.authorityReply || <span className="italic text-gray-400">No reply yet</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorityBroadcastFeed;
