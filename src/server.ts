import 'dotenv/config'
import mongoose from 'mongoose';
import app from './app'


mongoose.connect(process.env.MONGO_CONNECTION_STRING as string)
    .then(()=>{
        console.log('mongoose connected')
        app.listen(process.env.PORT, ()=>{
        console.log(`server running on port ${process.env.PORT}`)
        })
    })
    .catch((error)=>console.log(error))
