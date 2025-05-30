import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Notifications.css";

function Notifications({ theme }) {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch messages from backend API
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const res = await fetch("/api/messages", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error fetching messages: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Fetch messages failed:", error);
      setMessages([]); // clear on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReplyChange = (id, value) => {
    setReplyText((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token for reply");

      if (!replyText[id] || replyText[id].trim() === "") {
        alert("Reply text cannot be empty");
        return;
      }

      const reply = replyText[id].trim();

      const res = await axios.put(
        `/api/messages/${id}/reply`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        alert("Replied successfully");

        // Optimistically update local message state so reply shows immediately
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === id ? { ...msg, reply: reply, read: true } : msg
          )
        );

        // Clear the reply text box for this message
        setReplyText((prev) => ({ ...prev, [id]: "" }));

        // Optionally re-fetch messages for full sync, but not mandatory
        // await fetchMessages();
      } else {
        alert("Failed to reply");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reply");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token for delete");

      const res = await axios.delete(`/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        alert("Deleted successfully");
        await fetchMessages();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const containerClass = theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  const cardClass = theme === "dark" ? "bg-secondary text-light border-light" : "bg-white text-dark";

  if (loading) return <div className={`container mt-5 ${containerClass}`}>Loading messages...</div>;

  return (
    <div className={`notifications-container container mt-5 ${containerClass}`}>
      <h2 className="notifications-title mb-4">Customer Messages</h2>

      {messages.length === 0 ? (
        <p>No messages received.</p>
      ) : (
        <div className="list-group">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-card list-group-item mb-3 ${cardClass} ${!msg.read ? "unread border border-warning" : ""}`}
            >
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <strong>{msg.name}</strong> ({msg.email})<br />
                  <small className="text-muted">{new Date(msg.createdAt).toLocaleString()}</small>
                  <p className="message-content mt-2">{msg.message}</p>
                  {msg.reply && (
                    <div className={`alert ${theme === "dark" ? "alert-dark" : "alert-info"}`}>
                      <strong>Reply:</strong> {msg.reply}
                    </div>
                  )}
                </div>
                <div>
                  <button className="btn btn-danger btn-sm mb-2" onClick={() => handleDelete(msg._id)}>
                    Delete
                  </button>
                </div>
              </div>

              <div className="reply-section mt-3">
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Write a reply..."
                  value={replyText[msg._id] || ""}
                  onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                  style={{
                    backgroundColor: theme === "dark" ? "#444" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    borderColor: theme === "dark" ? "#666" : "#ced4da",
                  }}
                />
                <button
                  className="btn btn-primary btn-sm mt-2"
                  disabled={!replyText[msg._id] || replyText[msg._id].trim() === ""}
                  onClick={() => handleReplySubmit(msg._id)}
                >
                  Send Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
