import express from "express"
const router = express.Router()
import { addSubjectHandler, deleteSubjectHandler, getAllSubjectsHandler, updateSubjectHandler } from "../controllers/subject.js"

router.get('/:year', getAllSubjectsHandler)
router.post('/', addSubjectHandler)
router.delete('/:subjectId', deleteSubjectHandler)
router.put('/:subjectId', updateSubjectHandler)

export default router;