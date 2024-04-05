import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../services/userService'; 
import DialogModalStore from '../stores/DialogModalStore';

const ConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token'); 
        console.log('Token:', token);

        if (!token) {
            console.error('Token not received');
            alert('Token not received');
            navigate('/'); 
            return;
        }

        const performConfirmation = async () => {
            try {
                await userService.confirmAccount(token); 
                DialogModalStore.getState().setDialogMessage('Acount Confirmed!');
                DialogModalStore.getState().setIsDialogOpen(true);
                DialogModalStore.getState().setOnConfirm(async () => {
                    navigate('/');
                });
            } catch (error) {
                console.error('Error:', error);
                alert('Error trying to confirm your account. Try again.');
            }
        };

        performConfirmation();
    }, [navigate, location.search]);

    return (
        <div className="confirmationPage">
            <div>Confirming your Account...</div> 
        </div>
    );
};

export default ConfirmationPage;
