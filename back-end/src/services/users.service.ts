const Users = require('../models/users.model');

module.exports = class UsersService{
  
  static create = async (data: any) => {
    try {
      const user = {
        username: data.userName,
        password: data.password,
        full_name: data.fullName,
        email: data.email
      }
      const response = await new Users(user).save();
      return response;
    }
    catch (error) {
      console.log(error);
    }
    
  }

}