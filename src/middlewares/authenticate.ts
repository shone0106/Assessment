import { RequestHandler, Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken"
import 'dotenv/config'
import { Payload } from "../../@types/express";



export const authenticate: RequestHandler<unknown,unknown,unknown,unknown> = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) {
            throw createHttpError(401, "User not authenticated")
        }
        const user = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string)
        
        req.user = user as Payload
        next()
    } catch(e){
        next(e)
    }
    
}

export function verifyToken(token: string, secret: string): Promise<Payload> {
    return new Promise((resolve, reject) => {
       
        jwt.verify(token, secret as string, (err, user) => {
            if (err) {
                reject(createHttpError(401, "User not authenticated"))
            }
            else {
                resolve(user as Payload)
            }
        })
    })
}