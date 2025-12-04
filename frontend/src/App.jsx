// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </div>
  );
}

export default App;