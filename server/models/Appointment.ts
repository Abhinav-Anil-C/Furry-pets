import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  petId: mongoose.Types.ObjectId;
  type: 'Vaccination' | 'Checkup' | 'Grooming' | 'Other';
  date: string;
  time: string;
  location: string;
  notes: string;
  reminder: boolean;
  reminderTime: string;
  completed: boolean;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IAppointment>({
  petId: {
    type: Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['Vaccination', 'Checkup', 'Grooming', 'Other'],
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  notes: {
    type: String,
    default: '',
  },
  reminder: {
    type: Boolean,
    default: false,
  },
  reminderTime: {
    type: String,
    default: '',
  },
  completed: {
    type: Boolean,
    default: false,
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

const Appointment = mongoose.model<IAppointment>('Appointment', schema);

export default Appointment;
