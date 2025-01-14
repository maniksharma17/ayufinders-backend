import express from "express"
import { addTagHandler, getTagsHandler, deleteTagHandler, updateTagHandler } from "../controllers/tag.js"
const router = express.Router()

router.post('/', addTagHandler)
router.get('/', getTagsHandler)
router.delete('/:tagId', deleteTagHandler)
router.put('/:tagId', updateTagHandler)

export default router