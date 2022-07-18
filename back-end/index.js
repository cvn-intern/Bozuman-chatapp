"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth = require('./src/routes/authentication.route');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = (0, express_1.default)();
const port = 3000;
const { Database } = require('./src/configs/db.config');
const db = new Database();
// Body parsing Middleware
app.use(express_1.default.json());
app.use(cookieParser());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cors({
// origin: 'http://127.0.0.1:5500', //Chan tat ca cac domain khac ngoai domain nay
// credentials: true //Để bật cookie HTTP qua CORS
}));
app.use('/api/auth', auth);
app.use('/', (req, res) => {
    res.json({
        success: 'hello'
    });
});
app.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
});
