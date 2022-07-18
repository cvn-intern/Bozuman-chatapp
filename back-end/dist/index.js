"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PORT = 3000;
const express_1 = __importDefault(require("express"));
const authentication_route_1 = __importDefault(require("./src/routes/authentication.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Body parsing Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
// origin: 'http://127.0.0.1:5500', //Chan tat ca cac domain khac ngoai domain nay
// credentials: true //Để bật cookie HTTP qua CORS
}));
app.use('/api/auth', authentication_route_1.default);
app.use('/', (req, res) => {
    res.json({
        success: 'hello'
    });
});
const port = process.env.PORT || PORT;
app.listen(port, () => {
    /* eslint-disable no-debugger, no-console */
    console.log(`Connected successfully on port ${PORT}`);
});
