import { Campaign } from "../javascript/models/campaign.js";
import { Pledge } from "../javascript/models/Pledge.js";
const allCampaigns = await Campaign.getAllCampaigns();
const approvedCampaigns = allCampaigns.filter((c) => c.isApproved);
const allPledges = await Pledge.getAllPledges();
const categorySelect = document.getElementById("category-filter");

export function renderCampaigns(campaigns) {
  const container = document.querySelector(".cards");
  container.innerHTML = "";
  campaigns.forEach((campaign) => {
    let id = campaign.id;
    let relatedPledges = allPledges.filter((pledge) => {
      return pledge.campaignId == id;
    });
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
      <p><span>Target:</span> ${campaign.goal}
      <p><span>Deadline:</span> ${campaign.deadline}
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
renderCampaigns(approvedCampaigns);
let toggle = document.querySelector(".toggle-menu");
let mainNav = document.querySelector("header nav");
let links = document.querySelectorAll("header nav a");
document.addEventListener("load", function () {
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
});
categorySelect.addEventListener("input", () => {
  const selectedCategory = categorySelect.value;
  console.log(selectedCategory);
  if (selectedCategory === "all") {
    renderCampaigns(approvedCampaigns);
  } else {
    const filtered = approvedCampaigns.filter(
      (c) => c.category === selectedCategory
    );
    renderCampaigns(filtered);
  }
});
const searchInput = document.getElementById("keyword-filter");

searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase();

  const filteredCampaigns = approvedCampaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(query) ||
      campaign.description.toLowerCase().includes(query)
  );

  renderCampaigns(filteredCampaigns);
});
const sortSelect = document.getElementById("deadline-filter");
sortSelect.addEventListener("change", function () {
  const selected = this.value;

  let sortedCampaigns = [...approvedCampaigns];

  sortedCampaigns.sort((a, b) => {
    const dateA = new Date(a.deadline);
    const dateB = new Date(b.deadline);

    if (selected === "asc") {
      return dateA - dateB;
    } else if (selected === "desc") {
      return dateB - dateA;
    }
  });

  renderCampaigns(sortedCampaigns);
});
