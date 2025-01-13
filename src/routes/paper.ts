import express from "express"
import { addPaperHandler, deletePaperHandler, getPaperInfoByIdHandler, getPapersBySubjectIdHandler, updatePaperHandler } from "../controllers/paper.js"
const router = express.Router()

router.get('/:subjectId', getPapersBySubjectIdHandler)
router.get('/:paperId', getPaperInfoByIdHandler)
router.post('/', addPaperHandler)
router.delete('/:paperId', deletePaperHandler)
router.put('/:paperId', updatePaperHandler)

export default router