function validateTitle(title) {
    if (!title || title.length < 3 || title.length > 50) {
      return "Title must be between 3 and 100 characters.";
    }
    return "";
  }
  
  function validateDescription(description) {
    if (!description || description.length < 3 || description.length > 400) {
      return "Description must be between 5 and 1000 characters.";
    }
    return "";
  }
  
  function validateStartDate(startDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(startDate) && startDate !== "") {
      return "Start date must be in the format YYYY-MM-DD.";
    }
    
    return "";
  }
  
  function validateEndDate(endDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(endDate) && endDate !== "") {
      return "End date must be in the format YYYY-MM-DD.";
    }
    return "";
  }
  function validateEndDateAfterStartDate(startDate, endDate) {
    if (new Date(endDate) < new Date(startDate)) {
      return "End date cannot be before start date.";
    }
    return "";
  }
  
  
  export {
    validateTitle,
    validateDescription,
    validateStartDate,
    validateEndDate,
    validateEndDateAfterStartDate,
  };
  