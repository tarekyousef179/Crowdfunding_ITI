import { User } from "../javascript/models/User.js";
import { Campaign } from "../javascript/models/campaign.js";

const usersTabel = document.querySelector("#user-table-body");
const compaignsTabel = document.querySelector("#campaign-table-body");
const pledgesTable = document.querySelector("#pledge-table-body");
const users = await User.getAllUsers();
const allCampaigns = await Campaign.getAllCampaigns();
const ApprovedCam = allCampaigns.filter((cam) => cam["isApproved"]);
const PendingCam = allCampaigns.filter((cam) => !cam["isApproved"]);
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
    actionBtn.classList.add("btn", "btn-outline-secondary");
    actionBtn.textContent = user.isActive ? "Ban" : "Unban";
    actionBtn.style.width = "100%";

    actionBtn.addEventListener("click", async () => {
      await User.toggleActiveStatus(user.id, user.isActive);
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
        <button class="approve btn btn-outline-secondary" data-id="${
          campaign.id
        }">Approve</button>
        <button class="reject btn btn-outline-secondary" data-id="${
          campaign.id
        }")">reject</button>
        <button class="delete btn btn-outline-secondary" data-id="${
          campaign.id
        }")">delete</button>
      </td>
    `;
    compaignsTabel.appendChild(row);
  });
};
loadCampaigns();
document.querySelectorAll(".approve").forEach((btn) =>
  btn.addEventListener("click", async () => {
    await User.approveCampaign(btn.dataset.id);
    loadCampaigns();
  })
);

document.querySelectorAll(".reject").forEach((btn) =>
  btn.addEventListener("click", async () => {
    await User.rejectCampaign(btn.dataset.id);
    loadCampaigns();
  })
);

document.querySelectorAll(".delete").forEach((btn) =>
  btn.addEventListener("click", async () => {
    await User.deleteCampaign(btn.dataset.id);
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
const alllis = document.querySelectorAll(".sidebar li");
alllis.forEach((li) => {
  li.addEventListener("click", function () {
    console.log(this);
    if (this.textContent.trim() === "Users") {
      showSection("usersSection");
    } else if (this.textContent.trim() === "Campaigns") {
      showSection("campaignsSection");
    } else {
      showSection("pledgesSection");
    }
  });
});
