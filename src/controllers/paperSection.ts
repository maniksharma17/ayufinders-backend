import { Request, Response } from "express";
import Paper from "../models/paper.js";
import PaperSection from "../models/paperSection.js";
import SubjectTopic from "../models/subjectTopic.js";

export const getPaperSectionsByPaperIdHandler = async (req: Request, res: Response) => {
  const { paperId } = req.params;

  try {
    const sections = await PaperSection.find({paperId: paperId});

    if (!sections) {
      res.status(404).json({ success: false, message: "Paper sections not found" });
      return;
    }

    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const getPaperSectionInfoByIdHandler = async (req: Request, res: Response) => {
  const { paperSectionId } = req.params;

  try {
    const paperSectionDetail = await SubjectTopic.find({paperSectionId});

    if (!paperSectionDetail) {
      res.status(404).json({ success: false, data: "Paper section not found" });
      return;
    }

    res.status(200).json({ success: true, data: paperSectionDetail });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const addPaperSectionHandler = async (req: Request, res: Response) => {
  const { name, description, paperId } = req.body;

  try {
    const exisitingPaperSection = await PaperSection.findOne({name, paperId});
    if(exisitingPaperSection){
      res.status(200).json({ success: false, data: null });
      return;
    }
    const newPaperSection = await PaperSection.create({ name, description, paperId });

    await Paper.findByIdAndUpdate(
      paperId,
      {$push: {section: newPaperSection._id}}
    )

    res.status(201).json({ success: true, data: newPaperSection });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const updatePaperSectionHandler = async (req: Request, res: Response) => {
  const { name, description, paperId } = req.body;
  const { paperSectionId } = req.params;

  try {
    const exisitingPaperSection = await PaperSection.findById(paperSectionId);
    if(!exisitingPaperSection){
      res.status(200).json({ success: false, data: null, message: "Paper does not exist." });
      return;
    }
    const updatedPaperSection = await PaperSection.findByIdAndUpdate(paperSectionId, { 
      name, description, paperId 
    });
    res.status(201).json({ success: true, data: updatedPaperSection });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const deletePaperSectionHandler = async (req: Request, res: Response) => {
  const { paperSectionId } = req.params;

  try {
    const existingPaperSection = await PaperSection.findById(paperSectionId);
    if(!existingPaperSection){
      res.status(404).json({ success: false, data: "Paper not found" });
      return;
    }
    const deletedPaperSection = await PaperSection.findByIdAndDelete(paperSectionId);

    await Paper.updateOne(
      {section: {$in: paperSectionId}},
      {$pull: {section: paperSectionId}}
    )
    res.status(200).json({ success: true, data: deletedPaperSection });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

