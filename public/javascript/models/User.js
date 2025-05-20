export class User {
  static getAllUsers = async function () {
    try {
      const response = await fetch("http://localhost:3000/users");
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };
  static getUser = async function (id) {
    try {
      const response = await fetch("http://localhost:3000/users");
      const allUsers = await response.json();
      const user = allUsers.find((u) => u.id == id);
      return user;
    } catch (error) {
      console.log(error);
    }
  };
  static async findUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find((user) => user.email === email) || null;
  }

  static register = async function (userData) {
    try {
      const users = await User.getAllUsers();
      const userExists = users.some((u) => u.email === userData.email);
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
  static updateUserInDatabase = async function (updatedUser) {
    try {
      await fetch(`http://localhost:3000/users/${updatedUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
    } catch (error) {
      console.log(error);
    }
  };

  static findUserByUsernameAndPassword = async function (_username, _password) {
    try {
      const response = await fetch("http://localhost:3000/users");
      const allUsers = await response.json();

      const userByUsername = allUsers.find(
        (user) => user.username === _username
      );

      if (!userByUsername) {
        return {
          errorCode: "userNotFound",
          errorMessage:
            "The username you entered isn't connected to an account. Find your account and log in.",
        };
      }

      if (userByUsername.password !== _password) {
        return {
          errorCode: "wrongPassword",
          errorMessage:
            "The password that you've entered is incorrect. Forgotten password?",
        };
      }

      return { user: userByUsername };
    } catch (error) {
      console.log(error);
      return {
        errorCode: "serverError",
        errorMessage: "An unexpected error occurred. Please try again later.",
      };
    }
  };
  static async toggleActiveStatus(id, currentStatus) {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
  }

  static findRequestByUserId = async function (userId) {
  try {
    const response = await fetch(`http://localhost:3000/requests?studentId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch requests");
    return await response.json();
  } catch (error) {
    console.error("Error fetching requests by user ID:", error);
    return [];
  }
};
}

