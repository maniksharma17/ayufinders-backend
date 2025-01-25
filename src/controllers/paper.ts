import { Request, Response } from "express";
import Paper from "../models/paper.js";
import Subject from "../models/subject.js";

export const getPapersBySubjectIdHandler = async (req: Request, res: Response) => {
  const { subjectId } = req.params;

  try {
    const papers = await Paper.find({ subjectId: subjectId });

    if (!papers) {
      res.status(404).json({ success: false, message: "Papers not found" });
      return;
    }

    res.status(200).json({ success: true, data: papers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const getPaperInfoByIdHandler = async (req: Request, res: Response) => {
  const { paperId } = req.params;

  try {
    const paperDetail = await Paper.find({ _id: paperId });

    if (!paperDetail) {
      res.status(404).json({ success: false, data: "Paper not found" });
      return;
    }

    res.status(200).json({ success: true, data: paperDetail });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const addPaperHandler = async (req: Request, res: Response) => {
  const { name, description, subjectId } = req.body;

  try {
    const exisitingPaper = await Paper.findOne({name, subjectId});
    if(exisitingPaper){
      res.status(200).json({ success: false, data: null });
      return;
    }
    const newPaper = await Paper.create({ name, description, subjectId });

    await Subject.findByIdAndUpdate(
      subjectId,
      {$push: {paper: newPaper._id}}
    )

    res.status(201).json({ success: true, data: newPaper });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const updatePaperHandler = async (req: Request, res: Response) => {
  const { name, description, subjectId } = req.body;
  const { paperId } = req.params;

  try {
    const exisitingPaper = await Paper.findById(paperId);
    if(!exisitingPaper){
      res.status(200).json({ success: false, data: null, message: "Paper does not exist." });
      return;
    }
    const updatedPaper = await Paper.findByIdAndUpdate(paperId, { 
      name, description, subjectId 
    });
    res.status(201).json({ success: true, data: updatedPaper });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const deletePaperHandler = async (req: Request, res: Response) => {
  const { paperId } = req.params;

  try {
    const existingPaper = await Paper.findById(paperId);
    if(!existingPaper){
      res.status(404).json({ success: false, data: "Paper not found" });
      return;
    }
    const deletedPaper = await Paper.deleteOne({ _id: paperId });

    await Subject.updateOne(
      {paper: {$in: paperId}},
      {$pull: {paper: paperId}}
    )

    res.status(200).json({ success: true, data: deletedPaper });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

