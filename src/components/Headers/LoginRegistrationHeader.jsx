import React from 'react';
import styles from './LoginRegistrationHeader.module.css';
import logoImg from '../../assets/logo.png';
import useTranslationStore from '../../stores/useTranslationsStore';


/**
 * LoginRegistrationHeader Component
 * Renders the header for the login and registration pages.
 */


const LoginRegistrationHeader = () => {
  const locale = useTranslationStore((state) => state.locale);
  const handleSelectLanguage = (event) => {
    const newLocale = event.target.value;
    updateLocale(newLocale);
  };
  const updateLocale = useTranslationStore((state) => state.updateLocale);
  return (
    <header className={styles.loginRegistrationHeader}>
      <img className={styles.logo} src={logoImg} alt="Logo" />
      <div className={styles.topRightFlags} id="langFlag">
       <select onChange={handleSelectLanguage} defaultValue={locale}>
          {["en", "pt"].map(language => (<option
          key={language}>{language}</option>))}
        </select>
      </div>
    </header>
  );
};

export default LoginRegistrationHeader;
