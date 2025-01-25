import express from "express"
import { addCategoryHandler, addQuestionHandler, deleteCategoryHandler, getAllQuizCategoriesHandler, getQuizByCategoryIdHandler, deleteQuestionHandler, updateQuestionHandler, updateCategoryHandler } from "../controllers/quiz.js"
const router = express.Router()

router.get('/', getAllQuizCategoriesHandler)
router.get('/:categoryId', getQuizByCategoryIdHandler)
router.post('/', addCategoryHandler)
router.put('/category/:categoryId', updateCategoryHandler)
router.post('/:categoryId', addQuestionHandler)
router.delete('/:questionId', deleteQuestionHandler)
router.put('/question/:questionId', updateQuestionHandler)
router.delete('/category/:categoryId', deleteCategoryHandler)

export default router;