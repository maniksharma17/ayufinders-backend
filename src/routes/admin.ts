import express from "express"
import { adminSigninHandler, adminLogoutHandler } from "../controllers/admin.js"
const router = express.Router()

router.post('/admin-signin', adminSigninHandler)
router.delete('/admin-logout', adminLogoutHandler)

export default router;