/**
 * AccessControl Component
 * 
 * Description:
 * Renders children components based on user roles, allowing or restricting access to certain functionalities.
 * 
 * Props:
 * - roles: An array of roles that are allowed to access the children components.
 * - children: The components or content to be rendered if the user role matches one of the allowed roles.
 * 
 * External Dependencies:
 * - sessionStorage: Provides access to the session storage for retrieving user role information.
 * 
 * Usage:
 * The AccessControl component is used to control access to specific functionalities or components based on user roles.
 * It checks the user's role stored in session storage against the provided roles array. If the user's role matches one 
 * of the allowed roles, it renders the children components; otherwise, it renders nothing.
 */


const AccessControl = ({ roles, children }) => {
  const userRole = sessionStorage.getItem('role');

  if (roles.includes(userRole)) {
    return children;
  }

  return null;
};

export default AccessControl;
