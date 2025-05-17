import { User } from "../javascript/models/User.js";

const onSubmitForm = async (event) => {
  event.preventDefault();

  document.getElementById("userNameErrorField").innerText = "";
  document.getElementById("passwordErrorField").innerText = "";
  document.getElementById("formError").innerText = "";

  const userName = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!userName) {
    document.getElementById("userNameErrorField").innerText = "* Required";
    return;
  }
  if (!password) {
    document.getElementById("passwordErrorField").innerText = "* Required";
    return;
  }

  const { user, errorCode, errorMessage } =
    await User.findUserByUsernameAndPassword(userName, password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    if (user.role === "donor") {
      window.location.href = "/donor-dashboard.html";
    } else if (user.role === "student") {
      window.location.href = "/student-dashboard.html";
    } else {
      window.location.href = "admin-dashboard.html";
    }
  } else {
    const formErrorField = document.getElementById("formError");
    if (errorCode === "userNotFound") {
      formErrorField.innerText = errorMessage;
    } else if (errorCode === "wrongPassword") {
      formErrorField.innerHTML = errorMessage;
    } else {
      formErrorField.innerText = errorMessage || "An unknown error occurred.";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", onSubmitForm);
});
