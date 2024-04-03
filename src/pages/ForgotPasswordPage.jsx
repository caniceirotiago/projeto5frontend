import React from 'react';
import LoginRegistrationHeader from '../components/Headers/LoginRegistrationHeader'; 
import LoginRegistrationFooter from '../components/Footers/LoginRegistrationFooter';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';

/**
 * LoginPage Component
 * Serves as the entry point for user authentication, providing a dedicated page for users to log in.
 * This page is structured with a header, login form, and footer components, specifically tailored
 * for the login process. The layout is designed to guide users smoothly through the login process,
 * enhancing user experience by focusing on usability and simplicity.
 *
 */

const ForgotPasswordPage = () => {
  return (
    <div className="forgotPasswordPage" >
      <LoginRegistrationHeader />
      <ForgotPasswordForm />
      <LoginRegistrationFooter />
    </div>
  );
};

export default ForgotPasswordPage;
