import express from 'express'
import createHttpError , {isHttpError} from 'http-errors'
import { Request, Response, NextFunction } from 'express'
import router from './routes/router'

const app = express()
app.use(express.json())

app.use('/api', router)

app.use((req, res, next)=>{
    throw createHttpError(404, 'endpoint not found')
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction)=>{
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ 
        statusCode,
        error: errorMessage,
        message: 'failed'
     });   
})

export default app