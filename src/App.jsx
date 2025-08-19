import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import MainMenu from "./components/MainMenu.jsx";
import JobMenu from "./components/JobMenu.jsx";
import JobDetails from "./components/JobDetails.jsx";
import ProfileMenu from "./components/ProfileMenu.jsx";
import PaymentMenu from "./components/PaymentMenu.jsx";
import MessagingMenu from "./components/MessagingMenu.jsx";
import "./App.css";

function ErrorBoundary({ children }) {
  try {
    return children;
  } catch (error) {
    console.error("Rendering error caught:", error);
    return (
      <div className="error-overlay">
        <div className="card">
          <h3>⚠️ Something went wrong</h3>
          <p>Please refresh the page or check the console for details.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}

function App() {
  // Jobs state with enhanced structure
  const [jobs, setJobs] = useState(() => {
    try {
      const savedJobs = localStorage.getItem("jobs");
      return savedJobs ? JSON.parse(savedJobs) : [];
    } catch {
      return [];
    }
  });

  // Enhanced profile with new fields
  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem("profile");
      const initialProfile = savedProfile
        ? JSON.parse(savedProfile)
        : {
            name: "",
            email: "",
            phone: "",
            description: "",
            logo: "",
            location: "",
            website: "",
            comments: [],
            isPremium: false,
            messages: [],
            payments: [],
            paymentMethods: [],
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            preferences: {
              currency: "USD",
              language: "en",
              timezone: "UTC"
            }
          };
      return initialProfile;
    } catch {
      return {
        name: "",
        email: "",
        phone: "",
        description: "",
        logo: "",
        location: "",
        website: "",
        comments: [],
        isPremium: false,
        messages: [],
        payments: [],
        paymentMethods: [],
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        preferences: {
          currency: "USD",
          language: "en",
          timezone: "UTC"
        }
      };
    }
  });

  // Enhanced dark mode
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedDarkMode = localStorage.getItem("darkMode");
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedDarkMode ? JSON.parse(savedDarkMode) : systemPrefersDark;
    } catch {
      return false;
    }
  });

  // Enhanced notifications
  const [notification, setNotification] = useState({
    message: "",
    type: "success", // success, error, warning, info
    visible: false
  });

  // Welcome modal
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem("visited");
  });

  // Messages state for real-time messaging
  const [conversations, setConversations] = useState(() => {
    try {
      const savedConversations = localStorage.getItem("conversations");
      return savedConversations ? JSON.parse(savedConversations) : [];
    } catch {
      return [];
    }
  });

  // Payment state
  const [payments, setPayments] = useState(() => {
    try {
      const savedPayments = localStorage.getItem("payments");
      return savedPayments ? JSON.parse(savedPayments) : [];
    } catch {
      return [];
    }
  });

  // Enhanced notification system
  const showNotification = (message, type = "success") => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Save to localStorage effects
  useEffect(() => {
    try {
      localStorage.setItem("jobs", JSON.stringify(jobs));
    } catch (error) {
      console.error("Failed to save jobs:", error);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem("profile", JSON.stringify(profile));
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
    } catch (error) {
      console.error("Failed to save dark mode:", error);
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem("conversations", JSON.stringify(conversations));
    } catch (error) {
      console.error("Failed to save conversations:", error);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem("payments", JSON.stringify(payments));
    } catch (error) {
      console.error("Failed to save payments:", error);
    }
  }, [payments]);

  // Job posting notification
  useEffect(() => {
    if (jobs.length > 0 && !notification.visible) {
      const latestJob = jobs[jobs.length - 1];
      if (latestJob && latestJob.isNew) {
        showNotification(`New job posted: ${latestJob.title}`, "success");
        // Remove the isNew flag
        setJobs(prev => prev.map(job => 
          job.id === latestJob.id ? { ...job, isNew: false } : job
        ));
      }
    }
  }, [jobs.length]);

  // Handle welcome modal
  const handleCloseWelcome = () => {
    try {
      localStorage.setItem("visited", "true");
      setShowWelcome(false);
      showNotification("Welcome to Restaurant Jobs! 🎉", "success");
    } catch (error) {
      console.error("Failed to save visited status:", error);
      setShowWelcome(false);
    }
  };

  // Handle theme toggle with system preference detection
  const handleThemeToggle = () => {
    setDarkMode(prev => !prev);
    showNotification(
      `Switched to ${!darkMode ? "dark" : "light"} mode`, 
      "info"
    );
  };

  // Enhanced job creation
  const handleCreateJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      applicants: [],
      views: 0,
      isActive: true,
      isNew: true,
      postedBy: profile.name || "Anonymous"
    };

    setJobs(prev => [...prev, newJob]);
    showNotification("Job posted successfully! 🚀", "success");
  };

  // Enhanced payment processing
  const handleProcessPayment = (paymentData) => {
    const newPayment = {
      ...paymentData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: "processing"
    };

    setPayments(prev => [...prev, newPayment]);

    // Simulate payment processing
    setTimeout(() => {
      setPayments(prev => prev.map(payment => 
        payment.id === newPayment.id 
          ? { ...payment, status: "completed" }
          : payment
      ));
      showNotification("Payment processed successfully! 💳", "success");
    }, 2000);
  };

  // Enhanced messaging
  const handleSendMessage = (conversationId, message) => {
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: profile.name || "You",
      timestamp: new Date().toISOString(),
      type: "sent"
    };

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, messages: [...conv.messages, newMessage], lastActivity: new Date().toISOString() }
        : conv
    ));

    showNotification("Message sent! 📨", "success");
  };

  return (
    <Router>
      <div className={`App ${darkMode ? "dark" : ""}`}>
        {/* Enhanced Welcome Modal */}
        {showWelcome && (
          <div className="welcome-modal">
            <div className="welcome-content">
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍽️</div>
              <h2>Welcome to Restaurant Jobs!</h2>
              <p>
                Connect with top restaurants, post jobs, manage payments, 
                and chat with potential candidates - all in one beautiful platform.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <button onClick={handleCloseWelcome} className="btn btn-primary">
                  Get Started
                </button>
                <button 
                  onClick={() => {
                    handleCloseWelcome();
                    setDarkMode(true);
                  }} 
                  className="btn btn-outline"
                >
                  Dark Mode
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <header className="app-header" role="banner">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "24px" }}>🍽️</div>
            <h1>Restaurant Jobs</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {profile.isPremium && (
              <span style={{ 
                background: "var(--gradient-warning)", 
                color: "white", 
                padding: "4px 12px", 
                borderRadius: "20px", 
                fontSize: "12px", 
                fontWeight: "600" 
              }}>
                ⭐ PREMIUM
              </span>
            )}
            <button
              onClick={handleThemeToggle}
              className="theme-toggle"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Enhanced Notification */}
        {notification.visible && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* Main Content */}
        <main className="app-main" role="main">
          <ErrorBoundary>
            <Routes>
              <Route 
                path="/" 
                element={
                  <MainMenu 
                    darkMode={darkMode} 
                    profile={profile}
                    stats={{
                      totalJobs: jobs.length,
                      activeJobs: jobs.filter(job => job.isActive).length,
                      totalPayments: payments.length,
                      unreadMessages: conversations.reduce((acc, conv) => 
                        acc + conv.messages.filter(msg => !msg.read && msg.type === 'received').length, 0
                      )
                    }}
                  />
                } 
              />
              <Route
                path="/jobs"
                element={
                  <JobMenu
                    jobs={jobs}
                    setJobs={setJobs}
                    profile={profile}
                    darkMode={darkMode}
                    onCreateJob={handleCreateJob}
                    showNotification={showNotification}
                  />
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <JobDetails
                    jobs={jobs}
                    setJobs={setJobs}
                    profile={profile}
                    setProfile={setProfile}
                    darkMode={darkMode}
                    showNotification={showNotification}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProfileMenu
                    profile={profile}
                    setProfile={setProfile}
                    darkMode={darkMode}
                    showNotification={showNotification}
                  />
                }
              />
              <Route
                path="/payments"
                element={
                  <PaymentMenu
                    payments={payments}
                    setPayments={setPayments}
                    profile={profile}
                    setProfile={setProfile}
                    darkMode={darkMode}
                    onProcessPayment={handleProcessPayment}
                    showNotification={showNotification}
                  />
                }
              />
              <Route
                path="/messages"
                element={
                  <MessagingMenu
                    conversations={conversations}
                    setConversations={setConversations}
                    profile={profile}
                    jobs={jobs}
                    darkMode={darkMode}
                    onSendMessage={handleSendMessage}
                    showNotification={showNotification}
                  />
                }
              />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* Enhanced Navigation */}
        <NavBar 
          darkMode={darkMode} 
          unreadCount={conversations.reduce((acc, conv) => 
            acc + conv.messages.filter(msg => !msg.read && msg.type === 'received').length, 0
          )}
          pendingPayments={payments.filter(payment => payment.status === 'pending').length}
        />
      </div>
    </Router>
  );
}

export default App;