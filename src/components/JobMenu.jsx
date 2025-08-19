import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function JobMenu({ jobs, setJobs, profile, darkMode }) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobPay, setJobPay] = useState("");
  const [jobCategory, setJobCategory] = useState("Chef");
  const [location, setLocation] = useState("Pelotas");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      }, (err) => setLocation("Pelotas")); // Fallback to Pelotas
    }
  }, []);

  const addJob = () => {
    if (jobTitle.trim() && jobDescription.trim() && jobPay.trim()) {
      setJobs([
        ...jobs,
        {
          id: Date.now(),
          title: jobTitle,
          description: jobDescription,
          pay: jobPay,
          category: jobCategory,
          filled: false,
          company: profile.name || "My Company",
          location,
          image: null,
          messages: [],
        },
      ]);
      setJobTitle("");
      setJobDescription("");
      setJobPay("");
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.company === profile.name &&
      (job.location.includes("Pelotas") || !job.location)
  );

  return (
    <div className={`menu-container ${darkMode ? "dark" : ""}`}>
      <div className="card">
        <h2>Post a New Job</h2>
        <div className="form-group">
          <label>Job Title <span className="tooltip">(e.g., Chef)</span></label>
          <input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Enter job title"
            aria-label="Job title input"
          />
          <label>Job Description <span className="tooltip">(e.g., Part-time)</span></label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Describe the job"
            aria-label="Job description input"
          />
          <label>Pay <span className="tooltip">(e.g., $20/hr)</span></label>
          <input
            value={jobPay}
            onChange={(e) => setJobPay(e.target.value)}
            placeholder="Enter pay rate"
            aria-label="Job pay input"
          />
          <label>Category <span className="tooltip">(Choose a role)</span></label>
          <select
            value={jobCategory}
            onChange={(e) => setJobCategory(e.target.value)}
            aria-label="Job category select"
          >
            <option value="Chef">Chef</option>
            <option value="Server">Server</option>
            <option value="Delivery">Delivery</option>
          </select>
          <button onClick={addJob} className="btn btn-primary">
            Add Job
          </button>
        </div>
      </div>
      <div className="card">
        <h2>Your Jobs</h2>
        <div className="job-list">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id} className="job-item">
                <h3>{job.title}</h3>
                <p>Pay: {job.pay} | Category: {job.category}</p>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <h3>No Jobs</h3>
              <p>Post a job to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobMenu;