export class Pledge {
  static getAllPledges = async function () {
    try {
      const response = await fetch("http://localhost:3000/pledges");
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };
  static getAllPledgesByUSerId = async function (userId) {
    try {
      const response = await fetch("http://localhost:3000/pledges");
      const allPledges = await response.json();
      return allPledges.filter((p) => p.userId == userId);
    } catch (error) {
      console.log(error);
    }
  };
  static getAllPledgesByCampaignId = async function (campaignId) {
    try {
      const response = await fetch("http://localhost:3000/pledges");
      const allPledges = await response.json();
      return allPledges.filter((p) => p.campaignId == campaignId);
    } catch (error) {
      console.log(error);
    }
  };
  static postPledge = async function (pledge) {
    try {
      const response = await fetch(`http://localhost:3000/pledges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pledge),
      });
    } catch (error) {
      console.log(error);
    }
  };
}
