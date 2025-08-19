import React, { useState } from "react";

function ProfileMenu({ profile, setProfile, darkMode }) {
  const [name, setName] = useState(profile.name || "");
  const [description, setDescription] = useState(profile.description || "");
  const [courseTitle, setCourseTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [isPremium, setIsPremium] = useState(profile.isPremium || false);

  const saveProfile = () => {
    setProfile(prev => ({
      ...prev,
      name,
      description,
      isPremium,
      comments: prev.comments || [],
      messages: prev.messages || [],
      payments: prev.payments || [],
    }));
  };

  const addCourse = () => {
    if (courseTitle.trim()) {
      setProfile(prev => ({
        ...prev,
        courses: [...(prev.courses || []), courseTitle],
      }));
      setCourseTitle("");
    }
  };

  const addComment = () => {
    if (newComment.trim()) {
      setProfile(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
      setNewComment("");
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      setProfile(prev => ({
        ...prev,
        messages: [...(prev.messages || []), { to: "Company", text: message, time: new Date().toLocaleTimeString() }],
      }));
      setMessage("");
    }
  };

  return (
    <div className={`menu-container ${darkMode ? "dark" : ""}`}>
      <div className="card">
        <h2>Your Profile</h2>
        <div className="form-group">
          <label>Name <span className="tooltip">(Your full name)</span></label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            aria-label="Profile name input"
          />
          <label>Description <span className="tooltip">(About you)</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about yourself"
            aria-label="Profile description input"
          />
          <button onClick={saveProfile} className="btn btn-primary">
            Save Profile
          </button>
        </div>
      </div>
      <div className="card">
        <h2>Add a Course</h2>
        <div className="form-group">
          <label>Course Title <span className="tooltip">(e.g., Cooking 101)</span></label>
          <input
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter course title"
            aria-label="Course title input"
          />
          <button onClick={addCourse} className="btn btn-primary">
            Add Course
          </button>
        </div>
        <div className="job-list">
          {(profile.courses || []).map((course, index) => (
            <div key={index} className="job-item">
              <h3>{course}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Your Comments</h2>
        <div className="form-group">
          <label>Comment <span className="tooltip">(Share your thoughts)</span></label>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            aria-label="Comment input"
          />
          <button onClick={addComment} className="btn btn-primary">
            Add Comment
          </button>
        </div>
        <ul>
          {(profile.comments || []).map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h2>Messages</h2>
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
        <ul>
          {(profile.messages || []).map((msg, i) => (
            <li key={i}>{`To ${msg.to} (${msg.time}): ${msg.text}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfileMenu;
