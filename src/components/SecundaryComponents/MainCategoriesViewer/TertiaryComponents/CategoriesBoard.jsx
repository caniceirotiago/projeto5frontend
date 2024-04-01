import React, { useEffect, useState } from 'react';
import { categoryService } from '../../../../services/categoryService';
import styles from './CategoriesBoard.module.css';
import DeleteIcon from '../../../../assets/trashCanIcon.png';
import toastStore from '../../../../stores/toastMessageStore';
import DialogModalStore from '../../../../stores/DialogModalStore';
import useCategoryStore from '../../../../stores/categoryStore'; 

/**
 * CategoriesManagerBoard is a component for managing categories. It allows for adding, editing, 
 * and deleting categories with immediate feedback and confirmation dialogs for critical actions. The state of categories 
 * is managed through a global category store, enhancing data consistency across the application.
 * 
 * Key Features:
 * - Add Category: Users can input names for new categories, with input validation to prevent empty entries.
 * - Edit/Delete Category: In-place editing and a delete option with a confirmation dialog to prevent accidental deletions.
 * - Feedback Mechanisms: Uses toast messages for user feedback and a dialog modal for delete confirmations.
 * - Centralized State: Leverages a category store for managing category data, facilitating easy updates and access.
 * 
 * The component employs React hooks for local state and effects, async operations for data persistence, and is designed 
 * with a focus on user experience and application scalability.
 */


const CategoriesManagerBoard = () => {
    const categories = useCategoryStore((state) => state.categories); 
    const setCategories = useCategoryStore((state) => state.setCategories); 
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const fetchedCategories = await categoryService.getAllCategories();
            setCategories(fetchedCategories || []); 
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        const result = await categoryService.addCategory(newCategoryName);
        if (result.success) {
            setNewCategoryName('');
            loadCategories(); 
            toastStore.getState().setMessage('Category added');
        } else {
            toastStore.getState().setMessage('Error adding category');
        }
    };

    const handleEditCategory = async (oldType, newType) => {
        const result = await categoryService.editCategory(oldType, newType);
        if (result.success) {
            loadCategories();
            toastStore.getState().setMessage('Category edited');
        } else {
            toastStore.getState().setMessage('Error editing category');
        }
    };

    const handleDeleteCategory = async (type) => {
        DialogModalStore.getState().setDialogMessage('Are you sure you want to delete this task permanently?');
        DialogModalStore.getState().setIsDialogOpen(true);
        DialogModalStore.getState().setOnConfirm(async () => {
            const result = await categoryService.deleteCategory(type);
            if (result.success) {
                loadCategories(); 
                toastStore.getState().setMessage('Category deleted');
            } else {
                toastStore.getState().setMessage('You can not delete this category. It is being used by some tasks.');
            }
        });       
    };

    return (
        <div className={styles.board}>
            <input 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                placeholder="New category name"
            />
            <button onClick={handleAddCategory}>Add Category</button>

            {categories.map((category) => (
                <div key={category.id} className={styles.categoryCard}>
                    <input 
                        defaultValue={category.type} 
                        onBlur={(e) => handleEditCategory(category.type, e.target.value)}
                        className={styles.categoryInput}
                    />
                    <button className={styles.deleteButton} onClick={() => handleDeleteCategory(category.type)}>
                        <img src={DeleteIcon} alt="Delete" />
                    </button>

                </div>
            ))}
        </div>
    );
};

export default CategoriesManagerBoard;
