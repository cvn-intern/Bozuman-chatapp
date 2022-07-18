const PORT = 3000;
import express, { Application, Request, Response } from 'express';
const auth = require('./src/routes/authentication.route');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app: Application = express();
const { Database } = require('./src/configs/db.config');

const db = new Database();
// Body parsing Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  // origin: 'http://127.0.0.1:5500', //Chan tat ca cac domain khac ngoai domain nay
  // credentials: true //Để bật cookie HTTP qua CORS
}))

app.use('/api/auth',auth);
app.use('/',(req,res) => {
  res.json({
    success: 'hello'
  })
});
const port = process.env.PORT || PORT;
app.listen(port, (): void => {
  console.log(`Connected successfully on port ${PORT}`);
});