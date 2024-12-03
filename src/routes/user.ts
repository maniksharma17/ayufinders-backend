import express from "express"
import { signinHandler, signupHandler } from "../controllers/user.js"


const router = express.Router()

router.post('/signin', signinHandler)
router.post('/signup', signupHandler)

export default router