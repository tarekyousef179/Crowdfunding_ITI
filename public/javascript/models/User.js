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
      return allUsers.filter((user) => user["id"] === userId)[0];
    } catch (error) {
      console.log(error);
    }
  };
  static findUserByUsernameAndPassword = async function (_username, _password) {
    try {
      const response = await fetch("http://localhost:3000/users");
      const allUsers = await response.json();

      const foundUser = allUsers.find(({ username, password }) => username === _username && password === _password)

      if(foundUser){
        return {
          user: foundUser
        }
      };

      return {
        errorMessage: "User dosn't exist"
      }
    } catch (error) {
      console.log(error);
    }
  };
}
