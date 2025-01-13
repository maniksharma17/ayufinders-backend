import mongoose from "mongoose";

const PaperSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  description: {
    type: String,
    default: "",
  },
  subjectTopics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubjectTopics",
    },
  ],
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject"
  }
}, {
  timestamps: true,  
});

const Paper = mongoose.model("Paper", PaperSchema);
export default Paper;
