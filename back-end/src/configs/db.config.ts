import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
/* eslint-disable no-debugger, no-console */

export class Database {
  protected username: string | undefined = process.env.DB_USERNAME;
  protected password: string | undefined = process.env.DB_PASSWORD;
  protected cluster: string | undefined = process.env.DB_CLUSTER;
  protected dbname: string | undefined = process.env.DB_NAME;

  public dbConnect = async () => {
    await mongoose
      .connect(
        `mongodb+srv://${this.username || ''}:${this.password || ''}@${this.cluster || ''}.mongodb.net/${this.dbname || ''}?retryWrites=true&w=majority`
      )
      .then(() => {
        //TO DO
      });
    const conn: mongoose.Connection = mongoose.connection;
    conn.on('error', console.error.bind(console, 'connection error: '));
    conn.once('open', function () {
      console.log('Connected successfully');
    });
  }
}
