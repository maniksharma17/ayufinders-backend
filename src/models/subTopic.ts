import mongoose from 'mongoose';


const SubTopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    enum: ['DK', 'NK', 'MK']
  },
  year: {
    type: String,
    enum: ['1', '2', '3']
  },
  subjectTopicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubjectTopic",
  },
  tagId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  }],
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notes"
  }]
}, {
  timestamps: true,  
});

const SubTopic = mongoose.model("SubTopic", SubTopicSchema);
export default SubTopic;
