// src/components/QuaternaryComponents/CategoriesStatistics.jsx
import React from 'react';
import statisticsStore from '../../../../../stores/statisticsStore';

const CategoriesStatistics = () => {
  const categories = statisticsStore(state => state.categories);

  return (
    <div>
      <h3>Category Statistics</h3>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{category.type} - Tasks: {category.taskCount}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesStatistics;
