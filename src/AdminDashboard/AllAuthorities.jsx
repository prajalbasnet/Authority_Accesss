import React, { useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaMapMarkerAlt } from "react-icons/fa";

// Fetch authorities from backend
const fetchAuthorities = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/authorities/pending`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data && res.data.data ? res.data.data : [];
};

// Fetch authority detail by id
const fetchAuthorityDetail = async (id) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/authorities/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data && res.data.data ? res.data.data : {};
};
const AllAuthorities = () => {
  const [authorities, setAuthorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAuthority, setSelectedAuthority] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  React.useEffect(() => {
    fetchAuthorities().then(data => {
      setAuthorities(data);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/authorities/approve/${id}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAuthorities((prev) => prev.map(a => a.id === id ? { ...a, status: "Approved" } : a));
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/authorities/reject/${id}?reason=${encodeURIComponent(reason)}`, null, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAuthorities((prev) => prev.map(a => a.id === id ? { ...a, status: "Rejected" } : a));
  };

  const handleViewDetail = async (id) => {
    setDetailLoading(true);
    const detail = await fetchAuthorityDetail(id);
    setSelectedAuthority(detail);
    setDetailLoading(false);
  };
  return (
    <div className="space-y-6 bg-white min-h-screen pb-8">
      <div className="flex items-center gap-3 mb-2">
        <img src={require('../assets/nepalflag.png')} alt="Nepal Flag" className="h-8 w-8" />
        <h2 className="text-2xl font-bold mb-2 text-blue-800 tracking-wide">All Authorities</h2>
      </div>
      {loading ? (
        <div className="text-blue-700">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow border-2 border-blue-200">
          {authorities.length > 0 ? (
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-blue-700 text-white">
                  {Object.keys(authorities[0]).map((key) => (
                    <th key={key} className="py-2 px-4">{key}</th>
                  ))}
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {authorities.map((row, idx) => (
                  <tr key={row.id || idx} className="border-b hover:bg-blue-50">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="py-2 px-4">{String(value)}</td>
                    ))}
                    <td className="py-2 px-4 space-x-2 flex">
                      <button
                        className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 border-2 border-blue-900 disabled:opacity-50"
                        onClick={() => handleApprove(row.id)}
                        disabled={row.status === "Approved"}
                      >
                        <FaCheckCircle className="text-white" />
                      </button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 border-2 border-red-900 disabled:opacity-50"
                        onClick={() => handleReject(row.id)}
                        disabled={row.status === "Rejected"}
                      >
                        <FaTimesCircle className="text-white" />
                      </button>
                      <button
                        className="px-2 py-1 bg-white text-blue-700 border-2 border-blue-700 rounded hover:bg-blue-50"
                        onClick={() => handleViewDetail(row.id)}
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-gray-500">No authorities found.</div>
          )}
        </div>
      )}
      {detailLoading && <div className="text-blue-700">Loading detail...</div>}
      {selectedAuthority && !detailLoading && (
        <div className="mt-4 p-4 bg-blue-50 rounded border-2 border-blue-200">
          <h3 className="font-bold mb-2 text-blue-800">Authority Detail</h3>
          <div className="space-y-2">
            {Object.entries(selectedAuthority).map(([key, value]) => (
              <div key={key} className="flex items-start gap-2">
                <span className="font-semibold min-w-[120px] text-blue-900">{key}:</span>
                {typeof value === 'string' && value.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                  <img src={value} alt={key} className="max-h-32 rounded border-2 border-red-600" />
                ) : (
                  <span className="break-all">{String(value)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAuthorities;
