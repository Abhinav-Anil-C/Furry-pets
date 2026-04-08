import mongoose, { Document, Schema } from 'mongoose';
import { isPasswordHash } from '../utils/password';
import { randomUUID } from 'crypto';
import { ROLES } from 'shared';

// export interface IUser extends Document {
//   email: string;
//   password: string;
//   name: string;
//   location: string;
//   photo: string;
//   createdAt: Date;
//   lastLoginAt: Date;
//   isActive: boolean;
//   role: string;
//   refreshToken: string;
// }

// const schema = new Schema<IUser>({
//   email: {
//     type: String,
//     required: true,
//     index: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     validate: { validator: isPasswordHash, message: 'Invalid password hash' },
//   },
//   name: {
//     type: String,
//     default: '',
//     trim: true,
//   },
//   location: {
//     type: String,
//     default: '',
//     trim: true,
//   },
//   photo: {
//     type: String,
//     default: '',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     immutable: true,
//   },
//   lastLoginAt: {
//     type: Date,
//     default: Date.now,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   role: {
//     type: String,
//     enum: [ROLES.ADMIN, ROLES.USER],
//     default: ROLES.USER,
//   },
//   refreshToken: {
//     type: String,
//     unique: true,
//     index: true,
//     default: () => randomUUID(),
//   },
// }, {
//   versionKey: false,
// });

// schema.set('toJSON', {
//   transform: (doc: Document, ret: Record<string, unknown>) => {
//     delete ret.password;
//     return ret;
//   },
// });

// const User = mongoose.model<IUser>('User', schema);

// export default User;
// import mongoose, { Document, Schema } from 'mongoose';
// import { isPasswordHash } from '../utils/password';
// import { randomUUID } from 'crypto';
// import { ROLES } from 'shared';

// export interface IUser extends Document {
//   email: string;
//   password: string;
//   name: string;

//   // OLD (keep for display)
//   location: string;

//   // NEW (for geo search)
//   geoLocation: {
//     type: string;
//     coordinates: number[]; // [lng, lat]
//   };

//   // NEW (for SMS)
//   phone: string;

//   photo: string;
//   createdAt: Date;
//   lastLoginAt: Date;
//   isActive: boolean;
//   role: string;
//   refreshToken: string;
// }

// const schema = new Schema<IUser>(
//   {
//     email: {
//       type: String,
//       required: true,
//       index: true,
//       unique: true,
//       lowercase: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       validate: { validator: isPasswordHash, message: 'Invalid password hash' },
//     },

//     name: {
//       type: String,
//       default: '',
//       trim: true,
//     },

//     // 👇 keep your existing field (DO NOT REMOVE)
//     location: {
//       type: String,
//       default: '',
//       trim: true,
//     },

//     // 🚨 NEW: GeoJSON location for nearby search
//     geoLocation: {
//       type: {
//         type: String,
//         enum: ['Point'],
//         default: 'Point',
//       },
//       coordinates: {
//         type: [Number], // [longitude, latitude]
//         default: [0, 0],
//       },
//     },

//     // 🚨 NEW: phone number for SMS
//     phone: {
//       type: String,
//       default: '',
//       trim: true,
//     },

//     photo: {
//       type: String,
//       default: '',
//     },

//     createdAt: {
//       type: Date,
//       default: Date.now,
//       immutable: true,
//     },

//     lastLoginAt: {
//       type: Date,
//       default: Date.now,
//     },

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     role: {
//       type: String,
//       enum: [ROLES.ADMIN, ROLES.USER],
//       default: ROLES.USER,
//     },

//     refreshToken: {
//       type: String,
//       unique: true,
//       index: true,
//       default: () => randomUUID(),
//     },
//   },
//   {
//     versionKey: false,
//   }
// );

// // 🚨 IMPORTANT: Enable geo queries
// schema.index({ geoLocation: '2dsphere' });

// schema.set('toJSON', {
//   transform: (doc: Document, ret: Record<string, unknown>) => {
//     delete ret.password;
//     return ret;
//   },
// });

// const User = mongoose.model<IUser>('User', schema);

// export default User;


// const schema = new Schema<IUser>({
//   email: {
//     type: String,
//     required: true,
//     index: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//     validate: { validator: isPasswordHash, message: 'Invalid password hash' },
//   },
//   name: {
//     type: String,
//     default: '',
//     trim: true,
//   },
//   location: {
//     type: String,
//     default: '',
//     trim: true,
//   },
//   photo: {
//     type: String,
//     default: '',
//   },
//   phone: {
//     type: String,
//     default: '', // Or you can set it to null if that's your preference
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     immutable: true,
//   },
//   lastLoginAt: {
//     type: Date,
//     default: Date.now,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   role: {
//     type: String,
//     enum: [ROLES.ADMIN, ROLES.USER],
//     default: ROLES.USER,
//   },
//   refreshToken: {
//     type: String,
//     unique: true,
//     index: true,
//     default: () => randomUUID(),
//   },
// }, {
//   versionKey: false,
// });
// const User = mongoose.model<IUser>('User', schema);

// export default User;





// User interface extending Mongoose Document
interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  location: string;
  latitude: number | null; // New field for latitude
  longitude: number | null; // New field for longitude
  photo: string;
  phone: string;
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
  role: string;
  refreshToken: string;
}

// User Schema
const schema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    validate: { validator: isPasswordHash, message: 'Invalid password hash' },
  },
  name: {
    type: String,
    default: '',
    trim: true,
  },
  location: {
    type: String,
    default: '',
    trim: true,
  },
  latitude: {
    type: Number,
    default: null,  // Latitude will be stored as null initially
  },
  longitude: {
    type: Number,
    default: null,  // Longitude will be stored as null initially
  },
  photo: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '', // Or you can set it to null if that's your preference
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: [ROLES.ADMIN, ROLES.USER],
    default: ROLES.USER,
  },
  refreshToken: {
    type: String,
    unique: true,
    index: true,
    default: () => randomUUID(),
  },
}, {
  versionKey: false,
});

// Create and export the User model
const User = mongoose.model<IUser>('User', schema);

export default User;