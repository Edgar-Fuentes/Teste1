import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUtensils, 
  FaUsers, 
  FaBriefcase, 
  FaHeart, 
  FaComment, 
  FaShare, 
  FaBookmark,
  FaFire,
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch
} from 'react-icons/fa';
import './MainMenu.css';

function MainMenu({ darkMode, jobs = [], profile = {} }) {
  const [stories, setStories] = useState([
    { id: 1, name: 'Your Story', image: profile.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop&crop=face', isOwn: true },
    { id: 2, name: 'Churrascaria Dom', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop', viewed: false },
    { id: 3, name: 'Pizzaria Milano', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop', viewed: true },
    { id: 4, name: 'Café Central', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop', viewed: false },
    { id: 5, name: 'Sushi Zen', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop', viewed: false }
  ]);

  const [feed, setFeed] = useState([
    {
      id: 1,
      restaurant: 'Churrascaria Dom Pedro',
      avatar: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      caption: 'Procurando garçons experientes para fim de semana movimentado! 💼 Salário competitivo + gorjetas',
      position: 'Garçom/Garçonete',
      salary: 'R$ 25/hora + gorjetas',
      location: 'Centro, Pelotas',
      time: '2h',
      likes: 24,
      comments: 8,
      isLiked: false,
      isSaved: false,
      urgent: true
    },
    {
      id: 2,
      restaurant: 'Pizzaria Milano',
      avatar: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      caption: 'Buscamos pizzaiolo criativo para nossa equipe! Ambiente jovem e descontraído 🍕',
      position: 'Pizzaiolo',
      salary: 'R$ 30/hora',
      location: 'Três Vendas, Pelotas',
      time: '4h',
      likes: 18,
      comments: 5,
      isLiked: true,
      isSaved: false,
      urgent: false
    },
    {
      id: 3,
      restaurant: 'Café Central',
      avatar: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop',
      caption: 'Barista para período matutino. Experiência com cafés especiais é um plus! ☕',
      position: 'Barista',
      salary: 'R$ 22/hora',
      location: 'Centro, Pelotas',
      time: '6h',
      likes: 31,
      comments: 12,
      isLiked: false,
      isSaved: true,
      urgent: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [quickStats, setQuickStats] = useState({
    activeJobs: 47,
    newToday: 12,
    totalHires: 234
  });

  const handleLike = (id) => {
    setFeed(feed.map(item => 
      item.id === id 
        ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
        : item
    ));
  };

  const handleSave = (id) => {
    setFeed(feed.map(item => 
      item.id === id 
        ? { ...item, isSaved: !item.isSaved }
        : item
    ));
  };

  const filteredFeed = feed.filter(item =>
    item.restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`main-menu ${darkMode ? 'dark' : ''}`}>
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar vagas, restaurantes, localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <FaBriefcase className="stat-icon" />
          <span className="stat-number">{quickStats.activeJobs}</span>
          <span className="stat-label">Vagas Ativas</span>
        </div>
        <div className="stat-card">
          <FaFire className="stat-icon hot" />
          <span className="stat-number">{quickStats.newToday}</span>
          <span className="stat-label">Novas Hoje</span>
        </div>
        <div className="stat-card">
          <FaStar className="stat-icon" />
          <span className="stat-number">{quickStats.totalHires}</span>
          <span className="stat-label">Contratações</span>
        </div>
      </div>

      {/* Stories */}
      <div className="stories-container">
        <div className="stories-scroll">
          {stories.map(story => (
            <div key={story.id} className={`story-item ${story.viewed ? 'viewed' : ''}`}>
              <div className="story-ring">
                <img src={story.image} alt={story.name} />
                {story.isOwn && <FaPlus className="add-story" />}
              </div>
              <span className="story-name">{story.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/jobs" className="action-card primary">
          <FaBriefcase className="action-icon" />
          <div className="action-content">
            <h3>Postar Vaga</h3>
            <p>Encontre o talento ideal</p>
          </div>
        </Link>
        <Link to="/freelancers" className="action-card secondary">
          <FaUsers className="action-icon" />
          <div className="action-content">
            <h3>Buscar Talentos</h3>
            <p>Perfis disponíveis</p>
          </div>
        </Link>
      </div>

      {/* Job Feed */}
      <div className="feed-container">
        <div className="feed-header">
          <h2>
            <FaFire className="feed-icon" />
            Vagas em Destaque
          </h2>
          <div className="feed-filters">
            <button className="filter-btn active">Todas</button>
            <button className="filter-btn">Urgentes</button>
            <button className="filter-btn">Próximas</button>
          </div>
        </div>

        {filteredFeed.map(item => (
          <div key={item.id} className="feed-post">
            {/* Post Header */}
            <div className="post-header">
              <div className="post-user">
                <img src={item.avatar} alt={item.restaurant} className="post-avatar" />
                <div className="post-info">
                  <h4 className="restaurant-name">{item.restaurant}</h4>
                  <div className="post-meta">
                    <FaMapMarkerAlt className="meta-icon" />
                    <span>{item.location}</span>
                    <span className="separator">•</span>
                    <FaClock className="meta-icon" />
                    <span>{item.time}</span>
                    {item.urgent && <span className="urgent-badge">Urgente</span>}
                  </div>
                </div>
              </div>
              <button className="post-menu">⋯</button>
            </div>

            {/* Post Image */}
            <div className="post-image">
              <img src={item.image} alt="Job" />
              <div className="job-overlay">
                <div className="job-details">
                  <h3 className="job-position">{item.position}</h3>
                  <p className="job-salary">{item.salary}</p>
                </div>
              </div>
            </div>

            {/* Post Actions */}
            <div className="post-actions">
              <div className="action-group">
                <button 
                  className={`action-btn ${item.isLiked ? 'liked' : ''}`}
                  onClick={() => handleLike(item.id)}
                >
                  <FaHeart />
                </button>
                <button className="action-btn">
                  <FaComment />
                </button>
                <button className="action-btn">
                  <FaShare />
                </button>
              </div>
              <button 
                className={`action-btn ${item.isSaved ? 'saved' : ''}`}
                onClick={() => handleSave(item.id)}
              >
                <FaBookmark />
              </button>
            </div>

            {/* Post Engagement */}
            <div className="post-engagement">
              <p className="likes-count">{item.likes} curtidas</p>
              <div className="post-caption">
                <span className="restaurant-handle">@{item.restaurant.toLowerCase().replace(/\s+/g, '')}</span>
                <span className="caption-text">{item.caption}</span>
              </div>
              {item.comments > 0 && (
                <button className="view-comments">
                  Ver todos os {item.comments} comentários
                </button>
              )}
            </div>

            {/* Apply Button */}
            <Link to={`/jobs/${item.id}`} className="apply-btn">
              <FaBriefcase />
              Candidatar-se
            </Link>
          </div>
        ))}
      </div>

      {/* Bottom Suggestions */}
      <div className="suggestions">
        <h3>Sugestões para você</h3>
        <div className="suggestion-list">
          <div className="suggestion-item">
            <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=60&h=60&fit=crop" alt="Restaurant" />
            <div className="suggestion-info">
              <h4>Hamburgeria Artesanal</h4>
              <p>3 vagas disponíveis</p>
            </div>
            <button className="follow-btn">Seguir</button>
          </div>
          <div className="suggestion-item">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=60&h=60&fit=crop" alt="Restaurant" />
            <div className="suggestion-info">
              <h4>Restaurante Japonês</h4>
              <p>2 vagas disponíveis</p>
            </div>
            <button className="follow-btn">Seguir</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;