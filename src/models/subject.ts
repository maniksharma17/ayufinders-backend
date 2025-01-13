import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  paper: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper"
  }],
  year: {
    type: Number,
    required: true,
    enum: [1,2,3]
  }
  
}, {
  timestamps: true,  
});

const Subject = mongoose.model("Subject", SubjectSchema);
export default Subject;
