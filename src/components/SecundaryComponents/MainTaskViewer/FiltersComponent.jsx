import React, { useEffect, useCallback, useState } from 'react';
import useFiltersStore from '../../../stores/filterStore';
import userService from '../../../services/userService';
import { categoryService } from '../../../services/categoryService';
import style from './FiltersComponent.module.css';

/**
 * FiltersComponent provides a UI for filtering tasks by user and category. It fetches and displays lists of users and 
 * categories associated with tasks, allowing the user to select filters from dropdown menus. This component plays a key 
 * role in task visualization by enabling users to narrow down the tasks displayed based on these criteria.
 * 
 * Features:
 * - Dynamic Dropdowns: Populates dropdown menus with users and categories fetched from respective services.
 * - Clear Filters: Offers a clear filters option to reset the selection, making it easy to remove applied filters.
 * - Fetch on Load: Automatically fetches the necessary data for the dropdowns when the component mounts.
 */

const FiltersComponent = () => {
  const { filters, setFilter, setUsersWithTasks, setCategoriesWithTasks } = useFiltersStore(state => ({
    filters: state.filters,
    setFilter: state.setFilter,
    setUsersWithTasks: state.setUsersWithTasks,
    setCategoriesWithTasks: state.setCategoriesWithTasks
  }));
  const usersWithTasks = useFiltersStore(state => state.usersWithTasks);
  const categoriesWithTasks = useFiltersStore(state => state.categoriesWithTasks);
  const [fetchCompleted, setFetchCompleted] = useState(false); 


  const fetchData = useCallback(async () => {
      try {
        const users = await userService.fetchUsersWithTasks();
        const categories = await categoryService.getCategoriesWithTasks();
        setUsersWithTasks(users); 
        setCategoriesWithTasks(categories); 
        setFetchCompleted(true); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
  }, []); 

  useEffect(() => {
    fetchData();
  }, [filters]); 

  const handleClearFilters = useCallback(() => {
    setFilter('username', '');
    setFilter('category', '');
  }, [  ]); 

  if (!fetchCompleted) {
    return null;
  }

  return (
    <div className={style.filtersContainer}>
      <select value={filters.username} onChange={(e) => setFilter('username', e.target.value)}>
        <option key="default" value="">All Users</option>
        {usersWithTasks.map((user, index) => (
            <option key={index} value={user.username}>{user.username}</option>
        ))}
      </select>
      <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)}>
        <option key="default" value="">All Categories</option>
        {categoriesWithTasks.map((category) => (
            <option key={category.id} value={category.type}>{category.type}</option>
        ))}
      </select>
      <button onClick={handleClearFilters} className={style.clearFilters}>Clear Filters</button>
    </div>
  );
};

export default FiltersComponent;
