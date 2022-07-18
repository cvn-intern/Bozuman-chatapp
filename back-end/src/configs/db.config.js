"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class Database {
    constructor() {
        this.username = "haicauancarem";
        this.password = "tiachop1";
        this.cluster = "started.xqz9w53";
        this.dbname = "Tester";
        mongoose.connect(`mongodb+srv://${this.username}:${this.password}@${this.cluster}.mongodb.net/${this.dbname}?retryWrites=true&w=majority`);
        this.conn = mongoose.connection;
        this.conn.on("error", console.error.bind(console, "connection error: "));
        this.conn.once("open", function () {
            console.log("Connected successfully");
        });
    }
}
module.exports = { Database };
