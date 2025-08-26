import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useAuth } from "../../contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { Complaint } from "../../types";

const AuthorityDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);

  // GSAP refs
  const cardsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const fetchComplaints = useCallback(async () => {
    if (!userProfile) return;
    try {
      const q = query(
        collection(db, "complaints"),
        where("authorityId", "==", userProfile.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const complaintData = doc.data();
        return {
          id: doc.id,
          title: complaintData.title || "",
          description: complaintData.description || "",
          category: complaintData.category || "",
          location: complaintData.location?.address || "",
          status: complaintData.status || "Pending",
          priority: complaintData.priority || "Normal",
          createdAt: complaintData.createdAt || Timestamp.now(),
          userId: complaintData.userId || "",
          authorityId: complaintData.authorityId || "",
        } as Complaint;
      });
      setFilteredComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  }, [userProfile]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // GSAP Animations
  useEffect(() => {
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
    }
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [filteredComplaints]); // Rerun animation when filtered complaints change

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authority Dashboard
          </h1>
          <p className="text-gray-600">
            Manage complaints and serve your community efficiently.
          </p>
        </header>

        {/* Filters and Stats can go here */}

        <div
          ref={tableRef}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Complaints</h2>
          </div>
          <div className="divide-y">
            {filteredComplaints.length === 0 ? (
              <p className="p-6 text-center text-gray-500">
                No complaints found.
              </p>
            ) : (
              filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="p-6 hover:bg-gray-50">
                  {/* ... complaint details ... */}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
