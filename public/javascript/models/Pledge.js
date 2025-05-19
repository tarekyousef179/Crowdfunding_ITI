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
}
