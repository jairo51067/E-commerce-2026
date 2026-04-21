import React from 'react';
import { STORE_CONFIG } from '@config/store.config.js';

export const CategoriesBar = ({ activeCategory, onSelect }) => {
  return (
    <div className="categories-bar">
      {STORE_CONFIG.categories.map(cat => (
        <button
          key={cat.id}
          className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};