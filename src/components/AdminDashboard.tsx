import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

import { Complaint, UserProfile } from "../types";

const AdminDashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [authorities, setAuthorities] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (!currentUser || userProfile?.userType !== "admin") return;

    setLoading(true);
    try {
      // Fetch complaints
      const complaintsSnapshot = await getDocs(collection(db, "complaints"));
      const complaintsData = complaintsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          location: data.location?.address || "",
          status: data.status || "Pending",
          priority: data.priority || "Normal",
          createdAt: data.createdAt || Timestamp.now(),
          userId: data.userId || "",
          authorityId: data.authorityId || "",
        } as Complaint;
      });
      setComplaints(complaintsData);

      // Fetch users and authorities
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.name || "",
          email: data.email || "",
          userType: data.userType || "citizen",
          location: data.location?.address || data.location || "",
          phone: data.phone || "",
          verified: data.verified || false,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as UserProfile;
      });
      
      setUsers(usersData);
      setAuthorities(usersData.filter((u) => u.userType === "authority"));

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, userProfile]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Admin actions
  const handleStatusUpdate = async (complaintId: string, newStatus: string) => {
    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await updateDoc(complaintRef, { status: newStatus });
      setComplaints((prev) =>
        prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    try {
      const complaintRef = doc(db, "complaints", complaintId);
      await deleteDoc(complaintRef);
      setComplaints((prev) => prev.filter((c) => c.id !== complaintId));
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  if (!currentUser || userProfile?.userType !== "admin") {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Access Denied: Admins Only
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-red-700 border-b-4 border-blue-900 pb-2">
        Admin Dashboard
      </h1>
      {loading ? (
        <div className="text-center text-blue-700">Loading...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">Total Complaints</h2>
              <p className="text-3xl font-bold text-red-700">{complaints.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">Total Users</h2>
              <p className="text-3xl font-bold text-red-700">{users.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">Total Authorities</h2>
              <p className="text-3xl font-bold text-red-700">{authorities.length}</p>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">All Complaints</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-100 text-blue-900">
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Priority</th>
                    <th className="py-2 px-4">User ID</th>
                    <th className="py-2 px-4">Created</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-2 px-4">{c.title}</td>
                      <td className="py-2 px-4">{c.category}</td>
                      <td className="py-2 px-4">{c.status}</td>
                      <td className="py-2 px-4">{c.priority}</td>
                      <td className="py-2 px-4">{c.userId}</td>
                      <td className="py-2 px-4">
                        {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-2 px-4">
                        <button onClick={() => handleStatusUpdate(c.id, "Resolved")} className="bg-green-600 text-white px-2 py-1 rounded mr-2">Resolve</button>
                        <button onClick={() => handleStatusUpdate(c.id, "Escalated")} className="bg-yellow-600 text-white px-2 py-1 rounded mr-2">Escalate</button>
                        <button onClick={() => handleDeleteComplaint(c.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Authorities Table */}
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">All Authorities</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-100 text-blue-900">
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {authorities.map((a) => (
                    <tr key={a.uid} className="border-b">
                      <td className="py-2 px-4">{a.name}</td>
                      <td className="py-2 px-4">{a.email}</td>
                      <td className="py-2 px-4">{a.location || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;