import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

function Notifications() {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
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
      await axios.put(
        `/api/messages/${id}/reply`,
        { reply: replyText[id] },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Replied successfully');
      fetchMessages();
      setReplyText((prev) => ({ ...prev, [id]: '' }));
    } catch (err) {
      console.error(err);
      alert('Failed to reply');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Deleted successfully');
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="container mt-5">Loading messages...</div>;

  return (
    <div className="notifications-container container mt-5">
      <h2 className="notifications-title">Customer Messages</h2>

      {messages.length === 0 ? (
        <p>No messages received.</p>
      ) : (
        <div className="list-group">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-card list-group-item list-group-item-action mb-3 ${
                !msg.read ? 'unread bg-light' : ''
              }`}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{msg.name}</strong> ({msg.email})<br />
                  <small className="text-muted">
                    {new Date(msg.createdAt).toLocaleString()}
                  </small>
                  <p className="message-content mt-2">{msg.message}</p>
                  {msg.reply && (
                    <div className="alert alert-info">
                      <strong>Reply:</strong> {msg.reply}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    className="btn btn-danger btn-sm mb-2"
                    onClick={() => handleDelete(msg._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="reply-section mt-3">
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Write a reply..."
                  value={replyText[msg._id] || ''}
                  onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                />
                <button
                  className="btn btn-primary btn-sm mt-2"
                  disabled={!replyText[msg._id]}
                  onClick={() => handleReplySubmit(msg._id)}
                >
                  Send Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

export default Notifications;
