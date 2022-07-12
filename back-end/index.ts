import express, { Application, Request, Response } from "express";
const auth = require('./src/routes/authentication.route');
const app: Application = express();
const port = 3000;

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
    "/",
    async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({
            message: "Hello World!",
        });
    }
);

app.use('/auth',auth);


app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
});