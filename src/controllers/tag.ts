import { Request, Response } from "express";
import Tag from "../models/tag.js";

export const addTagHandler = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  try {
    const existingTag = await Tag.findOne({name})
    if(existingTag){
      res.status(200).json({ success: false, tag: null});
      return;
    }
    const newTag = await Tag.create({ name, description });
    res.status(201).json({ success: true, tag: newTag });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const getTagsHandler = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.status(200).json({ success: true, tags: tags });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const deleteTagHandler = async (req: Request, res: Response) => {
  const { tagId } = req.params;

  try {
    const existingTag = await Tag.findOne({_id: tagId})
    if(!existingTag){
      res.status(200).json({ success: false, tag: null, message: "No tag found."});
      return;
    }
    const deletedTag = await Tag.deleteOne({_id: tagId})
    res.status(200).json({ success: true, tag: deletedTag });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
