export class User {
  constructor(id, name, email, password, isActive = true, role = "backer") {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
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
      return allUsers.filter((user) => user["id"] == userId)[0];
    } catch (error) {
      console.log(error);
    }
  };

    static register = async function (userData) {
    try {
      
      const users = await User.getAllUsers();
      const userExists = users.some(u => u.email === userData.email);
      if (userExists) {
        return { user: null, errorMessage: "Email already registered." };
      }
      
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        return { user: null, errorMessage: "Failed to register user." };
      }

      const newUser = await response.json();
      return { user: newUser, errorMessage: null };
    } catch (error) {
      console.error(error);
      return { user: null, errorMessage: "An error occurred." };
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
