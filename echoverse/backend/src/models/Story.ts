import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStory extends Document {
  seedText: string;
  author: Types.ObjectId;
  createdAt: Date;
  branches: Types.ObjectId[];
}

const StorySchema: Schema = new Schema({
  seedText: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  branches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
});

export default mongoose.model<IStory>('Story', StorySchema);