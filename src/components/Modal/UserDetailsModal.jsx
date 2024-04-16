import React, { useState, useEffect } from 'react';
import userService from '../../services/userService'; 
import useSelectedUserStore from '../../stores/useSelectedUserStore'; 
import style from './UserDetailsModal.module.css'; 
import { validatePhone, validateEmail, validateName, validatePhotoURL } from '../../util/userFieldsValidation'; 
import {taskService} from '../../services/taskService'; 
import AccessControl from '../Auth/AcessControl';
import toastStore from '../../stores/toastMessageStore';
import DialogModalStore from '../../stores/DialogModalStore';
import ErrorMessageModalStore from '../../stores/ErrorMessageModalStore';
import  useTranslationStore  from '../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../translations';

/**
 * UserDetailsModal Component
 * Renders a modal containing user details and allows product owners to edit user information or delete users.
 *
 * Props:
 * - onClose: Function to close the modal.
 *
 * Components Used:
 * - useSelectedUserStore: Custom hook to access selected user information.
 * - userService: Service for fetching and updating user data.
 * - validatePhone: Function to validate phone numbers.
 * - validateEmail: Function to validate email addresses.
 * - validateName: Function to validate names.
 * - validatePhotoURL: Function to validate photo URLs.
 * - taskService: Service for deleting tasks.
 * - AccessControl: Component to control access based on user roles.
 * - toastStore: Store for displaying toast messages.
 * - DialogModalStore: Store for displaying confirmation dialogs.
 *
 * State:
 * - errors: Object containing validation errors.
 * - originalData: Object containing the original user data before edits.
 * - userRole: String representing the user's role.
 * - formData: Object containing the form data for editing user details.
 *
 * Effects:
 * - useEffect: Fetches user information when the selected user changes.
 * - useEffect: Updates the user role state based on session storage.
 *
 * Functions:
 * - handleChange: Handles changes in form inputs.
 * - handleSubmit: Handles form submission for updating user details.
 * - deleteAllTasksOfUser: Deletes all tasks associated with the user.
 * - deleteUserPermanently: Deletes the user permanently.
 *
 * @param {function} onClose Function to close the modal.
 */

const UserDetailsModal = ({ onClose }) => {
    const locale = useTranslationStore((state) => state.locale);

    const { selectedUser, clearSelectedUser } = useSelectedUserStore();
    const [errors, setErrors] = useState({});
    const [originalData, setOriginalData] = useState({}); 
    const [userRole, setUserRole] = useState('');
    const isProductOwner = userRole === 'productOwner';
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        photoURL: '',
        deleted: ''
    });
    useEffect(() => {
        setUserRole(sessionStorage.getItem("role"));
    }, []);
    useEffect(() => {
        const fetchUserInfo = async () => {
            if(selectedUser.username) {
                try {
                    const userInfo = await userService.fetchUserInfoByUsername( selectedUser.username);
                    setOriginalData(userInfo);
                    setFormData({
                        username: userInfo.username || '',
                        email: userInfo.email || '',
                        role: userInfo.role || '',
                        phoneNumber: userInfo.phoneNumber || '',
                        firstName: userInfo.firstName || '',
                        lastName: userInfo.lastName || '',
                        photoURL: userInfo.photoURL || '',
                        deleted: userInfo.deleted ? 'true' : 'false', 
                    });
                } catch (error) {
                    console.error("Error fetching user detailed info:", error);
                }
            }
        };
        fetchUserInfo();
    }, [selectedUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};
        const updatedFields = {};
        Object.keys(formData).forEach(key => {
            if(formData[key] !== originalData[key]) {
                updatedFields[key] = formData[key];
                if (key === 'email') validationErrors.email = validateEmail(updatedFields[key]);
                if (key === 'phoneNumber') validationErrors.phone = validatePhone(updatedFields[key]);
                if (key === 'firstName' || key === 'lastName') validationErrors.name = validateName(formData.firstName, formData.lastName);
                if (key === 'photoURL') validationErrors.photoURL = validatePhotoURL(updatedFields[key]);
            }
        });

        const isValid = Object.keys(validationErrors).every((key) => !validationErrors[key]);
        if (!isValid) {
            console.error("Validation errors:", validationErrors);
            setErrors(validationErrors); 
            const errorMessages = Object.entries(validationErrors)
                .filter(([key, value]) => value !== '') 
                .map(([key, value]) => `${key}: ${value}`); 
            ErrorMessageModalStore.getState().setDialogMessage(errorMessages);
            ErrorMessageModalStore.getState().setDialogTitle('Validation Errors');
            ErrorMessageModalStore.getState().setIsDialogOpen(true);
            return; 
        }      
        if (selectedUser.username && Object.keys(updatedFields).length > 0) {
            try {         
                await userService.updateUserByUsername(selectedUser.username, updatedFields);
                toastStore.getState().setMessage("User data updated successfully");
                useSelectedUserStore.getState().triggerUsersListUpdate(); 
            } catch (error) {
                console.error("Error updating user data:", error);
                toastStore.getState().setMessage("Error updating user data. Please try again.");
            }
        } else {
            console.error("No fields to update");
            toastStore.getState().setMessage("No fields to update");
            onClose(); 
        }
    };
    const deleteAllTasksOfUser = async () => {
        DialogModalStore.getState().setDialogMessage('Are you sure you want to delete this task?');
        DialogModalStore.getState().setIsDialogOpen(true);
        DialogModalStore.getState().setOnConfirm(async () => {
            if( selectedUser.username) {
                try {
                    await taskService.deleteAllTasksByUserTemporarily( selectedUser.username);
                    toastStore.getState().setMessage("Tasks deleted");
                } catch (error) {
                    console.error("Error deleting tasks:", error);
                    toastStore.getState().setMessage("Error deleting tasks. Please try again.");
                }
            }
        });
        
    };

    const deleteUserPermanently = async () => {
        DialogModalStore.getState().setDialogMessage('Are you sure you want to delete this user forever?');
        DialogModalStore.getState().setIsDialogOpen(true);
        DialogModalStore.getState().setOnConfirm(async () => {
            if(selectedUser.username) {
                    try {
                        await userService.deleteUserPermanently(selectedUser.username);  
                        await useSelectedUserStore.getState().triggerUsersListUpdate();               
                        toastStore.getState().setMessage("User deleted successfully");     
                        onClose(); 
                    } catch (error) {
                        console.error("Error deleting user", error);
                        toastStore.getState().setMessage("Error deleting user. Please try again."); 
                    }
                }
          });        
    };

    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <div className={style.modal}>
                <div className={style.modalContent}>
                    <span className="close" onClick={() => { clearSelectedUser(); onClose(); }} hidden={true} >&times;</span>
                    <form className={style.form} onSubmit={handleSubmit}>
                        <div className={style.userPhotoContainer}>
                            <img
                                src={formData.photoURL}
                                alt="User"
                                className={style.userPhoto} 
                            />
                        </div>
                        <label className={style.label} htmlFor="username">Username:</label>
                        <input 
                            className={style.input} 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={formData.username} 
                            onChange={handleChange} disabled />
                        <label className={style.label} htmlFor="email">Email:</label>
                        <input 
                            className={style.input} 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            disabled={!isProductOwner}/>
                        <label className={style.label} htmlFor="phoneNumber"><FormattedMessage id="phone">Phone:</FormattedMessage></label>
                        <input 
                            className={style.input} 
                            type="text" 
                            id="phoneNumber" 
                            name="phoneNumber" 
                            value={formData.phoneNumber} 
                            onChange={handleChange} 
                            disabled={!isProductOwner}/>                   
                        <label className={style.label} htmlFor="firstName"><FormattedMessage id="firstName">First Name:</FormattedMessage></label>
                        <input 
                            className={style.input} 
                            type="text" 
                            id="firstName" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleChange} 
                            disabled={!isProductOwner}/>                   
                        <label className={style.label} htmlFor="lastName"><FormattedMessage id="lastName">Last Name:</FormattedMessage></label>
                        <input 
                            className={style.input} 
                            type="text" 
                            id="lastName" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleChange} 
                            disabled={!isProductOwner}/>                   
                        <label className={style.label} htmlFor="photoURL"><FormattedMessage id="photoURL">Photo URL:</FormattedMessage></label>
                        <input 
                            className={style.input} 
                            type="text" 
                            id="photoURL" 
                            name="photoURL" 
                            value={formData.photoURL} 
                            onChange={handleChange} 
                            disabled={!isProductOwner}/>                   
                        <label className={style.label} htmlFor="deleted"><FormattedMessage id="userStatus">User Status:</FormattedMessage></label>
                        <select 
                            className={style.select} 
                            id="deleted" 
                            name="deleted" 
                            value={formData.deleted} 
                            onChange={handleChange} 
                            disabled={!isProductOwner}>
                            <option value={true}><FormattedMessage id="inactive">Inactive</FormattedMessage></option>
                            <option value={false}><FormattedMessage id="active">Active</FormattedMessage></option>
                        </select>
                        <label className={style.label} htmlFor="role"><FormattedMessage id="role">Role:</FormattedMessage></label>
                        <select 
                            className={style.select} 
                            id="role" 
                            name="role" 
                            value={formData.role} 
                            onChange={handleChange} 
                            disabled={!isProductOwner}>
                            <option value={"developer"}>Developer</option>
                            <option value={"scrumMaster"}>Scrum Master</option>
                            <option value={"productOwner"}>Product Owner</option>
                        </select>
                        <AccessControl roles={["productOwner"]}>
                            <button className={style.button} type="submit"><FormattedMessage id="saveChanges">Save Changes</FormattedMessage></button>
                        </AccessControl>
                    </form>
                    <AccessControl roles={["productOwner"]}>
                        <div className={style.btnDiv}>
                            <button className={style.button} onClick={deleteAllTasksOfUser}><FormattedMessage id="deleteAllTasks">Delete All Tasks</FormattedMessage></button>
                            <button className={style.button} onClick={deleteUserPermanently}><FormattedMessage id="deleteUserPermanetly">Delete User Permanently</FormattedMessage></button>
                        </div>  
                    </AccessControl>
                </div>
            </div>
        </IntlProvider>
    );
};

export default UserDetailsModal;
