export class Campaign {
  constructor(id, title, creatorId, goal, deadline, ...rewards) {
    this.id = id;
    this.title = title;
    this.creatorId = creatorId;
    this.goal = goal;
    this.deadline = deadline;
    this.isApproved = false;
    this.rewards = rewards;
  }
  static getAllCampaigns = async function () {
    try {
      const response = await fetch("http://localhost:3000/campaigns");
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };
  static getcampaign = async function (campaignId) {
    try {
      const response = await fetch("http://localhost:3000/campaigns");
      const allCampaigns = await response.json();
      return allCampaigns.filter((campaign) => campaign["id"] == campaignId)[0];
    } catch (error) {
      console.log(error);
    }
  };
}
