import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../services/userService'; // Importa a função de serviço que fará a chamada de confirmação

const ConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token'); // Extrai o token da query string
        console.log('Token:', token);

        if (!token) {
            console.error('Token não fornecido');
            alert('Token não fornecido. Por favor, verifique o link e tente novamente.');
            navigate('/'); // Você pode escolher redirecionar o usuário para uma página diferente se o token não for fornecido
            return;
        }

        const performConfirmation = async () => {
            try {
                await userService.confirmAccount(token); // Chama a função de serviço para confirmar a conta
                alert('Conta confirmada com sucesso! Você agora pode fazer login.');
                navigate('/login'); // Redireciona para a página de login após a confirmação
            } catch (error) {
                console.error('Erro ao confirmar conta:', error);
                alert('Falha ao confirmar a conta. Por favor, tente novamente.');
            }
        };

        performConfirmation();
    }, [navigate, location.search]);

    return (
        <div className="confirmationPage">
            <div>A confirmar a sua conta...</div> {/* Você pode adicionar uma animação de carregamento aqui */}
        </div>
    );
};

export default ConfirmationPage;
