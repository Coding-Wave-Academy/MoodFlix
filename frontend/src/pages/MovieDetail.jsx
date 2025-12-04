// client/src/pages/MovieDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './MovieDetail.css'

export default function MovieDetail() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    
    const fetchMovie = async () => {
      try {
        const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY; // We'll set this soon
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleGoHome = () => navigate('/');

  const handleWatch = () => {
    if (movie) {
      const searchQuery = encodeURIComponent(movie.title);
      window.open(`https://moviebox.ph/?s=${searchQuery}`, '_blank');
    }
  };

  if (loading) return <div className="container"><p className="loading">Loading movie...</p></div>;

  if (!movie) return (
    <div className="container">
      <p className="error">Movie not found.</p>
      <button onClick={handleGoHome}>← Back to Home</button>
    </div>
  );

  return (
    <div className="container movie-detail">
      <button className="back-btn" onClick={handleGoHome}>← Back</button>
      <div className="detail-content">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="detail-poster"
        />
        <div className="detail-info">
          <h1>{movie.title}</h1>
          <p className="tagline">{movie.tagline || ''}</p>
          <p><strong>Rating:</strong> ⭐ {movie.vote_average.toFixed(1)}/10</p>
          <p><strong>Release:</strong> {movie.release_date}</p>
          <p><strong>Overview:</strong></p>
          <p className="overview">{movie.overview}</p>

          <button className="watch-btn" onClick={handleWatch}>
            🎥 Watch or Download on MovieBox.ph
          </button>
        </div>
      </div>
    </div>
  );
}