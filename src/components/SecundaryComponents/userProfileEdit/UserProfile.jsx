import React, { useState, useEffect } from 'react';
import userService from '../../../services/userService'; 
import ProfileForm from './TertiaryComponents/ProfileForm';
import PasswordForm from './TertiaryComponents/PasswordForm';
import styles from './userProfile.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Zoom } from 'react-toastify';
import { useParams } from 'react-router-dom';
import UserProfileStatistics from './TertiaryComponents/UserProfileStatistics'
import {statisticsService} from "../../../services/statisticsService"
import  useTranslationStore  from '../../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../../translations';



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
  const locale = useTranslationStore((state) => state.locale);

  console.log("UserProfile rendered");
  const [tasks, setTasks] = useState({
    todoTasks: undefined,
    doingTasks: undefined,
    doneTasks: undefined
  });
  
  const { username: profileUsername } = useParams();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
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
          const loggedInUsername = sessionStorage.getItem('username');
          setIsOwnProfile(loggedInUsername === profileUsername);
          const data = await userService.fetchUserInfo(profileUsername); 
          setUserProfile({
            username: data.username,
            phoneNumber: data.phoneNumber,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            photoURL: data.photoURL,
          });
          fetchUserTasks();
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
 
    };
    fetchUserData();
    
  }, [profileUsername]); 

  const fetchUserTasks = async () => {
    try {
        const response = await statisticsService.getIndividualUserStatistics(profileUsername);
        console.log("response: ", response);
        setTasks({
          todoTasks: response.todoTasks,
          doingTasks: response.doingTasks,
          doneTasks: response.doneTasks
        });
    } catch (error) {
        console.error("Error fetching user tasks: ", error);
    }
}
const onUpdateUserProfile = async (updatedProfile) => {
  try {
    const { username, email, ...profileData } = updatedProfile;
    const result = await userService.updateUser(profileData);
    if(result.status === 204){
      notify('Profile updated successfully');
      onUpdateSuccess();
    }
    else notify('Failed to update profile. Please try again.');
  } catch (error) {
    console.error("Failed to update user profile:", error);
    notify('Failed to update profile. Please try again.');
  }
};
const onUpdateUserPassword = async (oldPassword, newPassword) => {
  try {
    const response = await userService.updateUserPassword(oldPassword, newPassword);
    console.log("response: ", response);
    if(response.status === 204) notify('Password updated successfully');
    else notify('Failed to update password. Please try again.');
  } catch (error) {
    notify('Failed to update password. Please try again.');
  }
};



  return (
    <IntlProvider locale={locale} messages={languages[locale]}>
      <div className={styles.profileContainer}>
        <ToastContainer limit={1} newestOnTop transition={Zoom}/>
        <section className={styles.userHeader}>
          <img src={userProfile.photoURL} alt="User" className={styles.userPhoto} />
          <h2 className={styles.username}>{userProfile.username}</h2>
          <UserProfileStatistics tasks={tasks}/>
        </section>
        {isOwnProfile ? (
          <>
            {!showPasswordForm ? (
              <ProfileForm userProfile={userProfile} onUpdateUserProfile={onUpdateUserProfile} />
            ) : (
              <PasswordForm onUpdateUserPassword={onUpdateUserPassword}/>
            )}
            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className={styles.toggleFormButton}>
              {showPasswordForm ? <FormattedMessage id="editProfileInformation">Edit Profile Information</FormattedMessage> : <FormattedMessage id="changePassword">Change Password</FormattedMessage>}
            </button>
          </>
        ) : (
          <ProfileForm userProfile={userProfile} readOnly={true} isOwnProfile/>
        )}
      </div>
    </IntlProvider>
  );
};

export default UserProfile;
