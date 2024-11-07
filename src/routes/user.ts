import express from "express"
import { signinHandler, signinWithGoogleHandler, signupHandler } from "../controllers/user.js"


const router = express.Router()

router.post('/signin', signinHandler)
router.post('/signinWithGoogle', signinWithGoogleHandler)
router.post('/signup', signupHandler)

export default router