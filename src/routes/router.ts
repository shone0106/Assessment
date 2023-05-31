import express from "express";
import * as userController from '../controllers/userController'
import * as articleController from '../controllers/articleContoller'
import { authenticate } from "../middlewares/authenticate";

const router = express.Router()

// user related routes
router.post('/signup', userController.signUp)

router.post('/login', userController.login)

router.patch('/users/:userId', authenticate, userController.updateProfile)


// article related routes
router.get('/articles', authenticate, articleController.getArticles)

router.post('/users/:userId/articles', authenticate, articleController.createArticle)


export default router