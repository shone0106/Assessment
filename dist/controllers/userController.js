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
exports.updateProfile = exports.login = exports.signUp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const user_1 = __importDefault(require("../models/user"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const age = req.body.age;
    try {
        if (!email || !password || !name || !age) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        if (!validator_1.default.isEmail(email)) {
            throw (0, http_errors_1.default)(400, "Invalid email");
        }
        if (typeof age !== 'number' || age > 120 || age < 10) {
            throw (0, http_errors_1.default)(400, "Invalid age");
        }
        const existingUsername = yield user_1.default.findOne({ email: email }).exec();
        if (existingUsername)
            throw (0, http_errors_1.default)(409, 'Username already taken. Please choose a different one or log in instead.');
        const newUser = yield user_1.default.create({ email, password, name, age });
        res.status(201).json({
            statusCode: 201,
            data: {
                user: newUser
            },
            message: "User created"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    try {
        if (!email || !password) {
            throw (0, http_errors_1.default)(400, "Parameters missing");
        }
        if (!validator_1.default.isEmail(email)) {
            throw (0, http_errors_1.default)(400, "Invalid email");
        }
        const user = yield user_1.default.findOne({ email: email }).select("+password").exec();
        if (!user)
            throw (0, http_errors_1.default)(404, "User does not exist");
        if (!(yield bcrypt_1.default.compare(password, user.password))) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        const payload = { id: user._id };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        res.status(200).json({
            statusCode: 200,
            data: {
                jwt: accessToken,
                user
            },
            message: "Login successful"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const name = req.body.name;
    const age = req.body.age;
    try {
        if (age && (typeof age !== 'number' || age > 120 || age < 10)) {
            throw (0, http_errors_1.default)(400, "Invalid age");
        }
        if (!mongoose_1.default.isValidObjectId(userId)) {
            throw (0, http_errors_1.default)(400, "Invalid user id");
        }
        const user = yield user_1.default.findById(userId).exec();
        if (!user) {
            throw (0, http_errors_1.default)(404, "Cannot find user");
        }
        if (!user._id.equals(req.user.id)) {
            throw (0, http_errors_1.default)(403, "You are not authorized");
        }
        user.name = name || user.name;
        user.age = age || user.age;
        const updatedUser = yield user.save();
        res.status(200).json({
            statusCode: 200,
            data: {
                user: updatedUser
            },
            message: "user details updated"
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.updateProfile = updateProfile;
