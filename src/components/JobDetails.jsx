import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

function JobDetails({ jobs, profile, setProfile, darkMode }) {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === parseInt(id));
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const handleRating = (rate) => setRating(rate);
  const addComment = () => {
    if (comment.trim() && job) {
      job.comments = job.comments || [];
      job.comments.push(comment);
      setComment("");
    }
  };
  const sendMessage = () => {
    if (message.trim() && job) {
      job.messages = job.messages || [];
      job.messages.push({ from: profile.name || "User", text: message, time: new Date().toLocaleTimeString() });
      setMessage("");
      // Sync with profile messages
      setProfile(prev => ({
        ...prev,
        messages: [...prev.messages, { jobId: job.id, from: profile.name || "User", text: message, time: new Date().toLocaleTimeString() }]
      }));
    }
  };

  return (
    <div className={`menu-container ${darkMode ? "dark" : ""}`}>
      <div className="card">
        <h2>Job Details</h2>
        {job ? (
          <>
            <h3>{job.title}</h3>
            <p>Description: {job.description}</p>
            <p>Pay: {job.pay}</p>
            <p>Category: {job.category}</p>
            <p>Status: {job.filled ? "Filled" : "Open"}</p>
            <div>
              <h4>Rate Freelancer</h4>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => handleRating(star)}
                  color={star <= rating ? "#ffd700" : "#e4e4e4"}
                  style={{ cursor: "pointer", marginRight: "5px" }}
                  aria-label={`Rate ${star} stars`}
                />
              ))}
              <p>Rating: {rating} / 5</p>
            </div>
            <div className="form-group">
              <label>Comment <span className="tooltip">(Share feedback)</span></label>
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
                aria-label="Comment input"
              />
              <button onClick={addComment} className="btn btn-primary">
                Add Comment
              </button>
            </div>
            {job.comments && (
              <ul>
                {job.comments.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}
            <div className="form-group">
              <label>Message <span className="tooltip">(Chat with company)</span></label>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                aria-label="Message input"
              />
              <button onClick={sendMessage} className="btn btn-primary">
                Send Message
              </button>
            </div>
            {job.messages && (
              <ul>
                {job.messages.map((msg, i) => (
                  <li key={i}>{`${msg.from} (${msg.time}): ${msg.text}`}</li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p>Job not found</p>
        )}
      </div>
    </div>
  );
}

export default JobDetails;