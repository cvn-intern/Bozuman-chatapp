import express from 'express';
const mongoose = require('mongoose');

class Database {
  protected username = 'haicauancarem';
  protected password = 'tiachop1';
  protected cluster = 'started.xqz9w53';
  protected dbname = 'Tester';
  protected conn: any;

  constructor() {
    mongoose.connect(
      `mongodb+srv://${this.username}:${this.password}@${this.cluster}.mongodb.net/${this.dbname}?retryWrites=true&w=majority`
    );
    this.conn = mongoose.connection;
    this.conn.on('error', console.error.bind(console, 'connection error: '));
    this.conn.once('open', function () {
      console.log('Connected successfully');
    });
  }
}

module.exports = { Database };
