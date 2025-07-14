import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBranch extends Document {
  parentStory: Types.ObjectId;
  parentBranch?: Types.ObjectId;
  text: string;
  author: Types.ObjectId;
  echoes: Types.ObjectId[];
  illustrations: Types.ObjectId[];
}

const BranchSchema: Schema = new Schema({
  parentStory: { type: Schema.Types.ObjectId, ref: 'Story', required: true },
  parentBranch: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  echoes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  illustrations: [{ type: Schema.Types.ObjectId, ref: 'Illustration' }],
});

export default mongoose.model<IBranch>('Branch', BranchSchema);