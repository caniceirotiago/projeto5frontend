import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm'; 
import Header from '../components/Headers/LoginRegistrationHeader'; 
import LoginRegistrationFooter from '../components/Footers/LoginRegistrationFooter';

/**
 * RegisterPage Component
 * Serves as the entry point for user registration, providing a dedicated page for users to create
 * a new account. This page is structured with a header, registration form, and footer components,
 * specifically tailored for the registration process. The layout is designed to guide users smoothly
 * through the registration process, enhancing user experience by focusing on usability and simplicity.
 *
 */


const RegisterPage = () => {
  return (
    <div className="register-page">
      <Header />
      <RegisterForm/>
      <LoginRegistrationFooter />
    </div>
  );
};

export default RegisterPage;
