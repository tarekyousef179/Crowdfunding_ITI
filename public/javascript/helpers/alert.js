export let alertBox2 = document.querySelector(".alert-box2");
export const showAlert = function (msg, isSuccess) {
  let icon = document.querySelector("i");
  document.querySelector(".alert-msg").innerText = msg;
  if (isSuccess) {
    icon.className = "fa-solid fa-circle-check";
    icon.style.color = "green";
    document.querySelector(".hide").classList.add("btn-success");
  } else {
    icon.className = "fa-solid fa-xmark fa-beat-fade";
    icon.style.color = "red";
    document.querySelector(".hide").classList.add("btn-danger");
  }
  document.body.classList.add("show-overlay");
  alertBox2.classList.add("show-alert");
};
//_________________________________________________________________________
document.querySelector(".hide").addEventListener("click", function () {
  alertBox2.classList.remove("show-alert");
  document.body.classList.remove("show-overlay");
});
