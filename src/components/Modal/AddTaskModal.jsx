import React, { useState , useEffect } from 'react';
import styles from './AddTaskModal.module.css';
import useCategoryStore from '../../stores/categoryStore';
import { validateTitle, validateDescription, validateStartDate, validateEndDate, validateEndDateAfterStartDate } from '../../util/taskFieldsValidation';
import  useTranslationStore  from '../../stores/useTranslationsStore';
import { IntlProvider , FormattedMessage} from 'react-intl';
import languages from '../../translations';

/**
 * AddTaskModal Component
 * Renders a modal for adding a new task.
 *
 * Props:
 * - isOpen: A boolean indicating whether the modal is open or closed.
 * - onClose: A function to handle closing the modal.
 * - onSubmit: A function to handle submitting the form data when adding a new task.
 *
 * State Variables:
 * - formData: An object containing the form data for adding a new task.
 * - errors: An object containing validation errors for form fields.
 *
 * Effects:
 * - useEffect: Updates the formData state with the first category type from the categories array when categories change.
 *
 * Usage:
 * The AddTaskModal component is used to display a modal for adding a new task. It includes form fields for entering t
 * ask details such as title, description, dates, category, and priority. Validation errors are displayed if any form 
 * fields are invalid.
 */

const initialState = {
  title: '',
  category_type: '',
  description: '',
  startDate: '',
  endDate: '',
  priority: 1,
  status: 100,
};
const TaskModal = ({ isOpen, onClose, onSubmit }) => {
  const locale = useTranslationStore((state) => state.locale);

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const categories = useCategoryStore((state) => state.categories);
  

  useEffect(() => {
    if (categories.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        category_type: categories[0].type, 
        priority: 1,
      }));
    }
  }, [categories]);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value,
      }));
  };

  const resetForm = () => {
    const initialCategoryType = categories.length > 0 ? categories[0].type : '';
    setFormData({
        ...initialState,
        category_type: initialCategoryType, 
        priority: 1, 
    });
    setErrors({});
};

  const handleSubmit = (e) => {
    e.preventDefault();

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
    const isValid = Object.values(newErrors).every(error => error === "");
  
    if (isValid) {
      resetForm();
      onSubmit(dataToSend);
    }
  };
  

  if (!isOpen) return null;

  return (
    <IntlProvider locale={locale} messages={languages[locale]}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <button onClick={onClose} className={styles.closeButton}>X</button>
          <h2 className={styles.h2}><FormattedMessage id="addNewTaskTitle">Add New Task</FormattedMessage></h2>
          <form className={styles.form} onSubmit={handleSubmit}>
          <FormattedMessage id="taskTitlePlaceholder">{(taskTitle) => (<input className={styles.input} type="text" name="title" placeholder={taskTitle} required value={formData.title} onChange={handleChange} maxLength={50}/>)}</FormattedMessage>
            <select className={styles.select} name="category_type" required value={formData.category_type} onChange={handleChange}>
                {categories.map((category) => (
                    <option key={category.id} value={category.type}>
                        {category.type}
                    </option>
                ))}
            </select>
            <FormattedMessage id="taskDescriptionPlaceholder">{(taskDescription) => (<textarea className={styles.textarea} name="description" placeholder={taskDescription} required value={formData.description} onChange={handleChange} maxLength={400}></textarea>)}</FormattedMessage>
            <input className={styles.input} type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            <input className={styles.input} type="date" name="endDate" min={formData.startDate} value={formData.endDate} onChange={handleChange} />
            <select className={styles.select} name="priority" required value={formData.priority} onChange={handleChange}>
              <option key={1} value={1}><FormattedMessage id="lowPriority">Low Priority</FormattedMessage></option>
              <option key={2} value={2}><FormattedMessage id="mediumPriority">Medium Priority</FormattedMessage></option>
              <option key={3} value={3}><FormattedMessage id="highPriority">High Priority</FormattedMessage></option>
            </select>
            <button className={styles.button} type="submit"><FormattedMessage id="saveTaskbtn">Save Task</FormattedMessage></button>
            {errors.title && <div className={styles.errorMessage}>{errors.title}</div>}
          </form>
        </div>
      </div>
    </IntlProvider>
  );
};

export default TaskModal;
