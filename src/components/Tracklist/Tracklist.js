import React from 'react';
import './Tracklist.css';
import Track from '../Track/Track.js';

const Tracklist = ({ tracks, onAdd, onRemove, onPlay, currentlyPlaying, isPlaylist }) => (
  <div className="tracklist">
    {tracks.length > 0 ? (
      tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          onAdd={onAdd}
          onRemove={onRemove}
          onPlay={onPlay}
          currentlyPlaying={currentlyPlaying}
          isPlaylist={isPlaylist}
        />
      ))
    ) : (
      <p>No tracks 😞</p>
    )}
  </div>
);

export default Tracklist;
