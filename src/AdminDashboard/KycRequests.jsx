import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaIdCard } from "react-icons/fa";

const dummyKyc = [
  { id: 1, name: "Ram Bahadur", email: "ram@gmail.com", status: "Pending" },
  { id: 2, name: "Sita Kumari", email: "sita@gmail.com", status: "Pending" },
  { id: 3, name: "Hari Prasad", email: "hari@gmail.com", status: "Rejected" },
  { id: 4, name: "Gita Devi", email: "gita@gmail.com", status: "Approved" },
];

const KycRequests = () => {
  const [kyc, setKyc] = useState(dummyKyc);

  const handleApprove = (id) => {
    setKyc((prev) => prev.map(k => k.id === id ? { ...k, status: "Approved" } : k));
  };
  const handleReject = (id) => {
    setKyc((prev) => prev.map(k => k.id === id ? { ...k, status: "Rejected" } : k));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Pending KYC Requests</h2>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {kyc.map((k) => (
              <tr key={k.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{k.id}</td>
                <td className="py-2 px-4 flex items-center gap-2"><FaIdCard className="text-blue-500" /> {k.name}</td>
                <td className="py-2 px-4">{k.email}</td>
                <td className="py-2 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    k.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : k.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {k.status}
                  </span>
                </td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    onClick={() => handleApprove(k.id)}
                    disabled={k.status === "Approved"}
                  >
                    <FaCheckCircle />
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    onClick={() => handleReject(k.id)}
                    disabled={k.status === "Rejected"}
                  >
                    <FaTimesCircle />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KycRequests;
