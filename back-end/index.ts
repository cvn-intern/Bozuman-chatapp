import express, { Application, Request, Response } from 'express';
const auth = require('./src/routes/authentication.route');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app: Application = express();
const port = 3000;
const { Database } = require('./src/configs/db.config');
const db = new Database();
// Body parsing Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: 'http://localhost:3001', //Chan tat ca cac domain khac ngoai domain nay
    origin: ['http://127.0.0.1:3001','http://localhost:3001'],
    credentials: true, //Để bật cookie HTTP qua CORS // Chỉ có thể set cookie trên cùng domain
    // methods: 'POST',
    // maxAge: 84000
  })
);

app.use('/api/auth', auth);
app.use(require('./src/middlewares/checkAccessToken'))
// secure route goes here

app.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
});
