import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../stores/authStore'; 
import styles from './ForgotPasswordForm.module.css';
import Image from "../../assets/user-login.png";
import  useTranslationStore  from '../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../translations';

/**
 * LoginForm Component
 * 
 * Description:
 * Renders a login form allowing users to input their username and password to log in to the application.
 * 
 * External Dependencies:
 * - react-router-dom: Provides the useNavigate hook for navigation within the application and the Link 
 * component for creating links.
 * - authStore: Provides access to the login function and error state from the authentication store.
 * - LoginForm.module.css: Provides styling for the LoginForm component.
 * - user-login.png: Image asset for the login form banner.
 * 
 * Usage:
 * The LoginForm component is used to allow users to log in to the application by providing their username and password.
 * It interacts with the authStore to perform the login operation and handles navigation after successful login.
 */


const LoginForm = () => {
    const locale = useTranslationStore((state) => state.locale);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, error } = useAuthStore(state => ({ login: state.login, error: state.error }));

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            const token = useAuthStore.getState().token;
            if (token) {
                navigate('/home');
            } else {
                console.error('Login failed: No token received');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <div className={styles.mainContent} >
                    <form id="loginForm" onSubmit={handleLogin} className={styles.form}>
                <div className={styles.banner}>
                    <img src={Image} alt="IMG" className={styles.loginIcon}/>
                    <p className={styles.memberLoginBanner}><FormattedMessage id="memberLogin">Member Login</FormattedMessage></p>
                </div>
                <div className={styles.content}>
                    <label htmlFor="username" className={styles.label}><FormattedMessage id="username">Username</FormattedMessage></label>
                    <input className={styles.input} type="text" name="username" id="username" maxLength="25" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="password" className={styles.label}><FormattedMessage id="password">Password</FormattedMessage></label>
                    <input className={styles.input} type="password" name="password" id="password" maxLength="25" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <div className={styles.errorMessage}>{error}</div>} 
                    <input className={styles.submit} type="submit" id="login" value="Login" />
                </div>
            </form>
            <div className={styles.signup}><FormattedMessage id="dontHaveAnAccount">Don't have an account?</FormattedMessage><Link to="/register"><FormattedMessage id="signUp">Sign up</FormattedMessage></Link></div>
            <div className={styles.forgotPassword}><Link to="/forgot-password"><FormattedMessage id="forgotThePassword">Forgot the password?</FormattedMessage></Link></div>
        </div>
      </IntlProvider>
    );
};

export default LoginForm;
