import mongoose, { Document, Schema } from "mongoose";

export interface ILostPet extends Document {
  name: string;
  breed: string;
  description: string;
  photo: string;
  lastSeenLocation: string;
  contactPhone: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<ILostPet>(
  {
    name: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    lastSeenLocation: {
      type: String,
      required: true,
    },
    latitude: {
  type: Number,
  required: true,
},
longitude: {
  type: Number,
  required: true,
},

    contactPhone: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const LostPet = mongoose.model<ILostPet>("LostPet", schema);

export default LostPet;
