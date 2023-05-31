import { Request, Response, NextFunction, response } from "express";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import 'dotenv/config'
import UserModel from '../models/user'
import { Payload } from "../../@types/express";


export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const age = req.body.age;

    try {
        if (!email || !password || !name || !age) {
            throw createHttpError(400, "Parameters missing")
        }
        if (!validator.isEmail(email)) {
            throw createHttpError(400, "Invalid email")
        }
        if (typeof age !== 'number' || age > 120 || age < 10) {
            throw createHttpError(400, "Invalid age")
          }
        const existingUsername = await UserModel.findOne({ email: email }).exec();

        if (existingUsername) throw createHttpError(409, 'Username already taken. Please choose a different one or log in instead.')

        const newUser = await UserModel.create({ email, password, name, age })

        res.status(201).json({
            statusCode: 201,
            data: {
                user: newUser
            },
            message: "User created"
        })
    }
    catch (error) {
        next(error)
    }
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email
    const password = req.body.password

    try {
        if (!email || !password) {
            throw createHttpError(400, "Parameters missing")
        }
        if (!validator.isEmail(email)) {
            throw createHttpError(400, "Invalid email")
        }

        const user = await UserModel.findOne({ email: email }).select("+password").exec()

        if (!user) throw createHttpError(404, "User does not exist")

        if (!await bcrypt.compare(password, user.password)) {
            throw createHttpError(401, "Invalid credentials")
        }

        const payload: Payload = { id: user._id }

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1d' })

        res.status(200).json({ 
            statusCode: 200,
            data:{
                jwt: accessToken,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    age: user.age
                }
            },
            message: "Login successful"      
        })
    }
    catch (error) {
        next(error)
    }
}


export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId
    const name = req.body.name
    const age = req.body.age
    try{
        if (age && (typeof age !== 'number' || age > 120 || age < 10)) {
            throw createHttpError(400, "Invalid age")
          }

        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "Invalid user id");
        }

        const user = await UserModel.findById(userId).exec()
        if(!user){
            throw createHttpError(404, "Cannot find user")
        }

        if (!user._id.equals(req.user!.id)) {
            throw createHttpError(403, "You are not authorized");
        }

        user.name = name || user.name
        user.age = age || user.age
        const updatedUser = await user.save()

        res.status(200).json({
            statusCode: 200,
            data: {
                user: updatedUser
            },
            message: "user details updated"
        })
    }
    catch(error){
        console.log(error)
        next(error)
    }
}

