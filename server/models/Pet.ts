import mongoose, { Document, Schema } from 'mongoose';

export interface IPet extends Document {
  name: string;
  age: number;
  breed: string;
  color: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'inches';
  healthNotes: string;
  photo: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IPet>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  breed: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  weightUnit: {
    type: String,
    enum: ['kg', 'lbs'],
    required: true,
  },
  height: {
    type: Number,
    required: true,
    min: 0,
  },
  heightUnit: {
    type: String,
    enum: ['cm', 'inches'],
    required: true,
  },
  healthNotes: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    default: '',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Pet = mongoose.model<IPet>('Pet', schema);

export default Pet;
