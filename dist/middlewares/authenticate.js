"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.authenticate = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            throw (0, http_errors_1.default)(401, "User not authenticated");
        }
        const user = yield verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = user;
        next();
    }
    catch (e) {
        next(e);
    }
});
exports.authenticate = authenticate;
function verifyToken(token, secret) {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, user) => {
            if (err) {
                reject((0, http_errors_1.default)(401, "User not authenticated"));
            }
            else {
                resolve(user);
            }
        });
    });
}
exports.verifyToken = verifyToken;
