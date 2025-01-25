import express from "express"
import { addPaperSectionHandler, deletePaperSectionHandler, getPaperSectionInfoByIdHandler, getPaperSectionsByPaperIdHandler, updatePaperSectionHandler } from "../controllers/paperSection.js"
const router = express.Router()

router.get('/:paperId', getPaperSectionsByPaperIdHandler)
router.get('/topics/:paperSectionId', getPaperSectionInfoByIdHandler)
router.post('/', addPaperSectionHandler)
router.delete('/:paperSectionId', deletePaperSectionHandler)
router.put('/:paperSectionId', updatePaperSectionHandler)

export default router;