import Appointment, { IAppointment } from '../models/Appointment';
import Pet from '../models/Pet';
import mongoose from 'mongoose';

export const getAllAppointments = async (userId: string): Promise<any[]> => {
  console.log(`Fetching all appointments for user: ${userId}`);
  const appointments = await Appointment.find({ userId: new mongoose.Types.ObjectId(userId) })
    .sort({ date: -1, time: -1 })
    .populate('petId', 'name photo');

  // Transform to include pet details
  const transformedAppointments = appointments.map(apt => {
    const pet = apt.petId as any;
    return {
      _id: apt._id,
      petId: apt.petId,
      petName: pet?.name || '',
      petPhoto: pet?.photo || '',
      type: apt.type,
      date: apt.date,
      time: apt.time,
      location: apt.location,
      notes: apt.notes,
      reminder: apt.reminder,
      reminderTime: apt.reminderTime,
      completed: apt.completed,
      userId: apt.userId,
      createdAt: apt.createdAt,
      updatedAt: apt.updatedAt,
    };
  });

  return transformedAppointments;
};

export const getAppointmentById = async (appointmentId: string, userId: string): Promise<any | null> => {
  console.log(`Fetching appointment: ${appointmentId} for user: ${userId}`);
  const appointment = await Appointment.findOne({
    _id: new mongoose.Types.ObjectId(appointmentId),
    userId: new mongoose.Types.ObjectId(userId)
  }).populate('petId', 'name photo');

  if (!appointment) return null;

  const pet = appointment.petId as any;
  return {
    _id: appointment._id,
    petId: appointment.petId,
    petName: pet?.name || '',
    petPhoto: pet?.photo || '',
    type: appointment.type,
    date: appointment.date,
    time: appointment.time,
    location: appointment.location,
    notes: appointment.notes,
    reminder: appointment.reminder,
    reminderTime: appointment.reminderTime,
    completed: appointment.completed,
    userId: appointment.userId,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
};

export const createAppointment = async (appointmentData: Partial<IAppointment>, userId: string): Promise<any> => {
  console.log(`Creating new appointment for user: ${userId}`);

  // Verify pet belongs to user
  const pet = await Pet.findOne({
    _id: new mongoose.Types.ObjectId(appointmentData.petId as any),
    userId: new mongoose.Types.ObjectId(userId)
  });

  if (!pet) {
    throw new Error('Pet not found or does not belong to user');
  }

  const appointment = new Appointment({
    ...appointmentData,
    userId: new mongoose.Types.ObjectId(userId),
  });
  await appointment.save();
  console.log(`Appointment created successfully with ID: ${appointment._id}`);

  return {
    _id: appointment._id,
    petId: appointment.petId,
    petName: pet.name,
    petPhoto: pet.photo,
    type: appointment.type,
    date: appointment.date,
    time: appointment.time,
    location: appointment.location,
    notes: appointment.notes,
    reminder: appointment.reminder,
    reminderTime: appointment.reminderTime,
    completed: appointment.completed,
    userId: appointment.userId,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
};

export const updateAppointment = async (appointmentId: string, appointmentData: Partial<IAppointment>, userId: string): Promise<any | null> => {
  console.log(`Updating appointment: ${appointmentId} for user: ${userId}`);

  // If petId is being updated, verify it belongs to user
  if (appointmentData.petId) {
    const pet = await Pet.findOne({
      _id: new mongoose.Types.ObjectId(appointmentData.petId as any),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!pet) {
      throw new Error('Pet not found or does not belong to user');
    }
  }

  const appointment = await Appointment.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(appointmentId), userId: new mongoose.Types.ObjectId(userId) },
    { $set: appointmentData },
    { new: true, runValidators: true }
  ).populate('petId', 'name photo');

  if (!appointment) return null;

  console.log(`Appointment updated successfully: ${appointmentId}`);
  const pet = appointment.petId as any;
  return {
    _id: appointment._id,
    petId: appointment.petId,
    petName: pet?.name || '',
    petPhoto: pet?.photo || '',
    type: appointment.type,
    date: appointment.date,
    time: appointment.time,
    location: appointment.location,
    notes: appointment.notes,
    reminder: appointment.reminder,
    reminderTime: appointment.reminderTime,
    completed: appointment.completed,
    userId: appointment.userId,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
};

export const deleteAppointment = async (appointmentId: string, userId: string): Promise<boolean> => {
  console.log(`Deleting appointment: ${appointmentId} for user: ${userId}`);
  const result = await Appointment.deleteOne({
    _id: new mongoose.Types.ObjectId(appointmentId),
    userId: new mongoose.Types.ObjectId(userId)
  });
  const deleted = result.deletedCount > 0;
  if (deleted) {
    console.log(`Appointment deleted successfully: ${appointmentId}`);
  }
  return deleted;
};

export const markAppointmentComplete = async (appointmentId: string, userId: string): Promise<any | null> => {
  console.log(`Marking appointment as complete: ${appointmentId} for user: ${userId}`);
  const appointment = await Appointment.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(appointmentId), userId: new mongoose.Types.ObjectId(userId) },
    { $set: { completed: true } },
    { new: true, runValidators: true }
  ).populate('petId', 'name photo');

  if (!appointment) return null;

  console.log(`Appointment marked as complete: ${appointmentId}`);
  const pet = appointment.petId as any;
  return {
    _id: appointment._id,
    petId: appointment.petId,
    petName: pet?.name || '',
    petPhoto: pet?.photo || '',
    type: appointment.type,
    date: appointment.date,
    time: appointment.time,
    location: appointment.location,
    notes: appointment.notes,
    reminder: appointment.reminder,
    reminderTime: appointment.reminderTime,
    completed: appointment.completed,
    userId: appointment.userId,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };
};
