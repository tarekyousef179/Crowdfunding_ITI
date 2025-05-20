export class Campaign {
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
  static async approveCampaign(id) {
    await fetch(`http://localhost:3000/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });
  }

  static async rejectCampaign(id) {
    await fetch(`http://localhost:3000/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: false }),
    });
  }

  static async deleteCampaign(id) {
    await fetch(`http://localhost:3000/campaigns/${id}`, {
      method: "DELETE",
    });
  }
}
