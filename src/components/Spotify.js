const clientId = '7d7da33aaef24b44b7c597fb861738d9';
const redirectUri = 'http://localhost:3000';
const scope = 'playlist-modify-public playlist-modify-private user-library-read user-read-private user-read-email';

const Spotify = {

  authenticate() {
    if (!this.accessToken) {
      const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
      window.location = authUrl;
    }
  },  

  // Loads the token from the local storage and cheks the expiration
loadAccessTokenFromStorage() {
  const token = localStorage.getItem('spotifyAccessToken');
  const expirationTime = localStorage.getItem('spotifyTokenExpiration');

  if (token && expirationTime) {
    if (Date.now() < expirationTime) {
      this.accessToken = token;
      return;
    } else {
      // Removes the token if it has expired
      localStorage.removeItem('spotifyAccessToken');
      localStorage.removeItem('spotifyTokenExpiration');
    }
  }

  this.authenticate(); // Redirects if no valid token
},

// handles the token and expiration
getAccessTokenFromUrl() {
  const hash = window.location.hash;

  if (hash.includes('access_token')) {
    const urlParams = new URLSearchParams(hash.substring(1));
    const accessToken = urlParams.get('access_token');
    const expiresIn = urlParams.get('expires_in');

    if (accessToken && expiresIn) {
      this.accessToken = accessToken;
      localStorage.setItem('spotifyAccessToken', accessToken);

      // Stores the token expiration date
      const expirationTime = Date.now() + parseInt(expiresIn, 10) * 1000;
      localStorage.setItem('spotifyTokenExpiration', expirationTime);

      window.history.replaceState(null, null, '/'); // Clears the URL after retrieving the token
    }
  }
},

  // Checks if the user is authenticated
  isAuthenticated() {
    return !!this.accessToken && localStorage.getItem('spotifyAccessToken');
  },  

  // Calls the API to get the user's ID
  async getUserId() {
    if (!this.accessToken) {
      this.authenticate();
      return null;
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    if (response.ok) {
      const data = await response.json();
      return data.id;
    }

    console.error('Failed to get user ID');
    return null;
  },

  // Searches tracks
  async searchTracks(searchTerm) {
    if (!this.accessToken) {
      this.authenticate();
      return [];
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=25`,
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.tracks.items || [];
    }

    console.error('Failed to search tracks');
    return [];
  },

  // Creates a playlist
  async createPlaylist(userId, playlistName) {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playlistName,
        description: 'Créée avec Jammming',
        public: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create playlist');
    }

    const data = await response.json();
    return data.id;
  },

  // Adds tracks to a playlist
  async addTracksToPlaylist(playlistId, trackUris) {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add tracks to playlist');
    }

    const data = await response.json();
    return data;
  },
};

export default Spotify;
