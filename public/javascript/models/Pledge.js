export class Pledge {
  static getAllPledges = async function () {
    try {
      const response = await fetch("http://localhost:3000/pledges");
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };
}
