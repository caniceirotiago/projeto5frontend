import React, { useState , useEffect } from 'react';
import styles from './AddTaskModal.module.css';
import useCategoryStore from '../../stores/categoryStore';
import { validateTitle, validateDescription, validateStartDate, validateEndDate, validateEndDateAfterStartDate } from '../../util/taskFieldsValidation';
import { taskService } from '../../services/taskService';
import  useTranslationStore  from '../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../translations';
import DialogModalStore from '../../stores/DialogModalStore';
import toastStore from '../../stores/toastMessageStore'; 



/**
 * TaskModal Component
 * Renders a modal for adding or editing a task.
 *
 * Props:
 * - isOpen: Boolean indicating whether the modal is open.
 * - onClose: Function to close the modal.
 * - onSubmit: Function to submit the form data.
 * - task: String representing the task ID.
 * - mode: String representing the mode of the modal (e.g., "deleted").
 *
 * State:
 * - formData: Object containing the form data for adding/editing a task.
 * - errors: Object containing validation errors.
 * - categories: Array containing category data.
 * - isEditing: Boolean indicating whether the modal is in edit mode.
 * - canEdit: Boolean indicating whether the user can edit the task.
 *
 * Effects:
 * - useEffect: Fetches task information when the task ID changes.
 * - useEffect: Sets initial category data.
 *
 * Functions:
 * - handleChange: Handles changes in form inputs.
 * - onEditClick: Handles the click event for editing the task.
 * - handleSubmit: Handles form submission for adding/editing a task.
 */

const TaskModal = ({ isOpen, onClose, onSubmit , task, mode, setTasks }) => {
  const locale = useTranslationStore((state) => state.locale);

  const [formData, setFormData] = useState({
    title: '',
    category_type: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 1,
    status: 100,
    username_author: '',
    id: '',
  });
  const [errors, setErrors] = useState({});
  const categories = useCategoryStore((state) => state.categories);
  const [isEditing, setIsEditing] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  
  useEffect(() => {
    if (task) {
      taskService.getTaskById(task)
        .then(taskData => {
          if (taskData) {
            setFormData({
              ...taskData,
              startDate: taskData.startDate || '',
              endDate: taskData.endDate || '',
            });
          const username = sessionStorage.getItem("username");
          const role = sessionStorage.getItem("role");
          setCanEdit((role === "developer" && username === taskData.username_author) || role !== "developer");
          }
        })
        .catch(error => console.error("Error fetching task data:", error));
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        category_type: categories[0].type, 
        priority: 1,
      }));
    }
  }, []);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value,
      }));
  };

  const onEditClick = (e) => {
        setIsEditing(true);
  } 
  const handleDeleteTask = async () => {
    DialogModalStore.getState().setDialogMessage('Are you sure you want to delete this task?');
    DialogModalStore.getState().setIsDialogOpen(true);
    DialogModalStore.getState().setOnConfirm(async () => {
      const updateData = { deleted: true, id: task}  
      setTasks((prevTasks) => prevTasks.filter(t => t.id !== task));
      const result = await taskService.editTask(updateData); 
      if (result) {
        toastStore.getState().setMessage('Task temporarily deleted (' + task + ")");
        onClose();

      }
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
      if (isEditing) {
      const dataToSend = { ...formData };
  
      if (!dataToSend.startDate) {
        delete dataToSend.startDate;
      }
      if (!dataToSend.endDate) {
        delete dataToSend.endDate;
      }
      const newErrors = {
        title: validateTitle(formData.title),
        description: validateDescription(formData.description),
        startDate: formData.startDate ? validateStartDate(formData.startDate) : "",
        endDate: formData.endDate ? validateEndDate(formData.startDate, formData.endDate) : "",
        endDateAfterStartDate: formData.startDate && formData.endDate ? validateEndDateAfterStartDate(formData.startDate, formData.endDate) : "",
      };
  
      setErrors(newErrors);  
      if (Object.keys(errors).length === 0) {
        if (isEditing) {
          const editedData = { ...formData };
          if (!editedData.startDate) delete editedData.startDate;
          if (!editedData.endDate) delete editedData.endDate;
  
          onSubmit(editedData); 
          
        } else {
          setIsEditing(true);
        }
      }
    }
  };

  if (!isOpen) return null;
  return (
    <IntlProvider locale={locale} messages={languages[locale]}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button  onClick={onClose} className={styles.closeButton}>X</button>
          <h2 className={styles.h2}><FormattedMessage id="viewTask">View Task</FormattedMessage></h2>
          <h4>User: {formData.username_author}</h4>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label><FormattedMessage id="title">Title</FormattedMessage></label>
            <input className={styles.input} type="text" name="title" placeholder="Task Title" required value={formData.title} onChange={handleChange} maxLength={50} disabled={!isEditing}/>
            <label><FormattedMessage id="Category">Category</FormattedMessage></label>
            <select className={styles.select} name="category_type" required value={formData.category_type} onChange={handleChange} disabled={!isEditing}>
                {categories.map((category) => (
                    <option key={category.id} value={category.type}>
                        {category.type}
                    </option>
                ))}
            </select>
            <label><FormattedMessage id="description">Description</FormattedMessage></label>
            <textarea className={styles.textarea} name="description" placeholder="Task Description" required value={formData.description} onChange={handleChange} maxLength={400} disabled={!isEditing}></textarea>
            <label><FormattedMessage id="startDate">Start Date</FormattedMessage></label>
            <input className={styles.input} type="date" name="startDate" value={formData.startDate} onChange={handleChange} disabled={!isEditing}/>
            <label><FormattedMessage id="endDate">End Date</FormattedMessage></label>
            <input className={styles.input} type="date" name="endDate" min={formData.startDate} value={formData.endDate} onChange={handleChange} disabled={!isEditing}/>
            <select className={styles.select} name="priority" required value={formData.priority} onChange={handleChange} disabled={!isEditing}>
              <option key={1} value={1}><FormattedMessage id="lowPriority">Low Priority</FormattedMessage></option>
              <option key={2} value={2}><FormattedMessage id="mediumPriority">Medium Priority</FormattedMessage></option>
              <option key={3} value={3}><FormattedMessage id="highPriority">High Priority</FormattedMessage></option>
            </select>
            {canEdit &&  
              (<>{mode !== "deleted" && 
                (<>{!isEditing ? (<><button name="edit" type="button" onClick={onEditClick} className={styles.editButton}> Edit</button>
                <button name="delete" type="button" onClick={handleDeleteTask} className={styles.deleteButton}> Delete</button></>
                          ) : (
                    <button name="save" type="button"className={styles.saveButton} onClick={handleSubmit}>Save </button>)}</>
            )}</>)}
          </form>
        </div>
      </div>
    </IntlProvider>
  );
};

export default TaskModal;
