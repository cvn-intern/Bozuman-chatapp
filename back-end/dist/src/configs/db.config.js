"use strict";
/* eslint-disable */
require('dotenv').config();
const mongoose = require("mongoose");
class Database {
    constructor() {
        this.username = process.env.DB_USERNAME;
        this.password = process.env.DB_PASSWORD;
        this.cluster = process.env.DB_CLUSTER;
        this.dbname = process.env.DB_NAME;
        mongoose.connect(`mongodb+srv://${this.username}:${this.password}@${this.cluster}.mongodb.net/${this.dbname}?retryWrites=true&w=majority`)
            .then((error) => {
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
