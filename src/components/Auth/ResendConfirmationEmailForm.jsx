import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import styles from './LoginForm.module.css';
import useTranslationStore from '../../stores/useTranslationsStore';
import {IntlProvider, FormattedMessage} from "react-intl";
import languages from '../../translations';
import DialogModalStore from '../../stores/DialogModalStore';


const ResendConfirmationEmailForm = () => {
    const locale = useTranslationStore((state) => state.locale);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await userService.requestNewConfirmationEmail(email);
            if (response.status === 204) {
                DialogModalStore.getState().setDialogMessage('Confirmation Email Sent');
                DialogModalStore.getState().setIsDialogOpen(true);
                DialogModalStore.getState().setAlertType(true);
                DialogModalStore.getState().setOnConfirm(async () => {
                    navigate('/');
                });
                return;
            }
            const responseBody = await response.json();
            console.log('responseBody :', responseBody);
            if(responseBody.errorMessage === "You can't request a new confirmation email now, please wait 1 minute"){
                DialogModalStore.getState().setDialogMessage('You can not request a new confirmation email now, please wait 1 minute');
            }
            else DialogModalStore.getState().setDialogMessage('Not able to send confirmation email, contact support.');
            DialogModalStore.getState().setIsDialogOpen(true);
            DialogModalStore.getState().setAlertType(true);
            DialogModalStore.getState().setOnConfirm(async () => {
                navigate('/');
            });
        } catch (error) {
            console.error('Error :', error);
        }
    };

    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <div className={styles.mainContent}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.banner}>
                        <img src={Image} alt="IMG" className={styles.loginIcon}/>
                        <p className={styles.memberLoginBanner}><FormattedMessage id="resendConfirmationEmail">Resend Confirmation Email</FormattedMessage></p>
                    </div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button type="submit"><FormattedMessage id="askForNewConfirmation">Ask for Confirmation</FormattedMessage></button>
                </form>
                <div><Link to="/"><FormattedMessage id="backToLogin">Back to login</FormattedMessage></Link></div>
            </div>
        </IntlProvider>
    );
};

export default ResendConfirmationEmailForm;
