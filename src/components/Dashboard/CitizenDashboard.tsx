import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "Pending" | "In Progress" | "Resolved";
}

const CitizenDashboard: React.FC = () => {
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatComplaintId, setChatComplaintId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // Fetch chat messages for selected complaint
    useEffect(() => {
      if (chatComplaintId) {
        import("../../config/firebase").then(({ db }) => {
          import("firebase/firestore").then(
            ({ collection, query, orderBy, onSnapshot }) => {
              const q = query(
                collection(db, "complaints", chatComplaintId, "messages"),
                orderBy("createdAt", "asc")
              );
              const unsub = onSnapshot(q, (snapshot) => {
                const msgs: any[] = [];
                snapshot.forEach((doc) => msgs.push(doc.data()));
                setChatMessages(msgs);
              });
              return () => unsub();
            }
          );
        });
      }
    }, [chatComplaintId]);
    // Send chat message
    const handleSendMessage = async () => {
      if (!chatComplaintId || !chatInput.trim()) return;
      import("../../config/firebase").then(({ db }) => {
        import("firebase/firestore").then(
          ({ collection, addDoc, serverTimestamp }) => {
            addDoc(collection(db, "complaints", chatComplaintId, "messages"), {
              sender: currentUser?.displayName || "User",
              senderId: currentUser?.uid || "",
              text: chatInput,
              createdAt: serverTimestamp(),
            });
            setChatInput("");
          }
        );
      });
    };
    if (!currentUser) return;
    import("../../config/firebase").then(({ db }) => {
      import("firebase/firestore").then(
        ({ collection, query, where, getDocs }) => {
          const q = query(
            collection(db, "complaints"),
            where("userId", "==", currentUser.uid)
          );
          getDocs(q).then((snapshot) => {
            const data: Complaint[] = [];
            snapshot.forEach((doc) => {
              const d = doc.data();
              data.push({
                id: doc.id,
                title: d.title,
                description: d.description,
                category: d.category,
                status: d.status || "Pending",
              });
            });
            setComplaints(data);
          });
        }
      );
    });
  }, [currentUser]);

  const handleMarkAsSolved = (id: string) => {
    setComplaints(
      complaints.map((c) => (c.id === id ? { ...c, status: "Resolved" } : c))
    );
    import("../../config/firebase").then(({ db }) => {
      import("firebase/firestore").then(({ doc, updateDoc }) => {
        const complaintRef = doc(db, "complaints", id);
        updateDoc(complaintRef, { status: "Resolved" });
      });
    });
  };

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
                  onClick={() => {
                    setChatOpen(true);
                    setChatComplaintId(complaint.id);
                  }}
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
      {chatOpen && chatComplaintId && (
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
                      msg.senderId === currentUser?.uid
                        ? "text-right"
                        : "text-left"
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
              onClick={() => {
                setChatOpen(false);
                setChatComplaintId(null);
              }}
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
