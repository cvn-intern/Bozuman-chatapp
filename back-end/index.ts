const PORT = 3000;

import express, { Application } from 'express';
import auth from './src/routes/authentication.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Application = express();

const { Database } = require('./src/configs/db.config');
const db = new Database();

// Body parsing Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  // origin: 'http://127.0.0.1:5500', //Chan tat ca cac domain khac ngoai domain nay
  //Để bật cookie HTTP qua CORS
  credentials: true 
}))

app.use('/api/auth',auth);
app.use('/',(req,res) => {
  res.json({
    success: 'Success'
  })
});

const port = process.env.PORT || PORT;

app.listen(port, (): void => {
  /* eslint-disable no-debugger, no-console */
  console.log(`Connected successfully on port ${PORT}`);
});
