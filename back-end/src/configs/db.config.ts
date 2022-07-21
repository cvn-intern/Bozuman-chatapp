import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

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
    // eslint-disable-next-line no-console
    conn.on('error', console.error.bind(console, 'connection error: '));
    conn.once('open', function () {
      // eslint-disable-next-line no-console
      console.log('Connected successfully');
    });
  }
}
