import mongoose, { Document, Schema } from 'mongoose';

export interface IBehaviorDetection extends Document {
  userId: mongoose.Types.ObjectId;
  image: string;
  behavior: 'Happy' | 'Angry' | 'Sad' | 'Sleeping' | 'Barking' | 'Howling' | 'Dizzy' | 'Standing' | 'Yawning';
  confidence: number;
  description: string;
  createdAt: Date;
}

const schema = new Schema<IBehaviorDetection>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  image: {
    type: String,
    required: true,
  },
  behavior: {
    type: String,
    enum: ['Happy', 'Angry', 'Sad', 'Sleeping', 'Barking', 'Howling', 'Dizzy', 'Standing', 'Yawning'],
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
}, {
  versionKey: false,
});

const BehaviorDetection = mongoose.model<IBehaviorDetection>('BehaviorDetection', schema);

export default BehaviorDetection;
