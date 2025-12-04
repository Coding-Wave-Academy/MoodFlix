// client/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const MOOD_SUGGESTIONS = [
  { mood: 'happy', icon: '😊', description: 'Feeling joyful and upbeat' },
  { mood: 'sad', icon: '😢', description: 'Need comfort or catharsis' },
  { mood: 'excited', icon: '🤩', description: 'Ready for adventure and thrills' },
  { mood: 'relaxed', icon: '🧘', description: 'Calm and stress-free vibes' },
  { mood: 'nostalgic', icon: '🕰️', description: 'Longing for memories' },
  { mood: 'romantic', icon: '❤️', description: 'Love stories and emotions' },
  { mood: 'adventurous', icon: '🌍', description: 'Epic journeys and exploration' },
  { mood: 'scary', icon: '👻', description: 'Spine-chilling suspense' },
];

export default function Home() {
  const [mood, setMood] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';

  const handleRecommend = async () => {
    if (!mood.trim()) {
      setError('Please enter a mood!');
      return;
    }

    setLoading(true);
    setError('');
    setMovies([]);
    setCurrentIndex(0);
    setIsAnimating(false);

    try {
      const response = await fetch('http://localhost:5000/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood }),
      });

      if (!response.ok) throw new Error('Failed to get recommendations');
      const data = await response.json();
      setMovies(data.movies);
    } catch (err) {
      setError(err,'Something went wrong. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleMoodClick = (selectedMood) => {
    setMood(selectedMood);
    handleRecommend();
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const nextMovie = () => {
    if (isAnimating || movies.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(prev => {
      const newIndex = (prev + 1) % movies.length;
      setTimeout(() => setIsAnimating(false), 500);
      return newIndex;
    });
  };

  const prevMovie = () => {
    if (isAnimating || movies.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(prev => {
      const newIndex = (prev - 1 + movies.length) % movies.length;
      setTimeout(() => setIsAnimating(false), 500);
      return newIndex;
    });
  };

  // Generate carousel items with 3D positioning
  const carouselItems = [];
  const visibleCount = 5;
  const halfVisible = Math.floor(visibleCount / 2);

  for (let i = 0; i < visibleCount; i++) {
    const index = (currentIndex - halfVisible + i + movies.length) % movies.length;
    const movie = movies[index];
    
    if (!movie) continue;
    
    const position = i - halfVisible;
    const scale = 1 - Math.abs(position) * 0.15;
    const opacity = 0.5 + (1 - Math.abs(position) * 0.2);
    const zIndex = visibleCount - Math.abs(position);
    
    carouselItems.push({
      id: movie.id,
      title: movie.title,
      poster: movie.posterPath,
      position,
      scale,
      opacity,
      zIndex
    });
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextMovie();
      if (e.key === 'ArrowLeft') prevMovie();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, movies, isAnimating]);

  return (
    <div className="container">
      <div className="header-section">
        <h1>MoodFlix 🎬</h1>
        <p className="subtitle">Tell us your mood, and we'll find the perfect movie for you</p>
      </div>

      <div className="mood-section">
        <div className="mood-input">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="e.g., happy, nostalgic, excited..."
            onKeyPress={(e) => e.key === 'Enter' && handleRecommend()}
          />
          <button onClick={handleRecommend}>Find Movies</button>
        </div>
        
       <div className="mood-buttons">
  {MOOD_SUGGESTIONS.map(({ mood: m, icon, description }) => (
    <button
      key={m}
      className="mood-btn"
      onClick={() => handleMoodClick(m)}
      onMouseEnter={(e) => e.currentTarget.classList.add('mood-hover')}
      onMouseLeave={(e) => e.currentTarget.classList.remove('mood-hover')}
      aria-label={`Feeling ${m}? ${description}`}
    >
      <div className="mood-icon-container">
        <span className="mood-icon">{icon}</span>
      </div>
      <span className="mood-text">{m}</span>
      <div className="mood-tooltip">{description}</div>
      <div className="mood-glow"></div>
    </button>
  ))}
</div>


      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Finding your perfect movie... 🍿</p>}

      {!loading && movies.length > 0 && (
        <div className="carousel-container">
          <button 
            className="carousel-nav left" 
            onClick={prevMovie}
            disabled={isAnimating}
          >
            <span>‹</span>
          </button>
          
          <div className="carousel">
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="carousel-item"
                style={{
                  transform: `translateX(${item.position * 150}px) scale(${item.scale})`,
                  opacity: item.opacity,
                  zIndex: item.zIndex,
                  transition: isAnimating ? 'all 0.5s ease' : 'none'
                }}
                onClick={() => handleMovieClick(item.id)}
              >
                <div className="carousel-card">
                  <img 
                    src={`${TMDB_POSTER_BASE}${item.poster}`} 
                    alt={item.title}
                    className="carousel-poster"
                  />
                  <div className="carousel-title">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="carousel-nav right" 
            onClick={nextMovie}
            disabled={isAnimating}
          >
            <span>›</span>
          </button>
        </div>
      )}

      {!loading && movies.length === 0 && !error && (
        <div className="empty-state">
          <h2>How it works</h2>
          <p>1. Enter or select a mood</p>
          <p>2. Get personalized movie recommendations</p>
          <p>3. Click any movie to explore details</p>
        </div>
      )}
    </div>
  );
}