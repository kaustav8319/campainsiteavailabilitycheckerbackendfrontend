
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
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/search-suggestions`, {
          params: { query: campgroundName }
        });
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
    <div className="relative w-full">
      <input
        type="text"
        value={campgroundName}
        onChange={(e) => setCampgroundName(e.target.value)}
        required
        placeholder="Enter campground name..."
        className="w-full px-4 py-3 text-lg font-semibold border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 bg-white shadow-sm"
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onFocus={() => campgroundName && setShowSuggestions(true)}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-2 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => handleSuggestionClick(s.name)}
              onMouseDown={(e) => e.preventDefault()}
              className="px-4 py-2 cursor-pointer hover:bg-emerald-100 border-b last:border-none"
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
