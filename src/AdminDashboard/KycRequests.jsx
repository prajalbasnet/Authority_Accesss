import React, { useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaIdCard } from "react-icons/fa";

// Fetch KYC requests from backend
const fetchKycRequests = async () => {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/pending-kyc`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data && res.data.data ? res.data.data : [];
  } catch (err) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch KYC requests');
  }
};

// Fetch KYC detail by id
const fetchKycDetail = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/kyc/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data && res.data.data ? res.data.data : {};
  } catch (err) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch KYC detail');
  }
};

// (removed duplicate fetchKycDetail)

const KycRequests = () => {

  const [kyc, setKyc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const loadKyc = async () => {
    setLoading(true); setError(null);
    try {
      const data = await fetchKycRequests();
      setKyc(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { loadKyc(); }, []);

  const handleApprove = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/approve-kyc/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKyc((prev) => prev.map(k => k.id === id ? { ...k, status: "Approved" } : k));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to approve KYC');
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('token');
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users/reject-kyc/${id}?reason=${encodeURIComponent(reason)}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setKyc((prev) => prev.map(k => k.id === id ? { ...k, status: "Rejected" } : k));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to reject KYC');
    }
  };

  const handleViewDetail = async (id) => {
    setDetailLoading(true); setDetailError(null);
    try {
      const detail = await fetchKycDetail(id);
      setSelectedKyc(detail);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

// (removed duplicate useEffect and handlers)

  return (

    <div className="space-y-6 bg-white min-h-screen pb-8">
      <div className="flex items-center gap-3 mb-2">
        <img src={require('../assets/nepalflag.png')} alt="Nepal Flag" className="h-8 w-8" />
        <h2 className="text-2xl font-bold mb-2 text-blue-800 tracking-wide">Pending KYC Requests</h2>
      </div>
      {loading ? (
        <div className="text-blue-700">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          {kyc.length > 0 ? (
            <table className="min-w-full text-left">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(kyc[0]).map((key) => (
                    <th key={key} className="py-2 px-4">{key}</th>
                  ))}
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kyc.map((row, idx) => (
                  <tr key={row.id || idx} className="border-b hover:bg-gray-50">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="py-2 px-4">{String(value)}</td>
                    ))}
                    <td className="py-2 px-4 space-x-2">
                      <button
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                        onClick={() => handleApprove(row.id)}
                        disabled={row.status === "Approved"}
                      >
                        <FaCheckCircle />
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        onClick={() => handleReject(row.id)}
                        disabled={row.status === "Rejected"}
                      >
                        <FaTimesCircle />
                      </button>
                      <button
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
            <div className="text-gray-500">No pending KYC requests.</div>
          )}
        </div>
      )}
      {detailLoading && <div className="text-blue-700">Loading detail...</div>}
      {detailError && <div className="text-red-600">{detailError}</div>}
      {selectedKyc && !detailLoading && !detailError && (
        <div className="mt-4 p-4 bg-blue-50 rounded border-2 border-blue-200">
          <h3 className="font-bold mb-2 text-blue-800">KYC Detail</h3>
          <div className="space-y-2">
            {Object.entries(selectedKyc).map(([key, value]) => (
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

export default KycRequests;

