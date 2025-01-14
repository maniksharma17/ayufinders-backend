import { Request, Response } from "express";
import Category from "../models/quizCategory.js";
import Question from "../models/question.js";
import Tag from "../models/tag.js";

export const getAllQuizCategoriesHandler = async (req: Request, res: Response) => {
  try{
    const quizCategories = await Category.find();
    if (!quizCategories) {
      res.status(404).json({ success: false, message: "Categories not found" });
    }
    res.status(200).json({ success: true, quizCategories: quizCategories });
  } catch(error){
    console.error(error)
  }
}

export const getQuizByCategoryIdHandler = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const quiz = await Question.find({ categoryId: categoryId }).populate("tagId").populate("createdBy");

    if (!quiz) {
      res.status(404).json({ success: false, message: "Quiz not found" });
      return;
    }

    res.status(200).json({ success: true, quiz: quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const addQuestionHandler = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { text, options, reference, correctOption, explanation, tagId, createdBy } = req.body;

  if (!categoryId || !text || !options || !tagId || options.length < 4) {
    res.status(400).json({
      success: false,
      message: "Quiz ID, question text, and at least four options are required.",
    });
    return;
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }

    // Create the new question
    const question = await Question.create({ text, options, categoryId, reference, correctOption, explanation, tagId, createdBy });

    // Add the question to the category
    category.questions.push(question._id);
    await category.save();

    // Add the question to each tag in the tagId array
    if (Array.isArray(tagId)) {
      await Promise.all(
        tagId.map(async (id: string) => {
          const tag = await Tag.findById(id);
          if (tag) {
            tag.questions.push(question._id);
            await tag.save();
          }
        })
      );
    } else {
      const tag = await Tag.findById(tagId);
      if (tag) {
        tag.questions.push(question._id);
        await tag.save();
      }
    }

    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const updateQuestionHandler = async (req: Request, res: Response) => {
  const { questionId } = req.params;
  const { text, options, reference, correctOption, explanation, tagId } = req.body;

  if (!text || !options || !tagId || options.length < 4) {
    res.status(400).json({
      success: false,
      message: "Quiz ID, question text, and at least four options are required.",
    });
    return;
  }

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({ success: false, message: "Question not found" });
      return;
    }
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { text, options, reference, correctOption, explanation, tagId },
      { new: true }
    );

    // Add the question to each tag in the tagId array
    if (Array.isArray(tagId)) {
      await Promise.all(
        tagId.map(async (id: string) => {
          const tag = await Tag.findById(id);
          if (tag) {
            tag.questions.push(question._id);
            await tag.save();
          }
        })
      );
    } else {
      const tag = await Tag.findById(tagId);
      if (tag) {
        tag.questions.push(question._id);
        await tag.save();
      }
    }

    res.status(200).json({ success: true, data: updatedQuestion });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};



export const addCategoryHandler = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    const existingCategory = await Category.findOne({name});
    if(existingCategory){
      res.status(200).json({ success: false, category: null });
      return;
    }
    const newCategory = await Category.create({ name, description });
    res.status(201).json({ success: true, category: newCategory });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const { categoryId } = req.params;

  try {
    const existingCategory = await Category.findById(categoryId);
    if(!existingCategory){
      res.status(200).json({ success: false, category: null });
      return;
    }
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name, description });
    res.status(201).json({ success: true, category: updatedCategory });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  try {
    const existingCategory = await Category.findById(categoryId);
    if(!existingCategory){
      res.status(404).json({ success: false, message: "Category not found" });
      return;
    }
    const deletedCategory = await Category.deleteOne({ _id: categoryId });
    res.status(200).json({ success: true, category: deletedCategory });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const deleteQuestionHandler = async (req: Request, res: Response) => {
  const { questionId } = req.params;

  try {
    const existingQuestion = await Question.findOne({_id: questionId});
    if(!existingQuestion){
      res.status(200).json({ success: false, question: null });
      return;
    }
    // Remove the questionId from related Tags
    await Tag.updateMany(
      { questions: questionId }, // Find all tags containing this questionId
      { $pull: { questions: questionId } } // Remove questionId from the questions array
    );

    // Remove the questionId from the related Category
    await Category.updateOne(
      { _id: existingQuestion.categoryId }, // Find the related category
      { $pull: { questions: questionId } } // Remove questionId from the questions array
    );

    // Delete the question itself
    const deletedQuestion = await Question.deleteOne({ _id: questionId });

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
      question: deletedQuestion,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

type QuestionType = {
  _id: string,
  text: string,
  options: OptionType[],
  correctOption: number,
  explanation?: string,
  reference: {
    title?: string,
    link?: string
  },
  categoryId: string,
  tagId: TagType[]
}

type OptionType = {
  text: string
}
type TagType = {
  _id: string,
  name: string,
  description: string,
  questions: QuestionType[]
}