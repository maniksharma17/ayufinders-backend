import mongoose, { Schema, Document } from 'mongoose';

export interface ISubjectTopic extends Document {
  name: string;
  description: string;
  tagId: mongoose.Types.ObjectId[];  // Array of ObjectIds referencing the Tag model
  paperId: mongoose.Types.ObjectId;
}

const SubjectTopicSchema: Schema<ISubjectTopic> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  paperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paper",
    required: true
  },
  tagId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag"
  }]
}, {
  timestamps: true,  
});

const SubjectTopic = mongoose.model<ISubjectTopic>("SubjectTopic", SubjectTopicSchema);
export default SubjectTopic;
