import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './components/Spotify';

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [userId, setUserId] = useState(null);

  // Loads the token on startup
  useEffect(() => {
    Spotify.getAccessTokenFromUrl();
    Spotify.loadAccessTokenFromStorage();

    // If no token, redirects for authentication
    if (!Spotify.isAuthenticated()) {
      Spotify.authenticate();
    }
  }, []);

  // Retrieves the user's ID
  useEffect(() => {
    const fetchUserId = async () => {
        const id = await Spotify.getUserId();
        setUserId(id);
    };
    fetchUserId();
  }, []);

  const handleSearch = async (searchTerm) => {
    const tracks = await Spotify.searchTracks(searchTerm);
    setSearchResults(tracks);
  };

  const addTrack = (track) => {
    if (!playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    }
  };

  const removeTrack = (track) => {
    setPlaylistTracks((prevTracks) => prevTracks.filter((savedTrack) => savedTrack.id !== track.id));
  };

  const handleNameChange = (newName) => {
    setPlaylistName(newName);
  };

  const savePlaylist = async () => {
    if (!playlistTracks.length) return;

    const playlistId = await Spotify.createPlaylist(userId, playlistName);
    const trackUris = playlistTracks.map((track) => track.uri);
    await Spotify.addTracksToPlaylist(playlistId, trackUris);

    setPlaylistTracks([]);
    setPlaylistName('My Playlist');
  };

  return (
    <div>
      <div className="header">
        <h1>Jam<span className="highlight">m</span>ming</h1>
      </div>
      <div className="background-section">
        <SearchBar onSearch={handleSearch} />
        <div className="main-content">
          <div className="left-column">
            <SearchResults tracks={searchResults} onAdd={addTrack} />
          </div>
          <div className="right-column">
            <Playlist
              name={playlistName}
              tracks={playlistTracks}
              onNameChange={handleNameChange}
              onRemove={removeTrack}
              onSave={savePlaylist}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
