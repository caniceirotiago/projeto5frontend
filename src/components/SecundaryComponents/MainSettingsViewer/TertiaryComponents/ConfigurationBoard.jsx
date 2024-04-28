import React, { useState, useEffect } from 'react';
import configService from '../../../../services/configurationService.jsx';
import toastStore from '../../../../stores/toastMessageStore.jsx';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './ConfigurationBoard.module.css';  
import { IntlProvider } from 'react-intl';
import languages from '../../../../translations';
import  useTranslationStore  from '../../../../stores/useTranslationsStore';

const ConfigurationBoard = () => {
  const [timeout, setTimeout] = useState('');
  const [error, setError] = useState('');
  const intl = useIntl();
  const locale = useTranslationStore((state) => state.locale);


  useEffect(() => {
    const fetchTimeout = async () => {
      try {
        const config = await configService.getConfiguration('sessionTimeout');
        setTimeout(config);
      } catch (error) {
        console.error('Error fetching configuration:', error);
        setError(intl.formatMessage({ id: 'loadError' }));
      }
    };

    fetchTimeout();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!/^\d+$/.test(timeout)) {
      setError(intl.formatMessage({ id: 'onlyNumbersError' }));
      return;
    }

    try {
      await configService.updateConfiguration({ configKey: 'sessionTimeout', configValue: timeout });
      setError('');
      toastStore.getState().setMessage(intl.formatMessage({ id: 'Update Success' }, { timeout }));
    } catch (error) {
      console.error('Error updating configuration:', error);
      setError(intl.formatMessage({ id: 'updateError' }));
    }
  };

  return (
    <IntlProvider locale={locale} messages={languages[locale]}>
    <form onSubmit={handleSubmit} className={styles.configurationForm}>
      <div>
        <label htmlFor="timeout" className={styles.label}>
          <FormattedMessage id="timeoutLabel" defaultMessage="Timeout (seconds):" />
        </label>
        <input
          type="text"
          id="timeout"
          value={timeout}
          onChange={(e) => setTimeout(e.target.value)}
          className={styles.inputField}
        />
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
      <button type="submit" className={styles.updateButton}>
        <FormattedMessage id="updateButton" defaultMessage="Update Configuration" />
      </button>
    </form>
    </IntlProvider>
  );
};

export default ConfigurationBoard;
