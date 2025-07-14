import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IIllustration extends Document {
  branch: Types.ObjectId;
  imageUrl: string;
  author: Types.ObjectId;
  echoes: Types.ObjectId[];
}

const IllustrationSchema: Schema = new Schema({
  branch: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  imageUrl: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  echoes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<IIllustration>('Illustration', IllustrationSchema);