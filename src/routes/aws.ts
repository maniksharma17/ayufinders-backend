import express from "express"
import { deleteResource, generatePresignedUrl } from "../controllers/aws.js";
const router = express.Router()

router.post('/generate-presigned-url', generatePresignedUrl)
router.delete('/delete-resource', deleteResource)

export default router;