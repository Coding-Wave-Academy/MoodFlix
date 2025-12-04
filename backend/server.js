import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { getGenreIdsForMood } from './genres.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT;
const TMDB_API_KEY = process.env.TDMDB_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MoodFlix Backend is up and running');
})

// Recommendation endpoint
app.post('/recommend', async (req, res) => {
  try {
    console.log('Request received:', req.body);
    const { mood } = req.body;
    console.log('Mood extracted:', mood);

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    const genreIds = getGenreIdsForMood(mood);
    const randomGenreId = genreIds[Math.floor(Math.random() * genreIds.length)];
    console.log('Genre IDs:', genreIds, 'Selected:', randomGenreId);

    // Fetch movies from TMDb
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${randomGenreId}&sort_by=popularity.desc&vote_count.gte=100`
    );

    console.log('TMDb Response received with', response.data.results.length, 'movies');

    const movies = response.data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      rating: movie.vote_average,
    }));

    res.json({ mood, genreId: randomGenreId, movies });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
