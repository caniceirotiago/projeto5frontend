import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userService from '../../services/userService'; // Importe seu serviço que inclui a chamada de API

const ResetPasswordForm = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token'); // Obtém o token da URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        try {
            // Supondo que você tenha um método no seu serviço para processar a redefinição de senha
            await userService.resetPassword(token, password);
            alert('Senha redefinida com sucesso!');
            navigate('/login'); // Redireciona o usuário para a página de login
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            alert('Falha ao redefinir senha, por favor tente novamente.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Redefinir Senha</h2>
            <label>
                Nova Senha:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <label>
                Confirme a Nova Senha:
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </label>
            <button type="submit">Redefinir Senha</button>
        </form>
    );
};

export default ResetPasswordForm;
