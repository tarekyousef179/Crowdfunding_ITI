import { User } from "../javascript/models/User.js";
import { Campaign } from "../javascript/models/campaign.js";

const usersTabel = document.querySelector("#user-table-body");
const compaignsTabel = document.querySelector("#campaign-table-body");
const pledgesTable = document.querySelector("#pledge-table-body");
let users = await User.getAllUsers();
let allCampaigns = await Campaign.getAllCampaigns();
let ApprovedCam = allCampaigns.filter((cam) => cam["isApproved"]);
let PendingCam = allCampaigns.filter((cam) => !cam["isApproved"]);
document.getElementById("total-users").textContent = users.length;
document.getElementById("active-campaigns").textContent = ApprovedCam.length;
document.getElementById("pending-campaigns").textContent = PendingCam.length;
const loadUsers = function () {
  usersTabel.innerHTML = "";
  users.forEach((user) => {
    const row = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = user.username;

    const emailTd = document.createElement("td");
    emailTd.textContent = user.email;

    const roleTd = document.createElement("td");
    roleTd.textContent = user.role;

    const statusTd = document.createElement("td");
    statusTd.textContent = user.isActive ? "Active" : "Banned";

    const actionTd = document.createElement("td");
    const actionBtn = document.createElement("button");
    actionBtn.classList.add("btn");
    actionBtn.textContent = user.isActive ? "Ban" : "Unban";
    actionBtn.className = user.isActive ? "btn btn-primary" : "btn btn-danger";
    actionBtn.style.width = "100%";
    actionBtn.addEventListener("click", async () => {
      await User.toggleActiveStatus(user.id, user.isActive);
      users = await User.getAllUsers();
      loadUsers();
    });

    actionTd.appendChild(actionBtn);

    row.appendChild(nameTd);
    row.appendChild(emailTd);
    row.appendChild(roleTd);
    row.appendChild(statusTd);
    row.appendChild(actionTd);

    usersTabel.appendChild(row);
  });
};
loadUsers();
const loadCampaigns = function () {
  compaignsTabel.innerHTML = "";
  allCampaigns.forEach((campaign) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${campaign.id}</td>
      <td>${campaign.title}</td>
      <td>${campaign.goal}</td>
      <td>${campaign.deadline}</td>
      <td>${campaign.description}</td>
      <td>${campaign.isApproved ? "Active" : "Pending"}</td>
      <td>
        <button class="approve" data-id="${campaign.id}"></button>
        <button class="reject" data-id="${campaign.id}")"></button>
        <button class="delete btn btn-outline-secondary" data-id="${
          campaign.id
        }")">delete</button>
      </td>
    `;
    compaignsTabel.appendChild(row);
  });
};
loadCampaigns();
const btnAproveStatus = async function () {
  document.querySelectorAll(".approve").forEach(async (btn) => {
    let campaign = await Campaign.getcampaign(btn.dataset.id);
    btn.textContent = campaign.isApproved ? "Approved" : "Approve";
    btn.className = campaign.isApproved
      ? "approve btn btn-primary"
      : "approve btn btn-outline-secondary";
    allCampaigns = await Campaign.getAllCampaigns();
    ApprovedCam = allCampaigns.filter((cam) => cam["isApproved"]);
    document.getElementById("active-campaigns").textContent =
      ApprovedCam.length;
  });
};
const btnRejectStatus = async function () {
  document.querySelectorAll(".reject").forEach(async (btn) => {
    let campaign = await Campaign.getcampaign(btn.dataset.id);
    btn.textContent = campaign.isApproved ? "Reject" : "Rejected";
    btn.className = campaign.isApproved
      ? "reject btn btn-outline-secondary"
      : "reject btn btn-danger";
    allCampaigns = await Campaign.getAllCampaigns();
    PendingCam = allCampaigns.filter((cam) => !cam["isApproved"]);
    document.getElementById("pending-campaigns").textContent =
      PendingCam.length;
  });
};
const initCampaignButtons = async function () {
  document.querySelectorAll(".approve").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await Campaign.approveCampaign(btn.dataset.id);
      allCampaigns = await Campaign.getAllCampaigns();
      loadCampaigns();
      btnAproveStatus();
      btnRejectStatus();
      initCampaignButtons();
    });
  });
  document.querySelectorAll(".reject").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await Campaign.rejectCampaign(btn.dataset.id);
      allCampaigns = await Campaign.getAllCampaigns();
      loadCampaigns();
      btnRejectStatus();
      btnAproveStatus();
      initCampaignButtons();
    });
  });
};
btnAproveStatus();
btnRejectStatus();
initCampaignButtons();
document.querySelectorAll(".delete").forEach((btn) =>
  btn.addEventListener("click", async () => {
    await Campaign.deleteCampaign(btn.dataset.id);
    loadCampaigns();
  })
);
async function getTotalpledges() {
  try {
    const response = await fetch("http://localhost:3000/pledges");
    const pledges = await response.json();
    const total = pledges.length;
    document.getElementById("total-pledges").textContent = total;
  } catch (error) {
    console.error(error);
  }
}
getTotalpledges();
const loadPledges = async function () {
  try {
    const response = await fetch("http://localhost:3000/pledges");
    const pledges = await response.json();
    pledgesTable.innerHTML = "";
    pledges.forEach(async (pledge) => {
      const row = document.createElement("tr");

      const pledgeTd = document.createElement("td");
      const relatedCampaign = await Campaign.getcampaign(pledge.campaignId);
      pledgeTd.textContent = await relatedCampaign.title;
      const amountTd = document.createElement("td");
      amountTd.textContent = `$${pledge.amount}`;

      const backerTd = document.createElement("td");
      const backer = await User.getUser(pledge.userId);
      console.log(backer);
      backerTd.textContent = backer.username;
      row.appendChild(pledgeTd);
      row.appendChild(amountTd);
      row.appendChild(backerTd);
      pledgesTable.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
};
loadPledges();
const showSection = function (sectionId) {
  const allSections = document.querySelectorAll(".dashboard-item");
  allSections.forEach((sec) => (sec.style.display = "none"));
  const activeSection = document.getElementById(sectionId);
  if (activeSection) activeSection.style.display = "block";
};
const alllis = document.querySelectorAll(".sidebar a");
alllis.forEach((li) => {
  li.addEventListener("click", function () {
    alllis.forEach((li) => li.classList.remove("active"));
    this.classList.add("active");
    if (this.textContent.trim() === "Users") {
      showSection("usersSection");
    } else if (this.textContent.trim() === "Campaigns") {
      showSection("campaignsSection");
    } else {
      showSection("pledgesSection");
    }
  });
});
