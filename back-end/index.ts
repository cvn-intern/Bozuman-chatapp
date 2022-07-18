import express, { Application, Request, Response } from 'express';
const auth = require('./src/routes/authentication.route');
const expiredAccessTokenHandler = require('./src/middlewares/expiredAccessTokenHandler')
const cors = require('cors');
const app: Application = express();
const port = 3000;
const { Database } = require('./src/configs/db.config');
const db = new Database();
// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ['http://127.0.0.1:3001','http://localhost:3001'],
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
  console.log(`Connected successfully on port ${port}`);
});
