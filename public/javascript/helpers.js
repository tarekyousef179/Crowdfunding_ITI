export const user = JSON.parse(localStorage.getItem("loggedInUser"));
export const logoutUser = function () {
  localStorage.removeItem("user");
};
