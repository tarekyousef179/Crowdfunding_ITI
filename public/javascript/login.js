import { User } from "../javascript/models/User.js";

const onSubmitForm = async (event) => {
  event.preventDefault(); // prevent actual form submission
  const userName = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!userName) {
    const userNameErrorField = document.getElementById("userNameErrorField");
    userNameErrorField.innerText = "* Required";
    return;
  }

  if (!password) {
    const passwordErrorField = document.getElementById("passwordErrorField");
    passwordErrorField.innerText = "* Required";
    return;
  }

  const { user, errorMessage } = await User.findUserByUsernameAndPassword(
    userName,
    password
  );

  if (user) {
    console.log(user);
    // window.location.pathname = "/Crowdfunding_ITI/public/pages/home.html";
    return;
  }

  const formErrorField = document.getElementById("formError");
  formErrorField.innerText = errorMessage;
};

// Register the event listener when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", onSubmitForm);
});
