import { Request, Response } from "express";
import SubjectTopic from "../models/subjectTopic.js";
import Question from "../models/question.js";
import Paper from "../models/paper.js";
import PaperSection from "../models/paperSection.js";

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


export const addSubjectTopicHandler = async (req: Request, res: Response) => {
  const { name, description, paperId, paperSectionId, year } = req.body;

  try {
    const exisitingTopic = await SubjectTopic.findOne({name, paperId});
    if(exisitingTopic){
      res.status(200).json({ success: false, data: null });
      return;
    }
    const newTopic = await SubjectTopic.create({ name, description, paperId, paperSectionId, year });

    await Paper.findByIdAndUpdate(
      paperId,
      { $push: { subjectTopics: newTopic._id } },
      { new: true } // Return the updated document
    );

    await PaperSection.findByIdAndUpdate(
      paperSectionId,
      { $push: { subjectTopics: newTopic._id } },
      { new: true } // Return the updated document
    );

    res.status(201).json({ success: true, data: newTopic });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const updateSubjectTopicHandler = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const { topicId } = req.params;

  try {
    const exisitingTopic = await SubjectTopic.findById(topicId);
    if(!exisitingTopic){
      res.status(404).json({ success: false, data: null });
      return;
    }
    const updatedTopic = await SubjectTopic.findByIdAndUpdate( topicId, { 
      name, description 
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
    const deletedTopic = await SubjectTopic.findByIdAndDelete(topicId);

    await Paper.updateOne(
      {subjectTopics: {$in: topicId}},
      {$pull: { subjectTopics: topicId }},
    );

    await PaperSection.updateOne(
      {subjectTopics: {$in: topicId}},
      {$pull: { subjectTopics: topicId }},
    );


    res.status(200).json({ success: true, data: deletedTopic });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

