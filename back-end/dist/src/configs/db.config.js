"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    constructor() {
        this.username = 'haicauancarem';
        this.password = 'tiachop1';
        this.cluster = 'started.xqz9w53';
        this.dbname = 'Tester';
        mongoose_1.default.connect(`mongodb+srv://${this.username}:${this.password}@${this.cluster}.mongodb.net/${this.dbname}?retryWrites=true&w=majority`)
            .then((error) => {
            /* eslint-disable no-debugger, no-console */
            console.log(error);
        });
        this.conn = mongoose_1.default.connection;
        this.conn.on('error', console.error.bind(console, 'connection error: '));
        this.conn.once('open', function () {
            console.log('Connected successfully');
        });
    }
}
exports.default = Database;
