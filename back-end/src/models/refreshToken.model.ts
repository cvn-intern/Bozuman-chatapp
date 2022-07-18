// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
import mongoose from "mongoose";
import { Schema } from "mongoose";

const RefreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users" },
  token: String,
  created: { type: Date, default: Date.now },
  createdByIp: String,
});

RefreshTokenSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
