export class User {
  constructor(id, name, email, password, isActive = true, role = "backer") {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.isActive = isActive;
    this.role = role;
  }

  static getAllUsers = async function () {
    try {
      const response = await fetch("http://localhost:3000/users");
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  static getUser = async function (userId) {
    try {
      const response = await fetch("http://localhost:3000/users");
      const allUsers = await response.json();
      return allUsers.find(user => user.id == userId);
    } catch (error) {
      console.log(error);
    }
  };

  static findUserByUsernameAndPassword = async function (_username, _password) {
    try {
      const response = await fetch("http://localhost:3000/users");
      const allUsers = await response.json();

      const foundUser = allUsers.find(
        ({ username, password }) => username === _username && password === _password
      );

      if (foundUser) {
        return { user: foundUser };
      }

      return { errorMessage: "User doesn't exist" };
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

  static async toggleActiveStatus(id, currentStatus) {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
  }
}

