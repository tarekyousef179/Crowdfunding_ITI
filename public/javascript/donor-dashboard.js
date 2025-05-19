import { Campaign } from "../javascript/models/campaign.js";
import { Pledge } from "../javascript/models/Pledge.js";
import { renderCampaigns } from "./main.js";
import { user } from "./helpers.js";
const allCampaigns = await Campaign.getAllCampaigns();
const approvedCampaigns = allCampaigns.filter((c) => c.isApproved);
const allPledges = await Pledge.getAllPledges();

const mypledges = await Pledge.getAllPledgesByUSerId(user.id);
const pledgesTable = document.querySelector("#pledges-table-body");
renderCampaigns(approvedCampaigns);
const loadPledges = async function () {
  try {
    pledgesTable.innerHTML = "";
    mypledges.forEach(async (pledge) => {
      const row = document.createElement("tr");

      const pledgeTd = document.createElement("td");
      const relatedCampaign = await Campaign.getcampaign(pledge.campaignId);
      pledgeTd.textContent = await relatedCampaign.title;
      const amountTd = document.createElement("td");
      amountTd.textContent = `$${pledge.amount}`;

      const rewardTd = document.createElement("td");
      const reward = await relatedCampaign.rewards;
      console.log(reward);
      rewardTd.textContent = reward[0].title;
      row.appendChild(pledgeTd);
      row.appendChild(amountTd);
      row.appendChild(rewardTd);
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
    console.log(this);
    alllis.forEach((li) => li.classList.remove("active"));
    this.classList.add("active");
    if (this.textContent.trim() === "Explore Campaigns") {
      showSection("campaigns");
    } else if (this.textContent.trim() === "My Pledges") {
      showSection("pledges");
    }
  });
});
