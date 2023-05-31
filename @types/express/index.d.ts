import { UserModel } from "../../src/user/user.model";
import mongoose from "mongoose";

export interface Payload {
    id: mongoose.Types.ObjectId;
}

declare global{
    namespace Express {
        interface Request {
            user?: Payload
        }
    }
}