import React, { useState, useRef, useEffect } from "react";
import "./Track.css";

const Track = ({
  track,
  onPlay,
  currentlyPlaying,
  onAdd,
  onRemove,
  isPlaylist,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentlyPlaying === track.id && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }

      const timer = setInterval(() => {
        const currentTime = audioRef.current.currentTime;
        const progressPercentage = (currentTime / 15) * 100;
        setProgress(progressPercentage);

        if (currentTime >= 15) {
          clearInterval(timer);
          audioRef.current.pause();
          setProgress(0);
          setIsPlaying(false);
        }
      }, 100);

      return () => clearInterval(timer);
    } else {
      audioRef.current?.pause();
      setProgress(0);
      setIsPlaying(false);
    }
  }, [currentlyPlaying, track.id, isPlaying]);

  const handlePlayPause = () => {
    if (currentlyPlaying === track.id) {
      if (isPlaying) {
        setIsPlaying(false);  // Pauses the track
      } else {
        setIsPlaying(true);   // Resumes the track
      }
    } else {
      onPlay(track.id); // Starts playing the track
      setIsPlaying(true); // Ensures the track starts playing
    }
  };

  const artistNames = track.artists.map((artist) => artist.name).join(", ");
  const albumName = track.album.name;

  return (
    <div className="track">
      <h3>{track.name}</h3>
      <p>{artistNames} | {albumName}</p>
      {track.album.images[0] && (
        <img
          src={track.album.images[0].url}
          alt={albumName}
          className="album-cover"
        />
      )}
      {!isPlaylist && (
      <div className="play-controls">
        <button
          className="play-pause-button"
          onClick={handlePlayPause}
          disabled={!track.preview_url || progress >= 100}
        >
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <span className="button-text">{isPlaying ? "Pause" : "Play"}</span>
        </button>

        <button className="add-remove-button" onClick={() => onAdd(track)}>+</button>
      </div>
      )}
      {track.preview_url && !isPlaylist && (
        <audio ref={audioRef}>
          <source src={track.preview_url} type="audio/mpeg" />
        </audio>
      )}

<div className="track-action">
        {isPlaylist ? (
          <button className="add-remove-button" onClick={() => onRemove(track)}>-</button>
        ) : null}
      </div>
    </div>
  );
};

export default Track;
