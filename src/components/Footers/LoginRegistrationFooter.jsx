import React from 'react';
import styles from './LoginRegistrationFooter.module.css';

/**
 * LoginRegistrationFooter Component
 * 
 * Description:
 * Renders the footer component for the login and registration pages, providing author information and contact details.
 */


const LoginRegistrationFooter = () => {
  return (
    <footer className = {styles.footer}>
      <h3 id="footer">Tiago Caniceiro @ DEI.UC.PT</h3>
      <div id="text-about" className={styles.textAbout}>
        <p id="text-about1" className={styles.textAboutP}></p>
      </div>
      <h3 id="contact">Contact informations:</h3>
      <p id="infosContact">You can reach us at our headquarters during workdays from 09:30 to 17:30</p>
      <div>
        <p id="adressTitle"><strong>Contact Information:</strong></p>
        <p id="address">Pólo II da Universidade de Coimbra, R. Silvio Lima, 3030-790 Coimbra</p>
        <p>caniceirotiago@gmail.com</p>
      </div>
      
    </footer>
  );
};

export default LoginRegistrationFooter;
