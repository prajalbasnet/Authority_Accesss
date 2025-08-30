
import React, { useEffect, useState } from "react";

import axios from "axios";

const AuthorityComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/authority/complaints-dummy`)
      .then((res) => {
        setComplaints(res.data?.data || []);
      })
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Complaints Assigned to You</h2>
      {loading ? (
        <div className="text-center text-blue-700">Loading...</div>
      ) : complaints.length === 0 ? (
        <div className="text-center text-gray-500">No complaints found.</div>
      ) : (
        <div className="space-y-6">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-semibold text-blue-800">{c.citizenName}</span>
                  <span className="text-sm text-blue-500">{c.citizenAddress}</span>
                  <span className="text-sm text-blue-400">{c.citizenPhone}</span>
                </div>
                <span className="text-xs text-gray-400 mt-2 md:mt-0">{new Date(c.date).toLocaleString()}</span>
              </div>
              <div className="text-gray-800 text-base mb-4">{c.text}</div>
              <div className="bg-blue-50 rounded p-3 text-blue-700 text-sm mb-2">
                <span className="font-semibold">Authority Reply:</span> {c.authorityReply || <span className="italic text-gray-400">No reply yet</span>}
              </div>
              {/* Add reply box/button here if needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorityComplaints;
