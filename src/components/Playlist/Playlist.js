import React, { useState } from 'react';
import './Playlist.css';
import Tracklist from '../Tracklist/Tracklist';

const Playlist = ({ 
  name, 
  tracks, 
  onNameChange, 
  onRemove, 
  onSave 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleNameChange = (e) => {
    setEditedName(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const updatedName = editedName.trim() ? editedName : 'My Playlist';
    setEditedName(updatedName); 
    onNameChange(updatedName);
  };

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedName(name);
    }
  };

  const handleSave = () => {
    onSave(); 
    setEditedName("My Playlist"); 
    onNameChange("My Playlist");
  };

  return (
    <div className='playlist'>
      {isEditing ? (
        <input 
          type='text'
          value='' 
          onChange={handleNameChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Enter playlist name" 
        />
      ) : (
        <h2 onClick={handleClick}>{editedName}</h2>
      )}
      <Tracklist 
        tracks={tracks}
        onRemove={onRemove}
        isPlaylist={true} 
      />
      <button onClick={handleSave}>Save to Spotify</button>
    </div>
  );
};

export default Playlist;
