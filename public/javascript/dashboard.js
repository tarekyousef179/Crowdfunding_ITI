import { User } from "../javascript/models/User.js";
import { Campaign } from "../javascript/models/campaign.js";
const usersTabel = document.querySelector("#user-table-body");
const compaignsTabel = document.querySelector("#campaign-table-body");
const users = await User.getAllUsers();
const allCampaigns = await Campaign.getAllCampaigns();
const ApprovedCam = allCampaigns.filter((cam) => cam["isApproved"]);
const PendingCam = allCampaigns.filter((cam) => !cam["isApproved"]);
document.getElementById("total-users").textContent = users.length;
document.getElementById("active-campaigns").textContent = ApprovedCam.length;
document.getElementById("pending-campaigns").textContent = PendingCam.length;
users.forEach((user) => {
  let cretedTr = document.createElement("tr");
  let nameTd = document.createElement("td");
  nameTd.textContent = user["username"];
  cretedTr.appendChild(nameTd);
  let roleTd = document.createElement("td");
  roleTd.textContent = user["role"];
  cretedTr.appendChild(roleTd);
  let statusTd = document.createElement("td");
  statusTd.textContent = user["isActive"] ? "Active" : "Panned";
  cretedTr.appendChild(statusTd);
  let actionTd = document.createElement("button");
  actionTd.classList.add("btn", "btn-outline-secondary");
  actionTd.style.width = "100%";
  actionTd.textContent = "Pan";
  cretedTr.appendChild(actionTd);
  usersTabel.appendChild(cretedTr);
});
allCampaigns.forEach((campaign) => {
  let row = document.createElement("tr");
  row.innerHTML = `
      <td>${campaign.id}</td>
      <td>${campaign.title}</td>
      <td>${campaign.goal}</td>
      <td>${campaign.deadline}</td>
      <td>${campaign.description}</td>
      <td>${campaign.isApproved ? "Active" : "Pending"}</td>
      <td>
        <button"></button>
        <button "></button>
        <button "></button>
      </td>
`;
  compaignsTabel.appendChild(row);
});

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
