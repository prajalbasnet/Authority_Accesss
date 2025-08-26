import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { useAuth } from "../../contexts/AuthContext";
import {
  // ...existing code...
  Users,
  FileText,
  Clock,
  MessageSquare,
  MapPin,
  Briefcase,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: "pending" | "in-progress" | "resolved" | "escalated";
  createdAt: Date;
  userId: string;
  userName: string;
  userLocation: string;
}

const AuthorityDashboard: React.FC = () => {
  // GSAP refs
  const cardsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatComplaintId, setChatComplaintId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const { userProfile } = useAuth();
  const [selectedField, setSelectedField] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // ...existing code...
  useEffect(() => {
    // GSAP entrance animation for cards and table
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
    }, [complaints, filteredComplaints]);
    // Fetch complaints from Firestore for this authority
    // Replace with your Firestore query logic
    import("../../config/firebase").then(({ db }) => {
      import("firebase/firestore").then(
        ({ collection, query, where, getDocs }) => {
          const q = query(
            collection(db, "complaints"),
            where("authorityId", "==", userProfile?.uid || "")
          );
          getDocs(q).then((snapshot: any) => {
            const data: Complaint[] = [];
            snapshot.forEach((doc: any) => {
              const d = doc.data();
              data.push({
                id: doc.id,
                title: d.title,
                description: d.description,
                category: d.category,
                location: d.location,
                status: d.status,
                createdAt: d.createdAt?.toDate
                  ? d.createdAt.toDate()
                  : new Date(),
                userId: d.userId,
                userName: d.userName || "",
                userLocation: d.userLocation || "",
              });
            });
            setComplaints(data);
            setFilteredComplaints(data);
          });
        }
      );
    });
  }, [userProfile]);

  const authorityFields = [
    "Electricity",
    "Water Supply",
    "Road & Transportation",
    "Healthcare",
    "Education",
    "Waste Management",
    "Public Safety",
    "Other",
  ];

  const locations = [
    "Kathmandu",
    "Lalitpur",
    "Bhaktapur",
    "Pokhara",
    "Biratnagar",
    "Dharan",
    "Butwal",
    "Other",
  ];

  useEffect(() => {
    // Removed mockComplaints usage. Complaints are now fetched from Firestore above.
    // Fetch chat messages for selected complaint
    if (chatComplaintId) {
      import("../../config/firebase").then(({ db }) => {
        import("firebase/firestore").then(
          ({ collection, query, orderBy, onSnapshot }) => {
            const q = query(
              collection(db, "complaints", chatComplaintId, "messages"),
              orderBy("createdAt", "asc")
            );
            const unsub = onSnapshot(q, (snapshot: any) => {
              const msgs: any[] = [];
              snapshot.forEach((doc: any) => msgs.push(doc.data()));
              setChatMessages(msgs);
            });
            return () => unsub();
          }
        );
      });
    }
  }, [chatComplaintId, userProfile]);

  // Send chat message
  const handleSendMessage = async () => {
    if (!chatComplaintId || !chatInput.trim()) return;
    import("../../config/firebase").then(({ db }) => {
      import("firebase/firestore").then(
        ({ collection, addDoc, serverTimestamp }) => {
          addDoc(collection(db, "complaints", chatComplaintId, "messages"), {
            sender: userProfile?.name || "Authority",
            senderId: userProfile?.uid || "",
            text: chatInput,
            createdAt: serverTimestamp(),
          });
          setChatInput("");
        }
      );
    });
  };

  useEffect(() => {
    let filtered = complaints;

    if (selectedField) {
      filtered = filtered.filter((complaint) =>
        complaint.category.toLowerCase().includes(selectedField.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter((complaint) =>
        complaint.location
          .toLowerCase()
          .includes(selectedLocation.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.status === statusFilter
      );
    }

    setFilteredComplaints(filtered);
  }, [selectedField, selectedLocation, searchTerm, statusFilter, complaints]);

  const handleStatusUpdate = (
    complaintId: string,
    newStatus: Complaint["status"]
  ) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, status: newStatus }
          : complaint
      )
    );
    // Persist status update to Firestore
    const complaintRef = doc(db, "complaints", complaintId);
    updateDoc(complaintRef, { status: newStatus });
  };

  const getStatusIcon = (status: Complaint["status"]) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "escalated":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Complaint["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "escalated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Authority Dashboard
          </h1>
          <p className="text-gray-600">
            Manage complaints and serve your community efficiently
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Field
              </label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Fields</option>
                {authorityFields.map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                Search
              </label>
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.length}
                </p>
                <p className="text-sm text-gray-600">Total Complaints</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.filter((c) => c.status === "pending").length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {complaints.filter((c) => c.status === "resolved").length}
                </p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints List */}
        <div
          ref={tableRef}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Complaints</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredComplaints.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No complaints found matching your filters.
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {getStatusIcon(complaint.status)}
                          <span className="ml-1">{complaint.status}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                          {complaint.createdAt.toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {complaint.title}
                      </h3>

                      <p className="text-gray-600 mb-3">
                        {complaint.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {complaint.category}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          {complaint.location}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          By: {complaint.userName}
                        </span>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(complaint.id, "in-progress")
                        }
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Start
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(complaint.id, "resolved")
                        }
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(complaint.id, "escalated")
                        }
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Escalate
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setChatOpen(true);
                          setChatComplaintId(complaint.id);
                        }}
                      >
                        <MessageSquare className="w-3 h-3 inline mr-1" />
                        Message
                      </button>
                      {/* Chat Modal */}
                      {chatOpen && chatComplaintId && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                          <div
                            ref={modalRef}
                            className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
                          >
                            <h3 className="text-lg font-bold mb-2">
                              Complaint Chat
                            </h3>
                            <div className="h-64 overflow-y-auto border rounded p-2 mb-2 bg-gray-50">
                              {chatMessages.length === 0 ? (
                                <p className="text-gray-500">
                                  No messages yet.
                                </p>
                              ) : (
                                chatMessages.map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`mb-2 ${
                                      msg.senderId === userProfile?.uid
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
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default AuthorityDashboard;
