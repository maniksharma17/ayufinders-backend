import { Request, Response } from "express";
import SubjectTopic from "../models/subjectTopic.js";
import Question from "../models/question.js";
import SubTopic from "../models/subTopic.js";
import Video from "../models/video.js";
import dotnev from "dotenv"
import NotesDoc from "../models/notes.js";
dotnev.config()

export const getSubTopicsBySubjectTopicIdHandler = async (req: Request, res: Response) => {
  const { subjectTopicId } = req.params;

  try {
    const subTopics = await SubTopic.find({ subjectTopicId: subjectTopicId });

    if (!subTopics) {
      res.status(404).json({ success: false, message: "Sub Topics not found" });
      return;
    }

    res.status(200).json({ success: true, data: subTopics });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const getSubTopicsInfoByIdHandler = async (req: Request, res: Response) => {
  const { subTopicId } = req.params;

  try {
    const subTopic = await SubTopic.findById(subTopicId)
    .populate([
      {
        path: 'videos', // Populate the 'videos' field
        populate: {
          path: 'createdBy', 
          select: 'name', 
        },
      },
      {
        path: 'notes', // Populate the 'notes' field
        populate: {
          path: 'createdBy', 
          select: 'name', 
        },
      },
    ])
    .exec()

    if (!subTopic) {
      res.status(404).json({ success: false, data: "Sub Topic Data not found" });
      return;
    }

    // Fetch questions related to the tags in this SubjectTopic
    const questions = await Question.find({ tagId: { $in: subTopic.tagId } }).populate('tagId').populate('createdBy').exec();

    res.status(200).json({ success: true, data: {subTopic, questions} });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const addSubTopicHandler = async (req: Request, res: Response) => {
  const { name, description, subjectTopicId, tagId, type, year } = req.body;

  try {
    const exisitingSubTopic = await SubTopic.findOne({name, subjectTopicId});
    if(exisitingSubTopic){
      res.status(200).json({ success: false, data: null });
      return;
    }
    const newSubTopic = await SubTopic.create({ name, description, subjectTopicId, tagId, type, year });

    await SubjectTopic.findByIdAndUpdate(
      subjectTopicId,
      { $push: { subTopics: newSubTopic._id } }
    );

    res.status(201).json({ success: true, data: newSubTopic });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const updateSubTopicHandler = async (req: Request, res: Response) => {
  const { name, description, subjectTopicId, tagId, type } = req.body;
  const { subTopicId } = req.params;

  try {
    const exisitingSubTopic = await SubTopic.findById(subTopicId);
    if(!exisitingSubTopic){
      res.status(404).json({ success: false, data: null });
      return;
    }
    const updatedSubTopic = await SubTopic.findByIdAndUpdate( subTopicId, { 
      name, description, subjectTopicId, tagId, type
    });

    res.status(201).json({ success: true, data: updatedSubTopic });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};


export const deleteSubTopicHandler = async (req: Request, res: Response) => {
  const { subTopicId } = req.params;

  try {
    const existingSubTopic = await SubTopic.findById(subTopicId);
    if(!existingSubTopic){
      res.status(404).json({ success: false, data: "Sub Topic not found" });
      return;
    }
    const deletedSubTopic = await SubTopic.deleteOne({ _id: subTopicId });

    await SubjectTopic.updateOne(
      {subTopics: {$in: subTopicId}},
      {$pull: {subTopics: subTopicId}}
    )

    res.status(200).json({ success: true, data: deletedSubTopic });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const uploadVideo = async (req: Request, res: Response) => {
  const { key, name, description, createdBy, thumbnailKey } = req.body;
  const { subTopicId } = req.params;

  const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  const thumbnailUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnailKey}`

  try{
    const newVideo = await Video.create({
      name,
      description,
      createdBy,
      url,
      thumbnailUrl,
      key,
      subTopicId
    })

    await SubTopic.findByIdAndUpdate(
      subTopicId,
      { $push: { videos: newVideo._id } }
    )

    res.status(200).json({success: true, message: "Video url added successfully."})
  } catch(error){
    res.status(500).json({success: false, message: "Server error", error})
  }
}

export const uploadDocs = async (req: Request, res: Response) => {
  const { key, name, description, createdBy, thumbnailKey } = req.body;
  const { subTopicId } = req.params;

  const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  const thumbnailUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${thumbnailKey}`

  try{
    const newDoc = await NotesDoc.create({
      name,
      description,
      createdBy,
      url,
      thumbnailUrl,
      key,
      subTopicId
    })

    await SubTopic.findByIdAndUpdate(
      subTopicId,
      { $push: { notes: newDoc._id } }
    )

    res.status(200).json({success: true, message: "Notes url added successfully."})
  } catch(e){
    res.status(500).json({success: false, message: "Server error"})
  }
}

export const deleteDoc = async (req: Request, res: Response) => {
  const { subTopicId, docId } = req.params;

  if (!subTopicId || !docId) {
    res.status(400).json({
      success: false,
      message: "SubTopic ID and Doc ID are required.",
    });
    return;
  }

  try {
    // Delete the document
    const deletedDoc = await NotesDoc.findByIdAndDelete(docId);
    if (!deletedDoc) {
      res.status(404).json({
        success: false,
        message: "Document not found.",
      });
      return;
    }

    // Update the sub-topic to remove the reference
    const updatedSubTopic = await SubTopic.findByIdAndUpdate(
      subTopicId,
      { $pull: { notes: docId } },
      { new: true } // Return the updated document
    );

    if (!updatedSubTopic) {
      res.status(404).json({
        success: false,
        message: "SubTopic not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Notes deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting notes:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  const { subTopicId, videoId } = req.params;

  if (!subTopicId || !videoId) {
    res.status(400).json({
      success: false,
      message: "SubTopic ID and Video ID are required.",
    });
    return;
  }

  try {
    // Delete the document
    const deletedVid = await NotesDoc.findByIdAndDelete(videoId);
    if (!deletedVid) {
      res.status(404).json({
        success: false,
        message: "Document not found.",
      });
      return;
    }

    // Update the sub-topic to remove the reference
    const updatedSubTopic = await SubTopic.findByIdAndUpdate(
      subTopicId,
      { $pull: { videos: videoId } },
      { new: true } // Return the updated document
    );

    if (!updatedSubTopic) {
      res.status(404).json({
        success: false,
        message: "SubTopic not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Video lecture deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting notes:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};