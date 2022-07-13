import { isSet } from "util/types";

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

  static find = async (data: any) => {
    if (data.userName) {
      const userList = await Users.find({ username: data.userName }).exec();
      return userList;
    } else if (data.email) {
      const userList = await Users.find({ email: data.email }).exec();
      return userList;
    } 
  }


}