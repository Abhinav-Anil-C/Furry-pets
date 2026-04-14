// import LostPet from "../models/LostPet";
// import mongoose from "mongoose";

// export const createLostPet = async (data: any, userId: string) => {
//   const lostPet = new LostPet({
//     ...data,
//     userId: new mongoose.Types.ObjectId(userId),
//   });

//   await lostPet.save();
//   return lostPet;
// };

// export const getAllLostPets = async () => {
//   return await LostPet.find().sort({ createdAt: -1 });
// };

// export const getLostPetById = async (id: string) => {
//   return await LostPet.findById(id);
// };

// export const deleteLostPet = async (id: string, userId: string) => {
//   const result = await LostPet.deleteOne({
//     _id: new mongoose.Types.ObjectId(id),
//     userId: new mongoose.Types.ObjectId(userId),
//   });

//   return result.deletedCount > 0;
// };










// //phase2

// // services/lostPetService.ts
// import  User  from "../models/User";
// import  LostPet  from "../models/Pet";
// import { sendSMS } from "../services/smsService";  // Import the sendSMS function

// // Haversine formula to calculate distance between two coordinates (in kilometers)
// const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert latitude difference to radians
//   const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert longitude difference to radians

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // Distance in kilometers
// };

// // Function to get all pets that are within the specified radius of the user
// export const findNearbyUsers = async (lostPetId: string, radius: number) => {
//   try {
//     const lostPet = await LostPet.findById(lostPetId); // Get the lost pet details by ID

//     if (!lostPet) {
//       throw new Error("Lost pet not found");
//     }

//     const { latitude: petLat, longitude: petLon } = lostPet; // Pet's location

//     // Find users within the specified radius (for now assuming `latitude` and `longitude` are stored in User model)
//     const users = await User.find({
//       latitude: { $ne: null },
//       longitude: { $ne: null },
//     });

//     const nearbyUsers = users.filter((user) => {
//       const distance = calculateDistance(petLat, petLon, user.latitude, user.longitude);
//       return distance <= radius; // Only include users within the specified radius
//     });

//     // Send SMS to each nearby user
//     nearbyUsers.forEach((user) => {
//       const message = `A dog is reported missing. Name: ${lostPet.name}, Location: ${lostPet.lastSeenLocation}, Contact: ${lostPet.contactPhone}. Please help!`;
//       sendSMS(user.phone, message); // Send the SMS
//     });

//     return nearbyUsers; // Return the list of nearby users who were sent SMS
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// };

// // Other functions (e.g., createLostPet, deleteLostPet) will go here

// export const createLostPet = async (data: any, userId: string) => {
//   const lostPet = new LostPet({
//     ...data,
//     userId: new mongoose.Types.ObjectId(userId),
//   });

//   await lostPet.save();
//   return lostPet;
// };

// export const getAllLostPets = async () => {
//   return await LostPet.find().sort({ createdAt: -1 });
// };

// export const getLostPetById = async (id: string) => {
//   return await LostPet.findById(id);
// };

// export const deleteLostPet = async (id: string, userId: string) => {
//   const result = await LostPet.deleteOne({
//     _id: new mongoose.Types.ObjectId(id),
//     userId: new mongoose.Types.ObjectId(userId),
//   });

//   return result.deletedCount > 0;
// };













import LostPet from "../models/LostPet";
import User from "../models/User";
import mongoose from "mongoose";
import { sendSMS } from "./smsService";

// Haversine formula to calculate distance in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Create lost pet and notify nearby users via SMS
export const createLostPet = async (data: any, userId: string) => {
  // 1. Save lost pet in DB
  const lostPet = new LostPet({
    ...data,
    userId: new mongoose.Types.ObjectId(userId),
  });

  await lostPet.save();

  // 2. Fetch all active users except the reporting user
  const users = await User.find({ isActive: true, _id: { $ne: userId } });

  // 3. Filter nearby users (within 5 km radius)
  const nearbyUsers = users.filter((user) => {
    if (!user.latitude || !user.longitude) return false;
    return calculateDistance(
      data.latitude,
      data.longitude,
      user.latitude,
      user.longitude
    ) <= 5; // radius in km
  });

  // 4. Prepare SMS message
  const message = `🚨 Lost Dog Alert
Name: ${data.name}
Last Seen: ${data.lastSeenLocation}
Contact: ${data.contactPhone}
You can find more details and updates here: https://furrypetss7.vercel.app/`;

  // 5. Send SMS to each nearby user
  for (const user of nearbyUsers) {
    try {
      await sendSMS(user.phone, message);
    } catch (err) {
      console.error(`Failed to send SMS to ${user.phone}:`, err);
    }
  }

  return lostPet;
};

// Get all lost pets
export const getAllLostPets = async () => {
  return await LostPet.find().sort({ createdAt: -1 });
};

// Get lost pet by ID
export const getLostPetById = async (id: string) => {
  return await LostPet.findById(id);
};

// Delete lost pet
export const deleteLostPet = async (id: string, userId: string) => {
  const result = await LostPet.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  });

  return result.deletedCount > 0;
};