import React, { useState, useEffect } from 'react';
import configService from '../../../../services/configurationService.jsx'; 
import  toastStore  from '../../../../stores/toastMessageStore';
import  userStore  from "../../../../stores/webSocketNotificationStore.jsx";
import WebSocketClient from "./WebSocketClient.jsx";

const ConfigurationForm = () => {
  const [timeout, setTimeout] = useState('');
  const [error, setError] = useState('');
  const notifications = userStore((state) => state.notifications);
WebSocketClient();

  // Carregar o valor atual do timeout ao iniciar o componente
  useEffect(() => {
    const fetchTimeout = async () => {
      try {
        const config = await configService.getConfiguration('sessionTimeout'); // Supondo que 'timeout' seja a chave do seu timeout
        setTimeout(config);
      } catch (error) {
        console.error('Erro ao buscar configuração:', error);
        setError('Erro ao carregar configurações.');
      }
    };

    fetchTimeout();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Validar se o timeout é um número
    if (!/^\d+$/.test(timeout)) {
      setError('Por favor, insira apenas números.');
      return;
    }

    try {
      // Supondo que você tenha um método updateConfiguration em userService
      await configService.updateConfiguration({ configKey: 'sessionTimeout', configValue: timeout });
      setError('');
      toastStore.getState().setMessage('Session Timeout changed (' + timeout + ")");
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      setError('Erro ao atualizar configurações.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="timeout">Timeout (segundos):</label>
        <input
          type="text"
          id="timeout"
          value={timeout}
          onChange={(e) => setTimeout(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Atualizar Configuração</button>
      <h2>Notifications</h2>
       <p>You have {notifications} notifications</p>
    </form>
  );
};

export default ConfigurationForm;
