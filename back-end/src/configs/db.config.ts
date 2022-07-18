/* eslint-disable */
require('dotenv').config();
const mongoose = require("mongoose");

export class Database {
  protected username: any = process.env.DB_USERNAME;
  protected password: any = process.env.DB_PASSWORD;
  protected cluster: any = process.env.DB_CLUSTER;
  protected dbname: any = process.env.DB_NAME;
  protected conn: any;

  constructor() {
    mongoose.connect(
      `mongodb+srv://${this.username}:${this.password}@${this.cluster}.mongodb.net/${this.dbname}?retryWrites=true&w=majority`
    )
      .then((error : any)=>{
        /* eslint-disable no-debugger, no-console */
        console.log(error);
      });
    this.conn = mongoose.connection;
    this.conn.on('error', console.error.bind(console, 'connection error: '));
    this.conn.once('open', function () {
      console.log('Connected successfully');
    });
  }
}
