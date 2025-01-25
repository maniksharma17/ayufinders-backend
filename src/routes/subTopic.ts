import express from "express";
const router = express.Router();
import {
  addSubTopicHandler,
  deleteDoc,
  deleteSubTopicHandler,
  deleteVideo,
  getSubTopicsBySubjectTopicIdHandler,
  getSubTopicsInfoByIdHandler,
  updateSubTopicHandler,
  uploadDocs,
  uploadVideo,
} from "../controllers/subTopic.js";

router.get("/topics/:subjectTopicId", getSubTopicsBySubjectTopicIdHandler);
router.get("/:subTopicId", getSubTopicsInfoByIdHandler);
router.post("/", addSubTopicHandler);
router.delete("/:subTopicId", deleteSubTopicHandler);
router.put("/:subTopicId", updateSubTopicHandler);
router.put('/video/upload/:subTopicId', uploadVideo)
router.put('/docs/upload/:subTopicId', uploadDocs)
router.put('/video/delete/:subTopicId/:videoId', deleteVideo)
router.put('/docs/delete/:subTopicId/:docId', deleteDoc)

export default router;
