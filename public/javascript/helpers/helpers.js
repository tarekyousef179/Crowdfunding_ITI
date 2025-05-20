export const user = JSON.parse(localStorage.getItem("loggedInUser"));
export let campaignId;
export const logoutUser = function () {
  localStorage.removeItem("user");
};
export function redirectUser() {
  if (user.role === "donor") {
    window.location.href = "donor-dashboard.html";
  } else if (user.role === "student") {
    window.location.href = "student-dashboard.html";
  } else {
    window.location.href = "admin-dashboard.html";
  }
}
