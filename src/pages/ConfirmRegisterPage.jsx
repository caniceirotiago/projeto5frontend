import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../services/userService'; 
import DialogModalStore from '../stores/DialogModalStore';
import { Dialog } from '@mui/material';

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
                const response = await userService.confirmAccount(token); 
                console.log('Response:', response.status);
                if(response.status === 204) {
                    DialogModalStore.getState().setDialogMessage('Acount Confirmed!');
                    DialogModalStore.getState().setIsDialogOpen(true);
                    DialogModalStore.getState().setAlertType(true);
                    DialogModalStore.getState().setOnConfirm(async () => {
                        navigate('/');
                });
                }else{
                    DialogModalStore.getState().setDialogMessage('Error Confirming Account!');
                    DialogModalStore.getState().setIsDialogOpen(true);
                    DialogModalStore.getState().setAlertType(true);
                    DialogModalStore.getState().setOnConfirm(async () => {
                        navigate('/');
                    });
                }
              
            } catch (error) {
                console.error('Error:', error);
                alert('Error confirming account');
            }
        };

        performConfirmation();
    }, [navigate, location.search]);

    return (
        <div className="confirmationPage">
            <div></div> 
        </div>
    );
};

export default ConfirmationPage;
