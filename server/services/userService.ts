// import User, { IUser } from '../models/User';
// import { generatePasswordHash, validatePassword } from '../utils/password';

// interface CreateUserData {
//   email: string;
//   password: string;
//   name?: string;
// }

// class UserService {
//   static async list(): Promise<IUser[]> {
//     try {
//       return await User.find();
//     } catch (err) {
//       throw new Error(`Database error while listing users: ${err}`);
//     }
//   }

//   static async get(id: string): Promise<IUser | null> {
//     try {
//       return await User.findOne({ _id: id }).exec();
//     } catch (err) {
//       throw new Error(`Database error while getting the user by their ID: ${err}`);
//     }
//   }

//   static async getByEmail(email: string): Promise<IUser | null> {
//     try {
//       return await User.findOne({ email }).exec();
//     } catch (err) {
//       throw new Error(`Database error while getting the user by their email: ${err}`);
//     }
//   }

//   static async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
//     try {
//       return await User.findOneAndUpdate({ _id: id }, data, { new: true, upsert: false });
//     } catch (err) {
//       throw new Error(`Database error while updating user ${id}: ${err}`);
//     }
//   }

//   static async delete(id: string): Promise<boolean> {
//     try {
//       const result = await User.deleteOne({ _id: id }).exec();
//       return (result.deletedCount === 1);
//     } catch (err) {
//       throw new Error(`Database error while deleting user ${id}: ${err}`);
//     }
//   }

//   static async authenticateWithPassword(email: string, password: string): Promise<IUser | null> {
//     if (!email) throw new Error('Email is required');
//     if (!password) throw new Error('Password is required');

//     try {
//       const user = await User.findOne({email}).exec();
//       if (!user) return null;

//       const passwordValid = await validatePassword(password, user.password);
//       if (!passwordValid) return null;

//       user.lastLoginAt = new Date(Date.now());
//       const updatedUser = await user.save();
//       return updatedUser;
//     } catch (err) {
//       throw new Error(`Database error while authenticating user ${email} with password: ${err}`);
//     }
//   }

//   static async create({ email, password, name = '' }: CreateUserData): Promise<IUser> {
//     if (!email) throw new Error('Email is required');
//     if (!password) throw new Error('Password is required');

//     const existingUser = await UserService.getByEmail(email);
//     if (existingUser) throw new Error('User with this email already exists');

//     const hash = await generatePasswordHash(password);

//     try {
//       const user = new User({
//         email,
//         password: hash,
//         name,
//       });

//       await user.save();
//       return user;
//     } catch (err) {
//       throw new Error(`Database error while creating new user: ${err}`);
//     }
//   }

//   static async setPassword(user: IUser, password: string): Promise<IUser> {
//     if (!password) throw new Error('Password is required');
//     user.password = await generatePasswordHash(password);

//     try {
//       if (!user.isNew) {
//         await user.save();
//       }

//       return user;
//     } catch (err) {
//       throw new Error(`Database error while setting user password: ${err}`);
//     }
//   }
// }

// export default UserService;

import User, { IUser } from '../models/User';
import { generatePasswordHash, validatePassword } from '../utils/password';

interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  phone?: string; // Added phone to the create user data interface
}

interface UpdateUserData {
  name?: string;
  location?: string;
  photo?: string;
  phone?: string; // Added phone to the update interface
  geoLocation?: {
    coordinates: [number, number]; // Optional geoLocation update
  };
}

class UserService {
  static async list(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (err) {
      throw new Error(`Database error while listing users: ${err}`);
    }
  }

  static async get(id: string): Promise<IUser | null> {
    try {
      return await User.findOne({ _id: id }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their ID: ${err}`);
    }
  }

  static async getByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email }).exec();
    } catch (err) {
      throw new Error(`Database error while getting the user by their email: ${err}`);
    }
  }

  static async update(id: string, data: UpdateUserData): Promise<IUser | null> {
    try {
      // Check if geoLocation is provided and format it correctly
      const updateFields: any = { ...data };

      if (data.geoLocation && Array.isArray(data.geoLocation.coordinates)) {
        updateFields.geoLocation = {
          type: 'Point',
          coordinates: data.geoLocation.coordinates,
        };
      }

      return await User.findOneAndUpdate({ _id: id }, updateFields, { new: true, upsert: false });
    } catch (err) {
      throw new Error(`Database error while updating user ${id}: ${err}`);
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const result = await User.deleteOne({ _id: id }).exec();
      return result.deletedCount === 1;
    } catch (err) {
      throw new Error(`Database error while deleting user ${id}: ${err}`);
    }
  }

  static async authenticateWithPassword(email: string, password: string): Promise<IUser | null> {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    try {
      const user = await User.findOne({ email }).exec();
      if (!user) return null;

      const passwordValid = await validatePassword(password, user.password);
      if (!passwordValid) return null;

      user.lastLoginAt = new Date(Date.now());
      const updatedUser = await user.save();
      return updatedUser;
    } catch (err) {
      throw new Error(`Database error while authenticating user ${email} with password: ${err}`);
    }
  }

  static async create({ email, password, name = '', phone = '' }: CreateUserData): Promise<IUser> {
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');

    const existingUser = await UserService.getByEmail(email);
    if (existingUser) throw new Error('User with this email already exists');

    const hash = await generatePasswordHash(password);

    try {
      const user = new User({
        email,
        password: hash,
        name,
        phone, // Add phone here
      });

      await user.save();
      return user;
    } catch (err) {
      throw new Error(`Database error while creating new user: ${err}`);
    }
  }

  static async setPassword(user: IUser, password: string): Promise<IUser> {
    if (!password) throw new Error('Password is required');
    user.password = await generatePasswordHash(password);

    try {
      if (!user.isNew) {
        await user.save();
      }

      return user;
    } catch (err) {
      throw new Error(`Database error while setting user password: ${err}`);
    }
  }

  // Optional: Add a helper function to update the phone number
  static async updatePhone(id: string, phone: string): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate({ _id: id }, { phone }, { new: true });
    } catch (err) {
      throw new Error(`Database error while updating phone number for user ${id}: ${err}`);
    }
  }
}

export default UserService;