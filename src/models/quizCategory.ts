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
  year: {
    type: String,
    enum: ["1","2","3"]
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
