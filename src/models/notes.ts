import mongoose from "mongoose";

const NotesDocSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  description: {
    type: String,
    default: "",
  },
  subTopicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubTopic"
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
  key: {
    type: String,
    required: true
  }
}, {
  timestamps: true,  
});

const NotesDoc = mongoose.model("Notes", NotesDocSchema);
export default NotesDoc;
