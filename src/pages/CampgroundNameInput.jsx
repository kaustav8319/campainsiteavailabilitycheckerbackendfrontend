// components/CampgroundNameInput.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CampgroundNameInput = ({ campgroundName, setCampgroundName }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (campgroundName.trim().length < 1) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8087/search-suggestions?query=${campgroundName}`);
        setSuggestions(res.data.results || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [campgroundName]);

  const handleSuggestionClick = (name) => {
    setCampgroundName(name);
    setShowSuggestions(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={campgroundName}
        onChange={(e) => setCampgroundName(e.target.value)}
        required
        placeholder="Enter campground name"
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontWeight: "bold"
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onFocus={() => campgroundName && setShowSuggestions(true)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderTop: 'none',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto',
          listStyleType: 'none',
          margin: 0,
          padding: 0
        }}>
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => handleSuggestionClick(s.name)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CampgroundNameInput;
