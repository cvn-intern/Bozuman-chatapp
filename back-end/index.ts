/* eslint-disable */

const expiredAccessTokenHandler = require('./src/middlewares/expiredAccessTokenHandler')
const port = 3000;
const { Database } = require('./src/configs/db.config');


import express, { Application } from 'express';
import auth from './src/routes/authentication.route';
import cors from 'cors';
const db = new Database();
const PORT = 3000;const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://127.0.0.1:3001','http://localhost:3001', 'https://bozuman-chatapp-staging.vercel.app', 'https://bozuman-chatapp.vercel.app'],
    credentials: true, //Để bật cookie HTTP qua CORS // Chỉ có thể set cookie trên cùng domain
    // methods: 'POST',
    // maxAge: 84000
  })
);

app.use('/api/auth', auth);
app.use('/api/token', expiredAccessTokenHandler)
app.use(require('./src/middlewares/checkAccessToken'))
// secure route goes here
app.use('/', (req, res)=>{
  res.json({success:'ok'})
})
app.listen(port, (): void => {
  /* eslint-disable no-debugger, no-console */
  console.log(`Connected successfully on port ${PORT}`);
});
