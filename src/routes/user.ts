import express from "express"
import { signinHandler, signupHandler, adminSigninHandler, adminLogoutHandler } from "../controllers/user.js"


const router = express.Router()

router.post('/signin', signinHandler)
router.post('/signup', signupHandler)
router.post('/admin-signin', adminSigninHandler)
router.delete('/admin-logout', adminLogoutHandler)

export default router