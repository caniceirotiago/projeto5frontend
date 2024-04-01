import React from 'react';
import styles from './LoginRegistrationHeader.module.css';
import logoImg from '../../assets/logo.png';

/**
 * LoginRegistrationHeader Component
 * Renders the header for the login and registration pages.
 */


const LoginRegistrationHeader = () => {
  return (
    <header className={styles.loginRegistrationHeader}>
      <img className={styles.logo} src={logoImg} alt="Logo" />
      <div className={styles.topRightFlags} id="langFlag">
        <ul>
          <li><button className={styles.langButton} >PT</button></li>
          <li><button className={styles.langButton} >EN</button></li>
        </ul>
      </div>
    </header>
  );
};

export default LoginRegistrationHeader;
