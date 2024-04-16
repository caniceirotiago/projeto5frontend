import React, { useEffect } from 'react';
import DialogBoxStore from '../../stores/DialogModalStore';
import style from './DialogModal.module.css';
import  useTranslationStore  from '../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../translations';

/**
 * DialogModal Component
 * Renders a modal dialog box with a message and options for confirmation or cancellation.
 *
 * Components Used:
 * - DialogBoxStore: Provides access to dialog box state and actions through a custom hook.
 *
 * State Variables:
 * - dialogMessage: The message to be displayed in the dialog box.
 * - isDialogOpen: Boolean flag indicating whether the dialog box is open or closed.
 *
 * Functions:
 * - handleClose: Handles the event when the dialog box is closed.
 * - handleConfirmation: Handles the event when the confirmation button is clicked.
 */

const DialogModal = () => {
    const locale = useTranslationStore((state) => state.locale);

    const { dialogMessage, isDialogOpen , onConfirm , clearDialog,} = DialogBoxStore();
    
    useEffect(() => {
    }   , [isDialogOpen]);
    const handleClose = () => {
        clearDialog();
    }
    const handleConfirmation = () => {
        onConfirm();
        clearDialog();
    }

    if (!isDialogOpen) return null;
    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <div className={style.modal}>
                <div className={style.modalContent}>
                    <span className={style.close} >&times;</span>
                    <h2>{dialogMessage}</h2>
                    <div className={style.modalButtons}>
                        <button onClick={handleClose}><FormattedMessage id="cancel">Cancel</FormattedMessage></button>
                        <button onClick={handleConfirmation}><FormattedMessage id="yes">Yes</FormattedMessage></button>
                    </div>
                </div>
            </div>
        </IntlProvider>
    );
}
export default DialogModal;