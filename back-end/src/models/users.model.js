const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = Schema({

    username:{
        type: String,
        required: true,
    },

    password:{
        type: String,
        required: true,
    },

    full_name: {
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
    },

    active:{
        type: Boolean,
        required: false,
    },

    birth_day:{
        type: Date,
        required: false,
    },

    gender: {
        type: Boolean,
        required: false,
    },

    phone:{
        type: String,
        required: false,
    },

    avatar:{
        type: String,
        required: false,
    },

    description:{
      type: String,
      required: false,
    },

    room_list: {
      type: Array,
      required: false,
    },

});


module.exports = mongoose.model("Users", UsersSchema);