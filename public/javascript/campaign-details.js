import { user } from "./helpers/helpers.js";
import { Campaign } from "./models/campaign.js";
import { Pledge } from "./models/Pledge.js";
import { User } from "./models/User.js";
import { showAlert } from "./helpers/alert.js";
const campaignId = parseInt(sessionStorage.getItem("campaignId"));
console.log(campaignId);
const allPledges = await Pledge.getAllPledges();

const currentUser = { ...user };
const campaign = await Campaign.getcampaign(campaignId);

const pledges = await Pledge.getAllPledgesByCampaignId(campaignId);
const creator = await User.getUser(campaign.creatorId);

let amountRaised = pledges.reduce((sum, pledge) => sum + pledge.amount, 0);
let progress = (amountRaised / campaign.goal) * 100;

const deadlineDate = new Date(campaign.deadline);
const today = new Date();
const daysLeft = Math.max(
  0,
  Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
);

document.getElementById("campaign-image").src = campaign.image;
document.getElementById("campaign-title").textContent = campaign.title;
document.getElementById("campaign-description").textContent =
  campaign.description;
document.getElementById("campaign-creator").textContent = creator.username;
document.getElementById("campaign-goal").textContent =
  campaign.goal.toLocaleString();
document.getElementById("campaign-goal-2").textContent =
  campaign.goal.toLocaleString();
document.getElementById("campaign-deadline").textContent =
  deadlineDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
document.getElementById("amount-raised").textContent =
  amountRaised.toLocaleString();
document.getElementById("progress-bar").style.width = `${progress}%`;
document.getElementById("progress-text").textContent = `${progress.toFixed(
  1
)}%`;

document.getElementById("stats-goal").textContent =
  campaign.goal.toLocaleString();
document.getElementById("stats-raised").textContent =
  amountRaised.toLocaleString();
document.getElementById("days-left").textContent = daysLeft;
document
  .getElementById("backing-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = parseInt(document.getElementById("pledge-amount").value);

    const newPledge = {
      id: allPledges.length + 1,
      amount,
      campaignId,
      userId: currentUser.id,
    };
    Pledge.postPledge(newPledge);
    amountRaised += amount;
    progress = (amountRaised / campaign.goal) * 100;
    document.getElementById("amount-raised").textContent =
      amountRaised.toLocaleString();
    document.getElementById("stats-raised").textContent =
      amountRaised.toLocaleString();
    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("progress-text").textContent = `${progress.toFixed(
      1
    )}%`;

    // alert("Thank you for backing this campaign!");
    showAlert("Thank you for backing this campaign!", true);
  });
document.getElementById("backBtn").addEventListener("click", () => {
  location.href = "donor-dashboard.html";
});
