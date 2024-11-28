import React, { useState } from 'react';
import './SearchResults.css';
import Tracklist from '../Tracklist/Tracklist.js';

const SearchResults = ({ tracks, onAdd }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const handlePlay = (trackId) => {
    if (currentlyPlaying === trackId) {
    setCurrentlyPlaying(null); // Stops the track if it is already playing
  } else {
    setCurrentlyPlaying(trackId); // Starts the track if it is not already playing
  } 
};

  return (
    <div className="searchResults">
      <h2>Results</h2>
      <Tracklist 
        tracks={tracks} 
        onAdd={onAdd} 
        onPlay={handlePlay} 
        currentlyPlaying={currentlyPlaying} 
      />
    </div>
  );
};

export default SearchResults;
