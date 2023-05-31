import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import createHttpError from "http-errors";
import articleModel from '../models/article'
import userModel from '../models/user'


export const getArticles = async (req: Request, res: Response, next: NextFunction) =>{
    try{
        const articles = await articleModel.find().populate('author').exec()
        res.status(200).json({
            statusCode: 200,
            data: {
                articles
            },
            message: "success"
        })
        }
        catch(error){
            next(error)        
        }
}


export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
    const title = req.body.title;
    const description = req.body.description
    const userId = req.params.userId
    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id");
        }
        
        const author = await userModel.findById(userId).exec()

        if(!author){
            throw createHttpError(400, "Invalid user id")
        }

        if (!author._id.equals(req.user!.id)) {
            throw createHttpError(403, "You are not authorized");
        }

        if (!title || !description) {
            throw createHttpError(400, "Article must have a title and description");
        }

        const newArticle = await articleModel.create({
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
    } catch (error) {
        next(error);
    }
};


