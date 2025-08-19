import React, { useState, useEffect, useRef } from 'react';

const MessagingMenu = ({ 
  conversations, 
  setConversations, 
  profile, 
  jobs,
  darkMode, 
  onSendMessage, 
  showNotification 
}) => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newConversationForm, setNewConversationForm] = useState({
    recipient: '',
    subject: '',
    jobId: '',
    message: ''
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  // Focus input when conversation changes
  useEffect(() => {
    if (activeConversation && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeConversation]);

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.participant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: profile.name || 'You',
      timestamp: new Date().toISOString(),
      type: 'sent',
      read: true
    };

    setConversations(prev => prev.map(conv =>
      conv.id === activeConversation.id
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastActivity: new Date().toISOString(),
            lastMessage: newMessage.trim()
          }
        : conv
    ));

    setNewMessage('');
    showNotification('Message sent! 📨', 'success');

    // Simulate receiving a reply (for demo purposes)
    setTimeout(() => {
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        text: getRandomReply(),
        sender: activeConversation.participant,
        timestamp: new Date().toISOString(),
        type: 'received',
        read: false
      };

      setConversations(prev => prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, replyMessage],
              lastActivity: new Date().toISOString(),
              lastMessage: replyMessage.text,
              unreadCount: (conv.unreadCount || 0) + 1
            }
          : conv
      ));
    }, 2000 + Math.random() * 3000);
  };

  // Handle creating a new conversation
  const handleNewConversation = (e) => {
    e.preventDefault();
    if (!newConversationForm.recipient || !newConversationForm.message) {
      showNotification('Please fill in recipient and message', 'error');
      return;
    }

    const newConv = {
      id: Date.now().toString(),
      participant: newConversationForm.recipient,
      subject: newConversationForm.subject || 'New Conversation',
      jobId: newConversationForm.jobId,
      jobTitle: newConversationForm.jobId ? jobs.find(j => j.id === newConversationForm.jobId)?.title : null,
      messages: [{
        id: Date.now().toString(),
        text: newConversationForm.message,
        sender: profile.name || 'You',
        timestamp: new Date().toISOString(),
        type: 'sent',
        read: true
      }],
      lastActivity: new Date().toISOString(),
      lastMessage: newConversationForm.message,
      unreadCount: 0,
      avatar: generateAvatar(newConversationForm.recipient)
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversation(newConv);
    setNewConversationForm({
      recipient: '',
      subject: '',
      jobId: '',
      message: ''
    });
    setShowNewConversation(false);
    showNotification('Conversation started! 🚀', 'success');
  };

  // Mark conversation as read
  const markAsRead = (conversationId) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map(msg => ({ ...msg, read: true }))
          }
        : conv
    ));
  };

  // Generate random reply for demo
  const getRandomReply = () => {
    const replies = [
      "Thanks for reaching out! I'll get back to you soon.",
      "Sounds interesting! When would be a good time to discuss?",
      "I'd love to learn more about this opportunity.",
      "Let me check my schedule and get back to you.",
      "That looks great! I have some questions though.",
      "Perfect timing! I was just looking for something like this.",
      "Thanks for considering me for this position!"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // Generate avatar initials
  const generateAvatar = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 7 * 24) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="messaging-menu" style={{ display: 'flex', height: '70vh', gap: '16px' }}>
      {/* Conversations Sidebar */}
      <div style={{ 
        width: '350px', 
        minWidth: '300px',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '20px',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--gradient-primary)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '20px' }}>💬 Messages</h2>
            <button 
              onClick={() => setShowNewConversation(true)}
              className="btn btn-accent"
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              ✉️ New
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search conversations..."
            style={{
              width: '100%',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </div>

        {/* Conversations List */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '8px'
        }}>
          {filteredConversations.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px', 
              color: 'var(--text-secondary)' 
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <p>No conversations yet</p>
              <button 
                onClick={() => setShowNewConversation(true)}
                className="btn btn-primary"
                style={{ marginTop: '16px', fontSize: '14px', padding: '8px 16px' }}
              >
                Start Chatting
              </button>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConversation(conv);
                  markAsRead(conv.id);
                }}
                style={{
                  padding: '16px',
                  marginBottom: '8px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: activeConversation?.id === conv.id 
                    ? 'var(--gradient-primary)' 
                    : 'var(--bg-tertiary)',
                  color: activeConversation?.id === conv.id ? 'white' : 'var(--text-primary)',
                  border: '1px solid var(--border-light)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (activeConversation?.id !== conv.id) {
                    e.target.style.transform = 'translateX(4px)';
                    e.target.style.boxShadow = 'var(--shadow-md)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeConversation?.id !== conv.id) {
                    e.target.style.transform = 'translateX(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: activeConversation?.id === conv.id 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'var(--gradient-accent)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {conv.avatar || generateAvatar(conv.participant)}
                  </div>

                  {/* Conversation Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '150px'
                      }}>
                        {conv.participant}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        opacity: 0.8,
                        whiteSpace: 'nowrap'
                      }}>
                        {formatTime(conv.lastActivity)}
                      </div>
                    </div>

                    <div style={{ 
                      fontSize: '12px', 
                      opacity: 0.8,
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {conv.jobTitle && `📋 ${conv.jobTitle}`}
                      {conv.subject && !conv.jobTitle && `💬 ${conv.subject}`}
                    </div>

                    <div style={{ 
                      fontSize: '13px', 
                      opacity: 0.9,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {conv.lastMessage}
                    </div>
                  </div>
                </div>

                {/* Unread Badge */}
                {conv.unreadCount > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'var(--danger)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div style={{ 
              padding: '20px',
              borderBottom: '1px solid var(--border-light)',
              background: 'var(--gradient-primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>
                {activeConversation.avatar || generateAvatar(activeConversation.participant)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{activeConversation.participant}</h3>
                {activeConversation.jobTitle && (
                  <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                    📋 {activeConversation.jobTitle}
                  </p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div 
              className="message-thread"
              style={{ 
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: 'var(--bg-secondary)'
              }}
            >
              {activeConversation.messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.type}`}
                  style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '18px',
                    position: 'relative',
                    animation: 'messageSlideIn 0.3s ease',
                    ...(message.type === 'sent' ? {
                      alignSelf: 'flex-end',
                      background: 'var(--gradient-primary)',
                      color: 'white'
                    } : {
                      alignSelf: 'flex-start',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-primary)'
                    })
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>{message.text}</div>
                  <div style={{ 
                    fontSize: '11px', 
                    opacity: 0.7,
                    textAlign: message.type === 'sent' ? 'right' : 'left'
                  }}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form 
              onSubmit={handleSendMessage}
              style={{ 
                padding: '20px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                gap: '12px'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid var(--border-light)',
                  borderRadius: '25px',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--primary)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-light)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="btn btn-primary"
                style={{
                  padding: '12px 20px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  opacity: newMessage.trim() ? 1 : 0.5
                }}
              >
                📤 Send
              </button>
            </form>
          </>
        ) : (
          /* No Conversation Selected */
          <div style={{ 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            padding: '40px'
          }}>
            <div>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConversation && (
        <div className="welcome-modal">
          <div className="welcome-content" style={{ maxWidth: '500px' }}>
            <h2>✉️ New Conversation</h2>
            <form onSubmit={handleNewConversation}>
              <div className="form-group">
                <label>Recipient *</label>
                <input
                  type="text"
                  value={newConversationForm.recipient}
                  onChange={(e) => setNewConversationForm({...newConversationForm, recipient: e.target.value})}
                  placeholder="Who do you want to message?"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  value={newConversationForm.subject}
                  onChange={(e) => setNewConversationForm({...newConversationForm, subject: e.target.value})}
                  placeholder="What's this about? (optional)"
                />
              </div>

              {jobs.length > 0 && (
                <div className="form-group">
                  <label>Related Job (optional)</label>
                  <select
                    value={newConversationForm.jobId}
                    onChange={(e) => setNewConversationForm({...newConversationForm, jobId: e.target.value})}
                  >
                    <option value="">Select a job (optional)</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title} - {job.restaurant}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  value={newConversationForm.message}
                  onChange={(e) => setNewConversationForm({...newConversationForm, message: e.target.value})}
                  placeholder="Type your message here..."
                  rows="4"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn btn-success">
                  📤 Send Message
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowNewConversation(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingMenu;