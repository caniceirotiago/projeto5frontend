import React, { useState , useEffect } from 'react';
import styles from './ProfileForm.module.css';
import ErrorMessageModalStore from '../../../../stores/ErrorMessageModalStore';
import {
    validateEmail,
    validatePhone,
    validateName,
    validatePhotoURL
  } from '../../../../util/userFieldsValidation';
import  useTranslationStore  from '../../../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../../../translations';

  /**
   * ProfileForm is a React component that renders a form for editing and submitting user profile information.
   * It is designed to be dynamically filled with existing user profile data and provides input fields for
   * email, phone number, first name, last name, and photo URL. Users can edit their information and submit the
   * changes, which are then validated before the update is attempted.
   */

const ProfileForm = ({ userProfile, onUpdateUserProfile , isOwnProfile}) => {
  const locale = useTranslationStore((state) => state.locale);

  const [profile, setProfile] = useState({
      email: '',
      phoneNumber: '',
      firstName: '',
      lastName: '',
      photoURL: '',
    });
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    setProfile({ ...userProfile });
  }, [userProfile]); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {
        email: validateEmail(profile.email),
        phoneNumber: validatePhone(profile.phoneNumber),
        firstName: validateName(profile.firstName, profile.lastName), 
        photoURL: validatePhotoURL(profile.photoURL)
      };

    const isValid = Object.keys(newErrors).every((key) => !newErrors[key]);

    if (isValid) {
      onUpdateUserProfile(profile);
      setIsEditing(false); 
    }else {
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
      <form onSubmit={handleSubmit} className={styles.formProfile}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email"><FormattedMessage id="email">Email</FormattedMessage></label>
          <input
            className={styles.input}
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled={true}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="phone"><FormattedMessage id="phone">Phone</FormattedMessage></label>
          <input
            className={styles.input}
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            disabled={!isEditing}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="firstName"><FormattedMessage id="firstName">First Name</FormattedMessage></label>
          <input
            className={styles.input}
            type="text"
            id="firstName"
            name="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            disabled={!isEditing}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="lastName"><FormattedMessage id="lastName">Last Name</FormattedMessage></label>
          <input
            className={styles.input}
            type="text"
            id="lastName"
            name="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            disabled={!isEditing}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="photoURL"><FormattedMessage id="photoURL">Photo URL</FormattedMessage></label>
          <input
            className={styles.input}
            type="text"
            id="photoURL"
            name="photoURL"
            value={profile.photoURL}
            onChange={handleInputChange}
            placeholder="Enter the URL of your photo"
            disabled={!isEditing}
          />
        </div>

        {isEditing ? (
          <FormattedMessage id="saveChangesUserProfForm">{(value) => (<input className={styles.input} type="submit" value={"Save Changes"} />)}</FormattedMessage>
        ) : (
          !isOwnProfile && (
            <button type="button" onClick={() => setIsEditing(true)} className={styles.editButton} >
            <FormattedMessage id="editBtnProfForm">Edit</FormattedMessage>
          </button>
          )
        )}
      </form>
    </IntlProvider>
  );
};

export default ProfileForm;
