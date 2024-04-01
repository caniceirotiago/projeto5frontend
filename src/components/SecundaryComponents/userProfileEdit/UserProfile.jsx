import React, { useState, useEffect } from 'react';
import userService from '../../../services/userService'; 
import ProfileForm from './TertiaryComponents/ProfileForm';
import PasswordForm from './TertiaryComponents/PasswordForm';
import styles from './userProfile.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Zoom } from 'react-toastify';

/**
 * UserProfile provides an interface for users to view and edit their profile information, including the ability to 
 * change their password. 
 * It fetches the user's current profile data from the userService on initial load and displays it within a form for editing.
 * Users can switch between editing their profile information and changing their password using a toggle button.
 *
 * Features:
 * - Dynamic Data Fetching: On component mount, it asynchronously fetches and displays the current user's profile data.
 * - Profile Editing: Users can update their personal information such as phone number, email, and names using the ProfileForm.
 * - Password Changing: Offers a separate form (PasswordForm) for users to update their password, enhancing account security.
 * - Toast Notifications: Utilizes 'react-toastify' for user-friendly notifications upon successful updates or errors.
 * - Form Toggle: Allows users to switch between viewing/editing profile information and changing their password with a 
 * single click.
 */

const UserProfile = ({ onUpdateSuccess }) => {

  const [userProfile, setUserProfile] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    photoURL: '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const notify = (message) => {
    toast(message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
          const data = await userService.fetchUserInfo(); 
          setUserProfile({
            username: data.username,
            phoneNumber: data.phoneNumber,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            photoURL: data.photoURL || 'path/to/default/image.jpg',
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
 
    };
    fetchUserData();
  }, [onUpdateSuccess]); 


const onUpdateUserProfile = async (updatedProfile) => {
  try {
    const { username, ...profileData } = updatedProfile;
    const result = await userService.updateUser(profileData);
    notify('Profile updated successfully');
    onUpdateSuccess();
  } catch (error) {
    console.error("Failed to update user profile:", error);
    notify('Failed to update profile. Please try again.');
  }
};
const onUpdateUserPassword = async (oldPassword, newPassword) => {
  try {
    await userService.updateUserPassword(oldPassword, newPassword);

    notify('Password updated successfully');

  } catch (error) {
    notify('Failed to update password. Please try again.');
  }
};

  return (
    <div className={styles.profileContainer}>
      <ToastContainer limit={1} newestOnTop transition={Zoom}/>
      <section className={styles.userHeader}>
        <img src={userProfile.photoURL} alt="User" className={styles.userPhoto} />
        <h2 className={styles.username}>{userProfile.username}</h2>
      </section>

      <div className={styles.formsContainer}>
        {!showPasswordForm ? (
          <ProfileForm userProfile={userProfile} onUpdateUserProfile={onUpdateUserProfile} />
        ) : (
          <PasswordForm onUpdateUserPassword={onUpdateUserPassword}/>
        )}
        <button  onClick={() => setShowPasswordForm(!showPasswordForm)} className={styles.toggleFormButton}>
          {showPasswordForm ? "Edit Profile Information" : "Change Password"}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
