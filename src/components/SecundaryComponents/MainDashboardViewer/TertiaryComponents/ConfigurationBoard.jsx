import React, { useState, useEffect } from 'react';
import configService from '../../../../services/configurationService.jsx'; 
import  toastStore  from '../../../../stores/toastMessageStore';

const ConfigurationForm = () => {
  const [timeout, setTimeout] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimeout = async () => {
      try {
        const config = await configService.getConfiguration('sessionTimeout'); 
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
    if (!/^\d+$/.test(timeout)) {
      setError('Por favor, insira apenas números.');
      return;
    }

    try {
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
    
    </form>
  );
};

export default ConfigurationForm;
