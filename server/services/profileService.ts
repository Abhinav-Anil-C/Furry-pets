// import User, { IUser } from '../models/User';
// import mongoose from 'mongoose';

// export const getProfile = async (userId: string): Promise<any> => {
//   console.log(`Fetching profile for user: ${userId}`);
//   const user = await User.findById(new mongoose.Types.ObjectId(userId));

//   if (!user) {
//     throw new Error('User not found');
//   }

//   return {
//     _id: user._id,
//     name: user.name || '',
//     email: user.email,
//     location: user.location || '',
//     photo: user.photo || '',
//     memberSince: user.createdAt,
//   };
// };

// export const updateProfile = async (userId: string, profileData: { name?: string; location?: string; photo?: string }): Promise<any> => {
//   console.log(`Updating profile for user: ${userId}`);

//   const updateFields: any = {};
//   if (profileData.name !== undefined) updateFields.name = profileData.name;
//   if (profileData.location !== undefined) updateFields.location = profileData.location;
//   if (profileData.photo !== undefined) updateFields.photo = profileData.photo;

//   const user = await User.findByIdAndUpdate(
//     new mongoose.Types.ObjectId(userId),
//     { $set: updateFields },
//     { new: true, runValidators: true }
//   );

//   if (!user) {
//     throw new Error('User not found');
//   }

//   console.log(`Profile updated successfully for user: ${userId}`);

//   return {
//     _id: user._id,
//     name: user.name || '',
//     email: user.email,
//     location: user.location || '',
//     photo: user.photo || '',
//     memberSince: user.createdAt,
//   };
// };

import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

export const getProfile = async (userId: string): Promise<any> => {
  console.log(`Fetching profile for user: ${userId}`);
  try {
    const user = await User.findById(new mongoose.Types.ObjectId(userId));

    if (!user) {
      throw new Error('User not found');
    }

    return {
      _id: user._id,
      name: user.name || '',
      email: user.email,
      location: user.location || '',
      photo: user.photo || '',
      phone: user.phone || '', // Include phone in the returned profile
      geoLocation: user.geoLocation || null, // Return geoLocation if available
      memberSince: user.createdAt,
    };
  } catch (err) {
    console.error(`Error fetching profile for user ${userId}: ${err.message}`);
    throw new Error(`Failed to fetch profile: ${err.message}`);
  }
};

export const updateProfile = async (
  userId: string,
  profileData: {
    name?: string;
    location?: string;
    photo?: string;
    phone?: string; // Added phone to the update data
    geoLocation?: { coordinates: [number, number] }; // Optional geoLocation update
  }
): Promise<any> => {
  console.log(`Updating profile for user: ${userId}`);

  const updateFields: any = {};

  if (profileData.name !== undefined) updateFields.name = profileData.name;
  if (profileData.location !== undefined) updateFields.location = profileData.location;
  if (profileData.photo !== undefined) updateFields.photo = profileData.photo;
  if (profileData.phone !== undefined) updateFields.phone = profileData.phone; // Handle phone update
  if (profileData.geoLocation) {
    updateFields.geoLocation = {
      type: 'Point',
      coordinates: profileData.geoLocation.coordinates,
    };
  }

  try {
    const user = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    console.log(`Profile updated successfully for user: ${userId}`);

    return {
      _id: user._id,
      name: user.name || '',
      email: user.email,
      location: user.location || '',
      photo: user.photo || '',
      phone: user.phone || '', // Include phone in the returned profile after update
      geoLocation: user.geoLocation || null, // Return geoLocation after update
      memberSince: user.createdAt,
    };
  } catch (err) {
    console.error(`Error updating profile for user ${userId}: ${err.message}`);
    throw new Error(`Failed to update profile: ${err.message}`);
  }
};
