import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import styles from './LoginForm.module.css';


const ForgotPasswordForm = () => {
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
        <div className={styles.mainContent}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.banner}>
                    <img src={Image} alt="IMG" className={styles.loginIcon}/>
                    <p className={styles.memberLoginBanner}>Recover Password</p>
                </div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Ask for new password</button>
            </form>
            {message && <div>{message}</div>}
            <div><Link to="/">Back to login</Link></div>
        </div>
    );
};

export default ForgotPasswordForm;
