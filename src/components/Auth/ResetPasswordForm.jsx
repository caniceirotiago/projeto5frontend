import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../../services/userService'; 
import  useTranslationStore  from '../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../translations';
import DialogModalStore from '../../stores/DialogModalStore';
import styles from './ResetPasswordForm.module.css';

const ResetPasswordForm = () => {
    const locale = useTranslationStore((state) => state.locale);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token'); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            DialogModalStore.getState().setDialogMessage('Passwords do not match');
            DialogModalStore.getState().setIsDialogOpen(true);
            DialogModalStore.getState().setAlertType(true);
            DialogModalStore.getState().setOnConfirm(async () => {
            });

            return;
        }
        try {
            console.log('token :', token);
            const response = await userService.resetPassword(token, password);
            console.log('response :', response);
            if (response.status === 204) {
                DialogModalStore.getState().setDialogMessage('Password Changed Successfully');
                DialogModalStore.getState().setIsDialogOpen(true);
                DialogModalStore.getState().setAlertType(true);
                DialogModalStore.getState().setOnConfirm(async () => {
                    navigate('/');
                });
                return;
            }
            const responseBody = await response.json();
            console.log('responseBody :', responseBody);
            
            DialogModalStore.getState().setDialogMessage('Not able to change password, contact support.');
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
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2><FormattedMessage id="changePassword">Change Password</FormattedMessage></h2>
                    <label>
                        <FormattedMessage id="newPassword"> New Password:</FormattedMessage>
                        <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={4}/>
                    </label>
                    <label>
                    <FormattedMessage id="confirmPassword">Confirm Password:</FormattedMessage>
                        <input className={styles.input} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={4}/>
                    </label>
                    <button type="submit" className={styles.button}><FormattedMessage id="changePassword">Change Password</FormattedMessage></button>
                </form>
            </div>
        </IntlProvider>
    );
};

export default ResetPasswordForm;
