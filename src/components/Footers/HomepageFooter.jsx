import React from 'react';
import styles from './HomepageFooter.module.css'; 

/**
 * HomepageFooter Component
 * 
 * Description:
 * Renders the footer component for the homepage, displaying author information or attribution.
 */

const HomepageFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <p>
        <span>Tiago Caniceiro @ DEI.UC.PT</span>
        <span> &copy; {currentYear}</span>
      </p>
    </footer>
  );
};

export default HomepageFooter;
