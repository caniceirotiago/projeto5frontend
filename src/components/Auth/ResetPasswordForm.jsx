import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../../services/userService'; 
import  useTranslationStore  from '../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../translations';

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
            alert('Passwords should be the same.');
            return;
        }
        try {
            await userService.resetPassword(token, password);
            alert('Password changed successfully!');
            navigate('/'); 
        } catch (error) {
            console.error('Error', error);
            alert('Fail to change the password.');
        }
    };

    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <form onSubmit={handleSubmit}>
                <h2><FormattedMessage id="changePassword">Change Password</FormattedMessage></h2>
                <label>
                    <FormattedMessage id="newPassword"> New Password:</FormattedMessage>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <label>
                <FormattedMessage id="confirmPassword">Confirm Password:</FormattedMessage>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </label>
                <button type="submit"><FormattedMessage id="changePassword">Change Password</FormattedMessage></button>
            </form>
        </IntlProvider>
    );
};

export default ResetPasswordForm;
