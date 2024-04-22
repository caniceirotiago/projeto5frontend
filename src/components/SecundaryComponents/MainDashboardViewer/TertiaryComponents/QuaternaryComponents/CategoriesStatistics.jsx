// src/components/QuaternaryComponents/CategoriesStatistics.jsx
import React from 'react';
import statisticsStore from '../../../../../stores/statisticsStore';
import styles from './CategoriesStatistics.module.css'; // Import the CSS module

const CategoriesStatistics = () => {
  const categories = statisticsStore(state => state.categories);

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Category Statistics</h3>
      <ul className={styles.list}>
        {categories.map((category, index) => (
          <li key={index} className={styles.listItem}>{category.type} - Tasks: {category.taskCount}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesStatistics;
