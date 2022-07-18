/* eslint-disable */
import mongoose from 'mongoose';
export default class Database {
  protected username = 'haicauancarem';
  protected password = 'tiachop1';
  protected cluster = 'started.xqz9w53';
  protected dbname = 'Tester';
  protected conn: any;

  constructor() {
    mongoose.connect(
      `mongodb+srv://${this.username}:${this.password}@${this.cluster}.mongodb.net/${this.dbname}?retryWrites=true&w=majority`
    )
      .then((error)=>{
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
