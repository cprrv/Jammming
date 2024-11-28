import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='searchBar'>
      <input
        type='text'
        placeholder='Enter a song, an album or an artist'
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <button onClick={handleSearch}>Search</button>
      {searchTerm && (
        <button className="clearButton" onClick={() => setSearchTerm('')}>&#10006;</button>
      )}
    </div>
  );
};

export default SearchBar;
