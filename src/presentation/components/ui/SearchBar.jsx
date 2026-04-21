import React, { useState, useEffect } from 'react';

export const SearchBar = ({ onSearch, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    onSearch(query);
  }, [query]);

  return (
    <div className="search-overlay">
      <div className="search-container">
        <div className="search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              className="search-clear"
              onClick={() => setQuery('')}
            >
              ✕
            </button>
          )}
        </div>
        <button
          className="search-cancel"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};