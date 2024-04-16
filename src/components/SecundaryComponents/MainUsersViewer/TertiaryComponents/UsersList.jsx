import React, { useState, useEffect }from 'react';
import UserCard from './QuaternaryComponents/UserCard'; 
import styles from './UsersList.module.css'; 
import userService from '../../../../services/userService';
import useSelectedUserStore from '../../../../stores/useSelectedUserStore';
import { useNavigate } from 'react-router-dom';
import AccessControl from '../../../Auth/AcessControl';
import  useTranslationStore  from '../../../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../../../translations';


/**
 * UsersList is a React component that fetches and displays a list of user profiles, excluding certain system 
 * or special accounts. It provides functionality to search users by their usernames and allows interaction 
 * with each user's details through the UserCard component. Additionally, it integrates with an access control 
 * mechanism to conditionally render an 'Add User' button based on the user's role.
 *
 * Features:
 * - Fetches users from a userService and filters out system accounts and the currently logged-in user.
 * - Supports real-time search functionality to filter displayed users based on the search term.
 * - Sorts users such that deactivated (deleted) users are listed after active ones.
 * - Utilizes AccessControl to restrict certain actions (e.g., adding a new user) to specific roles.
 * - Navigates to the user registration page upon clicking the 'Add User' button, for roles with sufficient permissions.
 * - Sets selected user details in global state upon user card click, triggering a modal or detailed view.
 */

const UsersList = () => {
    const locale = useTranslationStore((state) => state.locale);

    const [users, setUsers] = useState([]);
    const usernameOwn = sessionStorage.getItem('username');
    const { setSelectedUser, setIsModalVisible } = useSelectedUserStore();
    const updateTrigger = useSelectedUserStore((state) => state.shouldUpdateUsersList); 
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
                try {
                    const usersData = await userService.fetchAllUsers();
                    const filteredUsers = usersData.filter(user => user.username !== 'deletedUserTasks' 
                    && user.username !== 'admin'
                    && user.username !== usernameOwn);
                    const sortedUsers = filteredUsers.sort((a, b) => {
                        if (a.deleted && !b.deleted) {
                            return 1;
                        } else if (!a.deleted && b.deleted) {
                            return -1; 
                        }
                        return 0;
                    });
                    setUsers(sortedUsers);
                }
                catch (error) {
                    console.error("Error fetching users:", error.message);
                }
            }
            fetchUsers();
    }, [ updateTrigger ]);

    const handleUserClick = (user) => {
        console.log("Selected user:", user);
        setSelectedUser(user);
        setIsModalVisible(true);
    };

    const handleAddUser = () => {
        navigate('/register');
    };
        
    return (
        <IntlProvider locale={locale} messages={languages[locale]}>
            <div className={styles.usersListContainer}>
                <div className={styles.usersListBanner}>
                    <input
                        type="text"
                        placeholder="Search user by username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput} 
                    />
                    <h2 className={styles.title}><FormattedMessage id="usersList">Users List</FormattedMessage></h2>
                    <AccessControl roles={["productOwner"]}>
                        <button className={styles.addUserButton} onClick={handleAddUser}><FormattedMessage id="addUser">Add User</FormattedMessage></button>
                    </AccessControl>
                </div>
                <div className={styles.userList}>
                    {users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())).map((user, index) => (
                        <UserCard key={index} user={user} onClick={() => handleUserClick(user)} />
                    ))}
                </div>
            </div>
        </IntlProvider>
    );
};

export default UsersList;
