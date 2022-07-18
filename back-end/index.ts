/* eslint-disable */
import express, { Application } from 'express';
import cors from 'cors';
const expiredAccessTokenHandler = require('./src/middlewares/expiredAccessTokenHandler')
import auth from './src/routes/authentication.route';

const app: Application = express();

const { Database } = require('./src/configs/db.config');
const db = new Database();

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

const port = process.env.PORT || 5000;

app.listen(port, (): void => {
  /* eslint-disable no-debugger, no-console */
  console.log(`Connected successfully on port ${port}`);
});
