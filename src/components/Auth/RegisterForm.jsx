import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateUsername, validatePassword, validatePhone, validateEmail, validateName, validatePhotoURL } from '../../util/userFieldsValidation'; 
import { authService } from '../../services/authService';
import styles from './RegisterForm.module.css';
import Image from "../../assets/user-login.png";
import ErrorMessageModalStore from '../../stores/ErrorMessageModalStore';
import DialogModal from '../Modal/DialogModal';
import DialogModalStore from '../../stores/DialogModalStore';
import  useTranslationStore  from '../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../translations';

/**
 * RegisterForm Component
 * 
 * Description:
 * Renders a form for user registration, allowing users to input their information including username, password, 
 * email, phone number, first name, last name, photo URL, and role (if applicable).
 * Performs client-side validation on user inputs and displays error messages accordingly.
 * Submits the registration data to the authService for registration.
 * Redirects the user to the home page or user management page (if admin) upon successful registration.
 * 
 * State Variables:
 * - user: Object containing user registration data (username, password, confirmPassword, phoneNumber, email, 
 * irstName, lastName, photoURL, role).
 * 
 * External Dependencies:
 * - react-router-dom: Provides useNavigate for programmatic navigation.
 * - authService: Service for user authentication and registration.
 * - userFieldsValidation: Util functions for validating user input fields.
 * - ErrorMessageModalStore: Store for managing error message modal state.
 */

const RegisterForm = ( ) => {
   const locale = useTranslationStore((state) => state.locale);

   const isAdmin  = sessionStorage.getItem('role') === 'productOwner' ? true : false;
   const [user, setUser] = useState({
      username: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      email: '',
      firstName: '',
      lastName: '',
      photoURL: '',
      role: 'developer'
   });
   
  const navigate = useNavigate();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setUser(prevUser => ({
         ...prevUser,
         [name]: value
      }));
   };

  const handleSubmit = async (e) => {
   e.preventDefault();
   const { confirmPassword, ...userData } = user;

   const newErrors = {
     username: validateUsername(user.username),
     password: validatePassword(user.password, confirmPassword),
     phoneNumber: validatePhone(user.phoneNumber),
     email: validateEmail(user.email),
     name: validateName(user.firstName, user.lastName),
     photoURL: validatePhotoURL(user.photoURL)
   };

   const isValid = Object.keys(newErrors).every((key) => !newErrors[key]);

   if (isValid) {
      try {
         await authService.register(userData); 
         DialogModalStore.getState().setDialogMessage('Confirmation Email Sent');
         DialogModalStore.getState().setIsDialogOpen(true);
         DialogModalStore.getState().setOnConfirm(async () => {
            if(!isAdmin)navigate('/'); 
         else navigate('/users');
         });
         
       } catch (error) {
         console.error('Error:', error.message);
       }
   } else {
      const errorMessages = Object.entries(newErrors)
         .filter(([key, value]) => value !== '') 
         .map(([key, value]) => `${key}: ${value}`); 
      ErrorMessageModalStore.getState().setDialogMessage(errorMessages);
      ErrorMessageModalStore.getState().setDialogTitle('Validation Errors');
      ErrorMessageModalStore.getState().setIsDialogOpen(true);
   }
 };

  return (
   <IntlProvider locale={locale} messages={languages[locale]}>
      <main className={styles.mainContent}>
         <DialogModal />
         <form className={styles.registrationForm} onSubmit={handleSubmit}>
            <div className={styles.banner}>
               <img name="img_user" src={Image} alt="IMG" className={styles.loginIcon} />
               <p id="member-registration-banner"><FormattedMessage id="memberRegistration">Member Registration</FormattedMessage></p>
            </div>
            <div className={styles.content}>
            {isAdmin && (
                     <>
                     <label className={styles.label} htmlFor="role-field"><FormattedMessage id="role">Role</FormattedMessage></label>
                     <select name="role" id="role-field" onChange={handleChange}>
                           <option value="developer">Developer</option>
                           <option value="scrumMaster">Srum Master</option>
                           <option value="productOwner">Product Owner</option>
                     </select>
                     </>
                  )}
               <p></p>
               <label className={styles.label} id="username-label" htmlFor="username-field">Username</label>
               <FormattedMessage id="usernamePlaceholder">{(value) => (<input
                  className={styles.input}
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  id="username-field"
                  maxLength="25"
                  placeholder={value}
               />)}</FormattedMessage>
               <label className={styles.label} id="password-label" htmlFor="password-field">Password</label>
               <FormattedMessage id="passwordPlaceholder">{(value) => (<input
                  className={styles.input}
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  id="password-field"
                  maxLength="25"
                  placeholder={value}
               />)}</FormattedMessage>
               <label className={styles.label} id="password-label2" htmlFor="password2-field">Repeat Password</label>
               <FormattedMessage id="passwordPlaceholder">{(value) => (<input
                  className={styles.input}
                  type="password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  id="password2-field"
                  maxLength="25"
                  placeholder={value}
               />)}</FormattedMessage>
               <label className={styles.label} id="phone-label" htmlFor="phone-field"><FormattedMessage id="phone">Phone</FormattedMessage></label>
               <FormattedMessage id="phonePlaceholder">{(value) => (<input 
               className={styles.input}
                  type="tel" 
                  name="phoneNumber" 
                  value={user.phoneNumber}
                  onChange={handleChange}
                  id="phone-field" 
                  maxLength="35" 
                  placeholder={value} 
                  />)}</FormattedMessage>
               <label className={styles.label} id="email-label" htmlFor="email-field"><FormattedMessage id="email">Email</FormattedMessage></label>
               <FormattedMessage id="emailPlaceholder">{(value) => (<input
               className={styles.input} 
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  id="email-field" 
                  maxLength="35" 
                  placeholder={value} 
                  />)}</FormattedMessage>
               <label className={styles.label} id="first-name-label" htmlFor="firstname-field"><FormattedMessage id="firstName">First Name</FormattedMessage></label>
               <FormattedMessage id="firstNamePlaceholder">{(value) => (<input
                  className={styles.input}
                  type="text"
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  id="firstname-field"
                  maxLength="35"
                  placeholder={value}
               />)}</FormattedMessage>
               <label  className={styles.label} id="last-name-label" htmlFor="lastname-field"><FormattedMessage id="lastName">Last Name</FormattedMessage></label>
               <FormattedMessage id="lastNamePlaceholder">{(value) => (<input
                  className={styles.input}
                  type="text"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  id="lastname-field"
                  maxLength="35"
                  placeholder={value}
               />)}</FormattedMessage>
               <label className={styles.label} id="URL" htmlFor="photo-field"><FormattedMessage id="photoURL">Photo URL</FormattedMessage></label>
               <FormattedMessage id="photoURLPlaceholder">{(value) => (<input
                  className={styles.input}
                  type="text"
                  name="photoURL" 
                  value={user.photoURL}
                  onChange={handleChange}
                  id="photo-field" 
                  maxLength="400" 
                  placeholder={value}
                  />)}</FormattedMessage>
               <FormattedMessage id="registration">{(value) => (<input type="submit" id="registration" value={value}/>)}</FormattedMessage>
            </div>
         </form>
      </main>
   </IntlProvider>
    
  );
};

export default RegisterForm;
