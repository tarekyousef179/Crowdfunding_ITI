import { User } from "../javascript/models/User.js";


  function showError(input, message) {
    const formGroup = input.closest('.mb-3');
    const feedback = formGroup.querySelector('.invalid-feedback');
    feedback.textContent = message;
    input.classList.add('is-invalid');
  }

    function clearError(input) {
    const formGroup = input.closest('.mb-3');
    const feedback = formGroup.querySelector('.invalid-feedback');
    feedback.textContent = '';
    input.classList.remove('is-invalid');
  }

    function clearAllErrors(fields) {
    Object.values(fields).forEach(field => {
      if (field.length) return; 
      clearError(field);
    });
    document.getElementById('userTypeError').textContent = '';
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  
  function isStrongPassword(pw) {
    const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regexp.test(pw);
  }

  function validateUserType(fields) {
    const userTypeErrorDiv = document.getElementById('userTypeError');
    let checked = false;
    for (const radio of fields.userType) {
      if (radio.checked) {
        checked = true;
        break;
      }
    }
    if (!checked) {
      userTypeErrorDiv.textContent = 'Please select a user type.';
      return false;
    }
    userTypeErrorDiv.textContent = '';
    return true;
  }

const onSubmitForm = async (event) => {
  event.preventDefault();

  const fields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    userType: document.getElementsByName('userType'),
  };


  clearAllErrors(fields);

  const {
    email,
    confirmPassword,
    firstName,
    lastName,
    password,
    userType
   } = fields

  let isValid = true;

  if (!firstName.value.trim()) {
    showError(firstName, 'Please enter your first name.');
    isValid = false;
  }
  if (!lastName.value.trim()) {
    showError(lastName, 'Please enter your last name.');
    isValid = false;
  }
  if (!isValidEmail(email.value)) {
    showError(email, 'Please enter a valid email address.');
    isValid = false;
  }
  if (!isStrongPassword(password.value)) {
    showError(password, 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
    isValid = false;
  }
  if (password.value !== confirmPassword.value) {
    showError(confirmPassword, 'Password and Confirm Password do not match.');
    isValid = false;
  }
  if (!validateUserType(fields)) {
    isValid = false;
  }

  if (!isValid) return;

  
  const userData = {
    id: Date.now().toString(), 
    username: firstName.value.trim() + " " + lastName.value.trim(),
    email: email.value.trim(),
    password: password.value,
    role: Array.from(userType).find(r => r.checked).value,
    isActive: true
  };

  
  const { user, errorMessage } = await User.register(userData);

  // const isStudent = userType === "student";


  if (user) {
    // window.location.pathname = isStudent ? "" : "/Crowdfunding_ITI/public/pages/home.html"; 
    window.location.pathname = "/Crowdfunding_ITI/public/pages/home.html";
  } else {
    alert(errorMessage || "Registration failed. Please try again.");
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#signup-form');
  form.addEventListener('submit', onSubmitForm);
});
