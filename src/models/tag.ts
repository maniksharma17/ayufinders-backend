import mongoose from "mongoose";

const TagSchema = new mongoose.Schema({
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

const Tag = mongoose.model("Tag", TagSchema);
export default Tag;
