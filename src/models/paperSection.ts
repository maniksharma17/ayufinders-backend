import mongoose from "mongoose";

const PaperSectionSchema = new mongoose.Schema({
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
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper"
  }
}, {
  timestamps: true,  
});

const PaperSection = mongoose.model("PaperSection", PaperSectionSchema);
export default PaperSection;
