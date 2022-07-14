import express, { Application, Request, Response } from "express";
const auth = require('./src/routes/authentication.route');
const app: Application = express();
const port = 3000;
const { Database } = require('./src/configs/db.config');

const db = new Database();
// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',auth);

app.listen(port, (): void => {
  console.log(`Connected successfully on port ${port}`);
});