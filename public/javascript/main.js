import { Campaign } from "../javascript/models/campaign.js";
import { Pledge } from "../javascript/models/Pledge.js";
const allCampaigns = await Campaign.getAllCampaigns();
const approvedCampaigns = allCampaigns.filter((c) => c.isApproved);
const allPledges = await Pledge.getAllPledges();
// console.log(allPledges);

function renderCampaigns() {
  const container = document.querySelector(".cards");
  container.innerHTML = "";
  approvedCampaigns.forEach((campaign) => {
    let id = campaign.id;
    let relatedPledges = allPledges.filter((pledge) => {
      return pledge.campaignId == id;
    });
    console.log(relatedPledges);
    const totalAmount = relatedPledges.reduce((sum, p) => sum + p.amount, 0);
    const progressPercent = Math.min(
      (totalAmount / campaign.goal) * 100,
      100
    ).toFixed(1);
    const shortDesc =
      campaign.description.length > 100
        ? campaign.description.slice(0, 100) + "..."
        : campaign.description;

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${campaign.image}" alt="${campaign.title}" />
      <h3>${campaign.title}</h3>
      <p>${shortDesc}</p>
      <div class="progress">
        <div class="progress-bar" style="width: ${progressPercent}%">
              <span class="progress-text">${progressPercent}%</span>
         </div>
      </div>
      <button onclick="donate(${campaign.id})"> Donate Now</button>
    `;
    container.appendChild(card);
  });
}
renderCampaigns();
let toggle = document.querySelector(".toggle-menu");
let mainNav = document.querySelector("header nav");
let links = document.querySelectorAll("header nav a");
toggle.addEventListener("click", function () {
  this.classList.toggle("fa-solid");
  this.classList.toggle("fa-xmark");
  mainNav.classList.toggle("custom-nav");
});
links.forEach((link) => {
  link.addEventListener("click", function () {
    if (mainNav.classList.contains("custom-nav")) {
      mainNav.classList.remove("custom-nav");
      toggle.classList.remove("fa-solid", "fa-xmark");
    }
  });
});
