require('dotenv').config();
import express from "express";
const mongoose = require("mongoose");

class Database {
  protected username: any = process.env.DB_USERNAME;
  protected password: any = process.env.DB_PASSWORD;
  protected cluster: any = process.env.DB_CLUSTER;
  protected dbname: any = process.env.DB_NAME;
  protected conn: any;

  constructor() {
    mongoose.connect(
      `mongodb+srv://${this.username}:${this.password}@${this.cluster}.mongodb.net/${this.dbname}?retryWrites=true&w=majority`
    );
    this.conn = mongoose.connection;
    this.conn.on("error", console.error.bind(console, "connection error: "));
    this.conn.once("open", function () {
      console.log("Connected successfully");
    });
  }
}

module.exports = { Database };
