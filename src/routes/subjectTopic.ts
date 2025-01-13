import express from "express"
const router = express.Router()
import { addSubjectTopicHandler, deleteSubjectTopicHandler, getTopicsByPaperIdHandler, getTopicsInfoByIdHandler, updateSubjectTopicHandler } from "../controllers/subjectTopic.js"

router.get('/topics/:paperId', getTopicsByPaperIdHandler)
router.get('/:topicId', getTopicsInfoByIdHandler)
router.post('/', addSubjectTopicHandler)
router.delete('/:topicId', deleteSubjectTopicHandler)
router.put('/:topicId', updateSubjectTopicHandler)

export default router