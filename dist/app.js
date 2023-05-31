"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importStar(require("http-errors"));
const router_1 = __importDefault(require("./routes/router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', router_1.default);
app.use((req, res, next) => {
    throw (0, http_errors_1.default)(404, 'endpoint not found');
});
app.use((error, req, res, next) => {
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({
        statusCode,
        error: errorMessage,
        message: 'failed'
    });
});
exports.default = app;
