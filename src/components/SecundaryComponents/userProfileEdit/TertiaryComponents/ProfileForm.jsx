import React, { useState , useEffect } from 'react';
import styles from './ProfileForm.module.css';
import ErrorMessageModalStore from '../../../../stores/ErrorMessageModalStore';
import {
    validateEmail,
    validatePhone,
    validateName,
    validatePhotoURL
  } from '../../../../util/userFieldsValidation';

  /**
   * ProfileForm is a React component that renders a form for editing and submitting user profile information.
   * It is designed to be dynamically filled with existing user profile data and provides input fields for
   * email, phone number, first name, last name, and photo URL. Users can edit their information and submit the
   * changes, which are then validated before the update is attempted.
   */

const ProfileForm = ({ userProfile, onUpdateUserProfile , isOwnProfile}) => {
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
    <form onSubmit={handleSubmit} className={styles.formProfile}>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="email">Email</label>
        <input
          className={styles.input}
          type="email"
          id="email"
          name="email"
          value={profile.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          disabled={!isEditing}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="phone">Phone</label>
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
        <label className={styles.label} htmlFor="firstName">First Name</label>
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
        <label className={styles.label} htmlFor="lastName">Last Name</label>
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
        <label className={styles.label} htmlFor="photoURL">Photo URL</label>
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
        <input className={styles.input} type="submit" value="Save Changes" />
      ) : (
        !isOwnProfile && (
          <button type="button" onClick={() => setIsEditing(true)} className={styles.editButton} >
          Edit
        </button>
        )
      )}
    </form>
  );
};

export default ProfileForm;
