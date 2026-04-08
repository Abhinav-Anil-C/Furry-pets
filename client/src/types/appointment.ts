export interface Appointment {
  _id: string;
  petId: string;
  petName: string;
  petPhoto: string;
  type: 'Vaccination' | 'Checkup' | 'Grooming' | 'Other';
  date: string;
  time: string;
  location: string;
  notes: string;
  reminder: boolean;
  reminderTime: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFormData {
  petId: string;
  type: 'Vaccination' | 'Checkup' | 'Grooming' | 'Other';
  date: string;
  time: string;
  location: string;
  notes: string;
  reminder: boolean;
  reminderTime: string;
}