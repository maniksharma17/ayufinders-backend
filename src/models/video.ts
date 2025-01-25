import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin"
  },
  subTopicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubTopic"
  },
  key: {
    type: String,
    required: true
  }

}, {
  timestamps: true,  
});

const Video = mongoose.model("Video", VideoSchema);
export default Video;
