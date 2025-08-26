import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { Complaint } from "../../types";

const CitizenDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatComplaintId, setChatComplaintId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");

  const fetchComplaints = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "complaints"),
        where("userId", "==", currentUser.uid)
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
      setComplaints(data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Effect for chat messages
  useEffect(() => {
    if (!chatComplaintId) return;

    const q = query(
      collection(db, "complaints", chatComplaintId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setChatMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatComplaintId]);

  const handleMarkAsSolved = async (id: string) => {
    try {
      const complaintRef = doc(db, "complaints", id);
      await updateDoc(complaintRef, { status: "Resolved" });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Resolved" } : c))
      );
    } catch (error) {
      console.error("Error marking as solved:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatComplaintId || !chatInput.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, "complaints", chatComplaintId, "messages"), {
        sender: currentUser.displayName || "User",
        senderId: currentUser.uid,
        text: chatInput,
        createdAt: serverTimestamp(),
      });
      setChatInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const openChat = (complaintId: string) => {
    setChatComplaintId(complaintId);
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatComplaintId(null);
    setChatOpen(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading your complaints...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Complaints</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">{complaint.title}</h2>
            <p className="text-gray-600 mb-4">{complaint.description}</p>
            <div className="flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  complaint.status === "Pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : complaint.status === "In Progress"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {complaint.status}
              </span>
              <div className="flex gap-2">
                {complaint.status !== "Resolved" && (
                  <button
                    onClick={() => handleMarkAsSolved(complaint.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    Mark as Solved
                  </button>
                )}
                <button
                  onClick={() => openChat(complaint.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-2">Complaint Chat</h3>
            <div className="h-64 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
              {chatMessages.length === 0 ? (
                <p className="text-gray-500">No messages yet.</p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-2 ${
                      msg.senderId === currentUser?.uid ? "text-right" : "text-left"
                    }`}
                  >
                    <span className="font-semibold text-blue-700">
                      {msg.sender}:
                    </span>{" "}
                    <span>{msg.text}</span>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 border rounded px-2"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Send
              </button>
            </div>
            <button
              onClick={closeChat}
              className="mt-4 bg-gray-200 px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;