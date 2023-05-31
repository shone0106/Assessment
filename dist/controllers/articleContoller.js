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
exports.createArticle = exports.getArticles = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const article_1 = __importDefault(require("../models/article"));
const user_1 = __importDefault(require("../models/user"));
const getArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield article_1.default.find().populate('author').exec();
        res.status(200).json({
            statusCode: 200,
            data: {
                articles
            },
            message: "success"
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getArticles = getArticles;
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const description = req.body.description;
    const userId = req.params.userId;
    try {
        if (!mongoose_1.default.isValidObjectId(userId)) {
            throw (0, http_errors_1.default)(400, "Invalid user id");
        }
        const author = yield user_1.default.findById(userId).exec();
        if (!author) {
            throw (0, http_errors_1.default)(400, "Invalid user id");
        }
        if (!author._id.equals(req.user.id)) {
            throw (0, http_errors_1.default)(403, "You are not authorized");
        }
        if (!title || !description) {
            throw (0, http_errors_1.default)(400, "Article must have a title and description");
        }
        const newArticle = yield article_1.default.create({
            title,
            description,
            author
        });
        res.status(201).json({
            statusCode: 201,
            data: {
                article: newArticle
            },
            message: 'Article created'
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createArticle = createArticle;
