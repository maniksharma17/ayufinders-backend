import express from "express"
import { addCategoryHandler, addQuestionHandler, deleteCategoryHandler, getAllQuizCategoriesHandler, getQuizByCategoryIdHandler, deleteQuestionHandler, updateQuestionHandler } from "../controllers/quiz.js"
const router = express.Router()

router.get('/', getAllQuizCategoriesHandler)
router.get('/:categoryId', getQuizByCategoryIdHandler)
router.post('/', addCategoryHandler)
router.post('/:categoryId', addQuestionHandler)
router.delete('/:questionId', deleteQuestionHandler)
router.put('/:questionId', updateQuestionHandler)
router.delete('/category/:categoryId', deleteCategoryHandler)

export default router