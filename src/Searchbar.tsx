import { useState } from 'react';
import axios from 'axios';
import './searchbar.css';

interface SearchResult {
  url: string;
  // add any other properties here
}

const generateId = (): string => {
  const randomString = Math.random().toString(36).substr(2, 5);
  const timestamp = Date.now().toString(36);
  return `${randomString}${timestamp}`;
};


  const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
    const handleSearch = async () => {
      try {
        const response = await axios.post('/api/images', {
          prompt: searchTerm,
          n: 3,
          size: '512x512'
        });
        console.log('Success:', response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.log('Error:', error);
      }
    };
  
    return (
      <div className="search-bar-container">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        <ul>
          {searchResults.map(result => (
            <li key={generateId()}>
              <img className="theImg" src={result.url} alt="result" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  

export default SearchBar;
