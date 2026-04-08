import mongoose, { Document, Schema } from 'mongoose';

export interface IBehavior extends Document {
  behavior: string;
  confidence: number;
  description: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const schema = new Schema<IBehavior>({
  behavior: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  }
}, {
  timestamps: true,
  versionKey: false,
});

const Behavior = mongoose.model<IBehavior>('Behavior', schema);

export default Behavior;
