import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import styles from './LoginForm.module.css';
import useTranslationStore from '../../stores/useTranslationsStore';
import {IntlProvider, FormattedMessage} from "react-intl";
import languages from '../../translations';


const ForgotPasswordForm = () => {
    const locale = useTranslationStore((state) => state.locale);

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await userService.requestPasswordReset(email);
            setMessage(response.message);
        } catch (error) {
            console.error('Error :', error);
            setMessage(error.message);
        }
    };

    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <div className={styles.mainContent}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.banner}>
                        <img src={Image} alt="IMG" className={styles.loginIcon}/>
                        <p className={styles.memberLoginBanner}><FormattedMessage id="recoverPassword">Recover Password</FormattedMessage></p>
                    </div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button type="submit"><FormattedMessage id="askForNewPassword">Ask for new password</FormattedMessage></button>
                </form>
                {message && <div>{message}</div>}
                <div><Link to="/"><FormattedMessage id="backToLogin">Back to login</FormattedMessage></Link></div>
            </div>
        </IntlProvider>
    );
};

export default ForgotPasswordForm;
