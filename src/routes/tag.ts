import express from "express"
import { addTagHandler, getTagsHandler, deleteTagHandler } from "../controllers/tag.js"
const router = express.Router()

router.post('/', addTagHandler)
router.get('/', getTagsHandler)
router.delete('/:tagId', deleteTagHandler)

export default router