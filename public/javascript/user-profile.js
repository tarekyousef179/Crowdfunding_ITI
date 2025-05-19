import { user } from "./helpers/helpers.js";
import { User } from "./models/User.js";
const allUsers = await User.getAllUsers();
const currentUser = { ...user };
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const usernameDisplay = document.getElementById("usernameDisplay");
const roleDisplay = document.getElementById("roleDisplay");
const alertBox = document.getElementById("alertBox");

if (!currentUser) {
  location.href = "login.html";
} else {
  usernameDisplay.textContent = currentUser.username;
  roleDisplay.textContent = currentUser.role;
  usernameInput.value = currentUser.username;
  emailInput.value = currentUser.email;
  passwordInput.value = currentUser.password;
  confirmPasswordInput.value = currentUser.password;
}

document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const newUsername = usernameInput.value.trim();
  const newEmail = emailInput.value.trim();
  const newPassword = passwordInput.value.trim();
  const newConfirmedPassword = confirmPasswordInput.value.trim();

  const isDuplicate = allUsers.some(
    (user) =>
      (user.email === newEmail || user.username === newUsername) &&
      user.id != currentUser.id
  );
  if (newPassword !== newConfirmedPassword) {
    alertBox.className = "alert alert-danger mt-3";
    alertBox.textContent = "Passwords do not match!";
    alertBox.classList.remove("d-none");
    return;
  }

  if (isDuplicate) {
    alertBox.className = "alert alert-danger mt-3";
    alertBox.textContent = "Email or username already in use!";
    alertBox.classList.remove("d-none");
    return;
  }
  const updatedUser = {
    ...currentUser,
    username: newUsername,
    email: newEmail,
    password: newPassword,
  };
  User.updateUserInDatabase(updatedUser);
  localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
  usernameDisplay.textContent = newUsername;
  alertBox.className = "alert alert-success mt-3";
  alertBox.textContent = "Profile updated successfully!";
  alertBox.classList.remove("d-none");
});

document.getElementById("backBtn").addEventListener("click", () => {
  const role = currentUser.role;
  switch (role) {
    case "donor":
      location.href = "donor-dashboard.html";
      break;
    case "student":
      location.href = "student-dashboard.html";
    case "admin":
      location.href = "admin-dashboard.html";
  }
});
