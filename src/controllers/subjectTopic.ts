import { Request, Response } from "express";
import SubjectTopic from "../models/subjectTopic.js";
import Question from "../models/question.js";

export const getTopicsByPaperIdHandler = async (req: Request, res: Response) => {
  const { paperId } = req.params;

  try {
    const topics = await SubjectTopic.find({ paperId: paperId });

    if (!topics) {
      res.status(404).json({ success: false, message: "Topic not found" });
      return;
    }

    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const getTopicsInfoByIdHandler = async (req: Request, res: Response) => {
  const { topicId } = req.params;

  try {
    const topic = await SubjectTopic.findById(topicId).exec()

    if (!topic) {
      res.status(404).json({ success: false, data: "Topic Data not found" });
      return;
    }

    // Fetch questions related to the tags in this SubjectTopic
    const questions = await Question.find({ tagId: { $in: topic.tagId } }).populate('tagId').exec();

    res.status(200).json({ success: true, data: {topic, questions} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const addSubjectTopicHandler = async (req: Request, res: Response) => {
  const { name, description, paperId, tagId } = req.body;

  try {
    const exisitingTopic = await SubjectTopic.findOne({name, paperId});
    if(exisitingTopic){
      res.status(200).json({ success: false, data: null });
      return;
    }
    const newTopic = await SubjectTopic.create({ name, description, paperId, tagId });
    res.status(201).json({ success: true, data: newTopic });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const updateSubjectTopicHandler = async (req: Request, res: Response) => {
  const { name, description, paperId, tagId } = req.body;
  const { topicId } = req.params;

  try {
    const exisitingTopic = await SubjectTopic.findById(topicId);
    if(!exisitingTopic){
      res.status(404).json({ success: false, data: null });
      return;
    }
    const updatedTopic = await SubjectTopic.findByIdAndUpdate( topicId, { 
      name, description, paperId, tagId 
    });

    res.status(201).json({ success: true, data: updatedTopic });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};


export const deleteSubjectTopicHandler = async (req: Request, res: Response) => {
  const { topicId } = req.params;

  try {
    const existingTopic = await SubjectTopic.findById(topicId);
    if(!existingTopic){
      res.status(404).json({ success: false, data: "Topic not found" });
      return;
    }
    const deletedTopic = await SubjectTopic.deleteOne({ _id: topicId });
    res.status(200).json({ success: true, data: deletedTopic });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

