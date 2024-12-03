import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      }
    }
  ],
  correctOption: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
  },
  reference: {
    title: {
      type: String,
    },
    link: {
      type: String
    } 
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  tagId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }]
}, {
  timestamps: true,  
});

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
