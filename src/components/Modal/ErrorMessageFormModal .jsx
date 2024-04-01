import React, { useEffect } from 'react';
import style from './ErrorMessageFormModal.module.css';
import ErrorMessageModalStore from '../../stores/ErrorMessageModalStore';

/**
 * ErrorMessageFormModal Component
 * Renders a modal dialog box to display error messages.
 *
 * Components Used:
 * - ErrorMessageModalStore: Provides access to error message state and actions through a custom hook.
 *
 * State Variables:
 * - dialogMessage: An array containing the error messages to be displayed in the dialog box.
 * - isDialogOpen: Boolean flag indicating whether the dialog box is open or closed.
 * - dialogTitle: The title to be displayed in the dialog box.
 *
 * Functions:
 * - handleClose: Handles the event when the dialog box is closed.
 *
 * Effect:
 * - useEffect: Listens for changes in the isDialogOpen state variable and triggers any necessary actions accordingly.
 *
 * Usage:
 * The ErrorMessageFormModal component is used to display a modal dialog box containing error messages fetched 
 * from the ErrorMessageModalStore. It renders the messages along with a title and an option to close the dialog box.
 */

const ErrorMessageFormModal  = () => {
    const { dialogMessage, isDialogOpen , clearDialog, dialogTitle} = ErrorMessageModalStore();
    
    useEffect(() => {
    }   , [isDialogOpen]);

    
    const handleClose = () => {
        clearDialog();
    }

    if (!isDialogOpen) return null;
    return (
        <div className={style.modal}>
            <div className={style.modalContent}>
                <span className={style.close} >&times;</span>
                <h2>{dialogTitle}</h2>
                {dialogMessage.map((message, index) => (
                    <React.Fragment key={index}>
                        <p>{message}</p>
                        <br />
                    </React.Fragment>
                    ))}
                <div className={style.modalButtons}>
                    <button onClick={handleClose}>Ok</button>
                </div>
            </div>
        </div>
    );
}
export default ErrorMessageFormModal ;