
import React, { useEffect, useState, useRef } from "react";


// TODO: Replace with real API call


const AuthorityGroupChat = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupReply, setGroupReply] = useState("");
  const [complaintReply, setComplaintReply] = useState({});
  const chatEndRefs = useRef({});

  useEffect(() => {
    fetchGroupComplaints().then((data) => {
      setGroups(data);
      setLoading(false);
    });
  }, []);

  // Auto-scroll to latest message for each complaint
  useEffect(() => {
    Object.values(chatEndRefs.current).forEach(ref => {
      if (ref) ref.scrollIntoView({ behavior: "smooth" });
    });
  }, [groups]);

  const handleGroupReply = (topic) => {
    setGroups((prev) => prev.map(g => g.topic === topic ? { ...g, groupReplies: [...g.groupReplies, { from: "authority", text: groupReply, date: new Date().toISOString() }] } : g));
    setGroupReply("");
  };

  const handleComplaintReply = (topic, complaintId) => {
    setGroups((prev) => prev.map(g => g.topic === topic ? {
      ...g,
      complaints: g.complaints.map(c => c.id === complaintId ? {
        ...c,
        replies: [...(c.replies || []), { from: "authority", text: complaintReply[complaintId] || "", date: new Date().toISOString() }],
      } : c),
    } : g));
    setComplaintReply((prev) => ({ ...prev, [complaintId]: "" }));
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-900 text-center tracking-tight drop-shadow-lg">Authority Complaint Group Chat</h2>
      {loading ? (
        <div className="text-center text-blue-700">Loading...</div>
      ) : groups.length === 0 ? (
        <div className="text-center text-gray-500">No complaints found.</div>
      ) : (
        groups.map((group) => (
          <div key={group.topic} className="mb-12 bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-200 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-blue-800 mb-6">{group.topic} Complaints</h3>
            <div className="space-y-8 mb-8">
              {group.complaints.map((c) => (
                <div key={c.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg border border-blue-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-blue-900">{c.citizenName}</span>
                      <span className="text-xs text-blue-500">{c.citizenAddress}</span>
                      <span className="text-xs text-blue-400">{c.citizenPhone}</span>
                    </div>
                    <span className="text-xs text-gray-400 mt-2 md:mt-0">{formatTime(c.date)}</span>
                  </div>
                  <div className="text-gray-900 text-base mb-4 font-medium">{c.text}</div>
                  {/* Chat message area */}
                  <div className="bg-white rounded-lg p-3 mb-3 max-h-56 overflow-y-auto border border-blue-100 shadow-inner">
                    {c.replies && c.replies.length > 0 ? (
                      c.replies.map((r, i) => (
                        <div key={i} className={`flex ${r.from === "authority" ? "justify-end" : "justify-start"} mb-2`}>
                          <div className={`inline-block px-4 py-2 rounded-2xl shadow text-sm font-medium ${r.from === "authority" ? "bg-blue-700 text-white" : "bg-blue-100 text-blue-900"}`}>
                            {r.text}
                            <div className="text-[10px] text-right text-gray-200/80 mt-1 font-normal">
                              {formatTime(r.date)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400 text-center">No replies yet.</div>
                    )}
                    <div ref={el => (chatEndRefs.current[c.id] = el)} />
                  </div>
                  {/* Message box */}
                  <form
                    className="flex gap-2 mt-2"
                    onSubmit={e => {
                      e.preventDefault();
                      if (complaintReply[c.id]) handleComplaintReply(group.topic, c.id);
                    }}
                  >
                    <input
                      type="text"
                      className="flex-1 border border-blue-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow"
                      placeholder="Type a reply to this complaint..."
                      value={complaintReply[c.id] || ""}
                      onChange={e => setComplaintReply(pr => ({ ...pr, [c.id]: e.target.value }))}
                    />
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-blue-700 text-white font-bold shadow hover:bg-blue-800 transition-all duration-200"
                      disabled={!complaintReply[c.id]}
                    >Send</button>
                  </form>
                </div>
              ))}
            </div>
            {/* Group replies */}
            <div className="mb-4">
              <div className="font-semibold text-blue-700 mb-2 text-lg">Group Replies:</div>
              <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-inner max-h-40 overflow-y-auto">
                {group.groupReplies.length > 0 ? (
                  group.groupReplies.map((r, i) => (
                    <div key={i} className="flex justify-end mb-2">
                      <div className="inline-block px-4 py-2 rounded-2xl shadow text-sm font-medium bg-blue-600 text-white">
                        {r.text}
                        <div className="text-[10px] text-right text-gray-200/80 mt-1 font-normal">
                          {formatTime(r.date)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 text-center">No group replies yet.</div>
                )}
              </div>
            </div>
            {/* Group message box */}
            <form
              className="flex gap-2 mt-2"
              onSubmit={e => {
                e.preventDefault();
                if (groupReply) handleGroupReply(group.topic);
              }}
            >
              <input
                type="text"
                className="flex-1 border border-blue-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow"
                placeholder="Type a group reply to all users..."
                value={groupReply}
                onChange={e => setGroupReply(e.target.value)}
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-blue-700 text-white font-bold shadow hover:bg-blue-800 transition-all duration-200"
                disabled={!groupReply}
              >Send to All</button>
            </form>
          </div>
        ))
      )}
    </div>
  );
};

export default AuthorityGroupChat;
