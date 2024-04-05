import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../../services/userService'; 

const ResetPasswordForm = () => {
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
        <form onSubmit={handleSubmit}>
            <h2>Change Password</h2>
            <label>
                New Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <label>
                Confirm Password:
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </label>
            <button type="submit">Change Password</button>
        </form>
    );
};

export default ResetPasswordForm;
