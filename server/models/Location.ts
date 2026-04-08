import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  type: 'Park' | 'Vet Clinic' | 'Pet Hospital';
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ILocation>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['Park', 'Vet Clinic', 'Pet Hospital'],
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  phone: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

// Create geospatial index for location-based queries
schema.index({ latitude: 1, longitude: 1 });

const Location = mongoose.model<ILocation>('Location', schema);

export default Location;
