import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const schema = new Schema<IChatMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
}, {
  versionKey: false,
});

const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', schema);

export default ChatMessage;
