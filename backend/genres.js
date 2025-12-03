
// Mood to genre names 
const moodToGenreNames = {
  happy: ['Comedy', 'Musical', 'Family'],
  sad: ['Drama', 'Romance'],
  excited: ['Action', 'Adventure', 'Sci-Fi'],
  relaxed: ['Animation', 'Documentary', 'Fantasy'],
  nostalgic: ['Drama', 'Romance', 'Classic'],
  romantic: ['Romance', 'Drama'],
  adventurous: ['Adventure', 'Action', 'Fantasy'],
  scary: ['Horror', 'Thriller'],
  thoughtful: ['Drama', 'Documentary'],
  funny: ['Comedy', 'Family'],
};

// TMDb genre ID mapping (official as of 2024)
const tmdbGenreMap = {
  'Action': 28,
  'Adventure': 12,
  'Animation': 16,
  'Comedy': 35,
  'Crime': 80,
  'Documentary': 99,
  'Drama': 18,
  'Family': 10751,
  'Fantasy': 14,
  'History': 36,
  'Horror': 27,
  'Music': 10402,
  'Musical': 10402, // TMDb groups Music & Musical
  'Mystery': 9648,
  'Romance': 10749,
  'Science Fiction': 878,
  'Sci-Fi': 878,
  'TV Movie': 10770,
  'Thriller': 53,
  'War': 10752,
  'Western': 37,
  'Classic': 18, // Classic films often fall under Drama
};

function getGenreIdsForMood(mood) {
  const normalizedMood = mood.toLowerCase().trim();
  const genres = moodToGenreNames[normalizedMood] || moodToGenreNames['happy']; // fallback

  const ids = [];
  for (const genreName of genres) {
    const id = tmdbGenreMap[genreName];
    if (id && !ids.includes(id)) {
      ids.push(id);
    }
  }
  return ids.length ? ids : [35]; // default: Comedy
}

module.exports = { getGenreIdsForMood, tmdbGenreMap };