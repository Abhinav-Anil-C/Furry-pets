import Pet, { IPet } from '../models/Pet';
import mongoose from 'mongoose';

export const getAllPets = async (userId: string): Promise<IPet[]> => {
  console.log(`Fetching all pets for user: ${userId}`);
  const pets = await Pet.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  return pets;
};

export const getPetById = async (petId: string, userId: string): Promise<IPet | null> => {
  console.log(`Fetching pet: ${petId} for user: ${userId}`);
  const pet = await Pet.findOne({ _id: new mongoose.Types.ObjectId(petId), userId: new mongoose.Types.ObjectId(userId) });
  return pet;
};

export const createPet = async (petData: Partial<IPet>, userId: string): Promise<IPet> => {
  console.log(`Creating new pet for user: ${userId}`);
  const pet = new Pet({
    ...petData,
    userId: new mongoose.Types.ObjectId(userId),
  });
  await pet.save();
  console.log(`Pet created successfully with ID: ${pet._id}`);
  return pet;
};

export const updatePet = async (petId: string, petData: Partial<IPet>, userId: string): Promise<IPet | null> => {
  console.log(`Updating pet: ${petId} for user: ${userId}`);
  const pet = await Pet.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(petId), userId: new mongoose.Types.ObjectId(userId) },
    { $set: petData },
    { new: true, runValidators: true }
  );
  if (pet) {
    console.log(`Pet updated successfully: ${petId}`);
  }
  return pet;
};

export const deletePet = async (petId: string, userId: string): Promise<boolean> => {
  console.log(`Deleting pet: ${petId} for user: ${userId}`);
  const result = await Pet.deleteOne({ _id: new mongoose.Types.ObjectId(petId), userId: new mongoose.Types.ObjectId(userId) });
  const deleted = result.deletedCount > 0;
  if (deleted) {
    console.log(`Pet deleted successfully: ${petId}`);
  }
  return deleted;
};
