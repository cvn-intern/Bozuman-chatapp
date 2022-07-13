// import express from 'express';
// const mongoose = require('mongoose');


// class Database {
//   protected username: string = 'haicauancarem';
//   protected password: string = 'tiachop1';
//   protected cluster: string = 'started.xqz9w53';
//   protected dbname: string = 'Tester';
//   // protected username = 'vu';
//   // protected password = 'vu';
//   // protected cluster = 'cluster0.zsjsdin';
//   // protected dbname = '';
//   protected conn: any;

//   constructor() {
//     mongoose.connect(
//       `mongodb+srv://${this.username}:${this.password}@${this.cluster}.mongodb.net/${this.dbname}?retryWrites=true&w=majority`, 
//     );
//     this.conn = mongoose.connection;
//     this.conn.on("error", console.error.bind(console, "connection error: "));
//     this.conn.once("open", function () {
//       console.log("Connected successfully");
//     });
//   }
  
// }

// module.exports = {Database};

const { MongoClient } = require("mongodb");
// Connection URI
const uri =
  "mongodb+srv://vu:vu@cluster0.zsjsdin.mongodb.net/test";
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);