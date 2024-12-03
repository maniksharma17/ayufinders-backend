import express from "express"
import { addCategoryHandler, addQuestionHandler, deleteCategoryHandler, getAllQuizCategoriesHandler, getQuizByCategoryIdHandler, deleteQuestionHandler } from "../controllers/quiz.js"
const router = express.Router()

router.get('/', getAllQuizCategoriesHandler)
router.get('/:categoryId', getQuizByCategoryIdHandler)
router.post('/', addCategoryHandler)
router.post('/:categoryId', addQuestionHandler)
router.delete('/:questionId', deleteQuestionHandler)
router.delete('/:categoryId', deleteCategoryHandler)

export default router