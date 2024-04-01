
export function validateUsername(username) {
    if (username.length < 2 || username.length > 25) {
      return "Username must be between 2 and 25 characters.";
    }
    return "";
  }
export function validatePassword(password, confirmPassword) {
    if (password !== confirmPassword || password.length < 4) {
      return "Passwords must match and be at least 4 characters long.";
    }
    return "";
}
export function validatePhone(phone) {
    if (phone.length < 7 || phone.length > 20) {
      return "Phone number must be between 7 and 20 characters.";
    }
    if (phone[0] === '+') {
      for (let i = 1; i < phone.length; i++) {
        if (!isDigit(phone[i])) {
          return "Phone number can only contain digits and optionally start with a '+'.";
        }
      }
    } else {
      for (let i = 0; i < phone.length; i++) {
        if (!isDigit(phone[i])) {
          return "Phone number can only contain digits.";
        }
      }
    }
    return ""; 
  }
  
  function isDigit(character) {
    return character >= '0' && character <= '9';
  }
  

export function validateEmail(email) {
if (!email.includes('@') || !email.includes('.')) {
    return "Please enter a valid email address.";
}
return ""; 
}

export function validateName(firstName, lastName) {
if (firstName.length < 1 || firstName.length > 25 || lastName.length < 1 || lastName.length > 25) {
    return "First name and last name must be between 1 and 25 characters.";
}
return ""; 
}
  

export function validatePhotoURL(photoURL) {
    if (photoURL.length < 3 || photoURL.length > 400) {
      return "Photo URL must be between 3 and 400 characters.";
    }
    if (!isValidURL(photoURL)) {
      return "Please enter a valid URL.";
    }
    return ""; 
  }
  
  function isValidURL(url) {
   
    const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;


    return urlPattern.test(url);
}

  