// src/pages/HomePage.js
import React, {useEffect} from 'react';
import useCategoryStore from '../stores/categoryStore';
import { categoryService } from '../services/categoryService';
import TaskViewer from '../components/SecundaryComponents/MainTaskViewer/TaskViewer';
import styles from './layout/MainLayout.module.css';
import userService from '../services/userService';

/**
 * HomePage Component
 * Renders the home page of the application, displaying the main task viewer component
 * along with any relevant categories for task organization.
 *
 * Components Used:
 * - TaskViewer: Displays the main task viewer component, allowing users to view and interact
 *   with their tasks. This component include features such as task filtering, and
 *   task status updates.
 * Notes:
 * - The useEffect hook is utilized to fetch categories upon component mounting. Once the
 *   categories are retrieved, they are stored in the category store for global access within
 *   the application.
 * - Ensure that the TaskViewer component is appropriately configured to handle task-related
 *   functionalities and that it integrates seamlessly with the rest of the application.
 */


const HomePage = () => {
  const setCategories = useCategoryStore((state) => state.setCategories);



  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await categoryService.getAllCategories();
      if (categories) {
        setCategories(categories);
      }
    }; 
    fetchCategories();
  }, [setCategories]); 
  return (
    <div className={styles.rightContainer}>
        <TaskViewer />
    </div>
  );
};

export default HomePage;
