
import React, { useEffect, useState } from 'react';
import Header from "../components/Headers/HomepageHeader";
import Footer from "../components/Footers/HomepageFooter";
import UserProfile from "../components/SecundaryComponents/userProfileEdit/UserProfile";
import useAuthStore from '../stores/authStore';

/**
 * UserProfilePage Component
 * Renders the user profile page, allowing users to view and edit their profile information.
 * This page includes components for displaying the user's basic information, such as their
 * profile picture, name, and role. Additionally, it provides functionality for users to update
 * their profile details.
 */


const UserProfilePage = () => {
  const { fetchUserBasicInfo} = useAuthStore();


  const handleUpdateSuccess = () => {
    fetchUserBasicInfo(); 
  };
  return (
    <div className="userProfile">
      <Header />
        <UserProfile onUpdateSuccess={handleUpdateSuccess}/>
      <Footer />
    </div>
  );
};
export default UserProfilePage;
