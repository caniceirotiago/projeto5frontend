import React, { useEffect } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; 
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import useThemeStore from './stores/themeStore'; 
import UserProfilePage from './pages/UserProfilePage';
import UsersManagerPage from './pages/UsersManagerPage';
import DeletedTasksManagerPage from './pages/DeletedTasksManagerPage';
import CategoriesManagerPage from './pages/CategoriesManagerPage';
import MainLayout from './pages/layout/MainLayout';
import { ToastContainer, toast } from 'react-toastify';
import useNotificationStore from './stores/toastMessageStore'; 
import { Flip } from 'react-toastify';
import DialogModal from './components/Modal/DialogModal';
import DialogBoxStore from './stores/DialogModalStore';
import ErrorMessageFormModal from './components/Modal/ErrorMessageFormModal ';
import DashboardPage from './pages/DashboardPage';
import ConfirmationPage from './pages/ConfirmRegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordForm from './components/Auth/ResetPasswordForm';
import ChatModal from './components/Modal/ChatModal';

/**
 * App Component
 * This is the root component of the application that sets up the routing,
 * theme, and global notifications using react-toastify. It includes routes to all
 * main pages of the app, protected routes for authenticated access, and layouts.
 * Uses useEffect hooks to apply the theme from the themeStore and manage global
 * notifications and dialog modals based on application-wide state.
 *
 * Routes include:
 * - Login, Register, Home, User Profile, User Management, Task Deletion Management, and Category Management.
 * - ProtectedRoute component is used to wrap routes that require authentication.
 * - MainLayout is applied to pages needing a consistent layout.
 * - DialogModal and ErrorMessageFormModal are utilized for global message dialogs.
 */


function App() {
  const { theme } = useThemeStore();
  const { message, setMessage } = useNotificationStore();
  const { dialogMessage, setIsDialogOpen } = DialogBoxStore();
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    if (message) {
      toast(message, {
        position: "top-center",
        autoClose: 800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setMessage(''); 
    }
  }, [message, setMessage]);

  useEffect(() => {
    if (dialogMessage) {
      setIsDialogOpen(true);
    }
  }, [dialogMessage, setIsDialogOpen]);
    
  return (
    <>
      <DialogModal/>
      <ErrorMessageFormModal/>
      <ToastContainer limit={1} newestOnTop transition={Flip}/>
      <ChatModal/>
      <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} /> 
            <Route path="/home" element={<ProtectedRoute><MainLayout><HomePage /></MainLayout></ProtectedRoute>} />
            <Route path="/userProfile/:username" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>}/>
            <Route path="/users" element={<ProtectedRoute><MainLayout><UsersManagerPage /></MainLayout></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><MainLayout><DeletedTasksManagerPage /></MainLayout></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><MainLayout><CategoriesManagerPage /></MainLayout></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
            <Route path="/confirm" element={<ConfirmationPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />

        </Routes>
      </Router>
    </>

  );
}

export default App;
