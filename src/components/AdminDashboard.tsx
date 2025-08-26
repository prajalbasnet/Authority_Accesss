import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  priority: string;
  createdAt: any;
  userId: string;
  authorityId: string;
}

interface User {
  uid: string;
  name: string;
  email: string;
  userType: string;
  location?: string;
}

const AdminDashboard: React.FC = () => {
  const { currentUser, userProfile } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [authorities, setAuthorities] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || userProfile?.userType !== "admin") return;
    setLoading(true);
    import("../config/firebase").then(({ db }) => {
      import("firebase/firestore").then(({ collection, getDocs }) => {
        getDocs(collection(db, "complaints")).then((snapshot) => {
          const data: Complaint[] = [];
          snapshot.forEach((doc) => {
            const d = doc.data();
            data.push({ id: doc.id, ...d });
          });
          setComplaints(data);
        });
        getDocs(collection(db, "users")).then((snapshot) => {
          const userData: User[] = [];
          const authorityData: User[] = [];
          snapshot.forEach((doc) => {
            const d = doc.data();
            if (d.userType === "authority") authorityData.push(d);
            userData.push(d);
          });
          setUsers(userData);
          setAuthorities(authorityData);
          setLoading(false);
        });
      });
    });
  }, [currentUser, userProfile]);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                Total Complaints
              </h2>
              <p className="text-3xl font-bold text-red-700">
                {complaints.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                Total Users
              </h2>
              <p className="text-3xl font-bold text-red-700">{users.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-2">
                Total Authorities
              </h2>
              <p className="text-3xl font-bold text-red-700">
                {authorities.length}
              </p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              All Complaints
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-100 text-blue-900">
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Category</th>
                    <th className="py-2 px-4">Location</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Priority</th>
                    <th className="py-2 px-4">User</th>
                    <th className="py-2 px-4">Authority</th>
                    <th className="py-2 px-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c.id} className="border-b">
                      <td className="py-2 px-4">{c.title}</td>
                      <td className="py-2 px-4">{c.category}</td>
                      <td className="py-2 px-4">{c.location}</td>
                      <td className="py-2 px-4">{c.status}</td>
                      <td className="py-2 px-4">{c.priority}</td>
                      <td className="py-2 px-4">{c.userId}</td>
                      <td className="py-2 px-4">{c.authorityId}</td>
                      <td className="py-2 px-4">
                        {c.createdAt?.toDate
                          ? c.createdAt.toDate().toLocaleString()
                          : ""}
                      </td>
                        <td className="py-2 px-4">
                          <button onClick={() => handleStatusUpdate(c.id, 'resolved')} className="bg-green-600 text-white px-2 py-1 rounded mr-2">Resolve</button>
                          <button onClick={() => handleStatusUpdate(c.id, 'escalated')} className="bg-red-600 text-white px-2 py-1 rounded mr-2">Escalate</button>
                          <button onClick={() => handleDeleteComplaint(c.id)} className="bg-gray-600 text-white px-2 py-1 rounded">Delete</button>
                        </td>
                    </tr>
                  ))}
  // Admin actions
  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: newStatus } : c));
    import('../config/firebase').then(({ db }) => {
      import('firebase/firestore').then(({ doc, updateDoc }) => {
        const complaintRef = doc(db, 'complaints', complaintId);
        updateDoc(complaintRef, { status: newStatus });
      });
    });
  };

  const handleDeleteComplaint = (complaintId: string) => {
    setComplaints(prev => prev.filter(c => c.id !== complaintId));
    import('../config/firebase').then(({ db }) => {
      import('firebase/firestore').then(({ doc, deleteDoc }) => {
        const complaintRef = doc(db, 'complaints', complaintId);
        deleteDoc(complaintRef);
      });
    });
  };
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              All Authorities
            </h2>
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
                      <td className="py-2 px-4">{a.location}</td>
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
