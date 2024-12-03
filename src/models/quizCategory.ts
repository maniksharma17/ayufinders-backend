import mongoose from "mongoose";

const QuizCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
}, {
  timestamps: true,  
});

const QuizCategory = mongoose.model("QuizCategory", QuizCategorySchema);
export default QuizCategory;
