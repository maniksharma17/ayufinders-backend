import mongoose from 'mongoose';

const SubjectTopicSchema = new mongoose.Schema({
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
    enum: ['1','2','3']
  },
  subTopics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubTopic",
  }],
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper",
  },
  paperSectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaperSection",
  },
}, {
  timestamps: true,  
});

const SubjectTopic = mongoose.model("SubjectTopic", SubjectTopicSchema);
export default SubjectTopic;
